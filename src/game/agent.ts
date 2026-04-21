import { Commission } from './commission';

// ── Model tiers ──────────────────────────────────────────────────────────────

export type ModelTierId = '1B' | '8B' | '30B';

export interface ModelTier {
  id: ModelTierId;
  effortPerSec: number;
  tokenCost: number;
  maxDifficulty: number; // commissions with difficulty > this value cannot use this tier
}

// Tunable constants — change these without touching any other logic.
const COST_1B   = 100;
const COST_8B   = 400;
const COST_30B  = 1_200;

const EFFORT_PER_SEC_1B  = 5;
const EFFORT_PER_SEC_8B  = 15;
const EFFORT_PER_SEC_30B = 40;

// Difficulty thresholds: easy=50, medium=150, hard=400
const MAX_DIFFICULTY_1B  = 100; // easy only
const MAX_DIFFICULTY_8B  = 300; // easy + medium
const MAX_DIFFICULTY_30B = Infinity; // all tiers

export const MODEL_TIERS: Record<ModelTierId, ModelTier> = {
  '1B':  { id: '1B',  effortPerSec: EFFORT_PER_SEC_1B,  tokenCost: COST_1B,  maxDifficulty: MAX_DIFFICULTY_1B  },
  '8B':  { id: '8B',  effortPerSec: EFFORT_PER_SEC_8B,  tokenCost: COST_8B,  maxDifficulty: MAX_DIFFICULTY_8B  },
  '30B': { id: '30B', effortPerSec: EFFORT_PER_SEC_30B, tokenCost: COST_30B, maxDifficulty: MAX_DIFFICULTY_30B },
};

export const MODEL_TIER_IDS: ModelTierId[] = ['1B', '8B', '30B'];

// ── Agent state ───────────────────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'working';

export interface Agent {
  id: string;
  status: AgentStatus;
  assignedCommissionId: string | null;
  modelTierId: ModelTierId | null;
  progress: number; // effort points accumulated toward current commission
}

export const INITIAL_AGENT: Agent = {
  id: 'agent-1',
  status: 'idle',
  assignedCommissionId: null,
  modelTierId: null,
  progress: 0,
};

// ── Tick ──────────────────────────────────────────────────────────────────────

export interface TickAgentResult {
  agent: Agent;
  active: Commission[];
  dollarDelta: number;
}

export function tickAgent(
  agent: Agent,
  active: Commission[],
  scaledDeltaMs: number,
): TickAgentResult {
  if (agent.status !== 'working' || !agent.assignedCommissionId || !agent.modelTierId) {
    return { agent, active, dollarDelta: 0 };
  }

  const commission = active.find((c) => c.id === agent.assignedCommissionId);
  if (!commission) {
    // Commission disappeared unexpectedly — reset agent.
    return {
      agent: { ...agent, status: 'idle', assignedCommissionId: null, modelTierId: null, progress: 0 },
      active,
      dollarDelta: 0,
    };
  }

  const tier = MODEL_TIERS[agent.modelTierId];
  const newProgress = agent.progress + tier.effortPerSec * (scaledDeltaMs / 1000);

  if (newProgress >= commission.difficulty) {
    return {
      agent: { ...agent, status: 'idle', assignedCommissionId: null, modelTierId: null, progress: 0 },
      active: active.filter((c) => c.id !== commission.id),
      dollarDelta: commission.reward,
    };
  }

  return { agent: { ...agent, progress: newProgress }, active, dollarDelta: 0 };
}

// ── Assignment ────────────────────────────────────────────────────────────────

export type AssignResult =
  | { success: true; agent: Agent; tokens: number }
  | { success: false; reason: 'agent_busy' | 'insufficient_tokens' | 'tier_too_low' | 'commission_not_found' };

export function assignAgent(
  agent: Agent,
  commissionId: string,
  tierId: ModelTierId,
  active: Commission[],
  tokens: number,
): AssignResult {
  if (agent.status === 'working') {
    return { success: false, reason: 'agent_busy' };
  }

  const commission = active.find((c) => c.id === commissionId);
  if (!commission) {
    return { success: false, reason: 'commission_not_found' };
  }

  const tier = MODEL_TIERS[tierId];
  if (commission.difficulty > tier.maxDifficulty) {
    return { success: false, reason: 'tier_too_low' };
  }

  if (tokens < tier.tokenCost) {
    return { success: false, reason: 'insufficient_tokens' };
  }

  return {
    success: true,
    agent: { ...agent, status: 'working', assignedCommissionId: commissionId, modelTierId: tierId, progress: 0 },
    tokens: tokens - tier.tokenCost,
  };
}
