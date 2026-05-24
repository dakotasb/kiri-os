'use client';

import {
  Sparkles, Compass, Hammer, TrendingUp, CalendarDays,
  BookOpen, Target, BellRing, LucideIcon,
} from 'lucide-react';
import { hexToRgba } from '@/lib/utils';
import { Agent } from '@/lib/mock-data';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Compass, Hammer, TrendingUp, CalendarDays,
  BookOpen, Target, BellRing,
};

// badge = outer size, icon = lucide icon size, r = border-radius (rounded-square)
const SIZES = {
  xs: { badge: 24, icon: 11, r: 6  },
  sm: { badge: 30, icon: 13, r: 7  },
  md: { badge: 38, icon: 16, r: 9  },
  lg: { badge: 48, icon: 20, r: 11 },
  xl: { badge: 58, icon: 25, r: 13 },
};

interface AgentIconProps {
  agent: Agent;
  size?: keyof typeof SIZES;
  showName?: boolean;
  showRole?: boolean;
  showPulse?: boolean;
  className?: string;
}

export function AgentIcon({
  agent,
  size = 'md',
  showName = false,
  showRole = false,
  showPulse = true,
  className = '',
}: AgentIconProps) {
  const cfg = SIZES[size];
  const Icon = ICON_MAP[agent.icon] ?? Sparkles;
  const isActive  = agent.status === 'active';
  const isOffline = agent.status === 'offline';

  // Colour logic — offline goes muted, everything else uses agent accent
  const iconColor  = isOffline ? 'var(--tx3)' : agent.accent;
  const badgeBg    = isOffline
    ? 'var(--ov-xs)'
    : hexToRgba(agent.accent, 0.13);
  const badgeBorder = isOffline
    ? 'var(--ov-sm)'
    : hexToRgba(agent.accent, isActive ? 0.42 : 0.25);
  const badgeGlow  = isActive
    ? `0 0 14px ${hexToRgba(agent.accent, 0.32)}, 0 0 28px ${hexToRgba(agent.accent, 0.12)}`
    : 'none';

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Badge + pulse wrapper — sized to badge so rings hug it */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: cfg.badge, height: cfg.badge }}
      >
        {/* Pulse rings — match badge shape */}
        {isActive && showPulse && (
          <>
            <span
              className="absolute inset-0 animate-pulse-ring pointer-events-none"
              style={{
                borderRadius: cfg.r,
                border: `1px solid ${hexToRgba(agent.accent, 0.55)}`,
              }}
            />
            <span
              className="absolute inset-0 animate-pulse-ring-2 pointer-events-none"
              style={{
                borderRadius: cfg.r,
                border: `1px solid ${hexToRgba(agent.accent, 0.30)}`,
              }}
            />
          </>
        )}

        {/* The badge — icon + status expressed through colour/glow */}
        <div
          className="flex items-center justify-center transition-all duration-300"
          style={{
            width: cfg.badge,
            height: cfg.badge,
            borderRadius: cfg.r,
            background: badgeBg,
            border: `1.5px solid ${badgeBorder}`,
            boxShadow: badgeGlow,
          }}
        >
          <Icon size={cfg.icon} strokeWidth={1.8} style={{ color: iconColor }} />
        </div>
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
