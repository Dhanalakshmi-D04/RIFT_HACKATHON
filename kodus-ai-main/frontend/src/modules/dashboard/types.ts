export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'failed';

export type CiStatus = 'PASSED' | 'FAILED';

export type BugType =
  | 'LINTING'
  | 'SYNTAX'
  | 'LOGIC'
  | 'TYPE_ERROR'
  | 'IMPORT'
  | 'INDENTATION';

export type FixStatus = 'FIXED' | 'FAILED';

export interface FixEntry {
  file: string;
  bugType: BugType;
  lineNumber: number;
  commitMessage: string;
  status: FixStatus;
}

export interface CiRun {
  iteration: number;
  status: CiStatus;
  timestamp: string;
}

export interface Score {
  base: number;
  speedBonus: number;
  efficiencyPenalty: number;
  final: number;
}

export interface AgentResults {
  repositoryUrl: string;
  teamName: string;
  teamLeader: string;
  branchName: string;
  totalFailures: number;
  totalFixesApplied: number;
  finalCiStatus: CiStatus;
  totalTimeSeconds: number;
  baseScore: number;
  speedBonus: number;
  efficiencyPenalty: number;
  finalScore: number;
  commitCount: number;
  retryLimit: number;
  ciTimeline: CiRun[];
  fixes: FixEntry[];
}

export interface AgentState {
  repoUrl: string;
  teamName: string;
  leaderName: string;
  branchName: string;

  executionStatus: ExecutionStatus;
  startTime?: string;
  endTime?: string;

  failuresDetected: number;
  fixesApplied: number;
  ciRuns: CiRun[];
  finalStatus?: CiStatus;

  score: Score;
  retryLimit: number;

  fixes: FixEntry[];

  errorMessage?: string;
}

