'use client';

import { useState } from 'react';
import { Check, X, Target, Link2 } from 'lucide-react';
import { GoalOffer } from '@/lib/chat-context';
import { getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';

type OfferState = 'pending' | 'accepted' | 'declined';

interface GoalOfferCardProps {
  offer: GoalOffer;
  onAccept: (offer: GoalOffer) => void;
  onDecline: (offerId: string) => void;
}

export function GoalOfferCard({ offer, onAccept, onDecline }: GoalOfferCardProps) {
  const [state, setState] = useState<OfferState>('pending');

  const agent      = getAgent(offer.agentId);
  const accent     = agent?.accent ?? '#6CD9BA';
  const isExisting = !!offer.existingGoalId;

  function handleAccept() {
    setState('accepted');
    onAccept(offer);
  }

  function handleDecline() {
    setState('declined');
    onDecline(offer.id);
  }

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: state === 'accepted'
          ? hexToRgba(accent, 0.35)
          : 'var(--border)',
        background: state === 'accepted'
          ? hexToRgba(accent, 0.07)
          : 'var(--s1)',
        opacity: state === 'declined' ? 0.5 : 1,
      }}
    >
      {/* Goal preview */}
      <div className="flex items-center gap-3 px-3.5 pt-3.5 pb-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: hexToRgba(accent, 0.12) }}
        >
          {isExisting
            ? <Link2 size={14} strokeWidth={1.8} style={{ color: accent }} />
            : <Target size={14} strokeWidth={1.8} style={{ color: accent }} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
            {isExisting && (
              <span
                className="text-[9px] font-semibold uppercase tracking-wider leading-none px-1.5 py-0.5 rounded shrink-0"
                style={{ background: hexToRgba(accent, 0.12), color: accent }}
              >
                Existing
              </span>
            )}
            <p className="text-xs font-semibold text-tx leading-tight truncate">{offer.title}</p>
          </div>
          <p className="text-[10px] text-tx-3">
            {agent?.name ?? offer.agentId} · {offer.category} · {offer.targetDate}
          </p>
        </div>

        {agent && (
          <AgentIcon agent={agent} size="xs" showDot={false} showPulse={false} />
        )}
      </div>

      {/* Metric pill */}
      <div className="px-3.5 pb-3">
        <span
          className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md"
          style={{ background: hexToRgba(accent, 0.10), color: accent }}
        >
          {offer.metric}
        </span>
      </div>

      {/* Actions */}
      <div className="border-t border-border px-3.5 py-2.5">
        {state === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:brightness-110 active:scale-95"
              style={{ background: accent, color: '#FFFFFF' }}
            >
              <Check size={11} strokeWidth={2.5} />
              {isExisting ? 'Track toward it' : 'Add Goal'}
            </button>
            <button
              onClick={handleDecline}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-tx-2 hover:text-tx hover:bg-white/[0.05] transition-colors"
            >
              <X size={11} strokeWidth={2} />
              {isExisting ? 'Keep separate' : 'Not now'}
            </button>
          </div>
        )}

        {state === 'accepted' && (
          <div
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: accent }}
          >
            <Check size={12} strokeWidth={2.5} />
            {isExisting
              ? `Linked — outcomes will flow into "${offer.title}".`
              : "Added to your goals — I'll check in weekly."
            }
          </div>
        )}

        {state === 'declined' && (
          <p className="text-xs text-tx-3">
            {isExisting ? 'Kept separate — no changes made.' : 'Got it — just ask whenever you\'re ready.'}
          </p>
        )}
      </div>
    </div>
  );
}
