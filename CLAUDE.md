# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A terminal-based incremental/idle game built with TypeScript and [Ink](https://github.com/vadimdemedes/ink) (React for CLIs).

## Commands

```bash
npm run dev        # Run the game in development (watch mode)
npm run build      # Compile TypeScript
npm run start      # Run compiled output
npm test           # Run tests
npm run lint       # Lint with ESLint
```

## Architecture

The game follows a unidirectional data flow pattern:

- **Game state** is a plain object (resources, upgrades, timers) — never mutated directly, always replaced via a reducer or updater function.
- **Game loop** runs on a `setInterval` tick (e.g. 100ms), computes passive income/events, and calls a state updater.
- **Ink components** read from state and render the TUI. Components are organized by UI region (e.g. `ResourcePanel`, `UpgradePanel`, `LogPanel`).
- **Input handling** uses Ink's `useInput` hook to capture keypresses for purchases, navigation, and other player actions.

### Key layers

| Layer | Responsibility |
|---|---|
| `src/game/` | Pure game logic: state shape, tick calculations, upgrade definitions |
| `src/ui/` | Ink React components for rendering |
| `src/hooks/` | Custom hooks connecting game loop to UI state |
| `src/index.tsx` | Entry point — mounts the Ink app |

### State management

Game state lives in a single top-level `useState` (or `useReducer`) in the root component, passed down as props or via a React context. The game tick mutates nothing — it takes current state and returns next state.
