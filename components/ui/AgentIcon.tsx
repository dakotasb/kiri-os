'use client';

import {
  Sparkles, Compass, Hammer, TrendingUp, CalendarDays,
  BookOpen, Target, BellRing, LucideIcon,
} from 'lucide-react';
import { hexToRgba } from '@/lib/utils';
import { Agent } from '@/lib/mock-data';
import { AgentAvatar } from '@/components/ui/AgentAvatar';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Compass, Hammer, TrendingUp, CalendarDays,
  BookOpen, Target, BellRing,
};

const SIZES = {
  xs: { wrap: 28, icon: 12, dot: 7,  dotPos: '-1px' },
  sm: { wrap: 36, icon: 14, dot: 8,  dotPos: '-1px' },
  md: { wrap: 44, icon: 18, dot: 10, dotPos: '-2px' },
  lg: { wrap: 60, icon: 24, dot: 12, dotPos: '-2px' },
  xl: { wrap: 80, icon: 32, dot: 14, dotPos: '-3px' },
};

interface AgentIconProps {
  agent: Agent;
  size?: keyof typeof SIZES;
  showName?: boolean;
  showRole?: boolean;
  showPulse?: boolean;
  /** Orb mode: avatar fills the orb, function icon moves to bottom-right badge */
  orb?: boolean;
  className?: string;
}

export function AgentIcon({
  agent,
  size = 'md',
  showName = false,
  showRole = false,
  showPulse = true,
  orb = false,
  className = '',
}: AgentIconProps) {
  const cfg = SIZES[size];
  const Icon = ICON_MAP[agent.icon] ?? Sparkles;
  const isActive  = agent.status === 'active';
  const isOffline = agent.status === 'offline';

  const borderColor = isOffline ? 'var(--ov-sm)' : hexToRgba(agent.accent, 0.28);
  const bgColor = isOffline
    ? 'var(--ov-xs)'
    : `radial-gradient(circle at 35% 35%, ${hexToRgba(agent.accent, 0.22)}, ${hexToRgba(agent.accent, 0.05)})`;
  const glowShadow = isActive
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
        {/* Pulse rings */}
        {isActive && showPulse && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-pulse-ring pointer-events-none"
              style={{ border: `1px solid ${hexToRgba(agent.accent, 0.6)}` }}
            />
            <span
              className="absolute inset-0 rounded-full animate-pulse-ring-2 pointer-events-none"
              style={{ border: `1px solid ${hexToRgba(agent.accent, 0.4)}` }}
            />
          </>
        )}

        {/* Main orb — avatar fills it, clipped to circle */}
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
          <AgentAvatar
            seed={agent.id}
            accent={agent.accent}
            size={cfg.wrap}
            muted={isOffline}
            mouth={agent.id === 'kiri' ? ['smirk'] : undefined}
          />
        </div>

        {/* Default mode: small status dot at bottom-right */}
        {!orb && (
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
