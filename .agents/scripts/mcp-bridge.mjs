#!/usr/bin/env node

/**
 * MCP Bridge - Freebuff MCP Adapter
 * 
 * A CLI bridge that manages MCP (Model Context Protocol) server processes
 * and provides a unified interface for AI agents to discover and call MCP tools.
 *
 * Usage:
 *   node mcp-bridge.mjs list-servers            # List configured MCP servers
 *   node mcp-bridge.mjs list-tools <server>      # List tools on a server
 *   node mcp-bridge.mjs call <server> <tool> ...  # Call a tool with arguments
 *   node mcp-bridge.mjs status                   # Check server status
 *   node mcp-bridge.mjs install <server>         # Install an MCP server package
 */

import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../../');
const CONFIG_PATH = resolve(PROJECT_ROOT, '.mcp.json');
const SERVER_TIMEOUT = 30000; // 30s timeout for server operations

// ─── Logging ─────────────────────────────────────────

const LOG_PREFIX = '[MCP-Bridge]';
const log = {
  info: (msg) => console.error(`${LOG_PREFIX} ${msg}`),
  warn: (msg) => console.error(`${LOG_PREFIX} ⚠ ${msg}`),
  error: (msg) => console.error(`${LOG_PREFIX} ✗ ${msg}`),
  debug: (msg) => process.env.DEBUG_MCP && console.error(`${LOG_PREFIX} ▸ ${msg}`),
};

// ─── Config ──────────────────────────────────────────

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return { mcpServers: {}, version: '1.0', defaultServer: null };
  }
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    log.error(`Failed to parse config: ${err.message}`);
    return { mcpServers: {}, version: '1.0', defaultServer: null };
  }
}

function getConfiguredServers() {
  const config = loadConfig();
  const servers = [];
  for (const [name, server] of Object.entries(config.mcpServers || {})) {
    servers.push({
      name,
      description: server.description || '',
      disabled: server.disabled || false,
      command: server.command,
      args: server.args || [],
      hasEnv: Object.keys(server.env || {}).length > 0,
      missingEnv: getMissingEnvVars(server.env || {}),
    });
  }
  return servers;
}

function getServerConfig(name) {
  const config = loadConfig();
  const server = config.mcpServers?.[name];
  if (!server) return null;
  return {
    name,
    ...server,
    missingEnv: getMissingEnvVars(server.env || {}),
  };
}

function getMissingEnvVars(env) {
  const missing = [];
  for (const [key, value] of Object.entries(env)) {
    if (!value || value === '') {
      missing.push(key);
    }
  }
  return missing;
}

// ─── JSON-RPC over stdio ─────────────────────────────

/**
 * Send a JSON-RPC message to an MCP server process and wait for a response.
 * Implements the MCP transport protocol over stdio.
 */
