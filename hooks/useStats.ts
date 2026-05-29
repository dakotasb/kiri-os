'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface LiveStats {
  completedToday: number;
  tasksPerHour: number;
  activeAgents: number;
  totalErrors: number;
  memoriesStored: number;
  memoriesByAgent: Record<string, number>;
  uptimePercent: number;
  tasksByStatus: Record<string, number>;
}

export function useStats(intervalMs = 30_000) {
  const [data, setData]       = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await apiFetch<LiveStats>('/stats');
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Stats fetch failed');
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
