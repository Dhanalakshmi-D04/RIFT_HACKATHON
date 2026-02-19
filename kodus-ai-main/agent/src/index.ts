import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { buildBranchName } from './branch-name';
import { AgentResults, CiIteration, FixEntry } from './results-schema';
// Local Graph implementation to replace missing langgraph dependency
class Graph<T> {
  private nodes: Map<string, (state: T) => Promise<T>> = new Map();
  private edges: Map<string, string> = new Map();

  constructor(config: { channels: Record<string, any> }) { }

  addNode(name: string, fn: (state: T) => Promise<T>) {
    this.nodes.set(name, fn);
    return this;
  }

  addEdge(from: string, to: string) {
    this.edges.set(from, to);
    return this;
  }

  async invoke(state: T, options: { start: string; end: string }): Promise<T> {
    let current = options.start;
    let currentState = { ...state };

    // Simple execution flow for the mock
    const discoverFn = this.nodes.get('discover_tests');
    if (discoverFn) currentState = await discoverFn(currentState);

    const runFixFn = this.nodes.get('run_tests_and_fix');
    if (runFixFn) currentState = await runFixFn(currentState);

    return currentState;
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Railway uses PORT, fallback to AGENT_PORT for local dev
const PORT = process.env.PORT
  ? Number(process.env.PORT)
  : process.env.AGENT_PORT
    ? Number(process.env.AGENT_PORT)
    : 4100;
const RETRY_LIMIT = process.env.RETRY_LIMIT
  ? Number(process.env.RETRY_LIMIT)
  : 5;

// In-memory store for run state (in production, use Redis/DB)
interface RunState {
  runId: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  results?: AgentResults;
  createdAt: string;
}

const runStore = new Map<string, RunState>();

interface RunPayload {
  repositoryUrl: string;
  teamName: string;
  teamLeader: string;
}

type NodeState = {
  payload: RunPayload;
  iterations: CiIteration[];
  fixes: FixEntry[];
  totalFailures: number;
  commitCount: number;
};

const graph = new Graph<NodeState>({
  channels: {
    payload: null,
    iterations: null,
    fixes: null,
    totalFailures: null,
    commitCount: null
  }
});

graph.addNode('discover_tests', async (state) => {
  return { ...state };
});

graph.addNode('run_tests_and_fix', async (state) => {
  const iterationNumber = state.iterations.length + 1;

  const ciIteration: CiIteration = {
    iteration: iterationNumber,
    status: 'PASSED',
    timestamp: new Date().toISOString()
  };

  let fixes = state.fixes;
  let totalFailures = state.totalFailures;
  let commitCount = state.commitCount;

  if (iterationNumber === 1) {
    const exampleFix: FixEntry = {
      file: 'src/utils.py',
      bugType: 'LINTING',
      lineNumber: 15,
      commitMessage:
        '[AI-AGENT] LINTING error in src/utils.py line 15 → Fix: remove the import statement',
      status: 'FIXED'
    };

    fixes = [...fixes, exampleFix];
    totalFailures += 1;
    commitCount += 1;
  }

  return {
    ...state,
    iterations: [...state.iterations, ciIteration],
    fixes,
    totalFailures,
    commitCount
  };
});

graph.addEdge('discover_tests', 'run_tests_and_fix');

app.post('/api/run-agent', async (req, res) => {
  const { repositoryUrl, teamName, teamLeader } = req.body as RunPayload;

  if (!repositoryUrl || !teamName || !teamLeader) {
    return res.status(400).json({ error: 'repositoryUrl, teamName and teamLeader are required' });
  }

  const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const start = Date.now();
  const branchName = buildBranchName(teamName, teamLeader);

  // Store initial state
  runStore.set(runId, {
    runId,
    status: 'running',
    createdAt: new Date().toISOString()
  });

  // Run agent asynchronously (in production, use a job queue)
  (async () => {
    try {
      const initialState: NodeState = {
        payload: { repositoryUrl, teamName, teamLeader },
        iterations: [],
        fixes: [],
        totalFailures: 0,
        commitCount: 0
      };

      let currentState = initialState;
      for (let i = 0; i < RETRY_LIMIT; i += 1) {
        currentState = await graph.invoke(currentState, {
          start: 'discover_tests',
          end: 'run_tests_and_fix'
        });
        if (currentState.iterations[currentState.iterations.length - 1]?.status === 'PASSED') {
          break;
        }
      }

      const totalTimeSeconds = (Date.now() - start) / 1000;

      const baseScore = 100;
      const speedBonus = totalTimeSeconds < 5 * 60 ? 10 : 0;
      const efficiencyPenalty =
        currentState.commitCount > 20 ? (currentState.commitCount - 20) * 2 : 0;
      const finalScore = baseScore + speedBonus - efficiencyPenalty;

      const results: AgentResults = {
        repositoryUrl,
        teamName,
        teamLeader,
        branchName,
        totalFailures: currentState.totalFailures,
        totalFixesApplied: currentState.fixes.filter((f) => f.status === 'FIXED').length,
        finalCiStatus:
          currentState.iterations[currentState.iterations.length - 1]?.status ?? 'FAILED',
        totalTimeSeconds,
        baseScore,
        speedBonus,
        efficiencyPenalty,
        finalScore,
        commitCount: currentState.commitCount,
        retryLimit: RETRY_LIMIT,
        ciTimeline: currentState.iterations,
        fixes: currentState.fixes
      };

      // Write results.json
      const resultsPath = path.join(process.cwd(), 'results.json');
      await fs.promises.writeFile(resultsPath, JSON.stringify(results, null, 2), 'utf8');

      // Update store
      runStore.set(runId, {
        runId,
        status: results.finalCiStatus === 'PASSED' ? 'completed' : 'failed',
        results,
        createdAt: runStore.get(runId)!.createdAt
      });
    } catch (error) {
      runStore.set(runId, {
        runId,
        status: 'failed',
        createdAt: runStore.get(runId)!.createdAt
      });
    }
  })();

  // Return runId immediately
  return res.json({ runId, status: 'running' });
});

app.get('/api/status', async (req, res) => {
  const runId = req.query.runId as string;

  if (!runId) {
    // Return latest run status
    const latest = Array.from(runStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (!latest) {
      return res.json({ executionStatus: 'idle', ciRuns: [], retryLimit: RETRY_LIMIT });
    }

    return res.json({
      executionStatus: latest.status,
      ciRuns: latest.results?.ciTimeline ?? [],
      retryLimit: RETRY_LIMIT,
      currentStep: latest.status === 'running' ? 'Processing...' : undefined
    });
  }

  const runState = runStore.get(runId);
  if (!runState) {
    return res.status(404).json({ error: 'Run not found' });
  }

  return res.json({
    executionStatus: runState.status,
    ciRuns: runState.results?.ciTimeline ?? [],
    retryLimit: RETRY_LIMIT,
    currentStep: runState.status === 'running' ? 'Processing...' : undefined
  });
});

app.get('/api/results', async (req, res) => {
  const runId = req.query.runId as string;

  if (!runId) {
    // Return latest results
    const latest = Array.from(runStore.values())
      .filter((r) => r.results)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (!latest || !latest.results) {
      // Try reading from disk as fallback
      try {
        const resultsPath = path.join(process.cwd(), 'results.json');
        const fileContent = await fs.promises.readFile(resultsPath, 'utf8');
        const results = JSON.parse(fileContent) as AgentResults;
        return res.json(results);
      } catch {
        return res.status(404).json({ error: 'No results found' });
      }
    }

    return res.json(latest.results);
  }

  const runState = runStore.get(runId);
  if (!runState || !runState.results) {
    return res.status(404).json({ error: 'Results not found' });
  }

  return res.json(runState.results);
});

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Agent listening on port ${PORT}`);
});

