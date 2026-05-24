'use client';

import { tasks, TaskStatus } from '@/lib/mock-data';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo',        label: 'To Do',      color: '#4A4A6A' },
  { status: 'in-progress', label: 'In Progress', color: '#8B5CF6' },
  { status: 'review',      label: 'Review',      color: '#F59E0B' },
  { status: 'done',        label: 'Done',        color: '#10B981' },
];

export function KanbanBoard({ projectId }: { projectId?: string }) {
  const filteredTasks = projectId ? tasks.filter(t => t.projectId === projectId) : tasks;

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {COLUMNS.map(col => {
        const colTasks = filteredTasks.filter(t => t.status === col.status);

        return (
          <div key={col.status} className="flex flex-col w-72 shrink-0">
            {/* Column header */}
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
                <button className="w-6 h-6 rounded-md flex items-center justify-center text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors">
                  <Plus size={14} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 flex-1">
              {colTasks.map((task, i) => (
                <KanbanCard key={task.id} task={task} delay={i * 40} />
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
  );
}
