import type { AgentResults } from './types';

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.toString() ?? '';

const withBase = (path: string) =>
  API_BASE ? `${API_BASE}${path}` : path;

export interface RunAgentPayload {
  repositoryUrl: string;
  teamName: string;
  teamLeader: string;
}

export async function postRunAgent(
  payload: RunAgentPayload
): Promise<unknown> {
  const res = await fetch(withBase('/api/run-agent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to trigger agent run');
  }

  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function getStatus(): Promise<unknown> {
  const res = await fetch(withBase('/api/status'));
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch agent status');
  }
  return res.json();
}

export async function getResults(): Promise<AgentResults> {
  const res = await fetch(withBase('/api/results'));
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch agent results');
  }
  return res.json() as Promise<AgentResults>;
}

