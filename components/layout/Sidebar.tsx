'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, Package, Columns2,
  Brain, Settings, ChevronRight,
} from 'lucide-react';
import { agents, projects } from '@/lib/mock-data';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { hexToRgba } from '@/lib/utils';

const NAV = [
  { href: '/',           icon: Sparkles,        label: 'Home' },
  { href: '/dashboard',  icon: LayoutDashboard,  label: 'Fleet' },
  { href: '/catalog',    icon: Package,          label: 'Catalog' },
  { href: '/projects',   icon: Columns2,         label: 'Projects' },
  { href: '/mempalace',  icon: Brain,            label: 'Knowledge' },
];

export function Sidebar() {
  const path = usePathname();

  const kiri = agents.find(a => a.id === 'kiri')!;
  const myAgents = agents.filter(a => ['kiri', 'compass', 'forge', 'atlas'].includes(a.id));

  return (
    <aside className="flex flex-col w-[220px] shrink-0 h-full border-r border-border bg-bg overflow-hidden select-none">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #6CD9BA 0%, #3AC9A6 40%, #3F289D 100%)',
            boxShadow: '0 0 14px rgba(108,217,186,0.45)',
          }}
        >
          <Sparkles size={14} strokeWidth={2} className="text-white" />
        </div>
        <span className="font-semibold text-sm tracking-tight kiri-text">Kiri OS</span>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-kiri-dim text-kiri border border-kiri/20">
          Beta
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 pt-3 pb-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? 'font-medium'
                  : 'text-tx-2 hover:text-tx hover:bg-white/[0.04]'
              }`}
              style={active ? { background: 'rgba(108,217,186,0.10)', color: '#6CD9BA' } : {}}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.6} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-2 border-t border-border" />

      {/* My Agents */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-tx-3 mb-2">My Agents</p>
        <div className="flex flex-col gap-1">
          {myAgents.map(agent => (
            <div key={agent.id} className="flex items-center gap-2.5 py-1 px-1 rounded-md hover:bg-white/[0.03] cursor-pointer transition-colors">
              <AgentIcon agent={agent} size="xs" showPulse={agent.status === 'active'} />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: agent.status === 'offline' ? '#4A4A6A' : '#EEEEFA' }}>
                  {agent.name}
                </p>
                <p className="text-[10px] truncate" style={{ color: '#4A4A6A' }}>
                  {agent.status === 'active' ? `${agent.sessions} sessions` : agent.status}
                </p>
              </div>
              {agent.status === 'active' && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: agent.accent, boxShadow: `0 0 6px ${hexToRgba(agent.accent, 0.8)}` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Teams */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-tx-3 mb-2">Teams</p>
        <div className="flex flex-col gap-0.5">
          {projects.map(proj => (
            <div key={proj.id} className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-white/[0.03] cursor-pointer transition-colors">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: proj.color }} />
              <span className="text-xs text-tx-2 truncate">{proj.name}</span>
              {proj.activeCount > 0 && (
                <span className="ml-auto text-[10px] text-tx-3 tabular-nums">{proj.activeCount} active</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings */}
      <div className="px-2 pb-2">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-tx-2 hover:text-tx hover:bg-white/[0.04] transition-all duration-150"
        >
          <Settings size={15} strokeWidth={1.6} />
          Settings
        </Link>
      </div>

      {/* User */}
      <div className="mx-3 mb-3 p-2.5 rounded-xl border border-border bg-s1 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#13121A] text-xs font-semibold"
          style={{ background: 'linear-gradient(135deg, #6CD9BA, #3F289D)' }}
        >
          D
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-tx truncate">Dakota</p>
          <p className="text-[10px] text-tx-3 truncate">Free Plan</p>
        </div>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
          Upgrade
        </span>
      </div>
    </aside>
  );
}
