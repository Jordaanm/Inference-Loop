# Implementation Plan

## Iteration 1 — Core Loop Validation

**Goal**: Validate that the commission assignment loop and basic economy feel satisfying before building further.

---

### UI Layout

3-panel layout as per DESIGN.md:

```
┌─────────────────────────────────────────────────────────┐
│  NOTIFICATIONS BAR                                      │
├──────────────┬──────────────────────────┬───────────────┤
│              │                          │               │
│              │                          │               │
│  NAVIGATION  │     ACTIVE SECTION       │   DASHBOARD   │
│              │                          │               │
│              │                          │               │
└──────────────┴──────────────────────────┴───────────────┘
```

- **Notifications bar**: top, reserved for future events
- **Left panel**: navigation menu with visible keybinding hints per section
- **Center panel**: active section content (swaps on nav)
- **Right panel**: dashboard stats

---

### Navigation Sections (Iteration 1)

| Section | Keybind | Description |
|---|---|---|
| Commissions | shown in UI | Bounty board + claim commissions |
| Agents | shown in UI | Assign agents to claimed commissions |
| Settings | shown in UI | Game configuration |

---

### Settings

- **Time Scale Factor**: multiplier on game tick speed, for testing/debugging purposes

---

### Commissions (Bounty Board)

- 10 commissions shown at all times; replaced one-by-one as they expire or are claimed
- Themed as a freelance job board (Fiverr-style) — narrative expansion out of scope for v1
- Player can claim up to **2 active commissions** at a time
- Claimed commissions do not expire (no completion penalty in v1)

**Commission attributes:**

| Attribute | Description |
|---|---|
| Type | Category: writing, programming, art, etc. |
| Description | Procedurally generated from a type-specific template + random item from a fixed list (20+ items per type). E.g. `"Write a report on {topic}"` |
| Difficulty | Hidden effort points required to complete. Gates minimum model tier. Not shown to player. |
| Reward | Dollar payout on completion. Scales with difficulty. Tier 1: $5–$10. |
| Time Limit | Real-time countdown until commission expires from the board (only applies while unclaimed) |

---

### Agents Panel

- Shows active agent(s) and what commission they are currently working on
- Shows claimed commissions that have no agent assigned yet
- Player assigns their agent to a commission from this screen

---

### Agent & Model System

**Hierarchy**: Harness → Agents → Models

- Player has **1 agent** in Iteration 1 (cloud-based)
- Three model tiers available, each with a minimum difficulty threshold:

| Model | Parameters | Min Difficulty |
|---|---|---|
| Tier 1 | 1B | Any |
| Tier 2 | 8B | Medium |
| Tier 3 | 30B | High |

- Token cost scales exponentially across tiers and difficulty — exact values are tuning knobs, but expect orders-of-magnitude jumps between tiers
- Completion speed is determined by hidden **effort points per second**, derived from model tier

---

### Economy

| Resource | Start | Refresh |
|---|---|---|
| Tokens | 2,000 | +2,000 per real-time hour (= 1 in-game month) |
| Dollars | $0 | Earned by completing commissions |

- Tokens are consumed when an agent begins a commission (cost depends on model tier × difficulty)
- Dollars accumulate; no spending mechanic in Iteration 1

---

### Dashboard (Right Panel)

1. Tokens remaining (+ time until next refresh)
2. Dollars in account
3. Number of active agents currently working

---

### Out of Scope for Iteration 1

- Buying additional agents
- Hardware / local models
- Subscription / model unlock system
- Minigames
- Research / talent tree
- Prestige mechanic
- Active events
- Offline progress
- Multiple job board sites
- Competing model providers
- Subscription / model unlock system
