'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface LiveGoal {
  id: string;
  title: string;
  agent_id: string | null;
  category: string | null;
  metric: string | null;
  target_date: string | null;
  progress: number;
  created_at: number;
}

export function useGoals(intervalMs = 10_000) {
  const [data, setData]       = useState<LiveGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await apiFetch<LiveGoal[]>('/goals');
      setData(Array.isArray(json) ? json : []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Goals fetch failed');
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
