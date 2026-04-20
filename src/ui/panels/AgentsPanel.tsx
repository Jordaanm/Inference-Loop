import React from 'react';
import { Box, Text } from 'ink';

export default function AgentsPanel() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>AGENTS</Text>
      <Box marginTop={1}>
        <Text dimColor>No agents deployed yet.</Text>
      </Box>
    </Box>
  );
}
