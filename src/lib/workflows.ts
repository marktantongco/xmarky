export interface WorkflowStep {
  skillId: string;
  skillName: string;
  combo: string;
  phase: string;
  description: string;
  icon: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  command: string;
  combo: string;
  icon: string;
  color: string;
  steps: WorkflowStep[];
  status: 'active' | 'beta';
}

export const workflows: Workflow[] = [
  {
    id: 'autonomous-team',
    name: 'Autonomous Team',
    description:
      'Multi-agent orchestration pipeline — discovers skills, builds MCP servers, delegates tasks, and integrates AI capabilities through a coordinated team of specialized agents.',
    command: '/team',
    combo: 'skill-finder::utils + mcp-builder::dev + superpowers::dev + context-compress::reasoning + longcat-build::dev',
    icon: 'Users',
    color: '#8b5cf6',
    status: 'active',
    steps: [
      { skillId: 'skill-finder', skillName: 'Skill Finder', combo: 'skill-finder::utils', phase: 'Phase 1: Discovery', description: 'Find and recommend existing skills or identify gaps for new skill creation', icon: 'Compass' },
      { skillId: 'mcp-builder', skillName: 'MCP Builder', combo: 'mcp-builder::dev', phase: 'Phase 2: Build', description: 'Construct MCP servers and tool integrations for discovered needs', icon: 'Server' },
      { skillId: 'superpowers', skillName: 'Superpowers', combo: 'superpowers::dev', phase: 'Phase 3: Orchestrate', description: 'Coordinate sub-agent delegation and parallel task execution', icon: 'Zap' },
      { skillId: 'context-compressor', skillName: 'Context Compressor', combo: 'context-compress::reasoning', phase: 'Phase 4: Handoff', description: 'Compress and transfer context between agent boundaries efficiently', icon: 'Minimize2' },
      { skillId: 'longcat-build', skillName: 'LongCat Build', combo: 'longcat-build::dev', phase: 'Phase 5: AI Capabilities', description: 'Integrate LongCat AI APIs for enhanced inference and generation', icon: 'Cpu' },
    ],
  },
  {
    id: 'bulletproof-quality',
    name: 'Bulletproof Quality',
    description:
      'Rigorous multi-stage quality assurance pipeline — structured reasoning, probing questions, stress testing, simulation, auditing, and formatted reporting.',
    command: '/quality',
    combo: 'chain-of-thought::reasoning + socratic::reasoning + devils-advocate::reasoning + simulation::utils + audit::infra + output-format::utils',
    icon: 'ShieldCheck',
    color: '#06d6a0',
    status: 'active',
    steps: [
      { skillId: 'chain-of-thought', skillName: 'Chain of Thought', combo: 'chain-of-thought::reasoning', phase: 'Phase 1: Reasoning', description: 'Structured problem decomposition with step-by-step analysis', icon: 'Brain' },
      { skillId: 'socratic-method', skillName: 'Socratic Method', combo: 'socratic::reasoning', phase: 'Phase 2: Inquiry', description: 'Probing questions to challenge assumptions and deepen understanding', icon: 'HelpCircle' },
      { skillId: 'devils-advocate', skillName: 'Devil\'s Advocate', combo: 'devils-advocate::reasoning', phase: 'Phase 3: Challenge', description: 'Counterarguments, edge cases, and failure mode analysis', icon: 'AlertTriangle' },
      { skillId: 'simulation-sandbox', skillName: 'Simulation Sandbox', combo: 'simulation::utils', phase: 'Phase 4: Simulation', description: 'Scenario modeling and what-if analysis for decision validation', icon: 'Box' },
      { skillId: 'audit-analyzer', skillName: 'Audit Analyzer', combo: 'audit::infra', phase: 'Phase 5: Audit', description: 'Performance, accessibility, and security audit with recommendations', icon: 'Shield' },
      { skillId: 'output-formatter', skillName: 'Output Formatter', combo: 'output-format::utils', phase: 'Phase 6: Report', description: 'Structure findings into actionable, formatted reports', icon: 'FileOutput' },
    ],
  },
  {
    id: 'zero-to-revenue',
    name: 'Zero-to-Revenue',
    description:
      'Full product launch pipeline — from customer research through build, design, deployment, content creation, social distribution, and monetization.',
    command: '/launch',
    combo: 'jtbd-research::marketing + superpowers::dev + frontend-design::design + deploy::infra + seo-writer::content + humanizer::content + social-media::content + gumroad::marketing',
    icon: 'Rocket',
    color: '#f97316',
    status: 'active',
    steps: [
      { skillId: 'jtbd-research', skillName: 'JTBD Research', combo: 'jtbd-research::marketing', phase: 'Phase 1: Discovery', description: 'Jobs To Be Done research to understand customer needs and motivations', icon: 'Search' },
      { skillId: 'superpowers', skillName: 'Superpowers', combo: 'superpowers::dev', phase: 'Phase 2: Build', description: 'Specification, architecture, and sub-agent task delegation', icon: 'Zap' },
      { skillId: 'frontend-design', skillName: 'Frontend Design', combo: 'frontend-design::design', phase: 'Phase 3: Design', description: 'React + Tailwind component design with animations and accessibility', icon: 'Palette' },
      { skillId: 'deployment-manager', skillName: 'Deployment Manager', combo: 'deploy::infra', phase: 'Phase 4: Ship', description: 'Deploy to production with monitoring and rollback capabilities', icon: 'Rocket' },
      { skillId: 'seo-content-writer', skillName: 'SEO Content Writer', combo: 'seo-writer::content', phase: 'Phase 5: Content', description: 'SEO-optimized content creation with keyword research and meta tags', icon: 'FileText' },
      { skillId: 'humanizer', skillName: 'Humanizer', combo: 'humanizer::content', phase: 'Phase 5: Content', description: 'Transform AI content into natural, engaging human-sounding copy', icon: 'User' },
      { skillId: 'social-media-manager', skillName: 'Social Media Manager', combo: 'social-media::content', phase: 'Phase 6: Distribution', description: 'Social media calendar, scheduling, and engagement tracking', icon: 'Megaphone' },
      { skillId: 'gumroad-pipeline', skillName: 'Gumroad Pipeline', combo: 'gumroad::marketing', phase: 'Phase 7: Monetize', description: 'Gumroad product listing, pricing, launch, and sales optimization', icon: 'ShoppingCart' },
    ],
  },
  {
    id: 'skills-org-chart',
    name: 'Skills Org Chart',
    description:
      'Maps all 25 skills to human organizational roles across 7 layers — from executive leadership to operations, showing how skills form a complete autonomous organization.',
    command: '/org',
    combo: 'superpowers::dev + jtbd-research::marketing + mcp-builder::dev + frontend-design::design + audit::infra + chain-of-thought::reasoning + output-format::utils',
    icon: 'Network',
    color: '#eab308',
    status: 'active',
    steps: [
      { skillId: 'superpowers', skillName: 'Executive Layer', combo: 'superpowers::dev', phase: 'Layer 1: Executive', description: 'Tech Lead, PM, Principal Architect — strategic direction', icon: 'Crown' },
      { skillId: 'jtbd-research', skillName: 'Product Layer', combo: 'jtbd-research::marketing', phase: 'Layer 2: Product', description: 'Growth Lead, Content Lead, Social Media — market strategy', icon: 'TrendingUp' },
      { skillId: 'mcp-builder', skillName: 'Engineering Layer', combo: 'mcp-builder::dev', phase: 'Layer 3: Engineering', description: 'Platform Engineer, UI Engineer, ML Engineer — build', icon: 'Code2' },
      { skillId: 'frontend-design', skillName: 'Design Layer', combo: 'frontend-design::design', phase: 'Layer 4: Design', description: 'Design Systems Lead, Visual Creator — craft', icon: 'Palette' },
      { skillId: 'audit-analyzer', skillName: 'QA & Infrastructure', combo: 'audit::infra', phase: 'Layer 5: QA/Infra', description: 'DevOps, Security Analyst, Test Engineer — quality', icon: 'Shield' },
      { skillId: 'chain-of-thought', skillName: 'Research & Strategy', combo: 'chain-of-thought::reasoning', phase: 'Layer 6: Research', description: 'Research Lead, Chief Skeptic, Tech Writer — insight', icon: 'Brain' },
      { skillId: 'output-formatter', skillName: 'Operations', combo: 'output-format::utils', phase: 'Layer 7: Operations', description: 'Data Analyst, Recruitment Lead, QA Automation — execute', icon: 'Settings' },
    ],
  },
];

/** Generate copy-ready text for a workflow */
export function workflowToCopyText(workflow: Workflow): string {
  const lines = [
    `# ${workflow.name} [${workflow.command}]`,
    '',
    workflow.description,
    '',
    `**Combo:** ${workflow.combo}`,
    `**Status:** ${workflow.status}  |  **Stages:** ${workflow.steps.length}`,
    '',
    '## Pipeline',
    ...workflow.steps.map(
      (s, i) => `${i + 1}. **${s.skillName}** \`${s.combo}\` — ${s.description}`
    ),
  ];
  return lines.join('\n');
}

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}
