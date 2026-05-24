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
            <AgentIcon agent={agent} size="xl" showName showRole showPulse />

            {/* Connector between agents */}
            {i < myAgents.length - 1 && (
              <div className="relative flex items-center" style={{ width: 64, height: 2 }}>
                {/* Base line */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                />

                {/* Active handoff particle */}
                {currentHandoff.active &&
                  agent.id === currentHandoff.fromAgentId && (
                    <span
                      className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full animate-particle"
                      style={{
                        background: from?.accent ?? '#8B5CF6',
                        boxShadow: `0 0 6px ${hexToRgba(from?.accent ?? '#8B5CF6', 0.9)}`,
                      }}
                    />
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
