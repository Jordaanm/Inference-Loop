import { TOKEN_REFRESH_AMOUNT, TOKEN_REFRESH_INTERVAL_MS } from './constants';
import { GameState } from './state';
import { tickBoard } from './board';

export function tick(state: GameState, deltaMs: number): GameState {
  const scaledDelta = deltaMs * state.settings.timeScaleFactor;

  const newTimer = state.tokenRefreshTimer + scaledDelta;
  const refreshCount = Math.floor(newTimer / TOKEN_REFRESH_INTERVAL_MS);

  return {
    ...state,
    tokens: state.tokens + refreshCount * TOKEN_REFRESH_AMOUNT,
    tokenRefreshTimer: newTimer % TOKEN_REFRESH_INTERVAL_MS,
    board: tickBoard(state.board, scaledDelta),
  };
}
