'use client';

import { ExternalLink, Share2, TrendingUp, Search, Code2, BarChart3, FileText } from 'lucide-react';
import { Outcome, getAgent } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';

const TYPE_ICONS = {
  finance: TrendingUp,
  research: Search,
  build: Code2,
  analysis: BarChart3,
  review: FileText,
};

const TYPE_LABELS = {
  finance: 'Finance',
  research: 'Research',
  build: 'Build',
  analysis: 'Analysis',
  review: 'Review',
};

interface OutcomeCardProps {
  outcome: Outcome;
  delay?: number;
}

export function OutcomeCard({ outcome, delay = 0 }: OutcomeCardProps) {
  const agent = getAgent(outcome.agentId);
  if (!agent) return null;

  const TypeIcon = TYPE_ICONS[outcome.type];

  return (
    <div
      className="rounded-xl border border-border bg-surface p-4 hover:border-border-hover hover:bg-s1 transition-all duration-200 group cursor-pointer shadow-card hover:shadow-card-hover animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        borderLeft: `2px solid ${hexToRgba(agent.accent, 0.5)}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <AgentIcon agent={agent} size="sm" showPulse={false} showDot={false} />
          <div>
            <p className="text-xs text-tx-3 tabular-nums">{agent.name} · {outcome.time}</p>
            <p className="text-sm font-medium text-tx leading-tight mt-0.5">{outcome.title}</p>
          </div>
        </div>

        {/* Type badge */}
        <span
          className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md shrink-0 border"
          style={{
            color: agent.accent,
            background: hexToRgba(agent.accent, 0.08),
            borderColor: hexToRgba(agent.accent, 0.18),
          }}
        >
          <TypeIcon size={10} strokeWidth={2} />
          {TYPE_LABELS[outcome.type]}
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm text-tx-2 leading-relaxed line-clamp-3">{outcome.summary}</p>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-tx-2 hover:text-tx hover:bg-white/[0.06] transition-colors"
        >
          <ExternalLink size={11} />
          Open
        </button>
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-tx-2 hover:text-tx hover:bg-white/[0.06] transition-colors"
        >
          <Share2 size={11} />
          Share
        </button>
      </div>
    </div>
  );
}
