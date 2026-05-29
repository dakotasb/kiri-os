'use client';

import { useState } from 'react';
import { X, RefreshCw, GitCommit } from 'lucide-react';
import { useUpdateAvailable } from '@/hooks/useUpdateAvailable';
import { useChatContext } from '@/lib/chat-context';
import { hexToRgba } from '@/lib/utils';

const KIRI_COLOR = '#6CD9BA';

export function UpdateBanner() {
  const update              = useUpdateAvailable();
  const { sendMessage }     = useChatContext();
  const [dismissed, setDismissed] = useState(false);
  const [state, setState]         = useState<'idle' | 'sent'>('idle');

  if (!update || dismissed) return null;

  const { commitCount, latestTag } = update;

  function handleConfirm() {
    if (state !== 'idle') return;
    setState('sent');
    sendMessage(
      `There's a Hermes update available — ${commitCount} commit${commitCount !== 1 ? 's' : ''} ahead, latest ${latestTag}. Can you coordinate a graceful restart?`
    );
  }

  return (
    <div
      className="shrink-0 flex items-center gap-3 px-5 py-2 text-xs border-b animate-fade-up"
      style={{
        background:  hexToRgba(KIRI_COLOR, 0.06),
        borderColor: hexToRgba(KIRI_COLOR, 0.18),
      }}
    >
      {/* Icon */}
      <GitCommit size={13} strokeWidth={1.8} style={{ color: KIRI_COLOR, flexShrink: 0 }} />

      {state === 'idle' ? (
        <>
          <span className="text-tx-2 flex-1 min-w-0">
            <span style={{ color: KIRI_COLOR }} className="font-medium">hermes-agent update available</span>
            {' '}—{' '}
            {commitCount} commit{commitCount !== 1 ? 's' : ''} ahead, latest{' '}
            <span className="font-mono" style={{ color: KIRI_COLOR }}>{latestTag}</span>.
            {' '}Update now?
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConfirm}
              className="px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 hover:brightness-110 active:scale-95"
              style={{ background: KIRI_COLOR, color: '#13121A' }}
            >
              Confirm
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1 rounded-md text-[11px] font-medium text-tx-2 hover:text-tx hover:bg-white/[0.05] transition-colors"
            >
              Later
            </button>
          </div>
        </>
      ) : (
        <span className="flex-1 min-w-0 flex items-center gap-1.5" style={{ color: KIRI_COLOR }}>
          <RefreshCw size={11} strokeWidth={2} className="animate-spin" />
          <span>Asking Kiri to coordinate the update…</span>
        </span>
      )}

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}
