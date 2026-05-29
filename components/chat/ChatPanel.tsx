'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ArrowUp, Clock, Sparkles, Sun, Moon, TrendingUp, Search, FileText, CircleAlert, Code2, LucideIcon } from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { ChipRail } from '@/components/chat/ChipRail';
import { GoalOfferCard } from '@/components/chat/GoalOfferCard';
import { MessageText } from '@/components/chat/MessageText';
import { agents, getAgent } from '@/lib/mock-data';
import { hexToRgba } from '@/lib/utils';
import { JOBS, Job } from '@/lib/jobs';

const KIRI_COLOR = '#6CD9BA';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Sun, Moon, TrendingUp, Search, FileText, CircleAlert, Code2,
};

/* ─── Job card (empty-state grid) ───────────────────────────────────── */

function JobCard({ job, onInvoke }: { job: Job; onInvoke: (j: Job) => void }) {
  const Icon   = ICON_MAP[job.icon] ?? Sparkles;
  const agent  = job.agentId ? getAgent(job.agentId) : null;
  const accent = agent?.accent ?? KIRI_COLOR;

  return (
    <button
      onClick={() => onInvoke(job)}
      className="flex flex-col gap-2.5 p-3 rounded-xl border border-border bg-s1 hover:border-border-hover hover:bg-s2 text-left transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-1">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: hexToRgba(accent, 0.12) }}
        >
          <Icon size={15} strokeWidth={1.8} style={{ color: accent }} />
        </div>
        {job.isRoutine && (
          <Clock size={10} strokeWidth={1.8} className="text-tx-3 mt-1 opacity-60 shrink-0" />
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-tx leading-snug">{job.label}</p>
        <p className="text-[10px] text-tx-3 mt-0.5 leading-snug">{job.description}</p>
      </div>
    </button>
  );
}

/* ─── ChatPanel ──────────────────────────────────────────────────────── */

export function ChatPanel() {
  const { isOpen, messages, kiriActivity, kiriOffline, closePanel, sendMessage, acceptGoal, declineGoal } = useChatContext();
  const [input, setInput]     = useState('');
  const [focused, setFocused] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLTextAreaElement>(null);

  const kiri     = agents.find(a => a.id === 'kiri')!;
  const kiriLive = { ...kiri, activity: kiriActivity };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 310);
  }, [isOpen]);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  }

  function handleJob(job: Job) {
    sendMessage(job.prompt);
  }

  const hasMessages   = messages.length > 0;
  const isThinking    = hasMessages && kiriActivity === 'thinking';

  return (
    <div
      className="flex flex-col h-full border-l border-border bg-bg shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out"
      style={{ width: isOpen ? 400 : 0 }}
    >
      <div className="flex flex-col h-full w-[400px] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border shrink-0">
          <AgentIcon agent={kiriLive} size="2xl" orb hero showPulse />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold kiri-text">Kiri</p>
            <p className="text-[11px] text-tx-3">
              {kiriOffline
                ? 'Offline'
                : kiriActivity === 'responding'
                ? 'Responding…'
                : isThinking
                ? 'Thinking…'
                : 'Ready'}
            </p>
          </div>
          <button
            onClick={closePanel}
            className="p-1.5 rounded-lg text-tx-3 hover:text-tx hover:bg-white/[0.05] transition-colors"
          >
            <X size={15} strokeWidth={1.6} />
          </button>
        </div>

        {/* ── Body: empty state jobs grid OR message thread ── */}
        <div className="flex-1 overflow-y-auto">

          {!hasMessages ? (
            /* Jobs grid */
            <div className="px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-tx-3 mb-3">
                Quick actions
              </p>
              <div className="grid grid-cols-2 gap-2">
                {JOBS.map(job => (
                  <JobCard key={job.id} job={job} onInvoke={handleJob} />
                ))}
              </div>
            </div>
          ) : (
            /* Message thread */
            <div className="px-5 py-4 flex flex-col gap-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-up`}
                >
                  <div
                    className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: KIRI_COLOR,
                            color: '#FFFFFF',
                            borderRadius: '18px 18px 4px 18px',
                            fontWeight: 500,
                          }
                        : {
                            background: 'var(--s1)',
                            border: '1px solid var(--border)',
                            color: 'var(--tx)',
                            borderRadius: '18px 18px 18px 4px',
                          }
                    }
                  >
                    {msg.role === 'assistant' && !msg.text && isThinking ? (
                      <div className="flex items-center gap-1.5 py-0.5">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="inline-block w-1.5 h-1.5 rounded-full animate-typing"
                            style={{ background: KIRI_COLOR, animationDelay: `${i * 160}ms` }}
                          />
                        ))}
                      </div>
                    ) : msg.role === 'assistant' ? (
                      <MessageText text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>

                  {msg.goalOffer && msg.role === 'assistant' && (
                    <div className="w-[85%] mt-1.5">
                      <GoalOfferCard
                        offer={msg.goalOffer}
                        onAccept={acceptGoal}
                        onDecline={declineGoal}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Bottom: chips (post-message only) + input ── */}
        <div className="shrink-0 px-4 pt-3 pb-5 border-t border-border">
          {hasMessages && (
            <div className="mb-2.5">
              <ChipRail onInvoke={handleJob} compact />
            </div>
          )}

          <div
            className="flex items-end gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200"
            style={{
              background: focused ? `rgb(var(--t-kiri) / 0.04)` : 'var(--input-bg)',
              borderColor: focused ? hexToRgba(KIRI_COLOR, 0.35) : 'var(--input-border)',
              boxShadow: focused ? `0 0 0 3px ${hexToRgba(KIRI_COLOR, 0.07)}` : 'none',
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); autoResize(e.target); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={kiriOffline ? 'Gateway offline — check Hermes…' : 'Ask Kiri…'}
              disabled={kiriOffline}
              className="flex-1 bg-transparent resize-none text-sm text-tx placeholder:text-tx-3 outline-none min-h-[20px] max-h-32 leading-relaxed overflow-y-auto"
              style={{ fontFamily: 'inherit' }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
              style={{
                background: input ? KIRI_COLOR : 'rgba(255,255,255,0.06)',
                boxShadow: input ? `0 0 12px ${hexToRgba(KIRI_COLOR, 0.4)}` : 'none',
              }}
            >
              <ArrowUp size={13} strokeWidth={2.5} style={{ color: input ? '#0D1C16' : 'var(--tx3)' }} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
