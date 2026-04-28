# xmarky — AI Agent

<div align="center">

![xmarky logo](public/logo.svg)

**AI agent powered by LongCat-2.0-Preview with 1M context, skills library, multi-skill workflows, and MCP server integrations**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![LongCat](https://img.shields.io/badge/LongCat-2.0--Preview-8b5cf6)](https://longcat.chat/)

[Live Demo](https://xmarky.vercel.app) | [Skills Library](#skills-library) | [Workflows](#workflows) | [MCP Servers](#mcp-server-integration)

</div>

---

## Overview

**xmarky** is a production-ready AI agent that connects to the [LongCat API](https://longcat.chat/) to run the **LongCat-2.0-Preview** model — a high-performance agentic model with a 1M token context window and 128K max output tokens. It features a polished dark-themed UI with streaming responses, markdown rendering, code syntax highlighting, a comprehensive skills library, multi-skill workflow pipelines, and MCP server integration guides.

### Key Features

- **Streaming Responses** — Real-time token-by-token output via SSE (Server-Sent Events)
- **Markdown & Code** — Full markdown rendering with syntax highlighting and one-click code copy
- **25 Skills** — Comprehensive skills library across 7 categories (Development, Design, Content, Marketing, Infrastructure, Reasoning, Utilities)
- **4 Workflows** — Composable multi-skill pipelines (Autonomous Team, Bulletproof Quality, Zero-to-Revenue, Skills Org Chart)
- **8 MCP Servers** — Model Context Protocol server integration guides with install commands and JSON configs
- **Conversation Persistence** — Chats are automatically saved to localStorage and restored on reload
- **Responsive Design** — Desktop sidebar + mobile bottom tab bar, works on all screen sizes
- **Keyboard Shortcuts** — `Enter` to send, `Shift+Enter` for new line, `Ctrl+/` to focus input
- **Dark Theme** — Sleek dark UI with violet (`#8b5cf6`) accent colors and glassmorphism effects
- **Animations** — Framer Motion micro-interactions on all transitions
- **Environment-based Config** — API keys via `.env.local`, never hardcoded

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animations | Framer Motion 12 |
| Markdown | react-markdown + react-syntax-highlighter |
| AI Backend | LongCat-2.0-Preview (OpenAI-compatible API) |
| Icons | lucide-react |
| Package Manager | Bun |

---

## Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/) or [Bun](https://bun.sh/)
- A [LongCat API key](https://longcat.chat/)

### Installation

```bash
# Clone the repository
git clone https://github.com/marktantongco/xmarky.git
cd xmarky

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your LONGCAT_API_KEY

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LONGCAT_API_KEY` | Yes | — | Your LongCat API key |
| `LONGCAT_MODEL` | No | `LongCat-2.0-Preview` | Model to use |

---

## Project Structure

```
xmarky/
├── public/
│   ├── logo.svg                   # App favicon (violet cat-face SVG)
│   └── robots.txt                 # SEO robots configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts       # Backend proxy to LongCat API (SSE streaming)
│   │   ├── globals.css            # Tailwind v4 + shadcn theme variables
│   │   ├── layout.tsx             # Root layout, fonts, metadata, SEO
│   │   └── page.tsx               # Main app (orchestrates sidebar + tabs)
│   ├── components/
│   │   ├── chat/
│   │   │   ├── code-block.tsx     # Syntax-highlighted code with copy button
│   │   │   ├── message-bubble.tsx # Chat message with markdown rendering
│   │   │   ├── suggestion-cards.tsx # Welcome screen suggestion prompts
│   │   │   ├── typing-indicator.tsx # Animated 3-dot loading indicator
│   │   │   └── xmarky-logo.tsx    # SVG cat-face logo component
│   │   ├── tabs/
│   │   │   ├── skills-tab.tsx     # Skills library with search/filter
│   │   │   ├── workflows-tab.tsx  # Workflow pipeline viewer
│   │   │   └── mcp-tab.tsx        # MCP server integration guides
│   │   ├── sidebar.tsx            # Desktop sidebar + mobile bottom nav
│   │   └── ui/                    # shadcn/ui components (35+)
│   ├── hooks/
│   │   ├── use-mobile.ts          # Mobile breakpoint detection
│   │   └── use-toast.ts           # Toast notification state
│   └── lib/
│       ├── chat.ts                # Types, constants, model info
│       ├── skills.ts              # 25 skills definitions + search
│       ├── workflows.ts           # 4 workflow pipelines
│       ├── mcp-servers.ts         # 8 MCP server configs
│       └── utils.ts               # Utility functions (cn helper)
├── .env.example                   # Environment variable template
├── .env.local                     # Your local env vars (git-ignored)
├── AGENTS.md                      # AI agent operating instructions
├── eslint.config.mjs              # ESLint flat config
├── next.config.ts                 # Next.js configuration (standalone output)
├── package.json                   # Project manifest
├── postcss.config.mjs             # PostCSS config
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

---

## How It Works

### Architecture

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│   Browser    │ SSE  │  Next.js API │ HTTPS│   LongCat API    │
│  (React UI)  │◄────►│  /api/chat   │◄────►│ 2.0-Preview      │
└──────────────┘      └──────────────┘      └──────────────────┘
       │                      │
       │ localStorage         │ .env.local
       │ (conversation)       │ (API key)
```

1. User sends a message from the React frontend
2. Frontend POSTs to `/api/chat` with the conversation history
3. The API route proxies the request to LongCat API with streaming enabled
4. The response stream is parsed and forwarded as SSE to the frontend
5. Frontend renders tokens in real-time as they arrive
6. Completed conversations are persisted to localStorage

### API Route

The `/api/chat` route acts as a secure proxy — your LongCat API key never reaches the browser. It accepts OpenAI-compatible chat completions format and returns SSE events:

```json
// Request
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "systemPrompt": "You are xmarky, an AI agent..."
}

// SSE Response (streamed)
data: {"type":"delta","content":"Hello"}
data: {"type":"delta","content":"!"}
data: {"type":"done","reason":"stop"}
data: {"type":"usage","usage":{"prompt_tokens":10,"completion_tokens":2,"total_tokens":12}}
data: [DONE]
```

---

## Skills Library

xmarky includes a comprehensive library of **25 skills** across 7 categories:

| Category | Skills |
|----------|--------|
| **Development** | Superpowers, MCP Builder, NVIDIA Build, Explained Code |
| **Design** | Frontend Design, Web Design Guidelines, Web Artifacts Builder, Photography AI |
| **Content** | SEO Content Writer, Humanizer, Social Content Pillars, Social Media Manager |
| **Marketing** | Gumroad Pipeline, JTBD Research |
| **Infrastructure** | Deployment Manager, Audit Analyzer |
| **Reasoning** | Chain of Thought, Socratic Method, Devil's Advocate, Context Compressor |
| **Utilities** | Output Formatter, Skill Finder, Simulation Sandbox, Web Reader, Browser Use |

Each skill includes:
- **Trigger phrases** for automatic activation
- **Step-by-step instructions** for the workflow
- **Constraints** that define hard rules and guardrails
- **Status** (active/beta/placeholder)

---

## Workflows

xmarky includes **4 composable multi-skill workflow pipelines**:

### `/team` — Autonomous Team
Multi-agent orchestration that discovers skills, builds MCP servers, delegates tasks, and integrates AI capabilities.

### `/quality` — Bulletproof Quality
Rigorous QA pipeline: structured reasoning → probing questions → stress testing → simulation → audit → formatted report.

### `/launch` — Zero-to-Revenue
Full product launch: customer research → build → design → deploy → content creation → social distribution → monetization.

### `/org` — Skills Org Chart
Maps all 25 skills to human organizational roles across 7 layers — from executive leadership to operations.

---

## MCP Server Integration

xmarky includes guides for **8 MCP (Model Context Protocol) servers**:

| Server | Category | Tools |
|--------|----------|-------|
| Filesystem | System | 7 tools (read, write, list, search, etc.) |
| GitHub | Development | 6 tools (issues, PRs, repos, etc.) |
| PostgreSQL | Data | 7 tools (query, tables, schema, etc.) |
| Puppeteer | Development | 7 tools (navigate, screenshot, click, etc.) |
| Slack | Communication | 5 tools (messages, channels, search) |
| Memory | AI/ML | 5 tools (entities, relations, graph query) |
| Brave Search | Productivity | 2 tools (web, local search) |
| LongCat AI | AI/ML | 4 tools (chat, stream, models, quota) |

Each server entry includes:
- **One-click install command** (copy to clipboard)
- **JSON configuration template** (copy to clipboard)
- **Available tools** list
- **Documentation link**

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |
| `Ctrl + /` | Focus the input field |

---

## Customization

### Changing the AI Model

Edit `LONGCAT_MODEL` in your `.env.local` to use any LongCat model:

```bash
LONGCAT_MODEL=LongCat-2.0-Preview
```

### Changing the Theme

The accent color is defined in `src/lib/chat.ts`:

```typescript
export const ACCENT = '#8b5cf6';      // Violet
export const ACCENT_DIM = 'rgba(139, 92, 246, 0.15)';
export const ACCENT_GLOW = 'rgba(139, 92, 246, 0.25)';
```

### Adding Skills

Edit the `skills` array in `src/lib/skills.ts`. Each skill requires:
- `id`, `name`, `category`, `icon`, `description`
- `trigger` (comma-separated phrases)
- `instructions` (step array)
- `constraints` (rules array)
- `status` (active/beta/placeholder)

### Adding Workflows

Edit the `workflows` array in `src/lib/workflows.ts`. Each workflow chains multiple skills into a pipeline with phases.

### Adding MCP Servers

Edit the `mcpServers` array in `src/lib/mcp-servers.ts`.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `LONGCAT_API_KEY` = your LongCat API key
   - `LONGCAT_MODEL` = `LongCat-2.0-Preview` (optional)
4. Deploy

### Self-hosted

```bash
bun run build
NODE_ENV=production bun .next/standalone/server.js
```

The server runs on port 3000 by default.

---

## License

MIT

---

## Acknowledgments

- [LongCat](https://longcat.chat/) — AI model provider (1M context, 128K output)
- [Next.js](https://nextjs.org/) — React framework
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [lucide-react](https://lucide.dev/) — Icon library
- [Vercel](https://vercel.com/) — Deployment platform
- [Model Context Protocol](https://modelcontextprotocol.io/) — Tool integration standard
