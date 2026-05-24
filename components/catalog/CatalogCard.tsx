'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Agent, getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';

interface CatalogCardProps {
  agent: Agent;
  featured?: boolean;
  delay?: number;
}

export function CatalogCard({ agent, featured = false, delay = 0 }: CatalogCardProps) {
  const [added, setAdded] = useState(['kiri', 'compass', 'forge', 'atlas'].includes(agent.id));

  return (
    <div
      className={`rounded-xl border border-border bg-surface transition-all duration-200 cursor-pointer group hover:border-border-hover hover:bg-s1 hover:shadow-card-hover animate-fade-up ${
        featured ? 'p-5' : 'p-4'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className={`flex items-start justify-between ${featured ? 'mb-4' : 'mb-3'}`}>
        <AgentIcon agent={agent} size={featured ? 'lg' : 'md'} showPulse={agent.status === 'active'} />

        <button
          onClick={e => {
            e.stopPropagation();
            setAdded(v => !v);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
          style={
            added
              ? { color: agent.accent, background: hexToRgba(agent.accent, 0.08), borderColor: hexToRgba(agent.accent, 0.25) }
              : { color: '#7A7A9A', background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }
          }
        >
          {added ? <Check size={11} strokeWidth={2.5} /> : <Plus size={11} strokeWidth={2.5} />}
          {added ? 'Added' : 'Add'}
        </button>
      </div>

      {/* Info */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <p className={`font-semibold text-tx ${featured ? 'text-base' : 'text-sm'}`}>{agent.name}</p>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ color: agent.accent, background: hexToRgba(agent.accent, 0.1) }}
          >
            {agent.role}
          </span>
        </div>
        <p className={`text-tx-2 leading-relaxed ${featured ? 'text-sm' : 'text-xs'}`}>
          {agent.description}
        </p>
      </div>

      {/* Capabilities (featured only) */}
      {featured && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {agent.capabilities.slice(0, 3).map(cap => (
            <span
              key={cap}
              className="text-[11px] px-2 py-1 rounded-md border"
              style={{
                color: '#7A7A9A',
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              {cap}
            </span>
          ))}
        </div>
      )}

      {/* Works well with */}
      {agent.worksWell.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <span className="text-[10px] text-tx-3 shrink-0">Works with</span>
          <div className="flex -space-x-2">
            {agent.worksWell.slice(0, 3).map(id => {
              const peer = getAgent(id);
              if (!peer) return null;
              return (
                <div
                  key={id}
                  className="w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center"
                  style={{ background: hexToRgba(peer.accent, 0.2) }}
                  title={peer.name}
                >
                  <span className="text-[8px] font-bold" style={{ color: peer.accent }}>
                    {peer.name[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
