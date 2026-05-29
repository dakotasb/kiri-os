'use client';

import { goals as staticGoals, outcomes as allOutcomes, Goal } from '@/lib/mock-data';
import { useChatContext } from '@/lib/chat-context';
import { GoalCard } from '@/components/companion/GoalCard';
import { useGoals } from '@/hooks/useGoals';

export function GoalsRow() {
  const { latestGoalId }  = useChatContext();
  const { data: liveGoals } = useGoals(10_000);

  // Convert live DB goals to mock-compatible shape
  const liveAsMock: Goal[] = liveGoals.map(g => ({
    id:         g.id,
    title:      g.title,
    progress:   g.progress,
    agentId:    g.agent_id ?? 'kiri',
    category:   g.category ?? 'Personal',
    metric:     g.metric ?? 'Track progress',
    targetDate: g.target_date ?? 'Dec 2026',
  }));

  // Live DB goals first, then static fallbacks (deduplicated by id)
  const liveIds  = new Set(liveAsMock.map(g => g.id));
  const allGoals = [...liveAsMock, ...staticGoals.filter(g => !liveIds.has(g.id))];

  if (allGoals.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {allGoals.map((goal, i) => {
        const goalOutcomes = allOutcomes.filter(o => o.goalId === goal.id);
        const isNew        = goal.id === latestGoalId;

        return (
          <GoalCard
            key={goal.id}
            goal={goal}
            outcomes={goalOutcomes}
            isNew={isNew}
            delay={isNew ? 0 : i * 60}
          />
        );
      })}
    </div>
  );
}
