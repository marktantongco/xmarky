'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Zap, Server, Cpu, BookOpen, Palette, Globe, Camera,
  FileText, User, Share2, Megaphone, ShoppingCart,
  Rocket, Shield, Brain, HelpCircle, AlertTriangle, Minimize2,
  FileOutput, Compass, Box, Monitor, ChevronDown, ChevronUp,
  Ruler, Sparkles, Puzzle
} from 'lucide-react';
import { ACCENT, ACCENT_DIM } from '@/lib/chat';
import { skills, searchSkills, getSkillsByCategory, SKILL_CATEGORIES, Skill } from '@/lib/skills';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="size-5" />,
  Server: <Server className="size-5" />,
  Cpu: <Cpu className="size-5" />,
  BookOpen: <BookOpen className="size-5" />,
  Palette: <Palette className="size-5" />,
  Ruler: <Ruler className="size-5" />,
  Globe: <Globe className="size-5" />,
  Camera: <Camera className="size-5" />,
  FileText: <FileText className="size-5" />,
  User: <User className="size-5" />,
  Share2: <Share2 className="size-5" />,
  Megaphone: <Megaphone className="size-5" />,
  ShoppingCart: <ShoppingCart className="size-5" />,
  Search: <Search className="size-5" />,
  Rocket: <Rocket className="size-5" />,
  Shield: <Shield className="size-5" />,
  Brain: <Brain className="size-5" />,
  HelpCircle: <HelpCircle className="size-5" />,
  AlertTriangle: <AlertTriangle className="size-5" />,
  Minimize2: <Minimize2 className="size-5" />,
  FileOutput: <FileOutput className="size-5" />,
  Compass: <Compass className="size-5" />,
  Box: <Box className="size-5" />,
  Monitor: <Monitor className="size-5" />,
};

const categoryColors: Record<string, string> = {
  Development: '#8b5cf6',
  Design: '#06d6a0',
  Content: '#f97316',
  Marketing: '#eab308',
  Infrastructure: '#ef4444',
  Reasoning: '#3b82f6',
  Utilities: '#6b7280',
};

function SkillCard({ skill }: { skill: Skill }) {
  const [expanded, setExpanded] = useState(false);
  const color = categoryColors[skill.category] || ACCENT;

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
              {iconMap[skill.icon] || <Sparkles className="size-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{skill.name}</h3>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide"
                  style={{
                    backgroundColor: skill.status === 'active' ? `${color}20` : 'rgba(234,179,8,0.15)',
                    color: skill.status === 'active' ? color : '#eab308',
                  }}
                >
                  {skill.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{skill.description}</p>
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
            <div className="px-4 pb-4 pt-3 mx-4 space-y-3 border-t border-white/5">
              {/* Category */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {skill.category}
                </span>
              </div>

              {/* Trigger phrases */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Trigger Phrases</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.trigger.split(', ').map((phrase) => (
                    <span
                      key={phrase}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Instructions</p>
                <ol className="space-y-1">
                  {skill.instructions.map((step, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="flex-shrink-0 size-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: `${color}20`, color }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Constraints */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Constraints</p>
                <ul className="space-y-0.5">
                  {skill.constraints.map((constraint, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                      <span style={{ color }} className="mt-0.5">&#x2022;</span>
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SkillsTab() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    if (query) return searchSkills(query);
    if (activeCategory) return getSkillsByCategory(activeCategory);
    return skills;
  }, [query, activeCategory]);

  const stats = useMemo(() => ({
    total: skills.length,
    active: skills.filter(s => s.status === 'active').length,
    beta: skills.filter(s => s.status === 'beta').length,
    categories: SKILL_CATEGORIES.length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Skills Library</h2>
        <p className="text-sm text-gray-400 mt-1">
          {skills.length} skills across {SKILL_CATEGORIES.length} categories. Click any skill to expand details.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold" style={{ color: ACCENT }}>{stats.total}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Skills</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Active</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-yellow-400">{stats.beta}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Beta</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-blue-400">{stats.categories}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Categories</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveCategory(null); }}
          placeholder="Search skills by name, description, or trigger phrase..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12122a] border border-white/5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/30 transition-colors"
        />
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
          All
        </button>
        {SKILL_CATEGORIES.map((cat) => {
          const color = categoryColors[cat] || ACCENT;
          const count = getSkillsByCategory(cat).length;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(activeCategory === cat ? null : cat); setQuery(''); }}
              className={`text-[11px] px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                activeCategory === cat ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
              style={
                activeCategory === cat
                  ? { backgroundColor: `${color}25`, color }
                  : { backgroundColor: 'rgba(255,255,255,0.05)' }
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </AnimatePresence>
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Puzzle className="size-12 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No skills found matching &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
