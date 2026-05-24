'use client';

import { useState } from 'react';
import { ArrowUp, Mic, Paperclip } from 'lucide-react';
import { hexToRgba } from '@/lib/utils';

const KIRI_COLOR = '#6CD9BA';

const SUGGESTIONS = [
  'Summarize what my team did today',
  'What needs my attention right now?',
  'Brief me on the Q2 research',
  'How is the auth API going?',
];

export function ChatInput() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="px-6 py-4">
      {/* Suggestions */}
      {!value && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => setValue(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-tx-2 hover:text-tx hover:border-border-hover hover:bg-white/[0.04] transition-all duration-150"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="relative flex items-end gap-3 rounded-2xl border transition-all duration-200 px-4 py-3"
        style={{
          background: focused ? 'rgb(var(--t-kiri) / 0.05)' : 'var(--input-bg)',
          borderColor: focused ? hexToRgba(KIRI_COLOR, 0.4) : 'var(--input-border)',
          boxShadow: focused ? `0 0 0 3px ${hexToRgba(KIRI_COLOR, 0.08)}, 0 0 30px ${hexToRgba(KIRI_COLOR, 0.08)}` : 'none',
        }}
      >
        <textarea
          rows={1}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask Kiri anything…"
          className="flex-1 bg-transparent resize-none text-sm text-tx placeholder:text-tx-3 outline-none min-h-[22px] max-h-40 leading-relaxed"
          style={{ fontFamily: 'inherit' }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              setValue('');
            }
          }}
        />

        <div className="flex items-center gap-1 shrink-0">
          <button className="p-1.5 rounded-lg text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors">
            <Paperclip size={15} strokeWidth={1.6} />
          </button>
          <button className="p-1.5 rounded-lg text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors">
            <Mic size={15} strokeWidth={1.6} />
          </button>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: value ? KIRI_COLOR : 'rgba(255,255,255,0.06)',
              boxShadow: value ? `0 0 16px ${hexToRgba(KIRI_COLOR, 0.4)}` : 'none',
            }}
            onClick={() => setValue('')}
          >
            <ArrowUp size={15} strokeWidth={2.5} style={{ color: value ? '#13121A' : 'var(--tx3)' }} />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-tx-3 text-center mt-2">
        Kiri coordinates your team · powered by Hermes + MemPalace
      </p>
    </div>
  );
}
