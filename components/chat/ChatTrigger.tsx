'use client';

import { Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useChatContext } from '@/lib/chat-context';
import { hexToRgba } from '@/lib/utils';

const KIRI_COLOR = '#6CD9BA';

export function ChatTrigger() {
  const { isOpen, openPanel } = useChatContext();
  const path = usePathname();

  // Home page has its own action bar — hide there
  // Also hide whenever the panel is already open
  if (path === '/' || isOpen) return null;

  return (
    <button
      onClick={openPanel}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-3 pr-4 py-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #6CD9BA 0%, #3AC9A6 40%, #3F289D 100%)',
        boxShadow: `0 0 24px ${hexToRgba(KIRI_COLOR, 0.45)}, 0 4px 16px rgba(0,0,0,0.4)`,
      }}
    >
      <Sparkles size={16} strokeWidth={2} className="text-white" />
      <span className="text-xs font-semibold text-white tracking-tight">Ask Kiri</span>
    </button>
  );
}
