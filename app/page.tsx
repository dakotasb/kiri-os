import { AgentRail } from '@/components/companion/AgentRail';
import { OutcomeCard } from '@/components/companion/OutcomeCard';
import { ChatInput } from '@/components/companion/ChatInput';
import { outcomes, tasks } from '@/lib/mock-data';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function CompanionPage() {
  const activeTasks = tasks.filter(t => t.status === 'in-progress');
  const needsReview = tasks.filter(t => t.isHumanReview);

  return (
    <div className="flex flex-col h-full relative">
      {/* Top status bar */}
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-8 pb-40">

        {/* Agent rail — hero section */}
        <div className="flex flex-col items-center py-14">
          {/* Subtle background glow */}
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

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-2xl mx-auto">
          {[
            { label: 'Completed today', value: '7 tasks', color: '#10B981' },
            { label: 'Memories added', value: '14 new', color: '#06B6D4' },
            { label: 'Hours saved', value: '~4.2 hrs', color: '#6CD9BA' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-center animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <p className="text-lg font-semibold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-tx-3 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent outcomes */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-tx">Recent outcomes</h2>
            <div className="flex items-center gap-1 text-xs text-tx-3">
              <CheckCircle2 size={12} strokeWidth={2} className="text-emerald-500" />
              All systems healthy
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {outcomes.map((outcome, i) => (
              <OutcomeCard key={outcome.id} outcome={outcome} delay={i * 60} />
            ))}
          </div>
        </div>

      </div>

      {/* Fixed chat bar */}
      <div
        className="absolute bottom-0 left-0 right-0 glass border-t border-border"
        style={{ background: 'rgba(19,18,26,0.90)' }}
      >
        <ChatInput />
      </div>
    </div>
  );
}
