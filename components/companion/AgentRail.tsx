'use client';

import { agents as allAgents, currentHandoff, getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';

const MY_AGENTS = ['kiri', 'compass', 'forge', 'atlas'];

export function AgentRail() {
  const myAgents = MY_AGENTS.map(id => getAgent(id)).filter(Boolean) as typeof allAgents;
  const from = getAgent(currentHandoff.fromAgentId);
  const to = getAgent(currentHandoff.toAgentId);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Agent row */}
      <div className="flex items-center gap-10">
        {myAgents.map((agent, i) => (
          <div key={agent.id} className="flex items-center gap-10">
            <AgentIcon agent={agent} size="xl" showName showRole showPulse orb />

            {/* Connector between agents */}
            {i < myAgents.length - 1 && (
              <div className="relative flex items-center" style={{ width: 64, height: 2 }}>
                {/* Base line */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--connector-line)' }}
                />

                {/* Active handoff: glow sweeps left → right */}
                {currentHandoff.active &&
                  agent.id === currentHandoff.fromAgentId && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <span
                        className="absolute inset-y-0 left-0 w-1/2 animate-line-sweep"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${hexToRgba(from?.accent ?? '#6CD9BA', 1)} 50%, transparent)`,
                          boxShadow: `0 0 6px ${hexToRgba(from?.accent ?? '#6CD9BA', 0.8)}`,
                        }}
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Handoff status */}
      {currentHandoff.active && from && to && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border"
          style={{
            background: hexToRgba(from.accent, 0.06),
            borderColor: hexToRgba(from.accent, 0.2),
            color: from.accent,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: from.accent }}
          />
          {from.name} is handing off to {to.name}
          <span className="text-tx-3 font-normal">· {currentHandoff.task}</span>
        </div>
      )}
    </div>
  );
}
