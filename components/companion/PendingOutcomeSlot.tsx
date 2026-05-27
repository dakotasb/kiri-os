'use client';

import { useChatContext } from '@/lib/chat-context';
import { PendingOutcomeCard } from '@/components/chat/PendingOutcomeCard';

export function PendingOutcomeSlot() {
  const { pendingOutcome } = useChatContext();
  if (!pendingOutcome) return null;
  return <PendingOutcomeCard pending={pendingOutcome} />;
}
