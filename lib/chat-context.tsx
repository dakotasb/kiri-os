'use client';

import {
  createContext, useContext, useState, useCallback, useRef,
  useEffect, ReactNode,
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
  role: 'user' | 'assistant';
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
  isOpen:         boolean;
  messages:       Message[];
  pendingOutcome: PendingOutcome | null;
  kiriActivity:   AgentActivity;
  kiriOffline:    boolean;
  latestGoalId:   string | null;
  sendMessage:    (text: string) => void;
  acceptGoal:     (offer: GoalOffer) => void;
  declineGoal:    (offerId: string) => void;
  openPanel:      () => void;
  closePanel:     () => void;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

function uid() { return Math.random().toString(36).slice(2, 9); }

/* ─── Goal intent detection ──────────────────────────────────────────── */

export function detectGoalIntent(text: string): GoalOffer | null {
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

/* ─── Context ────────────────────────────────────────────────────────── */

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState<Message[]>([]);
  const [pendingOutcome, setPending]    = useState<PendingOutcome | null>(null);
  const [kiriActivity, setKiriActivity] = useState<AgentActivity>('idle');
  const [kiriOffline, setKiriOffline]   = useState(false);
  const [latestGoalId, setLatestGoalId] = useState<string | null>(null);

  const sessionIdRef    = useRef<string | null>(null);
  const sessionCreated  = useRef(false);

  /* ── Session creation on mount ── */
  useEffect(() => {
    if (sessionCreated.current) return;  // StrictMode guard
    sessionCreated.current = true;
    fetch('/api/kiri/session', { method: 'POST' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.id) {
          sessionIdRef.current = data.id;
          setKiriOffline(false);
        } else {
          setKiriOffline(true);
        }
      })
      .catch(() => setKiriOffline(true));
  }, []);

  /* ── Message helpers ── */
  const addMessage = useCallback((
    { role, content, goalOffer }: { role: 'user' | 'assistant'; content: string; goalOffer?: GoalOffer }
  ): string => {
    const id = uid();
    setMessages(prev => [...prev, { id, role, text: content, timestamp: 'just now', goalOffer }]);
    return id;
  }, []);

  const updateMessage = useCallback((id: string, content: string, goalOffer?: GoalOffer) => {
    setMessages(prev => prev.map(m =>
      m.id === id
        ? { ...m, text: content, ...(goalOffer !== undefined ? { goalOffer } : {}) }
        : m
    ));
  }, []);

  /* ── Send message via Hermes SSE ── */
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsOpen(true);

    if (!sessionIdRef.current) {
      addMessage({ role: 'assistant', content: 'Kiri is offline. Check that the Hermes gateway is running.' });
      return;
    }

    addMessage({ role: 'user', content: text });
    setKiriActivity('thinking');

    // Placeholder assistant message to stream into
    const placeholderId = addMessage({ role: 'assistant', content: '' });

    try {
      const res = await fetch('/api/kiri/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionIdRef.current }),
      });

      if (!res.ok || !res.body) {
        updateMessage(placeholderId, "Kiri didn't respond. Try again.");
        setKiriActivity('idle');
        return;
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer      = '';
      let accumulated = '';
      let eventName   = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventName = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (eventName === 'assistant.delta' && payload.delta) {
                accumulated += payload.delta;
                updateMessage(placeholderId, accumulated);
                setKiriActivity('responding');
              } else if (eventName === 'assistant.completed' && payload.content) {
                accumulated = payload.content;
                updateMessage(placeholderId, accumulated);
              } else if (eventName === 'error') {
                updateMessage(placeholderId, `Error: ${payload.message}`);
              }
            } catch { /* malformed JSON line — skip */ }
            eventName = '';
          }
        }
      }

      setKiriActivity('idle');

      // Goal detection on completed response
      if (accumulated) {
        const offer = detectGoalIntent(accumulated);
        if (offer) updateMessage(placeholderId, accumulated, offer);
      }
    } catch {
      updateMessage(placeholderId, 'Connection lost. Check the gateway.');
      setKiriActivity('idle');
    }
  }, [addMessage, updateMessage]);

  /* ── Accept a goal offer → POST to goals API ── */
  const acceptGoal = useCallback(async (offer: GoalOffer) => {
    if (offer.existingGoalId) {
      const agentName = getAgent(offer.agentId)?.name ?? 'your agent';
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: `Got it — I'll track this toward "${offer.title}". ${agentName} will keep it updated.`,
        });
      }, 350);
      return;
    }

    // New goal — persist to DB
    const goalId = offer.id;
    try {
      await fetch('/api/hermes/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:      offer.title,
          agentId:    offer.agentId,
          category:   offer.category,
          metric:     offer.metric,
          targetDate: offer.targetDate,
        }),
      });
      setLatestGoalId(goalId);
      setTimeout(() => setLatestGoalId(null), 4000);
    } catch { /* Persist failed — still show confirmation */ }

    const agentName = getAgent(offer.agentId)?.name ?? 'your agent';
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Done — "${offer.title}" is now a goal. ${agentName} is on it. I'll surface outcomes here as they come in.`,
      });
    }, 350);
  }, [addMessage]);

  /* ── Decline a goal offer ── */
  const declineGoal = useCallback((offerId: string) => {
    setMessages(prev => prev.map(m =>
      m.goalOffer?.id === offerId ? { ...m, goalOffer: undefined } : m
    ));
    addMessage({ role: 'assistant', content: "Got it, skipping that one." });
  }, [addMessage]);

  return (
    <ChatContext.Provider value={{
      isOpen, messages, pendingOutcome, kiriActivity, kiriOffline,
      latestGoalId,
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
