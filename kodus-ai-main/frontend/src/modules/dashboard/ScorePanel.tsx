import React from 'react';
import { useDashboardStore } from './state';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export const ScorePanel: React.FC = () => {
  const { lastRun } = useDashboardStore();
  if (!lastRun) return null;

  const { baseScore, speedBonus, efficiencyPenalty, finalScore } = lastRun;

  const data = [
    { name: 'Base', value: baseScore, color: '#38bdf8' },
    { name: 'Speed bonus', value: speedBonus, color: '#22c55e' },
    { name: 'Penalty', value: -Math.abs(efficiencyPenalty), color: '#f97316' },
    { name: 'Final', value: finalScore, color: '#a855f7' }
  ];

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40 md:p-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
            Score breakdown
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Base score, speed bonus, efficiency penalty, and final total.
          </p>
        </div>
        <div className="text-right">
          <span className="block text-xs text-slate-400">Final score</span>
          <span className="text-2xl font-semibold text-emerald-300">
            {finalScore}
          </span>
        </div>
      </div>

      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1f2937',
                borderRadius: 8,
                padding: 8
              }}
              labelStyle={{ color: '#e5e7eb', fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

