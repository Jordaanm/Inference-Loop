import React, { useState } from 'react';
import { Box, useApp, useInput } from 'ink';
import { Section } from '../types';
import { INITIAL_STATE } from '../game/state';
import { useGameLoop } from '../hooks/useGameLoop';
import { useTerminalSize } from '../hooks/useTerminalSize';
import NotificationsBar from './NotificationsBar';
import NavPanel from './NavPanel';
import Dashboard from './Dashboard';
import CommissionsPanel from './panels/CommissionsPanel';
import AgentsPanel from './panels/AgentsPanel';
import SettingsPanel from './panels/SettingsPanel';

export default function App() {
  const { exit } = useApp();
  const [section, setSection] = useState<Section>('commissions');
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const { rows } = useTerminalSize();

  useGameLoop(setGameState);

  useInput((input) => {
    if (input === '1') setSection('commissions');
    if (input === '2') setSection('agents');
    if (input === '3') setSection('settings');
    if (input === 'q') exit();
  });

  return (
    <Box flexDirection="column" height={rows}>
      <NotificationsBar />
      <Box flexDirection="row" flexGrow={1} alignItems="stretch">
        <NavPanel activeSection={section} />
        <Box flexGrow={1} flexDirection="column" borderStyle="single">
          {section === 'commissions' && <CommissionsPanel />}
          {section === 'agents' && <AgentsPanel />}
          {section === 'settings' && <SettingsPanel />}
        </Box>
        <Dashboard gameState={gameState} />
      </Box>
    </Box>
  );
}
