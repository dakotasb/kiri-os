import type { LiveTask } from '@/hooks/useTasks';

const BASE = '/api/hermes';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`kiri-api ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function apiCreateTask(params: {
  title: string;
  assignee?: string | null;
  priority?: 'low' | 'medium' | 'high';
  body?: string;
}): Promise<LiveTask> {
  const data = await apiFetch<{ task: LiveTask }>('/tasks', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return data.task;
}

export async function apiPatchTaskStatus(id: string, status: LiveTask['status']): Promise<LiveTask> {
  const data = await apiFetch<{ task: LiveTask }>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.task;
}
