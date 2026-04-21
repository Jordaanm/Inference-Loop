import { TOKEN_REFRESH_AMOUNT, TOKEN_REFRESH_INTERVAL_MS } from './constants';
import { GameState } from './state';
import { tickBoard } from './board';
import { tickAgent } from './agent';

export function tick(state: GameState, deltaMs: number): GameState {
  const scaledDelta = deltaMs * state.settings.timeScaleFactor;

  const newTimer = state.tokenRefreshTimer + scaledDelta;
  const refreshCount = Math.floor(newTimer / TOKEN_REFRESH_INTERVAL_MS);

  const agentResult = tickAgent(state.agent, state.active, scaledDelta);

  return {
    ...state,
    tokens: state.tokens + refreshCount * TOKEN_REFRESH_AMOUNT,
    tokenRefreshTimer: newTimer % TOKEN_REFRESH_INTERVAL_MS,
    board: tickBoard(state.board, scaledDelta),
    agent: agentResult.agent,
    active: agentResult.active,
    dollars: state.dollars + agentResult.dollarDelta,
    agentsWorking: agentResult.agent.status === 'working' ? 1 : 0,
  };
}
