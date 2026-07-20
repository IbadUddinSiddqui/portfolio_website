#!/usr/bin/env node

/**
 * Session Manager — Cross-Session Continuity System
 *
 * Maintains project context across Freebuff conversations so each new session
 * seamlessly continues from where the last one ended.
 *
 * Architecture:
 *   .session/state.json        ← Structured state (canonical source)
 *   .session/SESSION_CONTEXT.md ← Human-readable context (regenerated from state)
 *   MCP Memory Server          ← Knowledge graph persistence
 *
 * Usage:
 *   node .session/session.mjs restore          # Output full context for session start
 *   node .session/session.mjs status           # Quick status summary
 *   node .session/session.mjs update <json>    # Record a new action
 *   node .session/session.mjs next <json>      # Set next steps
 *   node .session/session.mjs decision <json>  # Log a decision
 *   node .session/session.mjs sync-memory      # Sync state to MCP memory server
 *   node .session/session.mjs regenerate       # Regenerate SESSION_CONTEXT.md from state
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = resolve(__dirname, 'state.json');
const CONTEXT_PATH = resolve(__dirname, 'SESSION_CONTEXT.md');
const MCP_BRIDGE = resolve(__dirname, '../.agents/scripts/mcp-bridge.mjs');

const LOG_PREFIX = '[Session]';
const log = {
  info: (msg) => console.error(`${LOG_PREFIX} ${msg}`),
  error: (msg) => console.error(`${LOG_PREFIX} ✗ ${msg}`),
  ok: (msg) => console.error(`${LOG_PREFIX} ✓ ${msg}`),
};

// ─── Load / Save State ──────────────────────────────

function loadState() {
  if (!existsSync(STATE_PATH)) {
    log.error('state.json not found. Creating default...');
    const defaultState = {
      session: { version: '1.0.0', lastUpdated: new Date().toISOString(), lastSessionId: '', sessionCount: 0 },
      project: { name: 'Unnamed Project', goal: 'TBD', description: '', techStack: {}, status: 'initializing' },
      currentState: { phase: 'Setup', lastAction: 'Initialized session system', lastActionTimestamp: '', currentFile: '' },
      phases: [],
      nextSteps: [],
      blockers: [],
      knownIssues: [],
      decisions: [],
      history: [],
      techNotes: {},
    };
    saveState(defaultState);
    return defaultState;
  }
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf-8'));
  } catch (err) {
    log.error(`Failed to parse state.json: ${err.message}`);
    throw err;
  }
}

function saveState(state) {
  state.session.lastUpdated = new Date().toISOString();
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8');
  log.ok('state.json saved');
}

// ─── ID Generation ──────────────────────────────────

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Commands ───────────────────────────────────────

/**
 * Restore: Output the complete session context as JSON.
 * This is intended to be read at the start of each new session.
 */
function cmdRestore() {
  const state = loadState();

  // Increment session count and save
  state.session.sessionCount++;
  state.session.lastSessionId = state.session.lastUpdated || '';
  saveState(state);

  // Build a focused restore payload
  const restore = {
    session: {
      sessionNumber: state.session.sessionCount + 1,
      lastSession: state.session.lastSessionId,
      lastUpdated: state.session.lastUpdated,
    },
    project: {
      name: state.project.name,
      goal: state.project.goal,
      status: state.project.status,
      techStack: state.project.techStack,
    },
    currentState: state.currentState,
    recentActions: state.history.slice(-5).reverse(),
    nextSteps: state.nextSteps,
    blockers: state.blockers,
    knownIssues: state.knownIssues,
    phaseProgress: state.phases.map(p => ({
      name: p.name,
      status: p.status,
      completed: p.completedItems.length,
      remaining: p.remainingItems.length,
    })),
    decisions: state.decisions.filter(d => d.confirmed).slice(-10),
  };

  console.log(JSON.stringify(restore, null, 2));
}

