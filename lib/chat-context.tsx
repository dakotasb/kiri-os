'use client';

import {
  createContext, useContext, useState, useCallback, useRef, ReactNode,
} from 'react';
import { Goal, AgentActivity, getAgent, goals as staticGoals } from './mock-data';

/* ─── Types ─────────────────────────────────────────────────────────── */

export interface GoalOffer {
  id: string;
  title: string;
  agentId: string;
  category: string;
  metric: string;
  targetDate: string;
  /** Set when the offer links to an already-existing goal rather than creating one */
  existingGoalId?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'kiri';
  text: string;
  timestamp: string;
  goalOffer?: GoalOffer;
}

export interface PendingOutcome {
  id: string;
  title: string;
  agentId: string;
}

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  pendingOutcome: PendingOutcome | null;
  kiriActivity: AgentActivity;
  acceptedGoals: Goal[];
  latestGoalId: string | null;
  sendMessage:  (text: string) => void;
  acceptGoal:   (offer: GoalOffer) => void;
  declineGoal:  (offerId: string) => void;
  openPanel:    () => void;
  closePanel:   () => void;
}

/* ─── Canned responses ───────────────────────────────────────────────── */

type CannedResponse = {
  text: string;
  pendingTitle?: string;
  pendingAgentId?: string;
  suggestedGoalName?: string;
  goalOffer?: GoalOffer;
};

const RESPONSES: { match: RegExp; res: CannedResponse }[] = [
  {
    match: /morning|catch me up|today|what.*(happen|going on)/i,
    res: {
      text: "Good morning. Here's your snapshot: 7 tasks completed, 14 new memories stored. Horizon's Q2 brief is 67% done — been at it since 6am. Ledger flagged 3 bills due in 7 days. You have 2 items in review waiting on you.",
    },
  },
  {
    match: /finance|financial|money|spending|budget|ledger/i,
    res: {
      text: "Running your weekly finance summary now. Ledger will pull from all connected sources — I'll surface the report here when it's ready.",
      pendingTitle:      'Weekly Finance Summary',
      pendingAgentId:    'ledger',
      suggestedGoalName: 'Grow my financial health',
    },
  },
  {
    match: /research|competitor|analysis|market|horizon/i,
    res: {
      text: "Kicking off competitor analysis. Horizon will run a full Q2 sweep across your tracked sources. Brief incoming.",
      pendingTitle:      'Competitor Analysis: Q2',
      pendingAgentId:    'horizon',
      suggestedGoalName: 'Stay ahead of the market',
    },
  },
  {
    match: /attention|priority|urgent|needs me|review/i,
    res: {
      text: "Right now: Onboarding copy is in review (45m), Q2 Financial Report needs your sign-off (5m), and Forge is 40% through the auth API — no blockers.",
    },
  },
  {
    match: /brief|q2|market brief/i,
    res: {
      text: "Q2 market brief is 67% done. Horizon has covered 3 competitor categories. Key insight so far: no dominant player in multi-agent orchestration yet. ETA ~20 minutes to completion.",
    },
  },
  {
    match: /auth|api|forge|pr|pull request/i,
    res: {
      text: "Auth API integration: 40% complete, started 23m ago. Forge has no blockers. The feat/auth-flow PR review is already done — clean, ready to merge on your call.",
    },
  },
  {
    match: /eod|end of day|wrap.?up|summary/i,
    res: {
      text: "Here's today's wrap-up: 7 tasks completed, 2 in review, 0 blockers. Portfolio up 2.3% this week. Your team logged 4.2 hours saved. Strong day.",
      pendingTitle:   'EOD Summary',
      pendingAgentId: 'kiri',
      suggestedGoalName: 'Track my daily wins',
    },
  },
];

/* ─── Goal helpers ───────────────────────────────────────────────────── */

const AGENT_CATEGORY: Record<string, string> = {
  ledger:  'Finance',
  horizon: 'Growth',
  forge:   'Build',
  coach:   'Health',
  kiri:    'Personal',
};

const AGENT_METRIC: Record<string, string> = {
  ledger:  'Weekly summary',
  horizon: 'Market insights',
  forge:   'Build progress',
  coach:   'Habit tracking',
  kiri:    'Daily outcomes',
};

/* ─── Goal intent detection ──────────────────────────────────────────── */

function detectGoalIntent(text: string): GoalOffer | null {
  if (/workout|fitness|shape|exercise|gym|healthy/i.test(text)) {
    return { id: uid(), title: 'Get in better shape', agentId: 'coach',   category: 'Health',       metric: '3 workouts / week', targetDate: 'Dec 2026' };
  }
  if (/read|book|learn|study/i.test(text)) {
    return { id: uid(), title: 'Read more books',     agentId: 'horizon', category: 'Growth',       metric: '2 books / month',   targetDate: 'Dec 2026' };
  }
  if (/productiv|habit|routine|consistent|organized/i.test(text)) {
    return { id: uid(), title: 'Build better habits', agentId: 'coach',   category: 'Productivity', metric: '5 days / week',     targetDate: 'Dec 2026' };
  }
  if (/skill|improve|better at|master/i.test(text)) {
    return { id: uid(), title: 'Level up my skills',  agentId: 'horizon', category: 'Growth',       metric: 'Track weekly',      targetDate: 'Dec 2026' };
  }
  if (/\b(want to|goal|achieve|become|start|build)\b/i.test(text)) {
    const cleaned = text.replace(/help me|i want to|i.d like to|i need to/gi, '').trim();
    const title   = (cleaned.charAt(0).toUpperCase() + cleaned.slice(1)).slice(0, 48);
    return { id: uid(), title: title || 'New goal', agentId: 'kiri', category: 'Personal', metric: 'Track progress', targetDate: 'Dec 2026' };
  }
  return null;
}

