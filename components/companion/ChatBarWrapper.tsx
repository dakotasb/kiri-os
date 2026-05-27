'use client';

import { ReactNode } from 'react';
import { useChatContext } from '@/lib/chat-context';

export function ChatBarWrapper({ children }: { children: ReactNode }) {
  const { isOpen } = useChatContext();

  return (
    <div
      className="absolute bottom-0 left-0 right-0 glass border-t border-border transition-all duration-300 ease-in-out"
      style={{
        background: 'var(--chat-bar-bg)',
        transform: isOpen ? 'translateY(110%)' : 'translateY(0)',
        pointerEvents: isOpen ? 'none' : 'auto',
      }}
    >
      {children}
    </div>
  );
}
