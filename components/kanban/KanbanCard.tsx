'use client';

import { useState } from 'react';
import { LiveTask } from '@/hooks/useTasks';
import { getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';
import { AlertCircle, User, ChevronRight } from 'lucide-react';
import { apiPatchTaskStatus } from '@/lib/api-client';

const PRIORITY_COLORS = {
  high:   '#EF4444',
  medium: '#F59E0B',
  low:    '#4A4A6A',
};

const NEXT_STATUS: Record<LiveTask['status'], LiveTask['status'] | null> = {
  todo:        'in-progress',
  'in-progress': 'review',
  review:      'done',
  done:        null,
};

const NEXT_LABEL: Record<LiveTask['status'], string> = {
  todo:          'Start',
  'in-progress': 'Review',
  review:        'Done',
  done:          '',
};

interface KanbanCardProps {
  task: LiveTask;
  delay?: number;
  onStatusChange?: (id: string, newStatus: LiveTask['status']) => void;
}

export function KanbanCard({ task, delay = 0, onStatusChange }: KanbanCardProps) {
  const agent    = task.assignee ? getAgent(task.assignee) : null;
  const isReview = task.isHumanReview;
  const [busy, setBusy] = useState(false);

  const next = NEXT_STATUS[task.status];

  async function handleAdvance(e: React.MouseEvent) {
    e.stopPropagation();
    if (!next || busy) return;
    setBusy(true);
    try {
      await apiPatchTaskStatus(task.id, next);
      onStatusChange?.(task.id, next);
    } catch {
      // silently leave the card in its current state; the polling hook will sync
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="rounded-xl border bg-surface p-3.5 cursor-pointer transition-all duration-200 group hover:bg-s1 shadow-card hover:shadow-card-hover animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: isReview ? 'rgba(242,126,180,0.45)' : 'var(--border)',
        boxShadow:   isReview ? '0 0 20px rgba(242,126,180,0.12), 0 0 0 1px rgba(242,126,180,0.2)' : undefined,
      }}
    >
      {isReview && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium mb-2.5 -mt-0.5" style={{ color: '#F27EB4' }}>
          <AlertCircle size={11} strokeWidth={2.5} />
          Needs your review
        </div>
      )}

      <p className="text-sm font-medium text-tx leading-snug mb-2 line-clamp-2">{task.title}</p>

      {task.status === 'in-progress' && task.progress !== undefined && agent && (
        <div className="mb-2.5">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--progress-track)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${task.progress}%`, background: `linear-gradient(90deg, ${agent.accent}, ${hexToRgba(agent.accent, 0.7)})` }}
            />
          </div>
          <p className="text-[10px] text-tx-3 mt-1 text-right font-mono">{task.progress}%</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ background: PRIORITY_COLORS[task.priority] }} />
          <span className="text-[10px] text-tx-3 capitalize">{task.priority}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {task.startedAt   && <span className="text-[10px] text-tx-3">{task.startedAt}</span>}
          {task.completedAt && <span className="text-[10px] text-tx-3">{task.completedAt}</span>}

          {next && (
            <button
              onClick={handleAdvance}
              disabled={busy}
              title={NEXT_LABEL[task.status]}
              className="hidden group-hover:flex items-center gap-0.5 text-[10px] text-tx-3 hover:text-tx-2 px-1.5 py-0.5 rounded hover:bg-white/[0.06] transition-all"
            >
              {NEXT_LABEL[task.status]}
              <ChevronRight size={9} strokeWidth={2} />
            </button>
          )}

          {agent ? (
            <AgentIcon agent={agent} size="xs" showPulse={false} />
          ) : isReview ? (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(242,126,180,0.1)', border: '1px solid rgba(242,126,180,0.28)' }}
            >
              <User size={11} style={{ color: '#F27EB4' }} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/[0.04] border border-border">
              <User size={11} className="text-tx-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
