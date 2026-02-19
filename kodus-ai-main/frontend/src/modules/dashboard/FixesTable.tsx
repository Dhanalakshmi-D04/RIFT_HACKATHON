import React from 'react';
import { useDashboardStore } from './state';

const statusBadgeClasses: Record<string, string> = {
  FIXED:
    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
  FAILED: 'bg-red-500/10 text-red-300 border border-red-500/40'
};

export const FixesTable: React.FC = () => {
  const { lastRun } = useDashboardStore();
  if (!lastRun) return null;

  const { fixes } = lastRun;

  if (!fixes.length) {
    return (
      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40 md:p-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
          Fixes applied
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          No fixes were required for this run.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40 md:p-6">
      <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        Fixes applied
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Detailed view of every bug the agent detected and attempted to fix.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-[0.16em] text-slate-400">
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Bug type</th>
              <th className="px-3 py-2">Line</th>
              <th className="px-3 py-2">Commit message</th>
              <th className="px-3 py-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {fixes.map((fix, index) => (
              <tr
                key={`${fix.file}-${fix.lineNumber}-${index}`}
                className="border-b border-slate-900/60 last:border-0"
              >
                <td className="max-w-xs truncate px-3 py-2 font-mono text-[11px] text-slate-100">
                  {fix.file}
                </td>
                <td className="px-3 py-2 text-[11px] font-medium text-slate-100">
                  {fix.bugType}
                </td>
                <td className="px-3 py-2 text-[11px] text-slate-200">
                  {fix.lineNumber}
                </td>
                <td className="max-w-md truncate px-3 py-2 text-[11px] text-slate-200">
                  {fix.commitMessage}
                </td>
                <td className="px-3 py-2 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      statusBadgeClasses[fix.status]
                    }`}
                  >
                    {fix.status === 'FIXED' ? '✓ Fixed' : '✗ Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

