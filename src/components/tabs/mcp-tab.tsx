'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Copy, Check, ExternalLink, ChevronDown, ChevronUp,
  Terminal, Database, Globe, MessageSquare, Brain, Search, Shield,
  Star, AlertTriangle, Info, Wrench
} from 'lucide-react';
import { ACCENT, ACCENT_DIM } from '@/lib/chat';
import { mcpServers, MCPServer } from '@/lib/mcp-servers';

const categoryIcons: Record<string, React.ReactNode> = {
  'AI/ML': <Brain className="size-4" />,
  'Development': <Wrench className="size-4" />,
  'Data': <Database className="size-4" />,
  'Communication': <MessageSquare className="size-4" />,
  'Productivity': <Star className="size-4" />,
  'System': <Terminal className="size-4" />,
};

const categoryColors: Record<string, string> = {
  'AI/ML': '#8b5cf6',
  'Development': '#06d6a0',
  'Data': '#3b82f6',
  'Communication': '#f97316',
  'Productivity': '#eab308',
  'System': '#6b7280',
};

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  stable: { bg: 'rgba(6,214,160,0.15)', color: '#06d6a0', label: 'Stable' },
  beta: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: 'Beta' },
  experimental: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Experimental' },
};

function MCPServerCard({ server }: { server: MCPServer }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const color = categoryColors[server.category] || ACCENT;
  const status = statusStyles[server.status];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      // Fallback: ignore clipboard errors (e.g. in restricted contexts)
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 p-2 rounded-lg"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Server className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-white">{server.name}</h3>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide"
                  style={{ backgroundColor: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {server.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{server.description}</p>
              <p className="text-[10px] text-gray-500 mt-1">
                {server.tools.length} tool{server.tools.length > 1 ? 's' : ''}: {server.tools.slice(0, 3).join(', ')}
                {server.tools.length > 3 && ` +${server.tools.length - 3} more`}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {expanded ? (
              <ChevronUp className="size-4 text-gray-500" />
            ) : (
              <ChevronDown className="size-4 text-gray-500" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 mx-4 space-y-4 border-t border-white/5">
              {/* Install command */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Install</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#0a0a1a] rounded-lg px-3 py-2 font-mono text-xs text-gray-300 overflow-x-auto">
                    {server.installCommand}
                  </div>
                  <button
                    onClick={() => handleCopy(server.installCommand, 'install')}
                    className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied === 'install' ? (
                      <Check className="size-3.5" style={{ color: ACCENT }} />
                    ) : (
                      <Copy className="size-3.5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Config template */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Configuration</p>
                <div className="relative">
                  <pre className="bg-[#0a0a1a] rounded-lg px-3 py-3 font-mono text-xs text-gray-300 overflow-x-auto max-h-60 overflow-y-auto">
                    {server.configTemplate}
                  </pre>
                  <button
                    onClick={() => handleCopy(server.configTemplate, 'config')}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {copied === 'config' ? (
                      <Check className="size-3" style={{ color: ACCENT }} />
                    ) : (
                      <Copy className="size-3 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Tools list */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Available Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {server.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Docs link */}
              <div className="flex items-center gap-2">
                <a
                  href={server.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color }}
                >
                  <ExternalLink className="size-3" />
                  View Documentation
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function MCPTab() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = useMemo(() => [...new Set(mcpServers.map((s) => s.category))], []);

  const stats = useMemo(() => ({
    total: mcpServers.length,
    tools: mcpServers.reduce((acc, s) => acc + s.tools.length, 0),
    stable: mcpServers.filter(s => s.status === 'stable').length,
    categories: categories.length,
  }), [categories.length]);

  const filteredServers = useMemo(() => {
    if (!activeCategory) return mcpServers;
    return mcpServers.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">MCP Servers</h2>
        <p className="text-sm text-gray-400 mt-1">
          Model Context Protocol servers extend agent capabilities with tools, data sources, and integrations.
          Install and configure servers to give xmarky new superpowers.
        </p>
      </div>

      {/* What is MCP */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
        <div className="flex items-start gap-3">
          <Info className="size-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-violet-300">What is MCP?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The <strong className="text-gray-300">Model Context Protocol (MCP)</strong> is an open standard that enables
              AI agents to connect with external tools and data sources. Think of it as a &quot;USB-C for AI&quot; — a universal
              connector that lets any AI model work with any tool, database, or API. MCP servers expose capabilities
              (called &quot;tools&quot;) that the agent can invoke during conversations.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300">Installation steps:</strong> 1) Install the server package globally
              with npm. 2) Add the server configuration to your MCP config file. 3) Restart your agent.
              The server&apos;s tools will automatically become available.
            </p>
          </div>
        </div>
      </div>

      {/* Config file location */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-yellow-300">Configuration File</h3>
            <p className="text-xs text-gray-400">
              MCP servers are configured in your agent&apos;s config file. The standard locations are:
            </p>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2 bg-[#0a0a1a] rounded-lg px-3 py-2">
                <span className="text-gray-400">macOS/Linux:</span>
                <span className="text-gray-300">~/.config/claude/mcp.json</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0a0a1a] rounded-lg px-3 py-2">
                <span className="text-gray-400">Windows:</span>
                <span className="text-gray-300">%APPDATA%\Claude\mcp.json</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold" style={{ color: ACCENT }}>{stats.total}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Servers</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-green-400">
            {stats.tools}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Tools</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-yellow-400">
            {stats.stable}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Stable</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-cyan-400">{stats.categories}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Categories</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
            !activeCategory ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
          style={!activeCategory ? { backgroundColor: ACCENT_DIM, color: ACCENT } : { backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          All ({mcpServers.length})
        </button>
        {categories.map((cat) => {
          const color = categoryColors[cat] || ACCENT;
          const count = mcpServers.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              style={
                activeCategory === cat
                  ? { backgroundColor: `${color}25`, color }
                  : { backgroundColor: 'rgba(255,255,255,0.05)' }
              }
            >
              {categoryIcons[cat]}
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Server cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredServers.map((server) => (
            <MCPServerCard key={server.id} server={server} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
