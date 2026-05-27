export type AgentStatus   = 'active' | 'idle' | 'offline';
export type TaskStatus    = 'todo' | 'in-progress' | 'review' | 'done';
export type OutcomeType   = 'finance' | 'research' | 'build' | 'analysis' | 'review';
export type AgentActivity = 'thinking' | 'thinking2' | 'responding' | 'responding2' | 'waiting' | 'idle';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  longDescription: string;
  accent: string;
  status: AgentStatus;
  sessions: number;
  model: string;
  tasksToday: number;
  memoryEntries: number;
  worksWell: string[];
  categories: string[];
  icon: string;
  capabilities: string[];
  /** Drives which gif/image is displayed in the orb for agents with custom avatars */
  activity?: AgentActivity;
}

export interface Task {
  id: string;
  title: string;
  agentId: string | null;
  status: TaskStatus;
  progress?: number;
  startedAt?: string;
  completedAt?: string;
  isHumanReview?: boolean;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface Outcome {
  id: string;
  title: string;
  agentId: string;
  time: string;
  summary: string;
  type: OutcomeType;
  goalId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  agentIds: string[];
  taskCount: number;
  activeCount: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;   // 0–100
  agentId: string;
  category: string;
  metric: string;     // human-readable progress label
  targetDate: string;
}

export interface Gateway {
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  sessions: number;
}

export const agents: Agent[] = [
  {
    id: 'kiri',
    name: 'Kiri',
    role: 'Orchestrator',
    description: 'Your AI team lead. Understands your goals and dispatches work to the right agents at the right time.',
    longDescription: 'Kiri is the intelligent core of your agent fleet. She learns your context, priorities, and communication style — then coordinates your team of agents to execute on what matters most.',
    accent: '#6CD9BA',
    status: 'active',
    activity: 'thinking',
    sessions: 3,
    model: 'deepseek-v4-pro',
    tasksToday: 12,
    memoryEntries: 843,
    worksWell: ['horizon', 'forge', 'ledger', 'mira'],
    categories: ['Core'],
    icon: 'Sparkles',
    capabilities: ['Task orchestration', 'Agent dispatch', 'Priority management', 'Context learning'],
  },
  {
    id: 'horizon',
    name: 'Horizon',
    role: 'Research',
    description: 'Deep research on any topic. Delivers structured briefs, competitive analysis, and market intelligence.',
    longDescription: 'Horizon is your dedicated research agent. Assign it a topic and receive a thorough, structured brief with sources. Ideal for market research, competitive analysis, and technical deep-dives.',
    accent: '#4227F2',
    status: 'active',
    activity: 'thinking',
    sessions: 4,
    model: 'kimi-k2.5',
    tasksToday: 5,
    memoryEntries: 421,
    worksWell: ['kiri', 'forge', 'sage'],
    categories: ['Research', 'Business'],
    icon: 'Compass',
    capabilities: ['Market research', 'Competitive analysis', 'Technical research', 'Summarization', 'Source tracking'],
  },
  {
    id: 'forge',
    name: 'Forge',
    role: 'Builder',
    description: 'Writes, reviews, and ships code. Handles features, PRs, docs, and architecture.',
    longDescription: 'Forge is your development agent. It writes clean code, reviews pull requests, generates documentation, and can take entire features from brief to implementation.',
    accent: '#F97316',
    status: 'active',
    activity: 'thinking',
    sessions: 2,
    model: 'kimi-k2.5',
    tasksToday: 4,
    memoryEntries: 318,
    worksWell: ['kiri', 'horizon', 'beacon'],
    categories: ['Development', 'Business'],
    icon: 'Hammer',
    capabilities: ['Code generation', 'PR review', 'Documentation', 'Architecture design', 'Debugging'],
  },
  {
    id: 'ledger',
    name: 'Ledger',
    role: 'Finance',
    description: 'Tracks, analyzes, and reports on your financial health. Weekly summaries, alerts, and forecasts.',
    longDescription: 'Ledger monitors your financial landscape and surfaces what matters. Weekly finance summaries, spending analysis, anomaly alerts, and forward-looking forecasts.',
    accent: '#16A34A',
    status: 'active',
    activity: 'thinking',
    sessions: 0,
    model: 'deepseek-v4-flash',
    tasksToday: 2,
    memoryEntries: 743,
    worksWell: ['kiri', 'beacon', 'sage'],
    categories: ['Finance', 'Personal'],
    icon: 'TrendingUp',
    capabilities: ['Financial reporting', 'Spending analysis', 'Budget tracking', 'Forecasting', 'Alert monitoring'],
  },
  {
    id: 'mira',
    name: 'Mira',
    role: 'Life & Calendar',
    description: 'Manages your schedule, reminders, and personal routines. Your AI chief of staff.',
    longDescription: 'Mira keeps your life organized. She manages calendars, sets reminders, tracks personal goals, and learns your routines to proactively surface what you need.',
    accent: '#F27EB4',
    status: 'idle',
    sessions: 0,
    model: 'deepseek-v4-flash',
    tasksToday: 1,
    memoryEntries: 289,
    worksWell: ['kiri', 'coach', 'beacon'],
    categories: ['Personal', 'Productivity'],
    icon: 'CalendarDays',
    capabilities: ['Calendar management', 'Reminder setting', 'Routine tracking', 'Goal monitoring', 'Schedule optimization'],
  },
  {
    id: 'sage',
    name: 'Sage',
    role: 'SME Advisor',
    description: 'Deep domain expertise on demand. Expert-level answers across any field.',
    longDescription: 'Sage is your subject matter expert on demand. Ask about any domain and receive expert-level guidance. Becomes more valuable the more context it accumulates about your work.',
    accent: '#B775BF',
    status: 'idle',
    sessions: 0,
    model: 'deepseek-v4-pro',
    tasksToday: 0,
    memoryEntries: 156,
    worksWell: ['kiri', 'horizon', 'ledger'],
    categories: ['Research', 'Business', 'Personal'],
    icon: 'BookOpen',
    capabilities: ['Domain expertise', 'Concept explanation', 'Advisory', 'Decision support', 'Knowledge synthesis'],
  },
  {
    id: 'coach',
    name: 'Coach',
    role: 'Fitness & Habits',
    description: 'Builds and tracks fitness routines, habits, and personal goals.',
    longDescription: 'Coach designs personalized workout plans, monitors habits, provides accountability check-ins, and adjusts routines based on your progress.',
    accent: '#A60D61',
    status: 'active',
    activity: 'waiting',
    sessions: 0,
    model: 'deepseek-v4-flash',
    tasksToday: 0,
    memoryEntries: 94,
    worksWell: ['mira', 'beacon'],
    categories: ['Personal', 'Health'],
    icon: 'Target',
    capabilities: ['Workout planning', 'Habit tracking', 'Progress monitoring', 'Accountability', 'Goal setting'],
  },
  {
    id: 'beacon',
    name: 'Beacon',
    role: 'Alerts & Monitoring',
    description: 'Watches what matters and surfaces the right information at the right time.',
    longDescription: 'Beacon is your always-on monitoring agent. It watches the sources you care about, filters noise, and delivers timely, actionable alerts.',
    accent: '#1E18D9',
    status: 'idle',
    sessions: 0,
    model: 'deepseek-v4-flash',
    tasksToday: 3,
    memoryEntries: 201,
    worksWell: ['kiri', 'ledger', 'forge'],
    categories: ['Business', 'Personal', 'Productivity'],
    icon: 'BellRing',
    capabilities: ['Alert monitoring', 'Source watching', 'Signal filtering', 'Notification delivery', 'Threshold tracking'],
  },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Q2 Market Research Brief', agentId: 'horizon', status: 'in-progress', progress: 67, startedAt: '8m ago', projectId: 'proj-alpha', priority: 'high', tags: ['research', 'Q2'] },
  { id: 't2', title: 'Auth API Integration', agentId: 'forge', status: 'in-progress', progress: 40, startedAt: '23m ago', projectId: 'proj-alpha', priority: 'high', tags: ['dev', 'auth'] },
  { id: 't3', title: 'Competitor Feature Matrix', agentId: 'horizon', status: 'todo', projectId: 'proj-alpha', priority: 'medium', tags: ['research'] },
  { id: 't4', title: 'API Documentation Update', agentId: 'forge', status: 'todo', projectId: 'proj-alpha', priority: 'low', tags: ['docs'] },
  { id: 't5', title: 'Onboarding Copy Review', agentId: null, status: 'review', isHumanReview: true, completedAt: '45m ago', projectId: 'proj-alpha', priority: 'medium', tags: ['copy'] },
  { id: 't6', title: 'Q2 Financial Report', agentId: null, status: 'review', isHumanReview: true, completedAt: '5m ago', projectId: 'proj-finance', priority: 'high', tags: ['finance'] },
  { id: 't7', title: 'Weekly Finance Summary', agentId: 'ledger', status: 'done', completedAt: '12m ago', projectId: 'proj-finance', priority: 'medium' },
  { id: 't8', title: 'PR Review: feat/auth-flow', agentId: 'forge', status: 'done', completedAt: '1hr ago', projectId: 'proj-alpha', priority: 'high', tags: ['dev'] },
];

export const outcomes: Outcome[] = [
  { id: 'o1', title: 'Weekly Finance Summary',    agentId: 'ledger',  time: '12m ago', type: 'finance',  goalId: 'goal-2', summary: 'Portfolio up 2.3% this week. 3 bills due in 7 days. Spending 8% below budget. Strong month overall — ahead of target.' },
  { id: 'o2', title: 'Competitor Analysis: Q2',   agentId: 'horizon', time: '1hr ago', type: 'analysis', goalId: 'goal-3', summary: '3 key competitors launched agent features this quarter. Linear, Notion, Monday.com all shipping. Recommendation: accelerate roadmap item #4 — institutional memory.' },
  { id: 'o3', title: 'PR Review: feat/auth-flow', agentId: 'forge',   time: '2hr ago', type: 'review',   goalId: 'goal-4', summary: '2 suggestions added as inline comments. No blocking issues. Implementation is clean. Ready to merge after your sign-off.' },
  { id: 'o4', title: 'AI Agent Market Brief',     agentId: 'horizon', time: '3hr ago', type: 'research', goalId: 'goal-3', summary: 'Autonomous agent market growing 340% YoY. Key gap identified: multi-agent orchestration with institutional memory. No dominant player yet.' },
  { id: 'o5', title: 'Habit Check-in: Week 3',    agentId: 'coach',   time: '5hr ago', type: 'review',   goalId: 'goal-1', summary: 'Streak active — 3 days logged this week. Workout plan on track. Rest day flagged for tomorrow based on recovery pattern.' },
];

export const goals: Goal[] = [
  { id: 'goal-1', title: 'Get in better shape', progress: 34, agentId: 'coach',   category: 'Health',   metric: '3 workouts / week', targetDate: 'Dec 2026' },
  { id: 'goal-2', title: 'Save $5K',            progress: 61, agentId: 'ledger',  category: 'Finance',  metric: '$3,050 of $5,000',  targetDate: 'Dec 2026' },
  { id: 'goal-3', title: 'Win the market',       progress: 48, agentId: 'horizon', category: 'Growth',   metric: 'Q2 intel on track', targetDate: 'Jun 2026' },
  { id: 'goal-4', title: 'Ship Project Alpha',   progress: 55, agentId: 'forge',   category: 'Build',    metric: '4 of 7 tasks done', targetDate: 'Jul 2026' },
];

export const projects: Project[] = [
  { id: 'proj-alpha', name: 'Project Alpha', description: 'Main product sprint', agentIds: ['kiri', 'horizon', 'forge'], taskCount: 7, activeCount: 2, color: '#6CD9BA' },
  { id: 'proj-finance', name: 'Finance Ops', description: 'Financial monitoring', agentIds: ['kiri', 'ledger', 'beacon'], taskCount: 3, activeCount: 0, color: '#07D98C' },
];

export const fleetStats = {
  activeAgents: 3,
  idleAgents: 4,
  offlineAgents: 1,
  totalErrors: 0,
  tasksPerHour: 12,
  memoriesStored: 2847,
  uptimePercent: 99.8,
  gateways: [
    { name: 'hermes-kiri', status: 'healthy' as const, sessions: 3 },
    { name: 'hermes-forge', status: 'healthy' as const, sessions: 2 },
    { name: 'hermes-default', status: 'healthy' as const, sessions: 4 },
  ] as Gateway[],
};

export const currentHandoff = {
  fromAgentId: 'horizon',
  toAgentId: 'forge',
  task: 'Q2 Market Brief → Auth Implementation',
  active: true,
};

export function getAgent(id: string): Agent | undefined {
  return agents.find(a => a.id === id);
}
