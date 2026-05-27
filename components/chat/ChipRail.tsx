'use client';

import {
  Sparkles, Sun, Moon, TrendingUp, Search, FileText,
  CircleAlert, Code2, Clock, LucideIcon,
} from 'lucide-react';
import { JOBS, Job } from '@/lib/jobs';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Sun, Moon, TrendingUp, Search, FileText, CircleAlert, Code2,
};

interface ChipRailProps {
  onInvoke: (job: Job) => void;
  /** Tighter sizing for inside the panel */
  compact?: boolean;
}

export function ChipRail({ onInvoke, compact = false }: ChipRailProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
      {JOBS.map(job => {
        const Icon = ICON_MAP[job.icon] ?? Sparkles;
        return (
          <button
            key={job.id}
            onClick={() => onInvoke(job)}
            className={`
              flex items-center gap-1.5 shrink-0 rounded-full border border-border
              text-tx-2 hover:text-tx hover:border-border-hover hover:bg-white/[0.04]
              transition-all duration-150
              ${compact ? 'text-[11px] px-2.5 py-1' : 'text-xs px-3 py-1.5'}
            `}
          >
            <Icon size={compact ? 10 : 11} strokeWidth={1.8} />
            {job.label}
            {job.isRoutine && (
              <Clock size={9} strokeWidth={2} className="opacity-40 ml-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
