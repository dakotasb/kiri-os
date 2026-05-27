'use client';

import {
  Sparkles, Compass, Hammer, TrendingUp, CalendarDays,
  BookOpen, Target, BellRing, LucideIcon,
} from 'lucide-react';
import { hexToRgba } from '@/lib/utils';
import { Agent, AgentActivity } from '@/lib/mock-data';

// Agents that have custom image folders under /agents/{id}/
const CUSTOM_AVATAR_AGENTS = new Set(['kiri', 'forge', 'horizon', 'ledger', 'coach']);

// Per-agent vertical crop — top shifts the image up, height fills the gap
const AGENT_IMG_CROP: Record<string, { top: string; height: string }> = {
  kiri:    { top: '0%',   height: '100%' },
  forge:   { top: '-20%', height: '140%' },
  horizon: { top: '-35%', height: '135%' },
  ledger:  { top: '0%',   height: '100%' },
  coach:   { top: '0%',   height: '100%' },
};

const ACTIVITY_FILE: Record<AgentActivity, string> = {
  thinking:    'thinking.gif',
  thinking2:   'thinking2.gif',
  responding:  'responding.gif',
  responding2: 'responding2.gif',
  waiting:     'waiting.gif',
  idle:        'idle.png',
};

function getAgentSrc(agent: Agent, forceIdle = false): string {
  const activity = forceIdle || agent.status === 'offline' ? 'idle' : (agent.activity ?? 'idle');
  return `/agents/${agent.id}/${ACTIVITY_FILE[activity]}`;
}
import { AgentAvatar } from '@/components/ui/AgentAvatar';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Compass, Hammer, TrendingUp, CalendarDays,
  BookOpen, Target, BellRing,
};

const SIZES = {
  xs:   { wrap: 28,  icon: 12, dot: 7,  dotPos: '-1px' },
  sm:   { wrap: 36,  icon: 14, dot: 8,  dotPos: '-1px' },
  md:   { wrap: 44,  icon: 18, dot: 10, dotPos: '-2px' },
  lg:   { wrap: 60,  icon: 24, dot: 12, dotPos: '-2px' },
  xl:   { wrap: 80,  icon: 32, dot: 14, dotPos: '-3px' },
  '2xl':{ wrap: 104, icon: 40, dot: 16, dotPos: '-4px' },
  '3xl':{ wrap: 160, icon: 56, dot: 20, dotPos: '-5px' },
};

interface AgentIconProps {
  agent: Agent;
  size?: keyof typeof SIZES;
  showName?: boolean;
  showRole?: boolean;
  showPulse?: boolean;
  /** Hide the status dot (useful when a separate status badge is already shown) */
  showDot?: boolean;
  /** Force the idle PNG regardless of agent.activity */
  forceIdle?: boolean;
  /** Orb mode: avatar fills the orb, function icon moves to bottom-right badge */
  orb?: boolean;
  /** Hero mode: enhanced glow + always-on pulse — used for Kiri in the rail */
  hero?: boolean;
  className?: string;
}

