export interface WorkflowStep {
  skillId: string;
  skillName: string;
  phase: string;
  description: string;
  icon: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  command: string;
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
    icon: 'Users',
    color: '#8b5cf6',
    status: 'active',
    steps: [
      { skillId: 'skill-finder', skillName: 'Skill Finder', phase: 'Phase 1: Discovery', description: 'Find and recommend existing skills or identify gaps for new skill creation', icon: 'Compass' },
      { skillId: 'mcp-builder', skillName: 'MCP Builder', phase: 'Phase 2: Build', description: 'Construct MCP servers and tool integrations for discovered needs', icon: 'Server' },
      { skillId: 'superpowers', skillName: 'Superpowers', phase: 'Phase 3: Orchestrate', description: 'Coordinate sub-agent delegation and parallel task execution', icon: 'Zap' },
      { skillId: 'context-compressor', skillName: 'Context Compressor', phase: 'Phase 4: Handoff', description: 'Compress and transfer context between agent boundaries efficiently', icon: 'Minimize2' },
      { skillId: 'nvidia-build', skillName: 'NVIDIA Build', phase: 'Phase 5: AI Capabilities', description: 'Integrate NVIDIA NIM APIs for enhanced inference and generation', icon: 'Cpu' },
    ],
  },
  {
    id: 'bulletproof-quality',
    name: 'Bulletproof Quality',
    description:
      'Rigorous multi-stage quality assurance pipeline — structured reasoning, probing questions, stress testing, simulation, auditing, and formatted reporting.',
    command: '/quality',
    icon: 'ShieldCheck',
    color: '#06d6a0',
    status: 'active',
    steps: [
      { skillId: 'chain-of-thought', skillName: 'Chain of Thought', phase: 'Phase 1: Reasoning', description: 'Structured problem decomposition with step-by-step analysis', icon: 'Brain' },
      { skillId: 'socratic-method', skillName: 'Socratic Method', phase: 'Phase 2: Inquiry', description: 'Probing questions to challenge assumptions and deepen understanding', icon: 'HelpCircle' },
      { skillId: 'devils-advocate', skillName: 'Devil\'s Advocate', phase: 'Phase 3: Challenge', description: 'Counterarguments, edge cases, and failure mode analysis', icon: 'AlertTriangle' },
      { skillId: 'simulation-sandbox', skillName: 'Simulation Sandbox', phase: 'Phase 4: Simulation', description: 'Scenario modeling and what-if analysis for decision validation', icon: 'Box' },
      { skillId: 'audit-analyzer', skillName: 'Audit Analyzer', phase: 'Phase 5: Audit', description: 'Performance, accessibility, and security audit with recommendations', icon: 'Shield' },
      { skillId: 'output-formatter', skillName: 'Output Formatter', phase: 'Phase 6: Report', description: 'Structure findings into actionable, formatted reports', icon: 'FileOutput' },
    ],
  },
  {
    id: 'zero-to-revenue',
    name: 'Zero-to-Revenue',
    description:
      'Full product launch pipeline — from customer research through build, design, deployment, content creation, social distribution, and monetization.',
    command: '/launch',
    icon: 'Rocket',
    color: '#f97316',
    status: 'active',
    steps: [
      { skillId: 'jtbd-research', skillName: 'JTBD Research', phase: 'Phase 1: Discovery', description: 'Jobs To Be Done research to understand customer needs and motivations', icon: 'Search' },
      { skillId: 'superpowers', skillName: 'Superpowers', phase: 'Phase 2: Build', description: 'Specification, architecture, and sub-agent task delegation', icon: 'Zap' },
      { skillId: 'frontend-design', skillName: 'Frontend Design', phase: 'Phase 3: Design', description: 'React + Tailwind component design with animations and accessibility', icon: 'Palette' },
      { skillId: 'deployment-manager', skillName: 'Deployment Manager', phase: 'Phase 4: Ship', description: 'Deploy to production with monitoring and rollback capabilities', icon: 'Rocket' },
      { skillId: 'seo-content-writer', skillName: 'SEO Content Writer', phase: 'Phase 5: Content', description: 'SEO-optimized content creation with keyword research and meta tags', icon: 'FileText' },
      { skillId: 'humanizer', skillName: 'Humanizer', phase: 'Phase 5: Content', description: 'Transform AI content into natural, engaging human-sounding copy', icon: 'User' },
      { skillId: 'social-media-manager', skillName: 'Social Media Manager', phase: 'Phase 6: Distribution', description: 'Social media calendar, scheduling, and engagement tracking', icon: 'Megaphone' },
      { skillId: 'gumroad-pipeline', skillName: 'Gumroad Pipeline', phase: 'Phase 7: Monetize', description: 'Gumroad product listing, pricing, launch, and sales optimization', icon: 'ShoppingCart' },
    ],
  },
  {
    id: 'skills-org-chart',
    name: 'Skills Org Chart',
    description:
      'Maps all 25 skills to human organizational roles across 7 layers — from executive leadership to operations, showing how skills form a complete autonomous organization.',
    command: '/org',
    icon: 'Network',
    color: '#eab308',
    status: 'active',
    steps: [
      { skillId: 'superpowers', skillName: 'Executive Layer', phase: 'Layer 1: Executive', description: 'Tech Lead, PM, Principal Architect — strategic direction', icon: 'Crown' },
      { skillId: 'jtbd-research', skillName: 'Product Layer', phase: 'Layer 2: Product', description: 'Growth Lead, Content Lead, Social Media — market strategy', icon: 'TrendingUp' },
      { skillId: 'mcp-builder', skillName: 'Engineering Layer', phase: 'Layer 3: Engineering', description: 'Platform Engineer, UI Engineer, ML Engineer — build', icon: 'Code2' },
      { skillId: 'frontend-design', skillName: 'Design Layer', phase: 'Layer 4: Design', description: 'Design Systems Lead, Visual Creator — craft', icon: 'Palette' },
      { skillId: 'audit-analyzer', skillName: 'QA & Infrastructure', phase: 'Layer 5: QA/Infra', description: 'DevOps, Security Analyst, Test Engineer — quality', icon: 'Shield' },
      { skillId: 'chain-of-thought', skillName: 'Research & Strategy', phase: 'Layer 6: Research', description: 'Research Lead, Chief Skeptic, Tech Writer — insight', icon: 'Brain' },
      { skillId: 'output-formatter', skillName: 'Operations', phase: 'Layer 7: Operations', description: 'Data Analyst, Recruitment Lead, QA Automation — execute', icon: 'Settings' },
    ],
  },
];

export function getWorkflowById(id: string): Workflow | undefined {
  return workflows.find((w) => w.id === id);
}
