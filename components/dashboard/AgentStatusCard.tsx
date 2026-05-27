'use client';

import { Agent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';

interface AgentStatusCardProps {
  agent: Agent;
  delay?: number;
}

export function AgentStatusCard({ agent, delay = 0 }: AgentStatusCardProps) {
  const isActive = agent.status === 'active';
  const isOffline = agent.status === 'offline';

  return (
    <div
      className="rounded-xl border border-border bg-surface p-4 hover:border-border-hover hover:bg-s1 transition-all duration-200 cursor-pointer group animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        borderTop: isActive ? `2px solid ${hexToRgba(agent.accent, 0.6)}` : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <AgentIcon agent={agent} size="md" showPulse={isActive} showDot={false} />
        <span
          className="text-[10px] font-medium px-2 py-1 rounded-full border"
          style={
            isActive
              ? { color: '#10B981', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }
              : isOffline
              ? { color: 'var(--tx3)', background: 'var(--badge-off-bg)', borderColor: 'var(--badge-off-border)' }
              : { color: 'var(--tx2)', background: 'var(--badge-idle-bg)', borderColor: 'var(--badge-idle-border)' }
          }
        >
          {isActive ? 'Active' : isOffline ? 'Offline' : 'Ready'}
        </span>
      </div>

      <p className="text-sm font-semibold text-tx mb-0.5">{agent.name}</p>
      <p className="text-xs text-tx-3 mb-3">{agent.role}</p>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <p className="text-tx-3">Sessions</p>
          <p className="text-tx font-mono font-medium">{agent.sessions}</p>
        </div>
        <div>
          <p className="text-tx-3">Today</p>
          <p className="text-tx font-mono font-medium">{agent.tasksToday} tasks</p>
        </div>
        <div>
          <p className="text-tx-3">Memories</p>
          <p className="text-tx font-mono font-medium">{agent.memoryEntries.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-tx-3">Model</p>
          <p className="text-tx-2 font-mono truncate" title={agent.model}>{agent.model.split('-').slice(0, 2).join('-')}</p>
        </div>
      </div>
    </div>
  );
}
