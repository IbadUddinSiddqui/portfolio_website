# MCP Adapter for Freebuff

> Bridge Freebuff with any MCP-compatible server using the Model Context Protocol.

## Overview

This adapter allows Freebuff to discover and use tools from MCP (Model Context Protocol) servers. MCP is an open standard developed by Anthropic that provides a standardized way for AI assistants to connect with external tools and data sources — think of it as a "USB-C port for AI."

## Architecture

```
┌──────────┐     ┌──────────────────┐     ┌──────────┐     ┌──────────┐
│ Freebuff  │────▶│ mcp-adapter.ts   │────▶│ mcp-     │────▶│ MCP      │
│ (AI Agent)│     │ (Agent Def)      │     │ bridge   │     │ Server   │
└──────────┘     └──────────────────┘     │ .mjs     │     └──────────┘
                                           └──────────┘           │
                                                                  ▼
                                                            ┌──────────┐
                                                            │ External │
                                                            │ Services │
                                                            └──────────┘
```

### Components

| File | Purpose |
|------|---------|
| `.mcp.json` | MCP server configuration (which servers, their commands, env vars) |
| `.agents/mcp-adapter.ts` | Freebuff agent definition with instructions on MCP usage |
| `.agents/scripts/mcp-bridge.mjs` | Node.js CLI bridge that manages MCP server lifecycle and communication |
| `.agents/README.md` | This file — usage documentation |

## Getting Started

### 1. Configure MCP Servers

Edit `.mcp.json` in your project root. Here's the default configuration:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "disabled": false
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "disabled": false
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "your-token-here" },
      "disabled": true  // Enable after setting GITHUB_TOKEN
    }
  }
}
```

### 2. Server Status

Check which servers are configured and their status:

```bash
node .agents/scripts/mcp-bridge.mjs ls
```

### 3. List Available Tools

See what tools a server provides:

```bash
node .agents/scripts/mcp-bridge.mjs tools filesystem
```

### 4. Call a Tool

Invoke a tool on a server:

```bash
# Simple string arguments
node .agents/scripts/mcp-bridge.mjs call filesystem read_file '{"path": "README.md"}'

# Search files
node .agents/scripts/mcp-bridge.mjs call filesystem search '{"pattern": "*.ts", "root": "."}'

# List directory
node .agents/scripts/mcp-bridge.mjs call filesystem list_directory '{"path": "."}'

# Memory (knowledge graph)
node .agents/scripts/mcp-bridge.mjs call memory search_nodes '{"query": "project"}'

# Sequential thinking
node .agents/scripts/mcp-bridge.mjs call sequential-thinking think '{"thought": "Analyzing...", "nextThoughtNeeded": true, "thoughtNumber": 1, "totalThoughts": 3}'
```

## Built-in MCP Servers

The `.mcp.json` includes these pre-configured servers:

| Server | Package | Purpose | Auth Required |
|--------|---------|---------|---------------|
| **filesystem** | `@modelcontextprotocol/server-filesystem` | Secure file read/write/search | No |
| **memory** | `@modelcontextprotocol/server-memory` | Persistent knowledge graph | No |
| **sequential-thinking** | `@modelcontextprotocol/server-sequential-thinking` | Step-by-step reasoning chains | No |
| **github** | `@modelcontextprotocol/server-github` | GitHub API (repos, issues, PRs) | GITHUB_TOKEN |
| **postgres** | `@modelcontextprotocol/server-postgres` | Database queries | DB URL |
| **brave-search** | `@modelcontextprotocol/server-brave-search` | Web search | BRAVE_API_KEY |

## Adding New MCP Servers

1. Install the server package (most are available via `npx -y`)
2. Add the configuration to `.mcp.json`:

```json
{
  "mcpServers": {
    "my-server": {
      "description": "What this server does",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name", "arg1", "arg2"],
      "env": {
        "API_KEY": ""
      },
      "disabled": false
    }
  }
}
```

## Available MCP Servers to Add

Browse available MCP servers at:
- **Official Registry:** https://registry.modelcontextprotocol.io/
- **Community Directory:** https://mcp.so/
- **Official Servers Repo:** https://github.com/modelcontextprotocol/servers

Popular ones to consider:

| Server | Use Case |
|--------|----------|
| `puppeteer` | Browser automation, web scraping |
| `sqlite` | SQLite database interactions |
| `redis` | Redis cache operations |
| `slack` | Slack messaging and channels |
| `excel` | Excel file manipulation |
| `notion` | Notion workspace integration |
| `figma` | Figma design file queries |

## When to Use MCP vs Freebuff's Built-in Tools

| Task | Better With |
|------|-------------|
| Read/write files in project | Freebuff's built-in tools (faster, no overhead) |
| Search codebase | Freebuff's code-searcher or MCP filesystem |
| Web search / browse docs | MCP brave-search |
| GitHub operations | MCP github server |
| Database queries | MCP postgres server |
| Persistent knowledge graph | MCP memory server |
| Complex reasoning chains | MCP sequential-thinking |
| External API interactions | MCP custom server |

## Troubleshooting

### "Unknown server" error
The server name must match a key in `.mcp.json` exactly.

### "Server is disabled"
Set `"disabled": false` in `.mcp.json` for that server.

### "Missing env vars"
Set the required environment variables in the `env` field of `.mcp.json` or export them in your shell.

### "Server startup timeout"
Some MCP servers may take time to download via `npx -y` on first use. The bridge has a 10-second startup timeout by default.

### Windows compatibility
On Windows, the bridge automatically uses `shell: true` for spawned processes. If you encounter issues, try setting the command to use `cmd /c`:

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-filesystem", "."]
}
```
