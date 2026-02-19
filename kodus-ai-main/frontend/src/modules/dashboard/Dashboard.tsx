import React from 'react';
import { useDashboardStore } from './state';
import { InputSection } from './InputSection';
import { RunSummaryCard } from './RunSummaryCard';
import { ScorePanel } from './ScorePanel';
import { FixesTable } from './FixesTable';
import { CiTimeline } from './CiTimeline';

export const Dashboard: React.FC = () => {
  const { lastRun } = useDashboardStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              RIFT Autonomous DevOps Agent
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              End-to-end CI agent: clone, test, fix, and iterate until green.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Live demo build
          </div>
        </header>

        <InputSection />

        {lastRun && (
          <>
            <RunSummaryCard />
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <ScorePanel />
              <CiTimeline />
            </div>
            <FixesTable />
          </>
        )}

        {!lastRun && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
            Agent has not been run yet. Submit a GitHub repository URL with your team
            details to see the full pipeline, including fixes, score breakdown, and
            CI/CD iterations.
          </div>
        )}
      </div>
    </div>
  );
};

