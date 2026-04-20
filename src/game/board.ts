import { Commission, generateCommission } from './commission';

export const BOARD_SIZE = 10;
export const MAX_ACTIVE = 2;

export function initBoard(): Commission[] {
  return Array.from({ length: BOARD_SIZE }, () => generateCommission());
}

export function tickBoard(board: Commission[], scaledDeltaMs: number): Commission[] {
  return board.map((c) => {
    const newTimeLimit = Math.max(0, c.timeLimit - scaledDeltaMs);
    return newTimeLimit <= 0 ? generateCommission() : { ...c, timeLimit: newTimeLimit };
  });
}

export function claimCommission(
  board: Commission[],
  active: Commission[],
  id: string,
): { board: Commission[]; active: Commission[] } | null {
  if (active.length >= MAX_ACTIVE) return null;
  const idx = board.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const claimed = board[idx];
  const newBoard = board.map((c, i) => (i === idx ? generateCommission() : c));
  return { board: newBoard, active: [...active, claimed] };
}
