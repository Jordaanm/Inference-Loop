# Game Design Document

## Concept

A terminal-based incremental game where the player builds and scales an AI commission business. Starting as a solo operator completing simple jobs manually, the player gradually automates work with AI agents, invests in hardware, and conducts research — culminating in a time-travel prestige mechanic.

---

## Resources

| Resource | Description |
|---|---|
| **Dollars** | Primary currency. Earned by completing commissions, spent on tokens, hardware, agents, and research. |
| **Tokens** | Cloud AI fuel. Purchased with dollars, consumed by cloud-based agents per commission. |
| **Compute** | Local hardware power. Measured in TOPS; costs electricity (dollars/time). |

---

## Core Loop

1. Complete commissions → earn dollars
2. Spend dollars on tokens or hardware
3. Deploy agents to automate commissions passively
4. Scale parallelism with more agents and hardware
5. Unlock higher-tier commissions via more powerful models
6. Research talent tree nodes
7. Prestige via Time Travel — carry one node back, repeat

---

## Commission Types & Tiers

Commissions scale with model capability, measured in **parameters**. The following table shows some examples, but is not exhaustive.

| Tier | Type | Example | Min Parameters |
|---|---|---|---|
| 1 | Writing | Reports, summaries | Any |
| 1 | Coding | Logic tasks, scripts | Any |
| 1 | AI Training | Labeling, RLHF | Any |
| 2 | Image (low-res) | Basic image gen | 2B |
| 3 | Image (high-res) | Quality image gen | 8B |
| 4 | Video | Video generation | 50B |

---

## Manual Minigames (Early Game)

Before the player can afford their first agent, they complete commissions manually via minigames. All three are among the first commission types agents can automate.

| Minigame | Theme | Mechanic |
|---|---|---|
| **Typing Challenge** | Writing a report | Type a given paragraph with no mistakes |
| **Logic Gates** | Completing a programming task | Solve a simple logic gate puzzle |
| **Multiple Choice Quiz** | Manually training an AI | Select the correct answer from options |

These manual tasks provide a fallback if a player mismanages their resources and runs out of money and tokens.

---

## AI Models

### Cloud Models
- Powered by purchased tokens
- Better models consume more tokens per commission but produce results faster and unlock higher tiers
- Always available (no hardware required)

### Local Models
- Powered by owned hardware (compute/parameters)
- Cost electricity (ongoing dollar drain)
- Slower and simpler than cloud equivalents
- Scale up to data-center tier through hardware upgrades
- Enable independence from token purchases at high investment

---

## Agents

- Agents complete commissions passively in the background
- Multiple agents run in parallel — parallelism is the primary scaling mechanic
- Each agent uses either a cloud model (costs tokens) or a local model (costs electricity)
- Agent count is the primary purchase in the mid-game

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  NOTIFICATIONS BAR (alerts, active events)              │
├──────────────┬──────────────────────────┬───────────────┤
│              │                          │               │
│  NAVIGATION  │     ACTIVE SECTION       │   DASHBOARD   │
│              │                          │               │
│  Commissions │  (changes based on nav)  │  Income/s     │
│  Agents      │                          │  Tokens left  │
│  Shop        │                          │  Time played  │
│  Resources   │                          │  Active jobs  │
│  Settings    │                          │  ...          │
│              │                          │               │
│  [unlocked]  │                          │               │
│  Hardware    │                          │               │
│  Research    │                          │               │
└──────────────┴──────────────────────────┴───────────────┘
```

### Navigation Sections

| Section | Unlocked | Description |
|---|---|---|
| Commissions | Start | Active jobs, queue, manual minigames |
| Agents | Start | Hire and manage AI agents |
| Shop | Start | Buy tokens, agents, and hardware |
| Resources | Start | Finances, token balance, spending breakdown |
| Settings | Start | Game settings |
| Hardware | After first hardware purchase | Manage local compute, view electricity costs |
| Research | After hitting a dollar threshold | Talent tree and Time Travel prestige |

---

## Research / Talent Tree

Four branch categories:

| Branch | Description | Example Nodes |
|---|---|---|
| **Scaling** | Flat multipliers and efficiency gains | +X% commission payout, -X% token cost per job |
| **Synergies** | Cross-system bonuses | For every X GPUs owned, +Y% cloud efficiency |
| **Unlocks** | New commission types or capabilities | Unlock image commissions, unlock a new agent skill |
| **Meta** | Improves the prestige mechanic | Carry back additional nodes per prestige run |

The Meta branch is gated behind late-game nodes in the other three branches.

---

## Prestige — Time Travel

- Researching **Time Travel** (a late-game research node) triggers a prestige reset
- The run resets: dollars, tokens, agents, hardware all return to zero
- The player carries back **1 completed talent tree node** into the next run
- Meta branch nodes can increase how many nodes are carried back per prestige
- Once all talent tree nodes have been carried back across multiple prestige runs, the **game ends** (true ending)

---

## Active Events

While the game is running, random events appear in the notifications bar. Each event prompts the player to press a specific key or type a specific three-letter word to claim a small bonus. Events are time-limited.

Events reward active play without punishing offline players (offline progress still accrues normally).

---

## Time & Offline Progress

- Game time is tracked including time spent offline
- Passive income (agents, commissions) accrues during offline periods
- Active events only fire during live sessions
- "Time spent in game" on the dashboard reflects total elapsed time including offline
