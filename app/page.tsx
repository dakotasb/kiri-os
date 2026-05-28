import { AgentRail } from '@/components/companion/AgentRail';
import { ChatInput } from '@/components/companion/ChatInput';
import { ChatBarWrapper } from '@/components/companion/ChatBarWrapper';
import { StatCards } from '@/components/companion/StatCards';
import { ChatBarChips } from '@/components/companion/ChatBarChips';
import { GoalsRow } from '@/components/companion/GoalsRow';
import { tasks } from '@/lib/mock-data';
import { Clock, CheckCircle2, Target } from 'lucide-react';

export default function CompanionPage() {
  const activeTasks = tasks.filter(t => t.status === 'in-progress');
  const needsReview = tasks.filter(t => t.isHumanReview);

  return (
    <div className="flex flex-col h-full relative">

      {/* ── Top status bar ── */}
      <div className="flex items-center justify-between px-8 pt-6 pb-0 shrink-0">
        <div>
          <p className="text-2xl font-semibold text-tx tracking-tight">Good morning, Dakota.</p>
          <p className="text-sm text-tx-2 mt-0.5">Your team has been busy since 6am.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTasks.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-surface text-tx-2">
              <span className="w-1.5 h-1.5 rounded-full bg-kiri animate-pulse" />
              {activeTasks.length} active task{activeTasks.length > 1 ? 's' : ''}
            </div>
          )}
          {needsReview.length > 0 && (
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'rgba(242,126,180,0.3)', background: 'rgba(242,126,180,0.08)', color: '#F27EB4' }}
            >
              <Clock size={11} />
              {needsReview.length} need{needsReview.length === 1 ? 's' : ''} your review
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-auto px-8 pb-52">

        {/* Agent rail */}
        <div className="flex flex-col items-center py-8">
          <div
            className="absolute pointer-events-none"
            style={{
              width: 500,
              height: 200,
              background: 'radial-gradient(ellipse at center, rgba(108,217,186,0.07) 0%, transparent 70%)',
              transform: 'translateX(-50%)',
              left: '50%',
            }}
          />
          <AgentRail />
        </div>

        <StatCards />

        {/* My Goals */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Target size={12} strokeWidth={2} className="text-tx-3" />
              <h2 className="text-sm font-semibold text-tx">Active Goals</h2>
            </div>
            <div className="flex items-center gap-1 text-xs text-tx-3">
              <CheckCircle2 size={12} strokeWidth={2} className="text-emerald-500" />
              All systems healthy
            </div>
          </div>

          <GoalsRow />
        </div>

      </div>

      {/* ── Fixed chat bar ── */}
      <ChatBarWrapper>
        <ChatBarChips />
        <ChatInput />
      </ChatBarWrapper>

    </div>
  );
}
