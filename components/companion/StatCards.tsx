'use client';

import { useChatContext } from '@/lib/chat-context';

const STATS = [
  {
    label:  'Completed today',
    value:  '7 tasks',
    color:  '#10B981',
    prompt: 'Give me an end of day wrap-up',
    hint:   'See today\'s full summary',
  },
  {
    label:  'Memories added',
    value:  '14 new',
    color:  '#06B6D4',
    prompt: 'Catch me up on what happened today',
    hint:   'Ask Kiri what was captured',
  },
  {
    label:  'Hours saved',
    value:  '~4.2 hrs',
    color:  '#6CD9BA',
    prompt: 'What needs my attention right now?',
    hint:   'See what needs you next',
  },
];

export function StatCards() {
  const { sendMessage } = useChatContext();

  return (
    <div className="grid grid-cols-3 gap-3 mb-4 max-w-2xl mx-auto">
      {STATS.map((stat, i) => (
        <div key={stat.label} className="relative group">
          <button
            onClick={() => sendMessage(stat.prompt)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center animate-fade-up hover:border-border-hover hover:bg-s1 transition-all duration-150"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-lg font-semibold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-tx-3 mt-0.5">{stat.label}</p>
          </button>
          {/* Hint floats below — no reserved space inside the card */}
          <p
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-70 transition-opacity duration-200 pointer-events-none"
            style={{ color: stat.color }}
          >
            {stat.hint} →
          </p>
        </div>
      ))}
    </div>
  );
}