/**
 * Status: Quick summary of current state.
 */
function cmdStatus() {
  const state = loadState();
  const completedTotal = state.phases.reduce((a, p) => a + p.completedItems.length, 0);
  const remainingTotal = state.phases.reduce((a, p) => a + p.remainingItems.length, 0);
  const progress = remainingTotal > 0
    ? Math.round((completedTotal / (completedTotal + remainingTotal)) * 100)
    : 0;

  console.log(JSON.stringify({
    status: 'ok',
    project: state.project.name,
    phase: state.currentState.phase,
    progress: `${progress}%`,
    lastAction: state.currentState.lastAction,
    totalActions: state.history.length,
    decisions: state.decisions.length,
    nextSteps: state.nextSteps,
    blockers: state.blockers,
  }, null, 2));
}

/**
 * Update: Record a new action/change in the session history.
 * Usage: node session.mjs update '{ "action": "...", "details": "...", "files": ["..."], "type": "create|update|fix|verify|delete" }'
 */
function cmdUpdate(args) {
  const state = loadState();
  const input = parseArgs(args);

  if (!input.action) {
    console.log(JSON.stringify({ status: 'error', message: 'Missing required field: action' }));
    process.exit(1);
  }

  const entry = {
    id: generateId('action'),
    timestamp: new Date().toISOString(),
    type: input.type || 'update',
    action: input.action,
    details: input.details || '',
    files: input.files || [],
  };

  state.history.push(entry);
  state.currentState.lastAction = input.action;
  state.currentState.lastActionTimestamp = entry.timestamp;
  state.currentState.phase = input.phase || state.currentState.phase;
  state.currentState.currentFile = input.currentFile || state.currentState.currentFile;

  // Update phase progress if specified
  if (input.completedPhaseItem) {
    for (const phase of state.phases) {
      const idx = phase.remainingItems.indexOf(input.completedPhaseItem);
      if (idx !== -1) {
        phase.remainingItems.splice(idx, 1);
        phase.completedItems.push(input.completedPhaseItem);
        if (phase.remainingItems.length === 0 && phase.status === 'not-started') {
          phase.status = 'completed';
        } else if (phase.status === 'not-started') {
          phase.status = 'in-progress';
        }
        log.ok(`Phase "${phase.name}" updated`);
      }
    }
  }

  // Update project status if needed
  if (input.projectStatus) {
    state.project.status = input.projectStatus;
  }

  // Update next steps if provided
  if (input.replaceNextSteps) {
    state.nextSteps = input.replaceNextSteps;
  }

  // Clear blockers if resolved
  if (input.resolvedBlockers) {
    state.blockers = state.blockers.filter(b => !input.resolvedBlockers.includes(b));
  }

  saveState(state);
  log.ok(`Action recorded: ${input.action}`);

  console.log(JSON.stringify({
    status: 'ok',
    actionId: entry.id,
    action: input.action,
    totalActions: state.history.length,
  }, null, 2));
}

/**
 * Next: Set the next steps to take.
 * Usage: node session.mjs next '{ "steps": ["...", "..."], "phase": "Phase Name" }'
 */
function cmdNext(args) {
  const state = loadState();
  const input = parseArgs(args);

  if (!input.steps) {
    console.log(JSON.stringify({ status: 'error', message: 'Missing required field: steps (array)' }));
    process.exit(1);
  }

  state.nextSteps = input.steps;
  if (input.phase) {
    state.currentState.phase = input.phase;
  }

  saveState(state);
  log.ok(`Next steps updated (${input.steps.length} steps)`);

  console.log(JSON.stringify({
    status: 'ok',
    nextSteps: state.nextSteps,
    phase: state.currentState.phase,
  }, null, 2));
}

/**
 * Decision: Log a new architecture/design decision.
 * Usage: node session.mjs decision '{ "decision": "...", "rationale": "...", "alternatives": ["..."], "confirmed": true }'
 */
