'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Puzzle,
  GitBranch,
  Server,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ACCENT, ACCENT_DIM } from '@/lib/chat';

export type TabId = 'chat' | 'skills' | 'workflows' | 'mcp';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const tabs: Tab[] = [
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="size-5" /> },
  { id: 'skills', label: 'Skills', icon: <Puzzle className="size-5" />, badge: '25' },
  { id: 'workflows', label: 'Workflows', icon: <GitBranch className="size-5" />, badge: '4' },
  { id: 'mcp', label: 'MCP Servers', icon: <Server className="size-5" />, badge: '8' },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activeTab, onTabChange, collapsed, onToggle }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen sticky top-0 border-r border-white/5 bg-[#0c0c1d]/95 backdrop-blur-xl z-50"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5 flex-shrink-0">
          <div
            className="flex-shrink-0 size-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: ACCENT_DIM }}
          >
            <span style={{ color: ACCENT }} className="text-lg font-bold">X</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">xmarky</h1>
              <p className="text-[10px] leading-none mt-0.5" style={{ color: ACCENT }}>
                LongCat-2.0-Preview
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 cursor-pointer group relative
                  ${isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }
                `}
                style={
                  isActive
                    ? { backgroundColor: `${ACCENT}1a` }
                    : undefined
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ backgroundColor: ACCENT }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <span
                  className="flex-shrink-0"
                  style={{ color: isActive ? ACCENT : undefined }}
                >
                  {tab.icon}
                </span>
                {!collapsed && (
                  <span className="truncate">{tab.label}</span>
                )}
                {!collapsed && tab.badge && (
                  <span
                    className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: isActive ? `${ACCENT}33` : 'rgba(255,255,255,0.05)',
                      color: isActive ? ACCENT : 'rgb(156,163,175)',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 py-3 border-t border-white/5">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-xs cursor-pointer"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0c0c1d]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                <span
                  style={{ color: isActive ? ACCENT : undefined }}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-[8px] px-1 py-0 rounded-full"
                    style={{
                      backgroundColor: ACCENT,
                      color: '#fff',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
