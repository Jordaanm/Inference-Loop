# PRD: Iteration 1 — Core Loop Validation

## Problem Statement

The player wants to run an AI commission business from their terminal, starting with no resources and growing it into a scaled automated operation. Before building the full game, we need to validate that the fundamental loop — discovering commissions, claiming them, assigning an AI agent to complete them, and earning money — is satisfying and intuitive in a TUI environment.

---

## Solution

Build a playable Iteration 1 that implements the 3-panel TUI shell, a live bounty board of procedurally generated commissions, a single cloud-based agent the player assigns to tasks, and a minimal token/dollar economy. The result should feel like a real (if thin) game that can be played and evaluated before further features are added.

---

## User Stories

1. As a player, I want to see a clean 3-panel terminal layout, so that I can orient myself and understand the game at a glance.
2. As a player, I want a persistent notifications bar at the top of the screen, so that I have a dedicated space for alerts and events.
3. As a player, I want a left navigation panel with visible keybinding hints, so that I can move between sections without memorising shortcuts.
4. As a player, I want to navigate to the Commissions section, so that I can see available jobs.
5. As a player, I want to navigate to the Agents section, so that I can manage my AI agent and assign it to work.
6. As a player, I want to navigate to the Settings section, so that I can configure game options.
7. As a player, I want a Time Scale Factor setting, so that I can speed up the game during testing and debugging.
8. As a player, I want the right panel to always show my current token balance, so that I know how much compute budget I have.
9. As a player, I want to see a countdown to my next token refresh in the dashboard, so that I can plan when my next commission will be affordable.
10. As a player, I want the right panel to always show my current dollar balance, so that I know how much money I have earned.
11. As a player, I want the right panel to show how many agents are currently working, so that I can tell at a glance if my harness is busy.
12. As a player, I want to see a bounty board of 10 commissions, so that I have meaningful choices about which jobs to take.
13. As a player, I want each commission to show its type (writing, programming, art, etc.), so that I understand what kind of work it involves.
14. As a player, I want each commission to show a procedurally generated description, so that each job feels distinct and flavourful.
15. As a player, I want each commission to show its reward in dollars, so that I can compare the value of different jobs.
16. As a player, I want each commission to show a time limit countdown, so that I know how long I have before it disappears from the board.
17. As a player, I want commissions to be replaced one-by-one as they expire or are claimed, so that the board always feels active.
18. As a player, I want to claim a commission from the bounty board, so that I can reserve it for my agent to work on.
19. As a player, I want to be limited to 2 active commissions at a time, so that I have to make meaningful prioritisation decisions.
20. As a player, I want claimed commissions to not expire after I accept them, so that I am not punished for switching to the agent screen to assign work.
21. As a player, I want to go to the Agents screen and see my uncompleted claimed commissions, so that I can assign my agent to them.
22. As a player, I want to see my agent's current status (idle or working) on the Agents screen, so that I know whether it is available.
23. As a player, I want to assign my agent to a claimed commission from the Agents screen, so that the work begins.
24. As a player, I want to choose which model tier my agent uses for a given commission, so that I can trade off token cost against speed.
25. As a player, I want to see three model tiers (1B, 8B, 30B parameters), so that I have meaningful options at different cost levels.
26. As a player, I want high-difficulty commissions to require a minimum model tier, so that progression feels gated and meaningful.
27. As a player, I want to see my agent making progress on a commission, so that the game feels alive while I wait.
28. As a player, I want to receive a dollar reward when my agent completes a commission, so that I feel the loop closing.
29. As a player, I want my token balance to be deducted when I assign an agent to a commission, so that resource management feels real.
30. As a player, I want to start with 2,000 tokens, so that I can take my first actions immediately without grinding.
31. As a player, I want my tokens to refresh by 2,000 every real-time hour, so that I have a reliable passive income of compute budget.
32. As a player, I want the game to feel thematically consistent with running an AI coding harness, so that the setting is immersive.

---

## Implementation Decisions

### Modules

**Game State**
- A single plain-object state shape holding: token balance, token refresh timer, dollar balance, bounty board commissions, active (claimed) commissions, agent status, and settings.
- State is never mutated directly; a reducer or updater function produces the next state.

**Game Loop**
- A `setInterval`-based tick (e.g. 100ms, scaled by Time Scale Factor) drives all passive changes: commission expiry countdown, agent progress, token refresh accumulation.
- The tick function is pure: takes current state, returns next state.

