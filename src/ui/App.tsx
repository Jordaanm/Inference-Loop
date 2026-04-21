import React, { useCallback, useState } from 'react';
import { Box, useApp, useInput } from 'ink';
import { Section } from '../types';
import { INITIAL_STATE } from '../game/state';
import { claimCommission } from '../game/board';
import { assignAgent, ModelTierId } from '../game/agent';
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

  const handleAssign = useCallback((commissionId: string, tierId: ModelTierId) => {
    setGameState((state) => {
      const result = assignAgent(state.agent, commissionId, tierId, state.active, state.tokens);
      if (!result.success) return state;
      return { ...state, agent: result.agent, tokens: result.tokens };
    });
  }, []);

  const handleSetTimeScale = useCallback((value: number) => {
    setGameState((state) => ({
      ...state,
      settings: { ...state.settings, timeScaleFactor: value },
    }));
  }, []);

  const handleClaim = useCallback((id: string) => {
    setGameState((state) => {
      const result = claimCommission(state.board, state.active, id);
      if (!result) return state;
      return { ...state, board: result.board, active: result.active };
    });
  }, []);

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
          {section === 'commissions' && (
            <CommissionsPanel
              board={gameState.board}
              active={gameState.active}
              isActive={section === 'commissions'}
              onClaim={handleClaim}
            />
          )}
          {section === 'agents' && (
            <AgentsPanel
              agent={gameState.agent}
              active={gameState.active}
              tokens={gameState.tokens}
              isActive={section === 'agents'}
              onAssign={handleAssign}
            />
          )}
          {section === 'settings' && (
            <SettingsPanel
              timeScaleFactor={gameState.settings.timeScaleFactor}
              isActive={section === 'settings'}
              onSetFactor={handleSetTimeScale}
            />
          )}
        </Box>
        <Dashboard gameState={gameState} />
      </Box>
    </Box>
  );
}
