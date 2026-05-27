import { Brain, Database, GitBranch, Layers } from 'lucide-react';
import { agents, fleetStats } from '@/lib/mock-data';
import { PageHeader } from '@/components/layout/PageHeader';

function MemoryBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/08 text-cyan-400 font-medium">
      <Database size={11} />
      {fleetStats.memoriesStored.toLocaleString()} entries
    </span>
  );
}

export default function MemPalacePage() {
  return (
    <div className="h-full overflow-y-auto p-8 animate-fade-in">
      <div className="mb-6">
        <PageHeader
          title="Knowledge"
          subtitle="Institutional memory · What your agents know"
          action={<MemoryBadge />}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Knowledge nodes', value: '2,847', icon: Brain, color: '#8B5CF6' },
          { label: 'Relationships', value: '4,120', icon: GitBranch, color: '#06B6D4' },
          { label: 'Memory rooms', value: '12', icon: Layers, color: '#10B981' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} style={{ color: stat.color }} strokeWidth={1.8} />
              <p className="text-xs text-tx-3">{stat.label}</p>
            </div>
            <p className="text-2xl font-semibold text-tx">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Agent memory breakdown */}
      <h2 className="text-sm font-semibold text-tx mb-3">Memory by Agent</h2>
      <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden">
        {agents.filter(a => a.memoryEntries > 0).sort((a, b) => b.memoryEntries - a.memoryEntries).map(agent => (
          <div key={agent.id} className="flex items-center gap-4 px-4 py-3 hover:bg-s1 transition-colors">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: agent.accent }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-tx">{agent.name}</span>
                <span className="text-xs font-mono text-tx-3">{agent.memoryEntries.toLocaleString()} entries</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(agent.memoryEntries / 843) * 100}%`,
                    background: agent.accent,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
        <Brain size={24} className="text-tx-3 mx-auto mb-3" strokeWidth={1.4} />
        <p className="text-sm font-medium text-tx mb-1">Graph Visualization</p>
        <p className="text-xs text-tx-3 max-w-xs mx-auto">
          Interactive knowledge graph powered by Neo4j — connects via MemPalace at port 3100.
        </p>
        <button className="mt-4 px-4 py-2 text-xs font-medium rounded-lg border border-border text-tx-2 hover:border-border-hover hover:text-tx transition-colors">
          Connect to MemPalace
        </button>
      </div>
    </div>
  );
}
