'use client';

import { useState } from 'react';
import { projects, agents as allAgents, getAgent } from '@/lib/mock-data';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { AgentIcon } from '@/components/ui/AgentIcon';
import { LayoutGrid, List, Plus, Settings2 } from 'lucide-react';

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [view, setView] = useState<'board' | 'list'>('board');

  const project = projects.find(p => p.id === activeProject) ?? projects[0];
  const projectAgents = project.agentIds.map(id => getAgent(id)).filter(Boolean) as typeof allAgents;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          {/* Project tabs */}
          <div className="flex items-center gap-1">
            {projects.map(proj => (
              <button
                key={proj.id}
                onClick={() => setActiveProject(proj.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150"
                style={
                  activeProject === proj.id
                    ? { background: `${proj.color}12`, color: proj.color, border: `1px solid ${proj.color}30` }
                    : { color: '#7A7A9A', border: '1px solid transparent' }
                }
              >
                <span className="w-2 h-2 rounded-full" style={{ background: proj.color }} />
                {proj.name}
              </button>
            ))}
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] transition-colors ml-1">
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Agent rail — compact */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface">
            <span className="text-[11px] text-tx-3 mr-1">Team</span>
            <div className="flex items-center -space-x-2">
              {projectAgents.map(agent => (
                <div key={agent.id} className="relative" title={agent.name}>
                  <AgentIcon agent={agent} size="xs" showPulse={agent.status === 'active'} />
                </div>
              ))}
            </div>
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-[11px] text-tx-3">
              {project.activeCount > 0 ? (
                <span className="text-kiri font-medium">{project.activeCount} active</span>
              ) : 'All idle'}
            </span>
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-0.5 p-1 rounded-lg border border-border bg-surface">
            {([['board', LayoutGrid], ['list', List]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v as 'board' | 'list')}
                className="p-1.5 rounded-md transition-all duration-150"
                style={
                  view === v
                    ? { background: 'rgba(255,255,255,0.08)', color: '#EEEEFA' }
                    : { color: '#4A4A6A' }
                }
              >
                <Icon size={14} strokeWidth={1.8} />
              </button>
            ))}
          </div>

          <button className="p-2 rounded-lg text-tx-3 hover:text-tx-2 hover:bg-white/[0.05] border border-border transition-colors">
            <Settings2 size={14} strokeWidth={1.8} />
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-all"
            style={{ background: '#6CD9BA', color: '#13121A', boxShadow: '0 0 14px rgba(108,217,186,0.3)' }}
          >
            <Plus size={12} strokeWidth={2.5} />
            Add Task
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-hidden px-8 pt-5">
        <KanbanBoard projectId={activeProject} />
      </div>
    </div>
  );
}
