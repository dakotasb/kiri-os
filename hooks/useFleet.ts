'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface LiveAgent {
  id: string;
  model: string;
  role: string;
  description: string;
  status: 'active' | 'idle' | 'offline';
  sessions: number;
  tasksToday: number;
  runningTask: { id: string; title: string } | null;
}

export interface LiveGateway {
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  sessions: number;
}

export interface FleetData {
  agents: LiveAgent[];
  gateways: LiveGateway[];
  counts: { active: number; idle: number; offline: number };
}

export function useFleet(intervalMs = 15_000) {
  const [data, setData]       = useState<FleetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await apiFetch<FleetData>('/fleet');
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fleet fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, intervalMs);
    return () => clearInterval(id);
  }, [load, intervalMs]);

  return { data, loading, error, refetch: load };
}
