import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Commission, MAX_DESC_LENGTH, TYPE_COLORS, TYPE_LABELS } from '../../game/commission';
import { MAX_ACTIVE } from '../../game/board';
import { useTerminalSize } from '../../hooks/useTerminalSize';

// Columns consumed by everything except the description field:
//   NavPanel outer width (width={20})           : 20
//   Dashboard outer width (width={22})          : 22
//   Center panel border (1 left + 1 right)      :  2
//   Center panel paddingX (1 left + 1 right)    :  2
//   Row fixed: indicator+sp(2) [type ](7) sp+reward+sp+time(2+4+6=12) : 21
//   Total                                       : 67
const PANEL_OVERHEAD = 67;
const MIN_DESC_WIDTH = 8;

const SCROLL_START_DELAY_MS = 1200;
const SCROLL_INTERVAL_MS = 150;

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

function BoardRow({
  commission,
  selected,
  scrollOffset,
  descWidth,
}: {
  commission: Commission;
  selected: boolean;
  scrollOffset: number;
  descWidth: number;
}) {
  const label = TYPE_LABELS[commission.type].padEnd(5);
  const color = TYPE_COLORS[commission.type];
  const desc = selected
    ? commission.description.slice(scrollOffset, scrollOffset + descWidth).padEnd(descWidth)
    : truncate(commission.description, descWidth).padEnd(descWidth);
  const reward = `$${commission.reward.toFixed(0).padStart(3)}`;
  const time = formatTimeLimit(commission.timeLimit);
  const urgent = commission.timeLimit < 60_000;
  const dim = !selected;

  return (
    <Box>
      <Text bold={selected}>{selected ? '►' : ' '} </Text>
      <Text color={color} dimColor={dim}>[{label}]</Text>
      <Text dimColor={dim}> {desc} </Text>
      <Text color="green" dimColor={dim}>{reward}</Text>
      <Text color={urgent ? 'red' : 'yellow'} dimColor={dim}> {time}</Text>
    </Box>
  );
}

export default function CommissionsPanel({ board, active, isActive, onClaim }: Props) {
  const { columns } = useTerminalSize();
  const descWidth = Math.max(MIN_DESC_WIDTH, columns - PANEL_OVERHEAD);
  const colWidth = Math.min(descWidth, MAX_DESC_LENGTH);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canClaim = active.length < MAX_ACTIVE;
  const selectedId = board[selectedIdx]?.id;
  const selectedDesc = board[selectedIdx]?.description ?? '';

  // Reset scroll and restart animation when the focused item or available width changes.
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setScrollOffset(0);

    const maxOffset = selectedDesc.length - colWidth;
    if (maxOffset <= 0) return;

    let offset = 0;
    const timeoutId = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        offset = Math.min(offset + 1, maxOffset);
        setScrollOffset(offset);
        if (offset >= maxOffset) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }, SCROLL_INTERVAL_MS);
    }, SCROLL_START_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [selectedIdx, selectedId, colWidth]);

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
          <BoardRow
            key={c.id}
            commission={c}
            selected={i === selectedIdx}
            scrollOffset={i === selectedIdx ? scrollOffset : 0}
            descWidth={descWidth}
          />
        ))}
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text bold>
          CLAIMED <Text color={canClaim ? 'green' : 'red'}>({active.length}/{MAX_ACTIVE})</Text>
        </Text>
        {active.length === 0 && <Text dimColor> No claimed commissions.</Text>}
        {active.map((c) => (
          <Box key={c.id}>
            <Text> </Text>
            <Text color={TYPE_COLORS[c.type]}>[{TYPE_LABELS[c.type].padEnd(5)}]</Text>
            <Text> {truncate(c.description, colWidth + 13)}</Text>
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
