'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { Goal, Outcome, getAgent } from '@/lib/mock-data';
import { OutcomeCard } from '@/components/companion/OutcomeCard';
import { hexToRgba } from '@/lib/utils';

/* ─── Progress ring ──────────────────────────────────────────────────── */

function RingProgress({ progress, accent }: { progress: number; accent: string }) {
  const size = 40;
  const sw   = 3;
  const r    = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ * (1 - progress / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--progress-track)" strokeWidth={sw} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={accent}
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-semibold font-mono leading-none" style={{ color: accent }}>
          {progress}%
        </span>
      </div>
    </div>
  );
}

/* ─── GoalCard ───────────────────────────────────────────────────────── */

interface GoalCardProps {
  goal: Goal;
  outcomes: Outcome[];
  defaultOpen?: boolean;
  delay?: number;
  isNew?: boolean;
}

export function GoalCard({ goal, outcomes, defaultOpen = true, delay = 0, isNew = false }: GoalCardProps) {
  const [open, setOpen]               = useState(defaultOpen);
  const [displayTitle, setDisplay]    = useState(isNew ? '' : goal.title);
  const [typingDone, setTypingDone]   = useState(!isNew);
  const [isEditing, setIsEditing]     = useState(false);
  const [editValue, setEditValue]     = useState(goal.title);
  const inputRef                      = useRef<HTMLInputElement>(null);

  const agent  = getAgent(goal.agentId);
  const accent = agent?.accent ?? '#6CD9BA';

  /* Typewriter — runs once on mount when isNew, completes in ~1 second */
  useEffect(() => {
    if (!isNew) return;
    const msPerChar = Math.max(12, Math.floor(1000 / goal.title.length));
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(goal.title.slice(0, i));
      if (i >= goal.title.length) {
        clearInterval(id);
        setTypingDone(true);
      }
    }, msPerChar);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function commitEdit() {
    const trimmed = editValue.trim() || goal.title;
    setDisplay(trimmed);
    setEditValue(trimmed);
    setIsEditing(false);
  }

  return (
    <div
      className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 hover:bg-s1 transition-colors cursor-pointer group/header"
        onClick={() => !isEditing && setOpen(v => !v)}
      >
        <RingProgress progress={goal.progress} accent={accent} />

        {/* Title area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => {
                  if (e.key === 'Enter')  { e.preventDefault(); commitEdit(); }
                  if (e.key === 'Escape') { setEditValue(displayTitle); setIsEditing(false); }
                }}
                onClick={e => e.stopPropagation()}
                className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-tx outline-none border-b pb-px"
                style={{ borderColor: hexToRgba(accent, 0.5) }}
              />
            ) : (
              <>
                <p className="text-sm font-semibold text-tx leading-tight truncate">
                  {displayTitle}
                  {isNew && !typingDone && (
                    <span className="ml-[1px] opacity-60 animate-pulse">|</span>
                  )}
                </p>
                {/* Edit pencil — visible on hover */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setEditValue(displayTitle);
                    setIsEditing(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                  className="opacity-0 group-hover/header:opacity-100 transition-opacity shrink-0 text-tx-3 hover:text-tx-2 p-0.5 rounded"
                >
                  <Pencil size={10} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
          <p className="text-[11px] text-tx-3 mt-0.5 truncate">
            {agent?.name} · {goal.category} · {goal.targetDate}
          </p>
        </div>

        {/* Metric pill */}
        <span
          className="shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-lg hidden sm:block"
          style={{ background: hexToRgba(accent, 0.10), color: accent }}
        >
          {goal.metric}
        </span>

        <ChevronDown
          size={14} strokeWidth={1.8}
          className="shrink-0 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: open ? accent : 'var(--tx3)',
          }}
        />
      </div>

      {/* ── Outcomes ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '800px' : '0px' }}
      >
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-tx-3 mt-3 mb-3">
            Recent Outcomes
          </p>

          {outcomes.length > 0 ? (
            <div className={`grid gap-2.5 ${outcomes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {outcomes.map((outcome, i) => (
                <OutcomeCard key={outcome.id} outcome={outcome} delay={i * 60} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-5 text-center">
              <p className="text-[11px] text-tx-3 leading-relaxed">
                Routines are building toward this goal — outcomes on their way.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
