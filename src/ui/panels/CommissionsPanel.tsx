import React from 'react';
import { Box, Text } from 'ink';

export default function CommissionsPanel() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>COMMISSIONS</Text>
      <Box marginTop={1}>
        <Text dimColor>No commissions available yet.</Text>
      </Box>
    </Box>
  );
}
