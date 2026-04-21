import React from 'react';
import { Box, Text, useInput } from 'ink';

const MIN_FACTOR = 1;
const MAX_FACTOR = 100;

interface Props {
  timeScaleFactor: number;
  isActive: boolean;
  onSetFactor: (value: number) => void;
}

export default function SettingsPanel({ timeScaleFactor, isActive, onSetFactor }: Props) {
  useInput((input, key) => {
    if (key.upArrow   || input === '+') onSetFactor(Math.min(MAX_FACTOR, timeScaleFactor + 1));
    if (key.downArrow || input === '-') onSetFactor(Math.max(MIN_FACTOR, timeScaleFactor - 1));
    if (key.pageUp)                     onSetFactor(Math.min(MAX_FACTOR, timeScaleFactor + 10));
    if (key.pageDown)                   onSetFactor(Math.max(MIN_FACTOR, timeScaleFactor - 10));
  }, { isActive });

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold>SETTINGS</Text>

      <Box flexDirection="column" marginTop={1} borderStyle="single" paddingX={1} width={40}>
        <Text bold>Time Scale Factor</Text>
        <Box marginTop={1} alignItems="center">
          <Text dimColor>[−] </Text>
          <Text bold inverse>{String(timeScaleFactor).padStart(3)}×</Text>
          <Text dimColor> [+]</Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>↑ / +    increase by 1</Text>
          <Text dimColor>↓ / −    decrease by 1</Text>
          <Text dimColor>PgUp     increase by 10</Text>
          <Text dimColor>PgDn     decrease by 10</Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>
          Game runs at{' '}
        </Text>
        <Text color="yellow">{timeScaleFactor}×</Text>
        <Text dimColor>
          {' '}real-time speed. Commission timers, agent progress,
        </Text>
      </Box>
      <Text dimColor>and token refresh all scale proportionally.</Text>
    </Box>
  );
}