function sendMessage(process, message, timeout = SERVER_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const id = message.id || Date.now();
    const request = JSON.stringify({ ...message, id }) + '\n';

    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout}ms: ${message.method || message.type}`));
    }, timeout);

    // Buffer for incoming data
    let buffer = '';
    let resolved = false;

    const onData = (chunk) => {
      // Clear timer and bail early if already resolved (prevents double-reject races)
      if (resolved) return;
      clearTimeout(timer);

      buffer += chunk.toString();
      
      // Process complete JSON-RPC messages (newline-delimited)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete data in buffer

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const response = JSON.parse(line);

          // We care about responses matching our request ID
          if (response.id === id) {
            resolved = true;
            cleanup();
            if (response.error) {
              reject(new Error(`MCP Error: ${response.error.message || JSON.stringify(response.error)}`));
            } else {
              resolve(response.result);
            }
            return;
          }

          // Handle notifications (no ID) - we log but don't resolve
          if (!response.id && response.method === 'notifications/message') {
            log.debug(`Notification: ${response.params?.message || JSON.stringify(response)}`);
          }
        } catch (e) {
          log.debug(`Failed to parse JSON: ${line}`);
        }
      }
    };

    const onError = (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        cleanup();
        reject(new Error(`Process error: ${err.message}`));
      }
    };

    const onClose = (code) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        cleanup();
        reject(new Error(`Process exited with code ${code} before responding`));
      }
    };

    const cleanup = () => {
      process.stdout.removeListener('data', onData);
      process.stderr?.removeListener('data', onError);
      process.removeListener('close', onClose);
      process.removeListener('error', onError);
    };

    process.stdout.on('data', onData);
    process.stderr?.on('data', (data) => log.debug(`Server stderr: ${data.toString().trim()}`));
    process.on('close', onClose);
    process.on('error', onError);

    // Send the request
    log.debug(`Sending: ${JSON.stringify({ ...message, id }).slice(0, 200)}`);
    process.stdin.write(request);
  });
}

// ─── MCP Server Lifecycle ────────────────────────────

/**
 * Start an MCP server process.
 */
function startServer(name) {
  const config = getServerConfig(name);
  if (!config) {
    throw new Error(`Unknown MCP server: ${name}`);
  }
  if (config.disabled) {
    throw new Error(`MCP server "${name}" is disabled`);
  }
  if (config.missingEnv.length > 0) {
    throw new Error(
      `MCP server "${name}" requires env vars: ${config.missingEnv.join(', ')}. ` +
      `Set them in .mcp.json or export them in your shell.`
    );
  }

  log.info(`Starting MCP server: ${name} (${config.command} ${config.args.slice(0, 3).join(' ')}...)`);

  const env = { ...process.env, ...(config.env || {}) };
  let proc;

  if (process.platform === 'win32' && config.command === 'npx') {
    // Windows: npx needs cmd /c wrapper for proper argument handling
    const cmdLine = [config.command, ...config.args]
      .map(a => a.includes(' ') ? `"${a}"` : a)
      .join(' ');
    proc = spawn('cmd.exe', ['/d', '/s', '/c', cmdLine], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env,
      windowsHide: true,
    });
  } else {
    proc = spawn(config.command, config.args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env,
      windowsHide: true,
    });
  }

  proc.on('error', (err) => {
    log.error(`Failed to start server "${name}": ${err.message}`);
  });

  // Log server output to debug
  proc.stderr?.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) log.debug(`[${name}] ${msg}`);
  });

  return proc;
}

/**
 * Initialize an MCP server connection (send initialize + notifications/initialized).
 */
async function initializeServer(proc, timeout = 10000) {
  log.debug('Sending initialize request...');

  const result = await sendMessage(proc, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
      clientInfo: {
        name: 'freebuff-mcp-adapter',
        version: '1.0.0',
      },
    },
  }, timeout);

  // Send initialized notification (fire and forget)
  try {
    proc.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    }) + '\n');
  } catch (e) {
    // Ignore - notification is fire-and-forget
  }

  log.debug(`Server initialized: ${result?.serverInfo?.name || 'unknown'} v${result?.serverInfo?.version || '?'}`);
  return result;
}

/**
 * List tools available on an MCP server.
 */
async function listTools(proc) {
  log.debug('Listing tools...');
  const tools = await sendMessage(proc, {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
  });
  return tools?.tools || [];
}

/**
 * Call a specific tool on an MCP server.
 */
async function callTool(proc, toolName, args = {}) {
  log.debug(`Calling tool: ${toolName}...`);
  const result = await sendMessage(proc, {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args,
    },
  });
  return result;
}

// ─── High-level operations ───────────────────────────

async function withServer(name, operation) {
  let proc = null;
  try {
    proc = startServer(name);

    // Give the process a moment to start (npx may need to download the package)
    await new Promise(r => setTimeout(r, 3000));

    // Use longer timeout for initialization since npx may need to download packages
    await initializeServer(proc, 30000);
    const result = await operation(proc);
    return result;
  } finally {
    if (proc && !proc.killed) {
      // Close stdin to signal we're done sending requests
      try { proc.stdin.end(); } catch {}
      proc.kill('SIGTERM');
      // Force kill after 3s (important on Windows where SIGTERM is not a real signal)
      setTimeout(() => {
        if (proc && !proc.killed) {
          try { proc.kill('SIGKILL'); } catch {}
        }
      }, 3000);
    }
  }
}

// ─── CLI Commands ────────────────────────────────────

async function cmdListServers() {
  const servers = getConfiguredServers();
  
  if (servers.length === 0) {
    console.log(JSON.stringify({
      status: 'empty',
      message: 'No MCP servers configured. Edit .mcp.json to add servers.',
      servers: [],
    }, null, 2));
    return;
  }

  const enriched = servers.map(s => ({
    name: s.name,
    description: s.description,
    status: s.disabled ? 'disabled' : (s.missingEnv.length > 0 ? 'needs_config' : 'ready'),
    command: `${s.command} ${s.args.join(' ')}`,
    missingEnv: s.missingEnv,
  }));

  console.log(JSON.stringify({
    status: 'ok',
    count: enriched.length,
    default: loadConfig().defaultServer || enriched[0]?.name,
    servers: enriched,
  }, null, 2));
}

async function cmdListTools(serverName) {
  if (!serverName) {
    console.log(JSON.stringify({ status: 'error', message: 'Usage: mcp-bridge.mjs list-tools <server-name>' }));
    process.exit(1);
  }

  const config = getServerConfig(serverName);
  if (!config) {
    console.log(JSON.stringify({ status: 'error', message: `Unknown server: "${serverName}". Use "list-servers" to see available servers.` }));
    process.exit(1);
  }

  try {
    const tools = await withServer(serverName, listTools);
    console.log(JSON.stringify({
      status: 'ok',
      server: serverName,
      toolCount: tools.length,
      tools: tools.map(t => ({
        name: t.name,
        description: t.description || '',
        inputSchema: t.inputSchema || {},
      })),
    }, null, 2));
  } catch (err) {
    console.log(JSON.stringify({
      status: 'error',
      server: serverName,
      message: err.message,
      hint: `Make sure the server package is installed. Try: npm install -g @modelcontextprotocol/server-${serverName}`,
    }, null, 2));
    process.exit(1);
  }
}

async function cmdCall(serverName, toolName, ...args) {
  if (!serverName || !toolName) {
    console.log(JSON.stringify({ 
      status: 'error', 
      message: 'Usage: mcp-bridge.mjs call <server-name> <tool-name> [args-json]' 
    }));
    process.exit(1);
  }

  const config = getServerConfig(serverName);
  if (!config) {
    console.log(JSON.stringify({ status: 'error', message: `Unknown server: "${serverName}"` }));
    process.exit(1);
  }

  // Parse arguments - either as JSON string or as key=value pairs
  let toolArgs = {};
  const joined = args.join(' ');
  if (joined) {
    try {
      toolArgs = JSON.parse(joined);
    } catch {
      // Try parsing as key=value pairs
      for (const arg of args) {
        const eqIdx = arg.indexOf('=');
        if (eqIdx > 0) {
          toolArgs[arg.slice(0, eqIdx)] = arg.slice(eqIdx + 1);
        }
      }
    }
  }

  try {
    const result = await withServer(serverName, (proc) => callTool(proc, toolName, toolArgs));
    console.log(JSON.stringify({
      status: 'ok',
      server: serverName,
      tool: toolName,
      arguments: toolArgs,
      result: result,
    }, null, 2));
  } catch (err) {
    console.log(JSON.stringify({
      status: 'error',
      server: serverName,
      tool: toolName,
      message: err.message,
    }, null, 2));
    process.exit(1);
  }
}

async function cmdStatus() {
  const config = loadConfig();
  const servers = getConfiguredServers();
  
  // Try connecting to each enabled server briefly
  const serverStatuses = [];
  for (const server of servers) {
    if (server.disabled) {
      serverStatuses.push({ name: server.name, status: 'disabled' });
      continue;
    }
    if (server.missingEnv.length > 0) {
      serverStatuses.push({ name: server.name, status: 'needs_config', missingEnv: server.missingEnv });
      continue;
    }

    try {
      await withServer(server.name, async (proc) => {
        const init = await initializeServer(proc, 5000);
        const tools = await listTools(proc);
        serverStatuses.push({
          name: server.name,
          status: 'connected',
          serverInfo: init?.serverInfo || {},
          toolCount: tools.length,
          tools: tools.map(t => ({ name: t.name, description: t.description })),
        });
      });
    } catch (err) {
      serverStatuses.push({ name: server.name, status: 'error', error: err.message });
    }
  }

  console.log(JSON.stringify({
    status: 'ok',
    configVersion: config.version || '1.0',
    defaultServer: config.defaultServer || null,
    serverCount: serverStatuses.length,
    servers: serverStatuses,
  }, null, 2));
}

async function cmdInstall(serverName) {
  if (!serverName) {
    console.log(JSON.stringify({ status: 'error', message: 'Usage: mcp-bridge.mjs install <server-name>' }));
    process.exit(1);
  }

  const pkgName = serverName.startsWith('@modelcontextprotocol/') 
    ? serverName 
    : `@modelcontextprotocol/server-${serverName}`;

  log.info(`Installing MCP server package: ${pkgName}...`);
  
  try {
    const { execSync } = await import('node:child_process');
    execSync(`npx -y ${pkgName} --help 2>&1 || true`, { 
      stdio: 'pipe',
      timeout: 60000,
    });
    console.log(JSON.stringify({
      status: 'ok',
      message: `MCP server "${serverName}" (${pkgName}) is available`,
      command: `npx -y ${pkgName}`,
    }, null, 2));
  } catch (err) {
    console.log(JSON.stringify({
      status: 'error',
      message: `Failed to install/verify MCP server: ${err.message}`,
      hint: `Try: npx -y ${pkgName}`,
    }, null, 2));
  }
}

// ─── Main ────────────────────────────────────────────

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  log.info(`Command: ${command} ${args.join(' ')}`);

  switch (command) {
    case 'list-servers':
    case 'servers':
    case 'ls':
      await cmdListServers();
      break;

    case 'list-tools':
    case 'tools':
    case 'ls-tools':
      await cmdListTools(args[0]);
      break;

    case 'call':
    case 'run':
      await cmdCall(args[0], args[1], ...args.slice(2));
      break;

    case 'status':
    case 'check':
      await cmdStatus();
      break;

    case 'install':
      await cmdInstall(args[0]);
      break;

    case 'help':
    case '--help':
    case '-h':
      console.log(`
MCP Bridge - Connect Freebuff to MCP servers

  Commands:
    list-servers (ls)      List configured MCP servers
    list-tools <server>    List tools on a server
    call <server> <tool>   Call a tool with arguments
    status (check)         Check server connection status
    install <server>       Install/verify MCP server package
    help                   Show this help

  Examples:
    mcp-bridge.mjs ls
    mcp-bridge.mjs tools filesystem
    mcp-bridge.mjs call filesystem read_allowed_directories
    mcp-bridge.mjs call filesystem search '{"pattern": "*.ts", "root": "."}'
    mcp-bridge.mjs status
`);
      break;

    default:
      console.log(JSON.stringify({
        status: 'error',
        message: `Unknown command: "${command}". Use "help" to see available commands.`,
      }, null, 2));
      process.exit(1);
  }
}

main().catch((err) => {
  log.error(`Unhandled error: ${err.message}`);
  console.log(JSON.stringify({ status: 'error', message: err.message }, null, 2));
  process.exit(1);
});
