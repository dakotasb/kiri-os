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

const SIZES = {
  xs: { wrap: 28, icon: 12, dot: 7, dotPos: '-1px' },
  sm: { wrap: 36, icon: 14, dot: 8, dotPos: '-1px' },
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
  const isActive = agent.status === 'active';
  const isOffline = agent.status === 'offline';

  const color = isOffline ? '#4A4A6A' : agent.accent;
  const borderColor = isOffline ? 'rgba(255,255,255,0.05)' : hexToRgba(agent.accent, 0.28);
  const bgColor = isOffline
    ? 'rgba(255,255,255,0.03)'
    : `radial-gradient(circle at 35% 35%, ${hexToRgba(agent.accent, 0.22)}, ${hexToRgba(agent.accent, 0.05)})`;
  const glowShadow = isActive
    ? `0 0 22px ${hexToRgba(agent.accent, 0.28)}, 0 0 44px ${hexToRgba(agent.accent, 0.10)}`
    : 'none';

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: cfg.wrap, height: cfg.wrap }}>
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

        {/* Icon container */}
        <div
          className="rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            width: cfg.wrap,
            height: cfg.wrap,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: glowShadow,
          }}
        >
          <Icon size={cfg.icon} strokeWidth={1.6} style={{ color }} />
        </div>

        {/* Status dot */}
        <span
          className="absolute rounded-full border-2 border-bg"
          style={{
            width: cfg.dot,
            height: cfg.dot,
            bottom: cfg.dotPos,
            right: cfg.dotPos,
            background: isActive ? '#10B981' : isOffline ? '#252530' : '#4A4A6A',
          }}
        />
      </div>

      {showName && (
        <div className="text-center leading-tight">
          <p className="text-xs font-medium" style={{ color: isOffline ? '#4A4A6A' : '#EEEEFA' }}>
            {agent.name}
          </p>
          {showRole && (
            <p className="text-[10px] mt-0.5" style={{ color: '#4A4A6A' }}>
              {agent.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
