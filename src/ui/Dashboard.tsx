import React from 'react';
import { Box, Text } from 'ink';

export default function Dashboard() {
  return (
    <Box flexDirection="column" width={22} borderStyle="single" paddingX={1}>
      <Text bold>DASHBOARD</Text>
      <Box flexDirection="column" marginTop={1}>
        <Text>Tokens:  <Text color="yellow">—</Text></Text>
        <Text>Dollars: <Text color="green">—</Text></Text>
        <Text>Agents:  <Text color="cyan">—</Text></Text>
        <Text>Refresh: <Text dimColor>—</Text></Text>
      </Box>
    </Box>
  );
}
