import React from 'react';
import { Box, Text } from 'ink';
import { GameState } from '../game/state';
import { TOKEN_REFRESH_INTERVAL_MS } from '../game/constants';

function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface Props {
  gameState: GameState;
}

export default function Dashboard({ gameState }: Props) {
  const { tokens, dollars, agentsWorking, tokenRefreshTimer, settings } = gameState;
  const msUntilRefresh = (TOKEN_REFRESH_INTERVAL_MS - tokenRefreshTimer) / settings.timeScaleFactor;

  return (
    <Box flexDirection="column" width={22} borderStyle="single" paddingX={1}>
      <Text bold>DASHBOARD</Text>
      <Box flexDirection="column" marginTop={1}>
        <Text>Tokens:  <Text color="yellow">{tokens.toLocaleString()}</Text></Text>
        <Text>Dollars: <Text color="green">${dollars.toFixed(2)}</Text></Text>
        <Text>Agents:  <Text color="cyan">{agentsWorking}</Text></Text>
        <Text>Refresh: <Text dimColor>{formatCountdown(msUntilRefresh)}</Text></Text>
      </Box>
    </Box>
  );
}
