export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: 'AI/ML' | 'Development' | 'Data' | 'Communication' | 'Productivity' | 'System';
  status: 'stable' | 'beta' | 'experimental';
  enabled: boolean;
  installCommand: string;
  configTemplate: string;
  tools: string[];
  docsUrl: string;
}

export const mcpServers: MCPServer[] = [
  {
    id: 'filesystem',
    name: 'Filesystem Server',
    description: 'Read, write, and manage files and directories on the local filesystem. Essential for any code-generation or file-processing workflow.',
    category: 'System',
    status: 'stable',
    enabled: true,
    installCommand: 'npm install -g @anthropic/mcp-filesystem',
    configTemplate: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem", "/path/to/workspace"],
      "env": {}
    }
  }
}`,
    tools: ['read_file', 'write_file', 'list_directory', 'create_directory', 'delete_file', 'move_file', 'search_files'],
    docsUrl: 'https://modelcontextprotocol.io/servers/filesystem',
  },
  {
    id: 'github',
    name: 'GitHub MCP Server',
    description: 'Interact with GitHub repositories, issues, pull requests, and actions. Manage code reviews and CI/CD workflows.',
    category: 'Development',
    status: 'stable',
    enabled: true,
    installCommand: 'npm install -g @anthropic/mcp-github',
    configTemplate: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}`,
    tools: ['create_issue', 'list_issues', 'create_pull_request', 'search_repositories', 'get_file_contents', 'create_branch'],
    docsUrl: 'https://modelcontextprotocol.io/servers/github',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Server',
    description: 'Execute SQL queries, manage database schemas, and inspect table structures. Supports read-only and read-write modes.',
    category: 'Data',
    status: 'stable',
    enabled: false,
    installCommand: 'npm install -g @anthropic/mcp-postgres',
    configTemplate: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-postgres", "postgresql://user:pass@localhost:5432/db"],
      "env": {}
    }
  }
}`,
    tools: ['query', 'list_tables', 'describe_table', 'create_table', 'insert', 'update', 'delete'],
    docsUrl: 'https://modelcontextprotocol.io/servers/postgres',
  },
  {
    id: 'puppeteer',
    name: 'Puppeteer Server',
    description: 'Browser automation for web scraping, screenshots, PDF generation, and end-to-end testing via headless Chrome.',
    category: 'Development',
    status: 'stable',
    enabled: false,
    installCommand: 'npm install -g @anthropic/mcp-puppeteer',
    configTemplate: `{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-puppeteer"],
      "env": {}
    }
  }
}`,
    tools: ['navigate', 'screenshot', 'click', 'fill', 'evaluate', 'pdf', 'get_content'],
    docsUrl: 'https://modelcontextprotocol.io/servers/puppeteer',
  },
  {
    id: 'slack',
    name: 'Slack Server',
    description: 'Send messages, manage channels, search conversations, and interact with Slack workspaces programmatically.',
    category: 'Communication',
    status: 'stable',
    enabled: false,
    installCommand: 'npm install -g @anthropic/mcp-slack',
    configTemplate: `{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}`,
    tools: ['send_message', 'list_channels', 'search_messages', 'get_channel_history', 'create_channel'],
    docsUrl: 'https://modelcontextprotocol.io/servers/slack',
  },
  {
    id: 'memory',
    name: 'Memory Server',
    description: 'Persistent knowledge graph for storing and retrieving information across sessions. Enables long-term agent memory.',
    category: 'AI/ML',
    status: 'stable',
    enabled: true,
    installCommand: 'npm install -g @anthropic/mcp-memory',
    configTemplate: `{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-memory"],
      "env": {}
    }
  }
}`,
    tools: ['create_entities', 'search_nodes', 'add_relations', 'open_nodes', 'query_graph'],
    docsUrl: 'https://modelcontextprotocol.io/servers/memory',
  },
  {
    id: 'brave-search',
    name: 'Brave Search Server',
    description: 'Web search via the Brave Search API. Fetch real-time information from the internet for research and fact-checking.',
    category: 'Productivity',
    status: 'stable',
    enabled: false,
    installCommand: 'npm install -g @anthropic/mcp-brave-search',
    configTemplate: `{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your_brave_api_key"
      }
    }
  }
}`,
    tools: ['brave_web_search', 'brave_local_search'],
    docsUrl: 'https://modelcontextprotocol.io/servers/brave-search',
  },
  {
    id: 'longcat-server',
    name: 'LongCat AI Server',
    description: 'Custom MCP server for LongCat AI integration — chat completions, image generation, and multi-modal inference.',
    category: 'AI/ML',
    status: 'beta',
    enabled: true,
    installCommand: 'npm install -g mcp-longcat',
    configTemplate: `{
  "mcpServers": {
    "longcat": {
      "command": "npx",
      "args": ["-y", "mcp-longcat"],
      "env": {
        "LONGCAT_API_KEY": "ak_your_api_key",
        "LONGCAT_MODEL": "LongCat-2.0-Preview"
      }
    }
  }
}`,
    tools: ['chat_completion', 'stream_chat', 'get_models', 'check_quota'],
    docsUrl: 'https://longcat.chat/platform/docs/',
  },
];

export function getMCPServersByCategory(category: string): MCPServer[] {
  return mcpServers.filter((s) => s.category === category);
}

export function getEnabledServers(): MCPServer[] {
  return mcpServers.filter((s) => s.enabled);
}

export function getDisabledServers(): MCPServer[] {
  return mcpServers.filter((s) => !s.enabled);
}
