import { STARTING_DOLLARS, STARTING_TOKENS } from './constants';

export interface Settings {
  timeScaleFactor: number;
}

export interface GameState {
  tokens: number;
  dollars: number;
  tokenRefreshTimer: number;
  agentsWorking: number;
  settings: Settings;
}

export const INITIAL_STATE: GameState = {
  tokens: STARTING_TOKENS,
  dollars: STARTING_DOLLARS,
  tokenRefreshTimer: 0,
  agentsWorking: 0,
  settings: {
    timeScaleFactor: 1,
  },
};
