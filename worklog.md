---
Task ID: 1
Agent: Main Agent
Task: Switch AI backend from Nvidia NIM to LongCat-2.0-Preview and integrate Skills, Workflows, MCP Servers

Work Log:
- Fetched LongCat API documentation from https://longcat.chat/platform/docs/
  - OpenAI-compatible endpoint: https://api.longcat.chat/openai/v1/chat/completions
  - Model: LongCat-2.0-Preview (1M context, 128K max output)
  - Bearer token auth, streaming SSE with standard OpenAI format
- Fetched opencode-accomplishments repo from GitHub
  - Static HTML site with 25 skills, 4 workflows, AGENTS.md system prompt
  - 6-tab SPA: Overview, Timeline, Skills, Config, Terminal, Agent Flow
  - Skills in 7 categories: Development, Design, Content, Marketing, Infrastructure, Reasoning, Utilities
  - 4 workflows: Autonomous Team, Bulletproof Quality, Zero-to-Revenue, Skills Org Chart
- Rewrote backend API route (src/app/api/chat/route.ts)
  - Changed endpoint to https://api.longcat.chat/openai/v1/chat/completions
  - Added systemPrompt support for agent identity
  - Model: LongCat-2.0-Preview, max_tokens: 32000
  - Forward usage info in stream
- Created lib/chat.ts with violet (#8b5cf6) brand colors and model info constants
- Created lib/skills.ts with 25 skills (data from opencode-accomplishments)
- Created lib/workflows.ts with 4 workflows and pipeline step definitions
- Created lib/mcp-servers.ts with 8 MCP servers (Filesystem, GitHub, Postgres, Puppeteer, Slack, Memory, Brave Search, LongCat)
- Created new LongCat cat-face SVG logo in xmarky-logo.tsx
- Updated all chat components (code-block, suggestion-cards, typing-indicator, message-bubble) with violet theme
- Created sidebar.tsx - collapsible sidebar with 4 tabs + mobile bottom nav
- Created tabs/skills-tab.tsx - Skills library with search, category filter, expandable cards
- Created tabs/workflows-tab.tsx - Workflows with pipeline visualization
- Created tabs/mcp-tab.tsx - MCP server guide with install commands, config templates, tools list
- Rewrote page.tsx - Main app with sidebar + tab navigation
- Updated layout.tsx with LongCat branding metadata
- Fixed syntax errors (trigger fields, excluded skills/ from tsconfig)
- Build successful, API verified working with streaming

Stage Summary:
- AI backend: Nvidia NIM → LongCat-2.0-Preview (1M context)
- Branding: Green (#76b900) → Violet (#8b5cf6)
- New features: Skills Library (25 skills), Workflows (4 pipelines), MCP Servers (8 servers)
- Navigation: Collapsible sidebar (desktop) + bottom tabs (mobile)
- API streaming verified: delta chunks → done → usage → [DONE]
