import { STARTING_DOLLARS, STARTING_TOKENS } from './constants';
import { Commission } from './commission';
import { initBoard } from './board';

export interface Settings {
  timeScaleFactor: number;
}

export interface GameState {
  tokens: number;
  dollars: number;
  tokenRefreshTimer: number;
  agentsWorking: number;
  board: Commission[];
  active: Commission[];
  settings: Settings;
}

export const INITIAL_STATE: GameState = {
  tokens: STARTING_TOKENS,
  dollars: STARTING_DOLLARS,
  tokenRefreshTimer: 0,
  agentsWorking: 0,
  board: initBoard(),
  active: [],
  settings: {
    timeScaleFactor: 1,
  },
};
