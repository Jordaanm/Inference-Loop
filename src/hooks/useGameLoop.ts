import { useEffect, useRef } from 'react';
import { TICK_INTERVAL_MS } from '../game/constants';
import { GameState } from '../game/state';
import { tick } from '../game/tick';

export function useGameLoop(setState: React.Dispatch<React.SetStateAction<GameState>>) {
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      setState(state => tick(state, delta));
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [setState]);
}
