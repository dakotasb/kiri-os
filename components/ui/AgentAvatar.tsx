'use client';

import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

interface AgentAvatarProps {
  /** Agent ID — used as the seed so each agent always gets the same character */
  seed: string;
  /** Agent accent hex (e.g. '#6CD9BA') — applied to shirt */
  accent: string;
  /** Render size in px — avatar fills this square, parent clips to circle */
  size: number;
  /** Desaturate + dim when offline */
  muted?: boolean;
}

export function AgentAvatar({ seed, accent, size, muted = false }: AgentAvatarProps) {
  const svgString = useMemo(() => {
    const hex = accent.replace('#', '');
    return createAvatar(micah, {
      seed,
      size,
      backgroundColor: ['transparent'],
      // Shirt picks up the agent's accent colour
      shirtColor: [hex],
      // Happy or neutral only — no sad/nervous/surprised
      mouth: ['smile', 'laughing', 'smirk'],
      // Gender-neutral: strip all gendered accessories and makeup
      earringProbability: 0,
      eyeShadowProbability: 0,
      facialHairProbability: 0,
    }).toString();
  }, [seed, accent, size]);

  return (
    <div
      style={{
        width: size,
        height: size,
        filter: muted ? 'grayscale(1) brightness(0.5)' : 'none',
        transition: 'filter 0.3s ease',
        flexShrink: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
