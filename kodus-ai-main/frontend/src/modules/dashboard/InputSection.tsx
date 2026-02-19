import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDashboardStore } from './state';

const schema = z.object({
  repositoryUrl: z.string().url('Enter a valid GitHub repository URL'),
  teamName: z.string().min(2, 'Team name is required'),
  teamLeader: z.string().min(2, 'Team leader name is required')
});

type FormValues = z.infer<typeof schema>;

export const InputSection: React.FC = () => {
  const { loading, errorMessage, runAgent } = useDashboardStore();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      repositoryUrl: '',
      teamName: '',
      teamLeader: ''
    }
  });

  const onSubmit = (values: FormValues) => {
    void runAgent(values);
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40 md:p-6">
      <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        Input
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Provide the GitHub repository and team details to start a full autonomous
        DevOps run.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_auto]"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            GitHub Repository URL
          </label>
          <input
            {...register('repositoryUrl')}
            type="url"
            placeholder="https://github.com/org/repo"
            className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          />
          {errors.repositoryUrl && (
            <span className="text-xs text-red-400">
              {errors.repositoryUrl.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">Team Name</label>
          <input
            {...register('teamName')}
            placeholder="RIFT ORGANISERS"
            className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          />
          {errors.teamName && (
            <span className="text-xs text-red-400">{errors.teamName.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            Team Leader Name
          </label>
          <input
            {...register('teamLeader')}
            placeholder="Saiyam Kumar"
            className="h-9 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
          />
          {errors.teamLeader && (
            <span className="text-xs text-red-400">
              {errors.teamLeader.message}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-emerald-500 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Running…' : 'Run Agent'}
          </button>
        </div>
      </form>

      {loading && (
        <p className="mt-3 text-xs text-slate-400">
          Agent is cloning the repository, running tests, applying fixes, and
          monitoring CI/CD…
        </p>
      )}

      {errorMessage && (
        <p className="mt-3 text-xs text-red-400">
          {errorMessage || 'Something went wrong while running the agent.'}
        </p>
      )}
    </section>
  );
};

