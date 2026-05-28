'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';
import type { LiveGateway } from './useFleet';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  mempalace: { status: string };
  gateways: LiveGateway[];
}

export function useSystemHealth(intervalMs = 30_000) {
  const [data, setData]       = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await apiFetch<SystemHealth>('/health');
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Health fetch failed');
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
