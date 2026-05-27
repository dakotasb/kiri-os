'use client';

import { useState, useEffect } from 'react';
import { getAgent } from '@/lib/mock-data';

const ACTIVITIES = [
  { agentId: 'ledger',  text: 'Running weekly portfolio scan — no anomalies detected' },
  { agentId: 'kiri',    text: 'Compressing 14 new memories into MemPalace' },
  { agentId: 'coach',   text: 'Habit streak holding — 3 active days logged' },
  { agentId: 'horizon', text: 'Monitoring competitive landscape for new signals' },
  { agentId: 'ledger',  text: 'Checking upcoming bills — 3 due in the next 7 days' },
  { agentId: 'kiri',    text: 'Reindexing agent context from this morning\'s sessions' },
  { agentId: 'beacon',  text: 'Watching 6 tracked sources — no new alerts' },
  { agentId: 'horizon', text: 'Scanning market feeds — flagging 2 items for review' },
  { agentId: 'ledger',  text: 'Portfolio up 2.3% this week — within target range' },
  { agentId: 'kiri',    text: 'Scheduling EOD summary for 6pm based on your routine' },
  { agentId: 'coach',   text: 'Workout plan updated — rest day flagged for tomorrow' },
  { agentId: 'beacon',  text: 'Auth API deployment detected — cross-checking status' },
];

export function ActivityStrip() {
  const [idx, setIdx]         = useState(0);
  const [typed, setTyped]     = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let charIndex = 0;
    const target = ACTIVITIES[idx].text;

    setTyped('');
    setVisible(true);

    function tick() {
      if (charIndex <= target.length) {
        setTyped(target.slice(0, charIndex));
        charIndex++;
        timer = setTimeout(tick, 24);
      } else {
        timer = setTimeout(() => {
          setVisible(false);
          timer = setTimeout(() => {
            setIdx(prev => (prev + 1) % ACTIVITIES.length);
          }, 350);
        }, 2200);
      }
    }

    tick();
    return () => clearTimeout(timer);
  }, [idx]);

  const activity = ACTIVITIES[idx];
  const agent    = getAgent(activity.agentId);
  if (!agent) return null;

  return (
    <div
      className="flex items-center gap-2 h-4 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span
        className="w-1 h-1 rounded-full shrink-0"
        style={{ background: agent.accent }}
      />

      <span
        className="text-[10px] font-semibold shrink-0 font-mono"
        style={{ color: agent.accent }}
      >
        {agent.name}
      </span>

      <span className="text-[10px] text-tx-2 shrink-0">·</span>

      <span className="text-[10px] text-tx-2 font-mono truncate">
        {typed}
        <span className="inline-block w-[1px] h-[10px] ml-[1px] align-middle animate-pulse" style={{ background: 'var(--tx2)' }} />
      </span>
    </div>
  );
}