function cmdDecision(args) {
  const state = loadState();
  const input = parseArgs(args);

  if (!input.decision || !input.rationale) {
    console.log(JSON.stringify({ status: 'error', message: 'Missing required fields: decision, rationale' }));
    process.exit(1);
  }

  const entry = {
    id: generateId('decision'),
    timestamp: new Date().toISOString(),
    decision: input.decision,
    rationale: input.rationale,
    alternatives: input.alternatives || [],
    confirmed: input.confirmed !== undefined ? input.confirmed : true,
  };

  state.decisions.push(entry);
  saveState(state);
  log.ok(`Decision logged: ${input.decision}`);

  console.log(JSON.stringify({
    status: 'ok',
    decisionId: entry.id,
    decision: input.decision,
    totalDecisions: state.decisions.length,
  }, null, 2));
}

/**
 * Blockers: Add or remove blockers.
 * Usage: node session.mjs blockers '{ "add": ["..."], "remove": ["..."] }'
 */
function cmdBlockers(args) {
  const state = loadState();
  const input = parseArgs(args);

  if (input.add) {
    for (const blocker of input.add) {
      if (!state.blockers.includes(blocker)) {
        state.blockers.push(blocker);
        log.warn(`Blocker added: ${blocker}`);
      }
    }
  }

  if (input.remove) {
    state.blockers = state.blockers.filter(b => !input.remove.includes(b));
    for (const b of input.remove) {
      log.ok(`Blocker resolved: ${b}`);
    }
  }

  saveState(state);
  console.log(JSON.stringify({
    status: 'ok',
    blockers: state.blockers,
  }, null, 2));
}

/**
 * Sync Memory: Sync session state to the MCP memory server knowledge graph.
 */
async function cmdSyncMemory() {
  const state = loadState();
  const { spawn } = await import('node:child_process');

  log.info('Syncing session state to MCP memory server...');

  // Store project entity
  const projectObservations = [
    `Goal: ${state.project.goal}`,
    `Status: ${state.project.status}`,
    `Phase: ${state.currentState.phase}`,
    `Last Action: ${state.currentState.lastAction}`,
    `Total Actions: ${state.history.length}`,
    `Total Decisions: ${state.decisions.length}`,
    `Next Steps: ${state.nextSteps.join(', ')}`,
  ];

  // Use the MCP bridge to store data
  const storeEntity = (name, type, observations) => {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [
        MCP_BRIDGE, 'call', 'memory', 'create_entities',
        JSON.stringify({
          entities: [{ name, entityType: type, observations }]
        })
      ], { stdio: ['pipe', 'pipe', 'pipe'] });

      let output = '';
      child.stdout.on('data', (data) => { output += data; });
      child.on('close', (code) => {
        if (code === 0) resolve(JSON.parse(output));
        else reject(new Error(`Exit code ${code}: ${output}`));
      });
      child.on('error', reject);
    });
  };

  try {
    await storeEntity('PortfolioProject', 'Project', projectObservations);

    // Store each phase as a related entity
    for (const phase of state.phases) {
      const phaseObs = [
        `Status: ${phase.status}`,
        `Completed: ${phase.completedItems.length}`,
        `Remaining: ${phase.remainingItems.length}`,
      ];
      await storeEntity(`Phase-${phase.name.replace(/[^a-zA-Z0-9]/g, '-')}`, 'Phase', phaseObs);
    }

    log.ok('Session state synced to MCP memory server');
    console.log(JSON.stringify({ status: 'ok', message: 'State synced to memory server' }, null, 2));
  } catch (err) {
    log.error(`Failed to sync memory: ${err.message}`);
    console.log(JSON.stringify({ status: 'error', message: err.message }, null, 2));
  }
}

/**
 * Regenerate: Rebuild SESSION_CONTEXT.md from state.json.
 */
