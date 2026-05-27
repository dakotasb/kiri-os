'use client';

import {
  Sparkles, Sun, Moon, TrendingUp, Search,
  FileText, CircleAlert, Code2, Clock, LucideIcon,
} from 'lucide-react';
import { JOBS } from '@/lib/jobs';
import { getAgent } from '@/lib/mock-data';
import { hexToRgba } from '@/lib/utils';
import { useChatContext } from '@/lib/chat-context';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Sun, Moon, TrendingUp, Search, FileText, CircleAlert, Code2,
};

const KIRI_COLOR = '#6CD9BA';

interface QuickActionsRowProps {
  /** Compact mode for inside the chat bar — no title, tighter cards */
  inChatBar?: boolean;
  /** Cap the number of jobs shown */
  limit?: number;
}

export function QuickActionsRow({ inChatBar = false, limit }: QuickActionsRowProps) {
  const { sendMessage } = useChatContext();
  const jobs = limit ? JOBS.slice(0, limit) : JOBS;

  return (
    <div className={inChatBar ? 'px-6 pt-3 pb-1' : 'mb-6'}>
      {!inChatBar && (
        <p className="text-sm font-semibold text-tx mb-3">Quick actions</p>
      )}

      <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-0.5">
        {jobs.map(job => {
          const Icon   = ICON_MAP[job.icon] ?? Sparkles;
          const agent  = job.agentId ? getAgent(job.agentId) : null;
          const accent = agent?.accent ?? KIRI_COLOR;

          return (
            <button
              key={job.id}
              onClick={() => sendMessage(job.prompt)}
              className={`
                flex items-center gap-2.5 rounded-xl border border-border bg-surface
                hover:border-border-hover hover:bg-s1 transition-all duration-150
                text-left group flex-1 shrink-0
                ${inChatBar ? 'px-3 py-2 basis-[136px]' : 'px-3.5 py-3 basis-[148px]'}
              `}
            >
              {/* Icon block */}
              <div
                className={`relative flex items-center justify-center rounded-lg shrink-0 ${inChatBar ? 'w-7 h-7' : 'w-9 h-9'}`}
                style={{ background: hexToRgba(accent, 0.12) }}
              >
                <Icon size={inChatBar ? 13 : 16} strokeWidth={1.8} style={{ color: accent }} />
                {job.isRoutine && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--surface)',
                      border: `1px solid ${hexToRgba(accent, 0.35)}`,
                    }}
                  >
                    <Clock size={7} strokeWidth={2.2} style={{ color: accent }} />
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className={`font-semibold text-tx leading-snug ${inChatBar ? 'text-[11px]' : 'text-xs'}`}>
                  {job.label}
                </p>
                {!inChatBar && (
                  <p className="text-[10px] text-tx-3 mt-0.5 leading-snug truncate">
                    {job.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
