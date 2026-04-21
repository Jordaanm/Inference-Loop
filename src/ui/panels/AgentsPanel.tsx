import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Agent, MODEL_TIER_IDS, MODEL_TIERS, ModelTierId } from '../../game/agent';
import { Commission, TYPE_COLORS, TYPE_LABELS } from '../../game/commission';

interface Props {
  agent: Agent;
  active: Commission[];
  tokens: number;
  isActive: boolean;
  onAssign: (commissionId: string, tierId: ModelTierId) => void;
}

const PROGRESS_BAR_WIDTH = 28;

function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + '…';
}

function makeProgressBar(progress: number, difficulty: number): string {
  const pct = Math.min(1, progress / difficulty);
  const filled = Math.round(pct * PROGRESS_BAR_WIDTH);
  return '[' + '█'.repeat(filled) + '░'.repeat(PROGRESS_BAR_WIDTH - filled) + '] ' + String(Math.floor(pct * 100)).padStart(3) + '%';
}

function TierButton({ id, selected, available, affordable }: {
  id: ModelTierId;
  selected: boolean;
  available: boolean;
  affordable: boolean;
}) {
  const label = `[${id} ${MODEL_TIERS[id].tokenCost}t]`;
  if (!available) return <Text dimColor>{label} </Text>;
  if (!affordable) return <Text inverse={selected} color="red">{label} </Text>;
  return <Text inverse={selected} color="cyan">{label} </Text>;
}

export default function AgentsPanel({ agent, active, tokens, isActive, onAssign }: Props) {
  const unassigned = active.filter((c) => c.id !== agent.assignedCommissionId);
  const assignedComm = active.find((c) => c.id === agent.assignedCommissionId) ?? null;

  const [commIdx, setCommIdx] = useState(0);
  const [tierIdx, setTierIdx] = useState(0);

  const safeCommIdx = Math.min(commIdx, Math.max(0, unassigned.length - 1));
  const focusedComm = unassigned[safeCommIdx] ?? null;

  const availableTiers = MODEL_TIER_IDS.filter(
    (id) => !focusedComm || focusedComm.difficulty <= MODEL_TIERS[id].maxDifficulty,
  );
  const safeTierIdx = Math.min(tierIdx, Math.max(0, availableTiers.length - 1));
  const selectedTierId = availableTiers[safeTierIdx] ?? null;

  // Reset tier selection when the focused commission changes.
  useEffect(() => {
    setTierIdx(0);
  }, [commIdx, focusedComm?.id]);

  const canAssign =
    agent.status === 'idle' &&
    focusedComm !== null &&
    selectedTierId !== null &&
    tokens >= MODEL_TIERS[selectedTierId].tokenCost;

  useInput((input, key) => {
    if (key.upArrow)    setCommIdx((i) => Math.max(0, i - 1));
    if (key.downArrow)  setCommIdx((i) => Math.min(Math.max(0, unassigned.length - 1), i + 1));
    if (key.leftArrow)  setTierIdx((i) => Math.max(0, i - 1));
    if (key.rightArrow) setTierIdx((i) => Math.min(availableTiers.length - 1, i + 1));
    if ((input === 'a' || key.return) && canAssign && focusedComm && selectedTierId) {
      onAssign(focusedComm.id, selectedTierId);
    }
  }, { isActive });

  return (
    <Box flexDirection="column" paddingX={1}>

      {/* ── Agent status card ────────────────────────────────── */}
      <Text bold>AGENT STATUS</Text>
      <Box flexDirection="column" marginTop={1} marginBottom={1} borderStyle="single" paddingX={1}>
        <Box justifyContent="space-between">
          <Text bold>{agent.id}</Text>
          <Text color={agent.status === 'working' ? 'green' : 'yellow'}>
            [{agent.status.toUpperCase()}]
          </Text>
        </Box>
        {assignedComm ? (
          <Box flexDirection="column">
            <Text dimColor>{truncate(assignedComm.description, 50)}</Text>
            <Box>
              <Text>{makeProgressBar(agent.progress, assignedComm.difficulty)}</Text>
              <Text color="cyan">  [{agent.modelTierId}]</Text>
            </Box>
          </Box>
        ) : (
          <Text dimColor>No active assignment.</Text>
        )}
      </Box>

      {/* ── Unassigned commission queue ──────────────────────── */}
      <Box>
        <Text bold>UNASSIGNED </Text>
        <Text dimColor>({unassigned.length})</Text>
      </Box>

      {unassigned.length === 0 ? (
        <Text dimColor> No claimed commissions awaiting assignment.</Text>
      ) : (
        <Box flexDirection="column" marginTop={1}>
          {unassigned.map((c, i) => {
            const isFocused = i === safeCommIdx;
            const eligibleTiers = MODEL_TIER_IDS.filter(
              (id) => c.difficulty <= MODEL_TIERS[id].maxDifficulty,
            );
            return (
              <Box key={c.id} flexDirection="column">
                <Box>
                  <Text bold={isFocused}>{isFocused ? '►' : ' '} </Text>
                  <Text color={TYPE_COLORS[c.type]}>[{TYPE_LABELS[c.type].padEnd(5)}]</Text>
                  <Text dimColor={!isFocused}> {truncate(c.description, 32)} </Text>
                  <Text color="green">${c.reward.toFixed(0)}</Text>
                </Box>
                {isFocused && (
                  <Box marginLeft={3} marginBottom={1}>
                    {MODEL_TIER_IDS.map((id) => (
                      <TierButton
                        key={id}
                        id={id}
                        selected={id === selectedTierId}
                        available={eligibleTiers.includes(id)}
                        affordable={tokens >= MODEL_TIERS[id].tokenCost}
                      />
                    ))}
                    {agent.status === 'working' && (
                      <Text color="yellow"> (agent busy)</Text>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}

          <Box marginTop={1}>
            <Text dimColor>↑↓ commission  ←→ tier  </Text>
            <Text color={canAssign ? 'white' : undefined} dimColor={!canAssign}>[a] assign</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