function cmdRegenerate() {
  const state = loadState();

  const phaseStatusIcon = { 'not-started': '⏳', 'in-progress': '🔄', completed: '✅', partial: '🔄' };
  const phaseRows = state.phases.map(p =>
    `| ${p.name} | ${phaseStatusIcon[p.status] || '⏳'} ${p.status} |`
  ).join('\n');

  const decisionRows = state.decisions.filter(d => d.confirmed).slice(-10).map((d, i) =>
    `| ${i + 1} | **${d.decision}** | ${d.rationale} |`
  ).join('\n');

  const recentActions = state.history.slice(-8).reverse().map(a =>
    `1. **${a.action}** — ${a.details}`
  ).join('\n');

  const nextSteps = state.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n');

  const context = `# Session Context — ${state.project.name}

> **Last Updated:** ${new Date(state.session.lastUpdated).toLocaleString()}  
> **Session #${state.session.sessionCount + 1}**  
> **Purpose:** Seamless continuation between Freebuff sessions.

---

## 🎯 Project Goal

${state.project.goal}

**Status:** \`${state.project.status}\`

---

## 📋 Current State

| Field | Value |
|-------|-------|
| **Phase** | ${state.currentState.phase} |
| **Last Action** | ${state.currentState.lastAction} |
| **Last Action At** | ${state.currentState.lastActionTimestamp || 'N/A'} |
| **Total Actions** | ${state.history.length} |
| **Total Decisions** | ${state.decisions.length} |
| **Blockers** | ${state.blockers.length > 0 ? state.blockers.join(', ') : 'None'} |

---

## 🔜 Next Steps

${nextSteps || 'None defined.'}

---

## 📐 Key Decisions

| # | Decision | Rationale |
|---|----------|-----------|
${decisionRows}

---

## 🔌 MCP Server Status

| Server | Status |
|--------|--------|
| memory | ✅ Working (9 tools) |
| filesystem | ⛔ Disabled (needs zod fix) |
| sequential-thinking | ⛔ Disabled (needs zod fix) |
| github | 🔒 Needs GITHUB_TOKEN |
| postgres | 🔒 Needs DB URL |
| brave-search | 🔒 Needs BRAVE_API_KEY |

---

## 📝 Recent Actions

${recentActions}

---

## 📋 Phase Progress

| Phase | Status |
|-------|--------|
${phaseRows}

---

## ⚠️ Known Issues

${state.knownIssues.map(i => `- ${i}`).join('\n') || 'None'}

---

## 📁 Key Files

- \`ARCHITECTURE.md\` — Full architecture plan
- \`.mcp.json\` — MCP server configuration
- \`.agents/mcp-adapter.ts\` — Freebuff MCP agent
- \`.agents/scripts/mcp-bridge.mjs\` — MCP bridge CLI
- \`.session/state.json\` — Session state (canonical)
- \`.session/session.mjs\` — Session manager
- \`.session/SESSION_CONTEXT.md\` — This file

---

*Auto-generated from \`.session/state.json\`. Update via: \`node .session/session.mjs update '{"action":"..."}'\`*
`;

  writeFileSync(CONTEXT_PATH, context, 'utf-8');
  log.ok('SESSION_CONTEXT.md regenerated');
  console.log(JSON.stringify({ status: 'ok', message: 'SESSION_CONTEXT.md regenerated' }, null, 2));
}

/**
 * Quick-record: One-line shorthand for recording an action + regenerating context.
 * node session.mjs did "Built the Hero section" --type create --files "Hero.tsx,hero.css"
 */
function cmdQuickRecord(args) {
  const input = parseArgs(args);
  if (!input._action) {
    console.log(JSON.stringify({ status: 'error', message: 'Usage: session.mjs did "What you did" [--type create] [--files "f1,f2"]' }));
    process.exit(1);
  }

  cmdUpdate({
    action: input._action,
    type: input.type || 'update',
    details: input.details || '',
    files: input.files ? input.files.split(',').map(f => f.trim()) : [],
    phase: input.phase || undefined,
    completedPhaseItem: input.completed || undefined,
    replaceNextSteps: input.nextSteps ? input.nextSteps.split(';').map(s => s.trim()) : undefined,
  });

  cmdRegenerate();
}