**Commission Generator**
- Generates a single commission object from a type, a template string, and a random item drawn from a type-specific pool (20+ items per type).
- Difficulty is a hidden numeric value (effort points); reward and time limit are derived from difficulty tier.
- Commission types for Iteration 1: writing, programming, art (at minimum).

**Bounty Board Logic**
- Maintains 10 commission slots. On each tick, decrements time limits. Expired commissions are removed and replaced with freshly generated ones.
- Exposes: list of available commissions, claim action (moves a commission to active list if < 2 active), replace action.

**Agent System**
- Agent has: id, status (idle | working), assigned commission id (nullable), chosen model tier, progress (effort points accumulated).
- On each tick, if agent is working, increments progress by model tier's effort-per-second rate.
- On completion: reward dollars, clear assignment, move commission to completed.

**Model Definitions**
- Static data: three model tiers (1B, 8B, 30B), each with: parameters, effort-per-second rate, token cost formula, minimum difficulty threshold.
- Token cost scales exponentially — exact coefficients are tuning constants, changeable without structural change.

**Economy**
- Token balance: starts at 2,000, deducted on agent assignment, refreshed on real-time hourly tick.
- Dollar balance: starts at $0, incremented on commission completion.
- Refresh timer: counts real elapsed milliseconds; triggers +2,000 tokens per 3,600,000ms.

**UI Shell**
- 3-panel Ink layout: notifications bar (top), left nav, center panel, right dashboard.
- Left nav renders section list with keybinding hints; active section highlighted.
- Center panel swaps component based on active nav section.
- Right dashboard always visible, reads from state.

**Commissions Panel**
- Renders bounty board as a selectable list.
- Claim action available when < 2 active commissions.
- Shows type, description, reward, time limit countdown per row.

**Agents Panel**
- Renders agent status card.
- Renders list of claimed-but-unassigned commissions with model tier selector.
- Assign action starts the agent working.

**Settings Panel**
- Renders Time Scale Factor control (numeric, adjustable with arrow keys or +/-).

### Architectural Decisions

- Game state lives in a single top-level `useState`/`useReducer` in the root Ink component.
- Game loop tick is managed in a `useGameLoop` custom hook that calls the state updater on each interval.
- All game logic (tick, generation, economy) is in `src/game/` as pure functions — no React imports, no side effects.
- All Ink components are in `src/ui/` and receive state as props or via context; they do not contain game logic.
- Time Scale Factor is applied as a multiplier inside the tick function, not at the `setInterval` level, so it can change mid-game.

---

## Testing Decisions

**What makes a good test**: tests should verify observable behaviour and state transitions, not internal implementation details. Test the output of pure functions given known inputs — avoid testing React rendering internals or private helpers.

**Modules to test:**

- **Commission Generator**: given a type and seed, produces a commission with correct attribute ranges and a valid templated description.
- **Bounty Board Logic**: expiry decrements correctly; expired commissions are replaced; claim correctly moves commission to active list and enforces the 2-commission cap.
- **Agent System**: progress increments at the correct rate per model tier; completion triggers dollar reward and clears agent state; token deduction happens on assignment.
- **Economy / Token Refresh**: token balance increments correctly after the real-time threshold elapses; does not double-increment.
- **Game Tick (integration)**: given an initial state and N elapsed ticks, final state matches expected values for progress, expiry, and balance.

---

## Out of Scope

- Buying additional agents
- Hardware and local models
- Subscription / model unlock system
- Manual minigames (typing challenge, logic gates, multiple choice quiz)
- Research / talent tree
- Prestige / Time Travel mechanic
- Active events (notification bar prompts)
- Offline progress
- Multiple job board sites / narrative unlocks
- Competing model providers
- Dollar spending mechanics

---

## Further Notes

- The Time Scale Factor in Settings is specifically intended to allow rapid playtesting of the commission loop without waiting real minutes. All time-based values (tick rate, token refresh, commission expiry) should respect this multiplier.
- Exact token costs and effort-per-second values for each model tier are intentionally left as named constants rather than hardcoded literals, so they can be tuned quickly during playtesting.
- Commission difficulty is deliberately hidden from the player in Iteration 1. The only signal is which model tiers are available to select for a given commission.
- The "job board as Fiverr-style site" framing is a narrative note for future iterations; in Iteration 1 no site branding or narrative copy is required.
