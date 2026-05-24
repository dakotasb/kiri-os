'use client';

import { Task, getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ActiveWorkItemProps {
  task: Task;
  delay?: number;
}

export function ActiveWorkItem({ task, delay = 0 }: ActiveWorkItemProps) {
  const agent = task.agentId ? getAgent(task.agentId) : null;
  if (!agent) return null;

  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-border last:border-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <AgentIcon agent={agent} size="sm" showPulse={false} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-medium text-tx truncate">{task.title}</p>
          <div className="flex items-center gap-1 text-xs text-tx-3 shrink-0 ml-2">
            <Clock size={11} />
            {task.startedAt}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${task.progress ?? 0}%`,
              background: `linear-gradient(90deg, ${agent.accent}, ${hexToRgba(agent.accent, 0.7)})`,
              boxShadow: `0 0 8px ${hexToRgba(agent.accent, 0.5)}`,
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-tx-3">{agent.name}</span>
          <span
            className="text-[11px] font-mono font-medium"
            style={{ color: agent.accent }}
          >
            {task.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
