'use client';

import { getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';
import { PendingOutcome } from '@/lib/chat-context';

interface Props {
  pending: PendingOutcome;
}

export function PendingOutcomeCard({ pending }: Props) {
  const agent = getAgent(pending.agentId) ?? getAgent('kiri')!;

  return (
    <div
      className="rounded-xl border bg-surface p-4 animate-fade-up col-span-2"
      style={{
        borderLeft: `2px solid ${hexToRgba(agent.accent, 0.55)}`,
        borderColor: hexToRgba(agent.accent, 0.22),
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <AgentIcon
          agent={{ ...agent, activity: 'thinking' }}
          size="sm"
          showPulse
          showDot={false}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-tx-3">{agent.name} · just now</p>
          <p className="text-sm font-medium text-tx leading-tight mt-0.5 truncate">{pending.title}</p>
        </div>
        <span
          className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md border shrink-0"
          style={{
            color: agent.accent,
            background: hexToRgba(agent.accent, 0.08),
            borderColor: hexToRgba(agent.accent, 0.18),
          }}
        >
          <span
            className="w-1 h-1 rounded-full animate-pulse"
            style={{ background: agent.accent }}
          />
          In progress
        </span>
      </div>

      {/* Shimmer lines */}
      <div className="flex flex-col gap-2">
        {[78, 60, 40].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full overflow-hidden"
            style={{ width: `${w}%`, background: hexToRgba(agent.accent, 0.06) }}
          >
            <div
              className="h-full w-full animate-shimmer rounded-full"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, ${hexToRgba(agent.accent, 0.18)} 50%, transparent 100%)`,
                backgroundSize: '400px 100%',
                animationDelay: `${i * 200}ms`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
