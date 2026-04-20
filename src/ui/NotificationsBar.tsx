import React from 'react';
import { Box, Text } from 'ink';

export default function NotificationsBar() {
  return (
    <Box borderStyle="single" paddingX={1}>
      <Text dimColor>[ No notifications ]</Text>
    </Box>
  );
}
