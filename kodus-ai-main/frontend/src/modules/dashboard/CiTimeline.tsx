import React from 'react';
import { useDashboardStore } from './state';

export const CiTimeline: React.FC = () => {
  const { lastRun } = useDashboardStore();
  if (!lastRun) return null;

  const { ciTimeline, retryLimit } = lastRun;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            CI/CD status timeline
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Each iteration represents a full test run and fix cycle.
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          {ciTimeline.length}/{retryLimit} iterations used
        </div>
      </div>

      <ol className="mt-4 space-y-3 text-xs">
        {ciTimeline.map((item) => {
          const isPassed = item.status === 'PASSED';
          return (
            <li key={item.iteration} className="flex items-start gap-3">
              <div
                className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                  isPassed ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-100">
                    Iteration {item.iteration}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      isPassed
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-500/10 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {!ciTimeline.length && (
        <p className="mt-3 text-xs text-slate-400">
          No CI/CD runs have been recorded for this execution yet.
        </p>
      )}
    </section>
  );
};

