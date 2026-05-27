'use client';

import { useChatContext } from '@/lib/chat-context';
import { ChipRail } from '@/components/chat/ChipRail';
import { Job } from '@/lib/jobs';

export function ChatBarChips() {
  const { sendMessage } = useChatContext();

  function handleJob(job: Job) {
    sendMessage(job.prompt);
  }

  return (
    <div className="px-6 pt-3 pb-1">
      <ChipRail onInvoke={handleJob} />
    </div>
  );
}
