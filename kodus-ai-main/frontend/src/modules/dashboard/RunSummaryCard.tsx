import React from 'react';
import { useDashboardStore } from './state';

const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining.toFixed(0)}s`;
};

export const RunSummaryCard: React.FC = () => {
  const { lastRun } = useDashboardStore();
  if (!lastRun) return null;

  const {
    repositoryUrl,
    teamName,
    teamLeader,
    branchName,
    totalFailures,
    totalFixesApplied,
    finalCiStatus,
    totalTimeSeconds
  } = lastRun;

  const statusColor =
    finalCiStatus === 'PASSED'
      ? 'bg-emerald-500 text-emerald-950'
      : 'bg-red-500 text-red-950';

  return (
    <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)] md:p-6">
      <div className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
          Run summary
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400">Repository</span>
            <span className="truncate font-medium text-slate-50">
              {repositoryUrl}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div>
              <span className="block text-xs text-slate-400">Team</span>
              <span className="text-sm font-medium text-slate-50">{teamName}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Team Leader</span>
              <span className="text-sm font-medium text-slate-50">
                {teamLeader}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">Branch</span>
              <span className="text-[11px] font-mono uppercase tracking-wide text-emerald-300">
                {branchName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Failures detected</span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-amber-300">
              {totalFailures}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400">Fixes applied</span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-1">
            <span className="text-2xl font-semibold text-emerald-300">
              {totalFixesApplied}
            </span>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusColor}`}
              >
                {finalCiStatus}
              </span>
              <span className="text-[11px] text-slate-400">
                Total time: {formatDuration(totalTimeSeconds)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

