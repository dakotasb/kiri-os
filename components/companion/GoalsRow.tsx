'use client';

import { goals as staticGoals, outcomes as allOutcomes } from '@/lib/mock-data';
import { useChatContext } from '@/lib/chat-context';
import { GoalCard } from '@/components/companion/GoalCard';

export function GoalsRow() {
  const { acceptedGoals, latestGoalId } = useChatContext();

  // Accepted (newest) goals prepended — appear at the top of the grid
  const allGoals = [...acceptedGoals, ...staticGoals];

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
