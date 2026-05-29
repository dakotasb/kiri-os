'use client';

import { useState, useCallback } from 'react';
import { FleetHealth } from '@/components/dashboard/FleetHealth';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { ActiveWorkItem } from '@/components/dashboard/ActiveWorkItem';
import { AddAgentModal } from '@/components/dashboard/AddAgentModal';
import { OutcomeCard } from '@/components/companion/OutcomeCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { agents, outcomes } from '@/lib/mock-data';
import { useFleet } from '@/hooks/useFleet';
import { useTasks } from '@/hooks/useTasks';
import { RefreshCw, Plus } from 'lucide-react';

function DashboardActions({
  onRefresh,
  refreshing,
  onAddAgent,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  onAddAgent: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-tx-2 hover:text-tx rounded-lg border border-border hover:border-border-hover hover:bg-white/[0.04] transition-all duration-150 disabled:opacity-50"
      >
        <RefreshCw size={12} strokeWidth={2} className={refreshing ? 'animate-spin' : ''} />
        Refresh
      </button>
      <button
        onClick={onAddAgent}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150"
        style={{ background: '#6CD9BA', color: '#13121A', boxShadow: '0 0 16px rgba(108,217,186,0.35)' }}
      >
        <Plus size={12} strokeWidth={2.5} />
        Add Agent
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const [refreshing,    setRefreshing]    = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);

  const { data: fleet,  refetch: refetchFleet }  = useFleet();
  const { tasks: liveTasks, refetch: refetchTasks } = useTasks({ status: 'running,ready,blocked' });
  const { tasks: doneTasks } = useTasks({ status: 'done' }, 60_000);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFleet(), refetchTasks()]);
    setRefreshing(false);
  }, [refetchFleet, refetchTasks]);

  const mergedAgents = agents.map(a => {
    const live = fleet?.agents.find(l => l.id === a.id);
    if (!live) return a;
    return {
      ...a,
      status:      live.status,
      sessions:    live.sessions,
      tasksToday:  live.tasksToday,
      model:       live.model || a.model,
      currentTask: live.runningTask?.title,
    };
  });

  const activeTasks = liveTasks.filter(t => t.status === 'in-progress');
  const recentDone  = doneTasks.slice(0, 3);

  return (
    <>
      <AddAgentModal open={agentModalOpen} onClose={() => setAgentModalOpen(false)} />

      <div className="h-full overflow-y-auto p-8 space-y-6 animate-fade-in">
        <PageHeader
          title="Fleet Dashboard"
          subtitle="Live view of your agent fleet · Updated just now"
          action={
            <DashboardActions
              onRefresh={handleRefresh}
              refreshing={refreshing}
              onAddAgent={() => setAgentModalOpen(true)}
            />
          }
        />

        <FleetHealth />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-tx mb-3">Agents</h2>
            <div className="grid grid-cols-3 gap-3">
              {mergedAgents.map((agent, i) => (
                <AgentStatusCard key={agent.id} agent={agent} delay={i * 50} />
              ))}
            </div>
          </div>

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

            {/* Recent completed */}
            <div className="rounded-xl border border-border bg-surface p-4">
              <h2 className="text-sm font-semibold text-tx mb-3">Recent</h2>
              <div className="flex flex-col gap-2">
                {recentDone.length > 0
                  ? recentDone.map((task, i) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-2.5 py-2 border-b border-border last:border-0 animate-fade-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#10B981' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-tx line-clamp-2 leading-snug">{task.title}</p>
                          <p className="text-[10px] text-tx-3 mt-0.5">
                            {task.assignee ?? 'unassigned'} · {task.completedAt ?? 'recently'}
                          </p>
                        </div>
                      </div>
                    ))
                  : outcomes.slice(0, 3).map((outcome, i) => (
                      <OutcomeCard key={outcome.id} outcome={outcome} delay={i * 50} />
                    ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
