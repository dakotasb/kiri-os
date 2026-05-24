'use client';

import { Task, getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';
import { AlertCircle, User } from 'lucide-react';

const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#4A4A6A',
};

interface KanbanCardProps {
  task: Task;
  delay?: number;
}

export function KanbanCard({ task, delay = 0 }: KanbanCardProps) {
  const agent = task.agentId ? getAgent(task.agentId) : null;
  const isReview = task.isHumanReview;

  return (
    <div
      className="rounded-xl border bg-surface p-3.5 cursor-pointer transition-all duration-200 group hover:bg-s1 animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: isReview ? 'rgba(245,158,11,0.4)' : '#252530',
        boxShadow: isReview ? '0 0 18px rgba(245,158,11,0.1), 0 0 0 1px rgba(245,158,11,0.15)' : 'none',
      }}
    >
      {/* Human review banner */}
      {isReview && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400 mb-2.5 -mt-0.5">
          <AlertCircle size={11} strokeWidth={2.5} />
          Needs your review
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-tx leading-snug mb-2">{task.title}</p>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded border"
              style={{ color: '#5A5A7A', borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress bar (in-progress only) */}
      {task.status === 'in-progress' && task.progress !== undefined && agent && (
        <div className="mb-2.5">
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${task.progress}%`,
                background: `linear-gradient(90deg, ${agent.accent}, ${hexToRgba(agent.accent, 0.7)})`,
              }}
            />
          </div>
          <p className="text-[10px] text-tx-3 mt-1 text-right font-mono">{task.progress}%</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {/* Priority */}
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: PRIORITY_COLORS[task.priority] }}
          />
          <span className="text-[10px] text-tx-3 capitalize">{task.priority}</span>
        </div>

        {/* Agent or human icon */}
        <div className="flex items-center gap-1.5">
          {task.startedAt && (
            <span className="text-[10px] text-tx-3">{task.startedAt}</span>
          )}
          {task.completedAt && (
            <span className="text-[10px] text-tx-3">{task.completedAt}</span>
          )}
          {agent ? (
            <AgentIcon agent={agent} size="xs" showPulse={false} />
          ) : isReview ? (
            <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
              <User size={11} style={{ color: '#F59E0B' }} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
