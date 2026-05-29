'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTasks, LiveTask } from '@/hooks/useTasks';
import { projects } from '@/lib/mock-data';
import { KanbanCard } from './KanbanCard';
import { AddTaskModal } from './AddTaskModal';
import { Plus, Loader2 } from 'lucide-react';

const COLUMNS: { status: LiveTask['status']; label: string; color: string }[] = [
  { status: 'todo',        label: 'To Do',       color: '#4A4A6A' },
  { status: 'in-progress', label: 'In Progress',  color: '#8B5CF6' },
  { status: 'review',      label: 'Review',       color: '#F59E0B' },
  { status: 'done',        label: 'Done',         color: '#10B981' },
];

export function KanbanBoard({ projectId }: { projectId?: string }) {
  const assigneeFilter = useMemo(() => {
    if (!projectId) return undefined;
    const proj = projects.find(p => p.id === projectId);
    return proj ? proj.agentIds.join(',') : undefined;
  }, [projectId]);

  const { tasks, loading, refetch } = useTasks(
    assigneeFilter ? { assignee: assigneeFilter } : {},
    15_000,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleStatusChange = useCallback((_id: string, _status: LiveTask['status']) => {
    // Optimistic: the card already moved visually via its own state.
    // Refetch to confirm and resync after a short delay.
    setTimeout(refetch, 1500);
  }, [refetch]);

  const handleCreated = useCallback(() => {
    refetch();
  }, [refetch]);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-tx-3 gap-2">
        <Loader2 size={14} className="animate-spin" />
        <span className="text-xs">Loading tasks…</span>
      </div>
    );
  }

  return (
    <>
      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />

      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.status);

          return (
            <div key={col.status} className="flex flex-col w-72 shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm font-medium text-tx">{col.label}</span>
                  <span
                    className="text-[11px] font-mono px-1.5 py-0.5 rounded border"
                    style={{ color: col.color, background: `${col.color}14`, borderColor: `${col.color}30` }}
                  >
                    {colTasks.length}
                  </span>
                </div>
                {col.status === 'todo' && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors"
                    title="Add task"
                  >
                    <Plus size={14} strokeWidth={2} />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2.5 flex-1">
                {colTasks.map((task, i) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    delay={i * 40}
                    onStatusChange={handleStatusChange}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border h-20 flex items-center justify-center">
                    <p className="text-xs text-tx-3">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