// ─── Utility ─────────────────────────────────────────

function parseArgs(args) {
  // If args is already an object (called programmatically), return as-is
  if (args && typeof args === 'object' && !Array.isArray(args)) return args;

  // Get the argument array
  const argsArray = Array.isArray(args) ? args : process.argv.slice(3);
  const raw = argsArray.join(' ');

  // Try parsing entire input as JSON
  try {
    return JSON.parse(raw);
  } catch {
    // Not JSON — parse as flags and values
    const result = {};
    for (let i = 0; i < argsArray.length; i++) {
      const arg = argsArray[i];
      
      if (arg.startsWith('--')) {
        const eqIdx = arg.indexOf('=');
        if (eqIdx > 0) {
          // --flag=value syntax
          const key = arg.slice(2, eqIdx);
          result[key] = arg.slice(eqIdx + 1);
        } else if (i + 1 < argsArray.length && !argsArray[i + 1].startsWith('--')) {
          // --flag value syntax (look-ahead for the value)
          result[arg.slice(2)] = argsArray[++i];
        } else {
          // --flag with no value (boolean flag)
          result[arg.slice(2)] = true;
        }
      } else if (!result._action) {
        // First non-flag argument is the action description
        result._action = arg;
      }
    }
    return result;
  }
}

// ─── Main ────────────────────────────────────────────

async function main() {
  const command = process.argv[2];

  if (!command || command === 'help' || command === '--help') {
    console.log(`
Session Manager — Cross-Session Continuity System

  Commands:
    restore               Output full session context as JSON (read at session start)
    status                Quick status summary
    update <json>         Record a new action/change
    next <json>           Set next steps
    decision <json>       Log a design/architecture decision
    blockers <json>       Add or remove blockers
    sync-memory           Sync state to MCP memory server
    regenerate            Regenerate SESSION_CONTEXT.md from state.json
    did <action> [flags]  Quick record + regenerate (shorthand)

  Examples:
    node .session/session.mjs restore
    node .session/session.mjs update '{"action":"Built Hero section","type":"create","files":["Hero.tsx"]}'
    node .session/session.mjs next '{"steps":["Build admin panel","Add auth"],"phase":"Phase 3"}'
    node .session/session.mjs decision '{"decision":"Use NextAuth","rationale":"Built-in Next.js support","alternatives":["Clerk","Auth0"]}'
    node .session/session.mjs blockers '{"remove":["zod dependency"]}'
    node .session/session.mjs did "Built the Hero section" --type create --files "Hero.tsx"
    node .session/session.mjs sync-memory
    node .session/session.mjs regenerate
`);
    return;
  }

  switch (command) {
    case 'restore':
      cmdRestore();
      break;
    case 'status':
      cmdStatus();
      break;
    case 'update':
      cmdUpdate(process.argv.slice(3));
      break;
    case 'next':
      cmdNext(process.argv.slice(3));
      break;
    case 'decision':
      cmdDecision(process.argv.slice(3));
      break;
    case 'blockers':
      cmdBlockers(process.argv.slice(3));
      break;
    case 'sync-memory':
      await cmdSyncMemory();
      break;
    case 'regenerate':
      cmdRegenerate();
      break;
    case 'did':
      cmdQuickRecord(process.argv.slice(3));
      break;
    default:
      console.log(JSON.stringify({ status: 'error', message: `Unknown command: "${command}". Use "help" for usage.` }));
      process.exit(1);
  }
}

main().catch((err) => {
  log.error(`Unhandled error: ${err.message}`);
  console.log(JSON.stringify({ status: 'error', message: err.message }));
  process.exit(1);
});
