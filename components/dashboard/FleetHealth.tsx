'use client';

import { Activity, Zap, Database, Cpu } from 'lucide-react';
import { fleetStats } from '@/lib/mock-data';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }: StatCardProps) {
  return (
    <div
      className="flex-1 min-w-0 rounded-xl border border-border bg-surface p-4 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-tx-3 uppercase tracking-wide">{label}</p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={13} strokeWidth={2} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-tx tabular-nums">{value}</p>
      {sub && <p className="text-xs text-tx-3 mt-0.5">{sub}</p>}
    </div>
  );
}

export function FleetHealth() {
  return (
    <div>
      {/* Gateway chips */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-tx-3 font-medium">Gateways</span>
        {fleetStats.gateways.map(gw => (
          <span
            key={gw.name}
            className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border border-border bg-s1"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: gw.status === 'healthy' ? '#6CD9BA' : '#EF4444',
                boxShadow: gw.status === 'healthy' ? '0 0 6px rgba(108,217,186,0.9)' : 'none',
              }}
            />
            <span className="text-tx-2">{gw.name}</span>
            <span className="text-tx-3">{gw.sessions}s</span>
          </span>
        ))}
        <span className="ml-auto text-xs text-tx-3 font-mono">{fleetStats.uptimePercent}% uptime</span>
      </div>

      {/* Stat cards */}
      <div className="flex gap-3">
        <StatCard
          icon={Activity}
          label="Active Agents"
          value={fleetStats.activeAgents}
          sub={`${fleetStats.idleAgents} idle · ${fleetStats.offlineAgents} offline`}
          color="#10B981"
          delay={0}
        />
        <StatCard
          icon={Zap}
          label="Tasks / Hour"
          value={fleetStats.tasksPerHour}
          sub="across all agents"
          color="#6CD9BA"
          delay={50}
        />
        <StatCard
          icon={Database}
          label="Memories Stored"
          value={fleetStats.memoriesStored.toLocaleString()}
          sub="in MemPalace"
          color="#B775BF"
          delay={100}
        />
        <StatCard
          icon={Cpu}
          label="Total Errors"
          value={fleetStats.totalErrors}
          sub="last 24 hours"
          color="#10B981"
          delay={150}
        />
      </div>
    </div>
  );
}
