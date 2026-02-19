import { create } from 'zustand';
import type { AgentResults, AgentState, ExecutionStatus } from './types';
import { getResults, getStatus, postRunAgent } from './agentApi';

interface DashboardState extends AgentState {
  loading: boolean;
  lastRun?: AgentResults;
  runAgent(input: {
    repositoryUrl: string;
    teamName: string;
    teamLeader: string;
  }): Promise<void>;
  refreshStatus(): Promise<void>;
  loadResults(): Promise<void>;
  reset(): void;
}

const initialState: AgentState = {
  repoUrl: '',
  teamName: '',
  leaderName: '',
  branchName: '',
  executionStatus: 'idle',
  failuresDetected: 0,
  fixesApplied: 0,
  ciRuns: [],
  score: {
    base: 0,
    speedBonus: 0,
    efficiencyPenalty: 0,
    final: 0
  },
  retryLimit: 0,
  fixes: []
};

const mapResultsToState = (
  current: AgentState,
  results: AgentResults
): AgentState => {
  const {
    repositoryUrl,
    teamName,
    teamLeader,
    branchName,
    totalFailures,
    totalFixesApplied,
    finalCiStatus,
    totalTimeSeconds,
    baseScore,
    speedBonus,
    efficiencyPenalty,
    finalScore,
    retryLimit,
    ciTimeline,
    fixes
  } = results;

  const endTime = current.startTime
    ? new Date(Date.parse(current.startTime) + totalTimeSeconds * 1000).toISOString()
    : undefined;

  return {
    ...current,
    repoUrl: repositoryUrl,
    teamName,
    leaderName: teamLeader,
    branchName,
    failuresDetected: totalFailures,
    fixesApplied: totalFixesApplied,
    finalStatus: finalCiStatus,
    ciRuns: ciTimeline,
    score: {
      base: baseScore,
      speedBonus,
      efficiencyPenalty,
      final: finalScore
    },
    retryLimit,
    fixes,
    endTime
  };
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initialState,
  loading: false,
  lastRun: undefined,
  async runAgent(payload) {
    const start = new Date().toISOString();
    set({
      ...initialState,
      repoUrl: payload.repositoryUrl,
      teamName: payload.teamName,
      leaderName: payload.teamLeader,
      executionStatus: 'running',
      startTime: start,
      loading: true,
      errorMessage: undefined
    });

    try {
      await postRunAgent(payload);

      // Optionally capture a one-shot status snapshot
      try {
        await getStatus();
      } catch {
        // status is best-effort; do not fail the run on this
      }

      const results = await getResults();
      set((state) => {
        const mapped = mapResultsToState(state, results);
        const finalStatus: ExecutionStatus =
          results.finalCiStatus === 'PASSED' ? 'completed' : 'failed';

        return {
          ...mapped,
          loading: false,
          executionStatus: finalStatus,
          lastRun: results
        };
      });
    } catch (err) {
      set((state) => ({
        ...state,
        loading: false,
        executionStatus: 'failed',
        errorMessage: err instanceof Error ? err.message : 'Unknown error'
      }));
    }
  },
  async refreshStatus() {
    try {
      await getStatus();
    } catch (err) {
      set((state) => ({
        ...state,
        errorMessage: err instanceof Error ? err.message : 'Failed to refresh status'
      }));
    }
  },
  async loadResults() {
    try {
      const results = await getResults();
      set((state) => {
        const mapped = mapResultsToState(state, results);
        return {
          ...mapped,
          lastRun: results
        };
      });
    } catch (err) {
      set((state) => ({
        ...state,
        errorMessage: err instanceof Error ? err.message : 'Failed to load results'
      }));
    }
  },
  reset() {
    set({
      ...initialState,
      loading: false,
      lastRun: undefined
    });
  }
}));