export function AgentIcon({
  agent,
  size = 'md',
  showName = false,
  showRole = false,
  showPulse = true,
  showDot = true,
  forceIdle = false,
  orb = false,
  hero = false,
  className = '',
}: AgentIconProps) {
  const cfg = SIZES[size];
  const Icon = ICON_MAP[agent.icon] ?? Sparkles;
  const isActive  = agent.status === 'active';
  const isOffline = agent.status === 'offline';

  const borderColor = isOffline
    ? 'var(--ov-sm)'
    : hero
    ? hexToRgba(agent.accent, 0.55)
    : hexToRgba(agent.accent, 0.28);

  const bgColor = isOffline
    ? 'var(--ov-xs)'
    : hero
    ? `radial-gradient(circle at 35% 35%, ${hexToRgba(agent.accent, 0.32)}, ${hexToRgba(agent.accent, 0.08)})`
    : `radial-gradient(circle at 35% 35%, ${hexToRgba(agent.accent, 0.22)}, ${hexToRgba(agent.accent, 0.05)})`;

  const glowShadow = isOffline
    ? 'none'
    : hero
    ? `0 0 28px ${hexToRgba(agent.accent, 0.50)}, 0 0 56px ${hexToRgba(agent.accent, 0.22)}, 0 0 96px ${hexToRgba(agent.accent, 0.10)}`
    : isActive
    ? `0 0 22px ${hexToRgba(agent.accent, 0.28)}, 0 0 44px ${hexToRgba(agent.accent, 0.10)}`
    : 'none';

  // Orb badge dimensions (used in orb mode)
  const bSize  = Math.round(cfg.wrap * 0.30);
  const offset = -Math.round(bSize * 0.18);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: cfg.wrap, height: cfg.wrap }}
      >
        {/* Pulse rings — always on for hero, active-only otherwise */}
        {(isActive || hero) && showPulse && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-pulse-ring pointer-events-none"
              style={{ border: `1px solid ${hexToRgba(agent.accent, hero ? 0.8 : 0.6)}` }}
            />
            <span
              className="absolute inset-0 rounded-full animate-pulse-ring-2 pointer-events-none"
              style={{ border: `1px solid ${hexToRgba(agent.accent, hero ? 0.55 : 0.4)}` }}
            />
          </>
        )}

        {/* Main orb — custom image for Kiri, DiceBear for everyone else */}
        <div
          className="rounded-full overflow-hidden transition-all duration-300"
          style={{
            width: cfg.wrap,
            height: cfg.wrap,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: glowShadow,
          }}
        >
          {CUSTOM_AVATAR_AGENTS.has(agent.id) ? (
            <img
              src={getAgentSrc(agent, forceIdle)}
              alt="Kiri"
              className={agent.id === 'kiri' ? 'animate-kiri-settle' : undefined}
              style={{
                position: 'relative',
                width: '100%',
                height: AGENT_IMG_CROP[agent.id]?.height ?? '100%',
                top:    AGENT_IMG_CROP[agent.id]?.top    ?? '0%',
                objectFit: 'cover',
                objectPosition: '50% 50%',
                ...(agent.id === 'kiri' ? { transformOrigin: '50% 20%' } : {}),
                filter: isOffline ? 'grayscale(1) brightness(0.5)' : 'none',
                transition: 'filter 0.3s ease',
              }}
            />
          ) : (
            <AgentAvatar
              seed={agent.id}
              accent={agent.accent}
              size={cfg.wrap}
              muted={isOffline}
              hair={agent.id === 'horizon' ? ['dannyPhantom'] : undefined}
            />
          )}
        </div>

        {/* Default mode: small status dot at bottom-right */}
        {!orb && showDot && (
          <span
            className="absolute rounded-full border-2 border-bg"
            style={{
              width: cfg.dot,
              height: cfg.dot,
              bottom: cfg.dotPos,
              right: cfg.dotPos,
              background: isActive
                ? '#10B981'
                : isOffline
                ? 'var(--status-dot-offline)'
                : 'var(--tx3)',
            }}
          />
        )}

        {/* Orb mode: function-icon badge at bottom-right */}
        {orb && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: bSize, height: bSize, borderRadius: '50%',
              bottom: offset, right: offset,
              background: 'var(--s1)',
              border: `2px solid ${isOffline ? 'var(--border)' : hexToRgba(agent.accent, 0.7)}`,
              boxShadow: isActive ? `0 0 8px ${hexToRgba(agent.accent, 0.5)}` : 'none',
            }}
          >
            <Icon
              size={Math.round(bSize * 0.52)}
              strokeWidth={1.8}
              style={{ color: isOffline ? 'var(--tx3)' : agent.accent }}
            />
          </div>
        )}
      </div>

      {showName && (
        <div className="text-center leading-tight">
          <p
            className="text-xs font-medium"
            style={{ color: isOffline ? 'var(--tx3)' : 'var(--tx)' }}
          >
            {agent.name}
          </p>
          {showRole && (
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--tx3)' }}>
              {agent.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
