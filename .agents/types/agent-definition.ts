/**
 * TypeScript type definitions for Freebuff/Codebuff custom agents.
 * 
 * These are reference types for building custom agents in the `.agents/` directory.
 * See: https://github.com/CodebuffAI/codebuff
 */

// ─── Agent Definition ────────────────────────────────

export interface AgentDefinition {
  /** Unique identifier for this agent */
  id: string;
  
  /** Human-readable name shown in the UI */
  displayName: string;
  
  /** Brief description of what this agent does */
  description?: string;
  
  /** AI model to use for this agent (e.g., "openai/gpt-5-nano") */
  model?: string;
  
  /** List of tool names this agent is allowed to use */
  toolNames: string[];
  
  /** System prompt / instructions for the agent's AI model */
  instructionsPrompt: string;
  
  /**
   * Generator-based step handler for programmatic control flow.
   * Can yield tool calls and AI generation steps.
   */
  handleSteps?: () => AsyncGenerator<
    | { tool: string; [key: string]: unknown }
    | typeof STEP_ALL,
    void,
    unknown
  >;
}

/** Sentinel value: hand control over to the LLM to complete the step */
export const STEP_ALL = 'STEP_ALL' as const;
export type StepAll = typeof STEP_ALL;

// ─── Built-in Tools ──────────────────────────────────

export type BuiltinToolName =
  | 'run_terminal_command'
  | 'read_files'
  | 'write_file'
  | 'str_replace'
  | 'end_turn'
  | 'list_directory'
  | 'glob'
  | 'code_search'
  | 'ask_user'
  | 'spawn_agents'
  | 'skill';

// ─── Tool Definitions ────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

// ─── Agent Configuration ─────────────────────────────

export interface AgentConfig {
  /** Map of agent IDs to their definitions */
  agents: Record<string, AgentDefinition>;
  
  /** Default agent to use when none is specified */
  defaultAgent?: string;
}
