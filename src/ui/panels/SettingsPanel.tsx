import React from 'react';
import { Box, Text } from 'ink';

export default function SettingsPanel() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>SETTINGS</Text>
      <Box marginTop={1}>
        <Text dimColor>No settings available yet.</Text>
      </Box>
    </Box>
  );
}
