export interface Job {
  id: string;
  label: string;
  description: string;
  icon: string;
  isRoutine?: boolean;
  prompt: string;
  agentId?: string;
}

export const JOBS: Job[] = [
  {
    id: 'catchup',
    label: 'Catch me up',
    description: "What happened while you were away",
    icon: 'Sparkles',
    prompt: 'Catch me up on what happened today',
  },
  {
    id: 'morning',
    label: 'Morning briefing',
    description: 'Start the day with full context',
    icon: 'Sun',
    isRoutine: true,
    prompt: 'Give me my morning briefing',
  },
  {
    id: 'attention',
    label: 'Needs attention',
    description: 'Items waiting on you right now',
    icon: 'CircleAlert',
    prompt: 'What needs my attention right now?',
  },
  {
    id: 'finance',
    label: 'Finance summary',
    description: 'Portfolio, bills, and spending',
    icon: 'TrendingUp',
    isRoutine: true,
    prompt: 'Run my weekly finance summary',
    agentId: 'ledger',
  },
  {
    id: 'research',
    label: 'Competitor analysis',
    description: 'Q2 market intelligence brief',
    icon: 'Search',
    prompt: 'Run competitor analysis',
    agentId: 'horizon',
  },
  {
    id: 'brief',
    label: 'Q2 brief status',
    description: 'Progress on the market research',
    icon: 'FileText',
    prompt: 'Brief me on the Q2 research',
    agentId: 'horizon',
  },
  {
    id: 'auth',
    label: 'Auth API status',
    description: 'Build progress and open PRs',
    icon: 'Code2',
    prompt: 'How is the auth API going?',
    agentId: 'forge',
  },
  {
    id: 'eod',
    label: 'EOD wrap-up',
    description: "End of day summary from your team",
    icon: 'Moon',
    isRoutine: true,
    prompt: 'Give me an end of day wrap-up',
  },
];
