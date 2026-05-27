'use client';

import { currentHandoff, getAgent } from '@/lib/mock-data';
import { hexToRgba } from '@/lib/utils';

export function CoordinationBar() {
  if (!currentHandoff.active) return null;

  const from = getAgent(currentHandoff.fromAgentId);
  const to   = getAgent(currentHandoff.toAgentId);
  if (!from || !to) return null;

  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-medium"
      style={{
        background:  hexToRgba(from.accent, 0.22),
        border:      `1px solid ${hexToRgba(from.accent, 0.35)}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
        style={{ background: from.accent }}
      />

      <span className="font-semibold" style={{ color: from.accent }}>
        {from.name}
      </span>

      <span className="text-tx opacity-50">→</span>

      <span className="font-semibold" style={{ color: to.accent }}>
        {to.name}
      </span>

      <span className="text-tx opacity-30">·</span>

      <span className="text-tx font-normal">{currentHandoff.task}</span>
    </div>
  );
}