function getResponse(text: string): CannedResponse {
  for (const { match, res } of RESPONSES) {
    if (match.test(text)) return res;
  }
  const offer = detectGoalIntent(text);
  if (offer) {
    return {
      text: "That sounds like something worth tracking. I can set that as a goal and have the right agent working toward it — I'll check in weekly with outcomes. Want me to add it?",
      goalOffer: offer,
    };
  }
  return { text: "On it. I'll coordinate the team and surface something shortly." };
}

function uid() { return Math.random().toString(36).slice(2, 9); }

/** Find the first existing goal that belongs to the same agent */
function findMatchingGoal(agentId: string, accepted: Goal[]): Goal | null {
  return (
    accepted.find(g => g.agentId === agentId) ??
    staticGoals.find(g => g.agentId === agentId) ??
    null
  );
}

/* ─── Context ────────────────────────────────────────────────────────── */

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [pendingOutcome, setPending]    = useState<PendingOutcome | null>(null);
  const [kiriActivity, setKiriActivity] = useState<AgentActivity>('thinking');
  const [acceptedGoals, setAccepted]    = useState<Goal[]>([]);
  const [latestGoalId, setLatestGoalId] = useState<string | null>(null);

  /* Always-current ref so timeouts inside sendMessage can read latest goals */
  const acceptedGoalsRef = useRef<Goal[]>(acceptedGoals);
  acceptedGoalsRef.current = acceptedGoals;

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setIsOpen(true);
    setMessages(prev => [...prev, { id: uid(), role: 'user', text, timestamp: 'just now' }]);
    setKiriActivity('thinking');

    const res = getResponse(text);

    setTimeout(() => {
      setKiriActivity('responding');

      /* Main Kiri response */
      setMessages(prev => [
        ...prev,
        {
          id: uid(), role: 'kiri', text: res.text, timestamp: 'just now',
          ...(res.goalOffer ? { goalOffer: res.goalOffer } : {}),
        },
      ]);

      /* Pending task spinner */
      if (res.pendingTitle) {
        const po: PendingOutcome = {
          id:      uid(),
          title:   res.pendingTitle,
          agentId: res.pendingAgentId ?? 'kiri',
        };
        setPending(po);
        setTimeout(() => setPending(null), 4500);
      }

      /* Goal offer follow-up — match existing goal or propose a new one */
      if (res.suggestedGoalName) {
        const agentId = res.pendingAgentId ?? 'kiri';

        setTimeout(() => {
          const match = findMatchingGoal(agentId, acceptedGoalsRef.current);

          const offer: GoalOffer = match
            ? {
                id:             uid(),
                title:          match.title,
                agentId:        match.agentId,
                category:       match.category,
                metric:         match.metric,
                targetDate:     match.targetDate,
                existingGoalId: match.id,
              }
            : {
                id:         uid(),
                title:      res.suggestedGoalName!,
                agentId,
                category:   AGENT_CATEGORY[agentId] ?? 'Personal',
                metric:     AGENT_METRIC[agentId]   ?? 'Track progress',
                targetDate: 'Dec 2026',
              };

          const followUpText = match
            ? `This looks connected to your "${match.title}" goal — want me to track it toward that?`
            : `This sounds like a goal worth building toward. Want me to add "${res.suggestedGoalName}" as a goal?`;

          setMessages(prev => [
            ...prev,
            { id: uid(), role: 'kiri', text: followUpText, timestamp: 'just now', goalOffer: offer },
          ]);
        }, 2200);
      }

      setTimeout(() => setKiriActivity('thinking'), 2200);
    }, 1400);
  }, []);

  const acceptGoal = useCallback((offer: GoalOffer) => {
    /* ── Linking to an existing goal — no new card, just confirm ── */
    if (offer.existingGoalId) {
      setTimeout(() => {
        const agentName = getAgent(offer.agentId)?.name ?? 'your agent';
        setMessages(prev => [
          ...prev,
          {
            id: uid(), role: 'kiri',
            text: `Got it — I'll track this toward "${offer.title}". ${agentName} will keep it updated.`,
            timestamp: 'just now',
          },
        ]);
      }, 350);
      return;
    }

    /* ── New goal — prepend so it appears at the top of the grid ── */
    const newGoal: Goal = {
      id:         offer.id,
      title:      offer.title,
      progress:   0,
      agentId:    offer.agentId,
      category:   offer.category,
      metric:     offer.metric,
      targetDate: offer.targetDate,
    };
    setAccepted(prev => [newGoal, ...prev]);
    setLatestGoalId(offer.id);
    setTimeout(() => setLatestGoalId(null), 4000);

    setTimeout(() => {
      const agentName = getAgent(offer.agentId)?.name ?? 'your agent';
      setMessages(prev => [
        ...prev,
        {
          id: uid(), role: 'kiri',
          text: `Done — "${offer.title}" is now a goal. ${agentName} is on it. I'll surface outcomes here as they come in.`,
          timestamp: 'just now',
        },
      ]);
    }, 350);
  }, []);

  const declineGoal = useCallback((_offerId: string) => {}, []);

  return (
    <ChatContext.Provider value={{
      isOpen, messages, pendingOutcome, kiriActivity,
      acceptedGoals, latestGoalId,
      sendMessage, acceptGoal, declineGoal,
      openPanel:  () => setIsOpen(true),
      closePanel: () => setIsOpen(false),
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be inside <ChatProvider>');
  return ctx;
}
