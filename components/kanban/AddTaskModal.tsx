'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { LiveTask } from '@/hooks/useTasks';
import { apiCreateTask } from '@/lib/api-client';
import { agents } from '@/lib/mock-data';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (task: LiveTask) => void;
  defaultAssignee?: string | null;
}

export function AddTaskModal({ open, onClose, onCreated, defaultAssignee }: AddTaskModalProps) {
  const [title,    setTitle]    = useState('');
  const [assignee, setAssignee] = useState(defaultAssignee ?? '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setAssignee(defaultAssignee ?? '');
      setPriority('medium');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, defaultAssignee]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const task = await apiCreateTask({ title: title.trim(), assignee: assignee || null, priority });
      onCreated(task);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setBusy(false);
    }
  }

  const PRIORITIES: Array<{ value: 'low' | 'medium' | 'high'; color: string }> = [
    { value: 'low',    color: '#4A4A6A' },
    { value: 'medium', color: '#F59E0B' },
    { value: 'high',   color: '#EF4444' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(11,11,14,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl animate-fade-up p-6"
        style={{ animationDuration: '150ms' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-tx">New Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-[11px] text-tx-3 font-medium block mb-1.5">Title</label>
            <input
              ref={inputRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-border bg-s1 px-3 py-2 text-sm text-tx placeholder:text-tx-3 focus:outline-none focus:border-kiri/50 transition-colors"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="text-[11px] text-tx-3 font-medium block mb-1.5">Assign to</label>
            <select
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              className="w-full rounded-lg border border-border bg-s1 px-3 py-2 text-sm text-tx focus:outline-none focus:border-kiri/50 transition-colors"
            >
              <option value="">Unassigned</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[11px] text-tx-3 font-medium block mb-1.5">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all duration-150"
                  style={
                    priority === p.value
                      ? { borderColor: p.color, color: p.color, background: `${p.color}14` }
                      : { borderColor: 'var(--border)', color: 'var(--tx3)' }
                  }
                >
                  {p.value}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-tx-2 hover:text-tx hover:border-border-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !title.trim()}
              className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              style={{ background: '#6CD9BA', color: '#13121A', boxShadow: '0 0 14px rgba(108,217,186,0.3)' }}
            >
              <Plus size={12} strokeWidth={2.5} />
              {busy ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
