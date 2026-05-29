'use client';

import { useState, useEffect } from 'react';
import { X, Check, Plus, Loader2 } from 'lucide-react';
import { agents } from '@/lib/mock-data';
import { apiCreateTask } from '@/lib/api-client';

const MY_AGENTS = ['kiri', 'horizon', 'forge', 'ledger', 'coach'];

const catalogAgents = agents.filter(a => !MY_AGENTS.includes(a.id));

interface AddAgentModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddAgentModal({ open, onClose }: AddAgentModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [busy,     setBusy]     = useState(false);
  const [done,     setDone]     = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (open) { setSelected(null); setBusy(false); setDone(null); setError(null); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleAdd() {
    if (!selected || busy) return;
    const agent = catalogAgents.find(a => a.id === selected);
    if (!agent) return;

    setBusy(true);
    setError(null);
    try {
      await apiCreateTask({
        title:    `Activate agent: ${agent.name}`,
        assignee: agent.id,
        priority: 'high',
      });
      setDone(agent.name);
      setTimeout(onClose, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add agent');
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(11,11,14,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl animate-fade-up p-6"
        style={{ animationDuration: '150ms' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-tx">Add Agent to Fleet</h2>
            <p className="text-[11px] text-tx-3 mt-0.5">Select an agent to activate</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        {/* Agent list */}
        <div className="flex flex-col gap-2 mb-5">
          {catalogAgents.map(agent => {
            const isSelected = selected === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelected(agent.id)}
                className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150"
                style={
                  isSelected
                    ? { borderColor: agent.accent, background: `${agent.accent}10` }
                    : { borderColor: 'var(--border)', background: 'transparent' }
                }
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: agent.accent }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-tx">{agent.name}</p>
                  <p className="text-[11px] text-tx-3">{agent.role} · {agent.model.split('-').slice(0, 2).join('-')}</p>
                </div>
                {isSelected && (
                  <Check size={14} strokeWidth={2.5} style={{ color: agent.accent, flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        {done ? (
          <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium" style={{ color: '#6CD9BA' }}>
            <Check size={14} strokeWidth={2.5} />
            {done} activation queued for Kiri
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border text-xs font-medium text-tx-2 hover:text-tx hover:border-border-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!selected || busy}
              className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#6CD9BA', color: '#13121A', boxShadow: selected ? '0 0 14px rgba(108,217,186,0.3)' : 'none' }}
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} strokeWidth={2.5} />}
              {busy ? 'Activating…' : 'Add to Fleet'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
