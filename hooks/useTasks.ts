'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface LiveTask {
  id: string;
  title: string;
  assignee: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: number;
  progress?: number;
  startedAt: string | null;
  completedAt: string | null;
  isHumanReview: boolean;
}

interface TasksResponse {
  tasks: LiveTask[];
}

export function useTasks(params: { status?: string; assignee?: string } = {}, intervalMs = 20_000) {
  const [tasks, setTasks]     = useState<LiveTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams();
      if (params.status)   qs.set('status', params.status);
      if (params.assignee) qs.set('assignee', params.assignee);
      const json = await apiFetch<TasksResponse>(`/tasks${qs.size ? `?${qs}` : ''}`);
      setTasks(json.tasks);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tasks fetch failed');
    } finally {
      setLoading(false);
    }
  }, [params.status, params.assignee]);

  useEffect(() => {
    load();
    const id = setInterval(load, intervalMs);
    return () => clearInterval(id);
  }, [load, intervalMs]);

  return { tasks, loading, error, refetch: load };
}
