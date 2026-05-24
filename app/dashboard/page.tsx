import { FleetHealth } from '@/components/dashboard/FleetHealth';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { ActiveWorkItem } from '@/components/dashboard/ActiveWorkItem';
import { OutcomeCard } from '@/components/companion/OutcomeCard';
import { agents, tasks, outcomes } from '@/lib/mock-data';
import { RefreshCw, Plus } from 'lucide-react';

export default function DashboardPage() {
  const activeTasks = tasks.filter(t => t.status === 'in-progress');
  const recentOutcomes = outcomes.slice(0, 3);

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-tx tracking-tight">Fleet Dashboard</h1>
          <p className="text-sm text-tx-3 mt-0.5">Live view of your agent fleet · Updated just now</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-tx-2 hover:text-tx rounded-lg border border-border hover:border-border-hover hover:bg-white/[0.04] transition-all duration-150">
            <RefreshCw size={12} strokeWidth={2} />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-150"
            style={{ background: '#8B5CF6', boxShadow: '0 0 16px rgba(139,92,246,0.35)' }}
          >
            <Plus size={12} strokeWidth={2.5} />
            Add Agent
          </button>
        </div>
      </div>

      {/* Fleet health */}
      <FleetHealth />

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* Agent status grid — 2 cols */}
        <div className="col-span-2">
          <h2 className="text-sm font-semibold text-tx mb-3">Agents</h2>
          <div className="grid grid-cols-3 gap-3">
            {agents.map((agent, i) => (
              <AgentStatusCard key={agent.id} agent={agent} delay={i * 50} />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Active work */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-tx">Active Work</h2>
              <span className="text-[11px] text-kiri font-mono">{activeTasks.length} running</span>
            </div>
            <div>
              {activeTasks.map((task, i) => (
                <ActiveWorkItem key={task.id} task={task} delay={i * 60} />
              ))}
              {activeTasks.length === 0 && (
                <p className="text-xs text-tx-3 py-4 text-center">No active tasks</p>
              )}
            </div>
          </div>

          {/* Recent outcomes */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <h2 className="text-sm font-semibold text-tx mb-3">Recent</h2>
            <div className="flex flex-col gap-2">
              {recentOutcomes.map((outcome, i) => (
                <OutcomeCard key={outcome.id} outcome={outcome} delay={i * 50} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
