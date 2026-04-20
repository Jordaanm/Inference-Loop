import React from 'react';
import { Box, Text } from 'ink';
import { Section } from '../types';

const NAV_ITEMS: { key: string; label: string; section: Section }[] = [
  { key: '1', label: 'Commissions', section: 'commissions' },
  { key: '2', label: 'Agents', section: 'agents' },
  { key: '3', label: 'Settings', section: 'settings' },
];

interface Props {
  activeSection: Section;
}

export default function NavPanel({ activeSection }: Props) {
  return (
    <Box flexDirection="column" width={20} borderStyle="single" paddingX={1}>
      <Text bold>NAVIGATION</Text>
      <Box flexDirection="column" marginTop={1}>
        {NAV_ITEMS.map(({ key, label, section }) => (
          <Text key={section} inverse={activeSection === section}>
            [{key}] {label}
          </Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>[q] Quit</Text>
      </Box>
    </Box>
  );
}
