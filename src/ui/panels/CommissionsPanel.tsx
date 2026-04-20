import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Commission, TYPE_COLORS, TYPE_LABELS } from '../../game/commission';
import { MAX_ACTIVE } from '../../game/board';

interface Props {
  board: Commission[];
  active: Commission[];
  isActive: boolean;
  onClaim: (id: string) => void;
}

function formatTimeLimit(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + '…';
}

function BoardRow({ commission, selected }: { commission: Commission; selected: boolean }) {
  const label = TYPE_LABELS[commission.type].padEnd(5);
  const color = TYPE_COLORS[commission.type];
  const desc = truncate(commission.description, 19);
  const reward = `$${commission.reward.toFixed(0).padStart(3)}`;
  const time = formatTimeLimit(commission.timeLimit);
  const urgent = commission.timeLimit < 60_000;
  const dim = !selected;

  return (
    <Box>
      <Text bold={selected}>{selected ? '►' : ' '} </Text>
      <Text color={color} dimColor={dim}>[{label}]</Text>
      <Text dimColor={dim}> {desc.padEnd(19)} </Text>
      <Text color="green" dimColor={dim}>{reward}</Text>
      <Text color={urgent ? 'red' : 'yellow'} dimColor={dim}> {time}</Text>
    </Box>
  );
}

export default function CommissionsPanel({ board, active, isActive, onClaim }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const canClaim = active.length < MAX_ACTIVE;

  useInput((input, key) => {
    if (key.upArrow) setSelectedIdx((i) => Math.max(0, i - 1));
    if (key.downArrow) setSelectedIdx((i) => Math.min(board.length - 1, i + 1));
    if (input === 'c' || key.return) {
      if (canClaim) onClaim(board[selectedIdx].id);
    }
  }, { isActive });

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Box marginBottom={1} justifyContent="space-between">
        <Text bold>BOUNTY BOARD</Text>
        <Text dimColor>↑↓ navigate  [c] claim</Text>
      </Box>

      <Box flexDirection="column">
        {board.map((c, i) => (
          <BoardRow key={c.id} commission={c} selected={i === selectedIdx} />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold>
          CLAIMED{' '}
          <Text color={canClaim ? 'green' : 'red'}>
            ({active.length}/{MAX_ACTIVE})
          </Text>
        </Text>
        {active.length === 0 && (
          <Text dimColor> No claimed commissions.</Text>
        )}
        {active.map((c) => (
          <Box key={c.id}>
            <Text> </Text>
            <Text color={TYPE_COLORS[c.type]}>[{TYPE_LABELS[c.type].padEnd(5)}]</Text>
            <Text> {truncate(c.description, 32)}</Text>
            <Text color="green"> ${c.reward.toFixed(0)}</Text>
          </Box>
        ))}
        {!canClaim && (
          <Text color="red"> Queue full — assign an agent to free a slot.</Text>
        )}
      </Box>
    </Box>
  );
}
