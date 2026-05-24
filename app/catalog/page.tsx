'use client';

import { useState } from 'react';
import { agents } from '@/lib/mock-data';
import { CatalogCard } from '@/components/catalog/CatalogCard';
import { Search, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Personal', 'Research', 'Business', 'Development', 'Finance', 'Health'];

const FEATURED_IDS = ['compass', 'forge', 'atlas'];

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  const featuredAgents = agents.filter(a => FEATURED_IDS.includes(a.id));
  const otherAgents = agents.filter(a => {
    if (FEATURED_IDS.includes(a.id)) return false;
    if (query) return a.name.toLowerCase().includes(query.toLowerCase()) || a.role.toLowerCase().includes(query.toLowerCase());
    if (activeCategory === 'All') return true;
    return a.categories.includes(activeCategory);
  });

  const gridAgents = query
    ? agents.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.role.toLowerCase().includes(query.toLowerCase()))
    : otherAgents;

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-tx tracking-tight">Agent Catalog</h1>
          <p className="text-sm text-tx-3 mt-0.5">
            {agents.length} agents available · Add any to your fleet
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-3" strokeWidth={2} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search agents…"
            className="w-56 bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-tx placeholder:text-tx-3 outline-none focus:border-kiri/40 transition-colors"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!query && (
        <div className="flex items-center gap-1 mb-7 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={
                activeCategory === cat
                  ? { background: 'rgba(108,217,186,0.10)', color: '#6CD9BA', border: '1px solid rgba(108,217,186,0.3)' }
                  : { background: 'transparent', color: '#7A7A9A', border: '1px solid transparent' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Featured */}
      {!query && activeCategory === 'All' && (
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} strokeWidth={2} className="text-kiri" />
            <h2 className="text-sm font-semibold text-tx">Featured</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {featuredAgents.map((agent, i) => (
              <CatalogCard key={agent.id} agent={agent} featured delay={i * 70} />
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div>
        {!query && activeCategory === 'All' && (
          <h2 className="text-sm font-semibold text-tx mb-3">All Agents</h2>
        )}
        {query && (
          <h2 className="text-sm font-semibold text-tx mb-3">
            {gridAgents.length} result{gridAgents.length !== 1 ? 's' : ''} for "{query}"
          </h2>
        )}
        <div className="grid grid-cols-4 gap-3">
          {gridAgents.map((agent, i) => (
            <CatalogCard key={agent.id} agent={agent} delay={i * 40} />
          ))}
        </div>
      </div>
    </div>
  );
}
