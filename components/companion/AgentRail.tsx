'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles, Sun, Moon, TrendingUp, Search,
  FileText, CircleAlert, Code2, LucideIcon,
} from 'lucide-react';
import { agents as allAgents, currentHandoff, getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';
import { useChatContext } from '@/lib/chat-context';
import { JOBS, Job } from '@/lib/jobs';

const MY_AGENTS = ['kiri', 'horizon', 'forge', 'ledger', 'coach'];

const KIRI_ORB = 160;
const SUB_ORB  = 80;
const SUB_PAD  = (KIRI_ORB - SUB_ORB) / 2;
const CONN_MT  = KIRI_ORB / 2 - 1;
const CONN_W   = 64;

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Sun, Moon, TrendingUp, Search, FileText, CircleAlert, Code2,
};

function getAgentJobs(agentId: string): Job[] {
  if (agentId === 'kiri') return JOBS.filter(j => !j.agentId);
  return JOBS.filter(j => j.agentId === agentId);
}

export function AgentRail() {
  const { kiriActivity, sendMessage } = useChatContext();
  const [openAgentId,   setOpenAgentId]   = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  const myAgents = MY_AGENTS.map(id => getAgent(id)).filter(Boolean) as typeof allAgents;
  const from     = getAgent(currentHandoff.fromAgentId);
  const to       = getAgent(currentHandoff.toAgentId);

  /* Close popover on any outside click */
  useEffect(() => {
    if (!openAgentId) return;
    const handle = () => setOpenAgentId(null);
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [openAgentId]);

  return (
    <div className="flex flex-col items-center gap-6">

      {/* ── Agent row ── */}
      <div className="flex items-start gap-10">
        {myAgents.map((agent, i) => {
          const isKiri    = agent.id === 'kiri';
          const agentData = isKiri ? { ...agent, activity: kiriActivity } : agent;
          const jobs      = getAgentJobs(agent.id);
          const isOpen    = openAgentId   === agent.id;
          const isActive  = isOpen || hoveredAgentId === agent.id;

          return (
            <div key={agent.id} className="flex items-start gap-10">

              {/* ── Agent orb (clickable) + popover ── */}
              <div
                className="relative cursor-pointer"
                style={!isKiri ? { paddingTop: SUB_PAD } : undefined}
                onMouseEnter={() => setHoveredAgentId(agent.id)}
                onMouseLeave={() => setHoveredAgentId(null)}
                onClick={e => { e.stopPropagation(); setOpenAgentId(isOpen ? null : agent.id); }}
              >
                {/* Scale + glow wrapper — scoped to the icon only so the popover stays put */}
                <div
                  style={{
                    transition: isActive
                      ? 'transform 150ms ease-out, filter 150ms ease-out'
                      : 'transform 200ms ease-out, filter 200ms ease-out',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    filter: isActive
                      ? `drop-shadow(0 0 ${isKiri ? '20px' : '12px'} ${hexToRgba(agent.accent, 0.55)})`
                      : 'none',
                  }}
                >
                  <AgentIcon
                    agent={agentData}
                    size={isKiri ? '3xl' : 'xl'}
                    showName
                    showRole
                    showPulse
                    orb
                    hero={isKiri}
                  />
                </div>

                {/* ── Job popover ── */}
                {isOpen && (
                  <div
                    className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 w-56 rounded-xl border border-border bg-surface shadow-xl animate-fade-up overflow-hidden"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Caret */}
                    <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l border-border bg-surface" />

                    {/* Header */}
                    <div className="px-3 pt-3 pb-2 border-b border-border">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-tx-3">
                        {agent.name} · Quick actions
                      </p>
                    </div>

                    {jobs.length > 0 ? (
                      <div className="py-1">
                        {jobs.map(job => {
                          const Icon = ICON_MAP[job.icon] ?? Sparkles;
                          return (
                            <button
                              key={job.id}
                              onClick={() => { sendMessage(job.prompt); setOpenAgentId(null); }}
                              className="flex items-start gap-2.5 w-full px-3 py-2.5 hover:bg-s1 transition-colors text-left"
                            >
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                                style={{ background: hexToRgba(agent.accent, 0.12) }}
                              >
                                <Icon size={11} strokeWidth={1.8} style={{ color: agent.accent }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-tx leading-snug">{job.label}</p>
                                <p className="text-[10px] text-tx-3 mt-0.5 leading-snug">{job.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-center">
                        <p className="text-[11px] text-tx-3">No quick actions yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Connector line ── */}
              {i < myAgents.length - 1 && (
                <div
                  className="relative flex-shrink-0"
                  style={{ width: CONN_W, height: 2, marginTop: CONN_MT }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--connector-line)' }}
                  />
                  {currentHandoff.active && agent.id === currentHandoff.fromAgentId && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <span
                        className="absolute inset-y-0 left-0 w-1/2 animate-line-sweep"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${hexToRgba(from?.accent ?? '#6CD9BA', 1)} 50%, transparent)`,
                          boxShadow:  `0 0 6px ${hexToRgba(from?.accent ?? '#6CD9BA', 0.8)}`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ── Handoff pill ── */}
      {currentHandoff.active && from && to && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border"
          style={{
            background:  hexToRgba(from.accent, 0.06),
            borderColor: hexToRgba(from.accent, 0.20),
            color:       from.accent,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: from.accent }} />
          {from.name} → {to.name}
          <span style={{ color: 'var(--tx3)', fontWeight: 400 }}>· {currentHandoff.task}</span>
        </div>
      )}

    </div>
  );
}
