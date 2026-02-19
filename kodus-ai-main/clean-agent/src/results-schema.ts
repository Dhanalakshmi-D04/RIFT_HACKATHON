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

export interface CiIteration {
  iteration: number;
  status: CiStatus;
  timestamp: string;
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
  ciTimeline: CiIteration[];
  fixes: FixEntry[];
}

