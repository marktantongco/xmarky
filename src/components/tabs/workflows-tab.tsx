'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShieldCheck, Rocket, Network,
  ChevronRight, Play,
  Compass, Server, Zap, Minimize2, Cpu,
  Brain, HelpCircle, AlertTriangle, Box, Shield,
  FileOutput, Search, Palette, Rocket as RocketIcon,
  FileText, User, Megaphone, ShoppingCart,
  Crown, TrendingUp, Code2, Settings, Sparkles
} from 'lucide-react';
import { ACCENT, ACCENT_DIM } from '@/lib/chat';
import type { Workflow } from '@/lib/workflows';
import { workflows } from '@/lib/workflows';
import { getSkillById } from '@/lib/skills';

const stepIconMap: Record<string, React.ReactNode> = {
  Compass: <Compass className="size-4" />,
  Server: <Server className="size-4" />,
  Zap: <Zap className="size-4" />,
  Minimize2: <Minimize2 className="size-4" />,
  Cpu: <Cpu className="size-4" />,
  Brain: <Brain className="size-4" />,
  HelpCircle: <HelpCircle className="size-4" />,
  AlertTriangle: <AlertTriangle className="size-4" />,
  Box: <Box className="size-4" />,
  Shield: <Shield className="size-4" />,
  FileOutput: <FileOutput className="size-4" />,
  Search: <Search className="size-4" />,
  Palette: <Palette className="size-4" />,
  Rocket: <RocketIcon className="size-4" />,
  FileText: <FileText className="size-4" />,
  User: <User className="size-4" />,
  Megaphone: <Megaphone className="size-4" />,
  ShoppingCart: <ShoppingCart className="size-4" />,
  Crown: <Crown className="size-4" />,
  TrendingUp: <TrendingUp className="size-4" />,
  Code2: <Code2 className="size-4" />,
  Settings: <Settings className="size-4" />,
};

const workflowIconMap: Record<string, React.ReactNode> = {
  Users: <Users className="size-6" />,
  ShieldCheck: <ShieldCheck className="size-6" />,
  Rocket: <Rocket className="size-6" />,
  Network: <Network className="size-6" />,
};

function PipelineFlow({ workflow, selected }: { workflow: Workflow; selected: boolean }) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 pl-4">
            <div className="relative">
              {/* Pipeline line */}
              <div
                className="absolute left-[18px] top-6 bottom-6 w-0.5"
                style={{ backgroundColor: `${workflow.color}30` }}
              />

              {workflow.steps.map((step, index) => {
                const skill = getSkillById(step.skillId);
                return (
                  <motion.div
                    key={`${step.skillId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 mb-6 last:mb-0 relative"
                  >
                    {/* Step node */}
                    <div
                      className="flex-shrink-0 size-9 rounded-full flex items-center justify-center z-10 border-2"
                      style={{
                        backgroundColor: `${workflow.color}15`,
                        borderColor: `${workflow.color}50`,
                        color: workflow.color,
                      }}
                    >
                      {stepIconMap[step.icon] || <Sparkles className="size-4" />}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{step.skillName}</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${workflow.color}15`, color: workflow.color }}>
                          {step.phase}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WorkflowsTab() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const stats = useMemo(() => ({
    total: workflows.length,
    stages: workflows.reduce((acc, w) => acc + w.steps.length, 0),
    uniqueSkills: new Set(workflows.flatMap(w => w.steps.map(s => s.skillId))).size,
    active: workflows.filter(w => w.status === 'active').length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Workflows</h2>
        <p className="text-sm text-gray-400 mt-1">
          Multi-skill pipelines that chain specialized capabilities into powerful automation sequences.
          Click a workflow to explore its pipeline stages.
        </p>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold" style={{ color: ACCENT }}>{stats.total}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Workflows</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-cyan-400">
            {workflows.reduce((acc, w) => acc + w.steps.length, 0)}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Pipeline Stages</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-green-400">
            {stats.uniqueSkills}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Unique Skills</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-2xl font-bold text-yellow-400">
            {stats.active}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Active</p>
        </div>
      </div>

      {/* Workflow cards */}
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const isSelected = selectedWorkflow === workflow.id;
          return (
            <motion.div
              key={workflow.id}
              layout
              className="rounded-xl border transition-all overflow-hidden"
              style={{
                borderColor: isSelected ? `${workflow.color}40` : 'rgba(255,255,255,0.05)',
                backgroundColor: isSelected ? `${workflow.color}08` : 'rgba(255,255,255,0.02)',
              }}
            >
              <button
                onClick={() => setSelectedWorkflow(isSelected ? null : workflow.id)}
                className="w-full text-left p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 p-3 rounded-xl"
                      style={{ backgroundColor: `${workflow.color}15`, color: workflow.color }}
                    >
                      {workflowIconMap[workflow.icon] || <Sparkles className="size-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{workflow.name}</h3>
                        <code
                          className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
                          style={{ backgroundColor: `${workflow.color}15`, color: workflow.color }}
                        >
                          {workflow.command}
                        </code>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 max-w-2xl">{workflow.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Play className="size-3" /> {workflow.steps.length} stages
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          Pipeline: {workflow.steps.map(s => s.skillName).join(' → ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`size-5 text-gray-500 transition-transform flex-shrink-0 mt-1 ${
                      isSelected ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              <PipelineFlow workflow={workflow} selected={isSelected} />
            </motion.div>
          );
        })}
      </div>

      {/* How to use */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-3">How to Use Workflows</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <p><strong className="text-gray-300">Type the command</strong> in the chat (e.g., <code className="px-1.5 py-0.5 rounded bg-white/5 text-violet-400 font-mono">/team</code>) to trigger a workflow.</p>
          <p><strong className="text-gray-300">Each workflow</strong> chains multiple skills in sequence, with context flowing between stages.</p>
          <p><strong className="text-gray-300">Customize</strong> by adding or removing stages, or create your own workflow in the <code className="px-1.5 py-0.5 rounded bg-white/5 text-violet-400 font-mono">workflows/</code> directory.</p>
          <p><strong className="text-gray-300">Workflows are composable</strong> — you can nest workflows or use individual skills within any workflow.</p>
        </div>
      </div>
    </div>
  );
}
