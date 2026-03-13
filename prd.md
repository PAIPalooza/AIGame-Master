---

# Product Requirements Document

# AI Game Master (AI GM)

Version: 1.0
Author: AINative Studio
Platform: ZeroDB + AIKit
Context: Extension of Moonvale AI-Native Game World Demo

---

# 1. Product Overview

AI Game Master is a **dynamic narrative engine** that acts as a Dungeon Master for AI-native games.

Instead of static quests and scripted dialogue, the AI GM:

* generates quests dynamically
* narrates player actions
* adapts difficulty
* references player history
* reacts to world state

The AI Game Master uses **ZeroDB as the persistent world memory layer** and **AIKit LLM orchestration for narrative generation**.

This creates a **living text-based game world** where stories evolve based on actual player behavior.

---

# 2. Problem Statement

Modern games still rely heavily on:

* pre-written quest trees
* static NPC dialogue
* scripted world events

This creates predictable gameplay.

Players increasingly want:

* dynamic storytelling
* worlds that remember them
* NPCs that react to history
* unique player journeys

The **GDC 2026 State of the Industry Report** highlights **emergent narrative systems** as one of the fastest growing trends in game design.

However, building these systems typically requires:

* custom AI infrastructure
* complex backend architecture
* large narrative teams

AI Game Master solves this by combining:

**ZeroDB persistent world memory + AIKit narrative AI.**

---

# 3. Product Vision

Create a **universal AI Game Master engine** capable of running persistent game worlds where:

* quests are generated dynamically
* the story reacts to player decisions
* NPCs remember past interactions
* world history accumulates over time

Players should feel like they are participating in **their own evolving fantasy novel.**

---

# 4. Key Features

## 4.1 Dynamic Quest Generation

The AI GM generates quests based on:

* player reputation
* recent events
* world history
* faction alignment
* region activity

Example:

Player killed wolves → AI GM generates quest:

“Track the alpha wolf deeper into the northern forest.”

---

## 4.2 Narrative Action Resolution

Players can perform actions such as:

```
Explore cave
Attack bandit
Sneak past guards
Investigate ruins
```

The AI GM narrates outcomes using world context.

Example response:

“You slip quietly into the ruined tower. The scent of ash still lingers from the Ember Tower collapse.”

---

## 4.3 Adaptive Difficulty

The AI GM adjusts difficulty based on:

* player level
* previous combat outcomes
* equipment
* party size (future feature)

---

## 4.4 Persistent Narrative Memory

The AI GM references stored data such as:

* NPC memories
* past quests
* player decisions
* world events

Example:

“Elarin remembers when you drove the wolves from Moonvale.”

---

## 4.5 Emergent World Simulation

Player actions influence the world.

Examples:

* wolves disappear → forest trade improves
* excessive hunting → ecosystem imbalance
* aiding faction → faction influence grows

---

## 4.6 Player Creativity Rewards

Players are encouraged to try creative actions.

Example input:

```
Climb the ruined tower and look for magical artifacts
```

AI GM evaluates plausibility and narrates results.

---

# 5. System Architecture

```mermaid
graph TD

Player Input
    ↓
AI Game Master Engine
    ↓
AIKit LLM

AIKit LLM
    ↓
Context Retrieval Layer

Context Retrieval Layer
    ↓
ZeroDB

ZeroDB
    ↓
World State
NPC Memory
Lore
Events
Quests
```

---

# 6. Data Model Extensions

The Moonvale schema already includes:

* players
* npc_memories
* lore
* game_events
* world_events

AI Game Master adds three new tables.

---

# 6.1 Quests

```sql
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    difficulty INTEGER,
    status TEXT,
    player_id UUID REFERENCES players(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

Example

```
Track the Alpha Wolf
Status: active
Difficulty: 2
```

---

# 6.2 Narrative Logs

Stores AI GM narration history.

```sql
CREATE TABLE narrative_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id),
    input TEXT,
    gm_response TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 6.3 World State

Persistent simulation variables.

```sql
CREATE TABLE world_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT,
    value JSONB,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

Example

```
wolf_population: reduced
moonvale_trade: increasing
forest_danger_level: low
```

---

# 7. AI Game Master Engine

The GM engine performs the following steps.

---

## Step 1: Receive Player Action

Example:

```
Player: "Investigate Ember Tower ruins"
```

---

## Step 2: Retrieve Context from ZeroDB

Retrieve:

* player data
* NPC memory
* recent events
* world state
* lore entries

---

## Step 3: Build Narrative Prompt

Example prompt structure:

```
You are the AI Game Master for Moonvale.

Player history:
- defeated wolves
- asked about Ember Tower

World state:
- wolves retreating

Relevant lore:
- Ember Tower collapse
```

---

## Step 4: Generate Outcome

AIKit LLM produces narration.

Example:

“Among the rubble you discover a glowing shard of arcane glass.”

---

## Step 5: Persist Narrative

Store result in:

```
narrative_logs
```

---

## Step 6: Update World

Possible updates:

* add NPC memory
* generate quest
* trigger event

---

# 8. API Endpoints

## Generate Quest

```
POST /api/gm/quest
```

Returns new dynamic quest.

---

## Player Action

```
POST /api/gm/action
```

Input

```
player_id
action
```

Output

```
gm_response
```

---

## Get Narrative History

```
GET /api/gm/history
```

---

## Get Active Quests

```
GET /api/quests
```

---

# 9. UI Design

Extend the Moonvale dashboard.

New panel:

## AI Game Master Console

Input field:

```
What do you want to do?
```

Example commands

```
Investigate ruins
Follow wolf tracks
Talk to Elarin
Search the forest
```

Output

Narrative response.

---

# 10. Example Gameplay Loop

1 Player enters action

```
Search the forest
```

2 AI GM narrates

3 System logs event

4 Quest may appear

5 World state updates

6 NPC remembers event

---

# 11. Example Gameplay Session

Player actions

```
Ask Elarin about wolves
Explore forest
Fight wolf
Follow tracks
```

AI GM responses

```
You notice deeper tracks leading north.
```

New quest appears

```
Track the Alpha Wolf
```

---

# 12. Demo Use Case (Workshop)

Instructor demonstrates:

1 Player asks AI GM what to do
2 AI GM generates quest
3 Player performs actions
4 AI GM narrates outcomes
5 NPC references past events
6 New quests appear

Shows:

* persistent narrative
* AI world building
* memory driven storytelling

---

# 13. Success Criteria

Demo is successful if:

* quests generate dynamically
* AI narration references history
* world state updates
* NPC memory evolves
* player actions influence the world

---

# 14. Future Expansion

Planned features:

* multi-player worlds
* AI NPC agents
* faction politics
* procedural world maps
* AI-driven economies
* RLHF training loops

---

# 15. Strategic Importance for AINative

AI Game Master demonstrates:

* ZeroDB persistent memory
* AIKit LLM orchestration
* emergent AI gameplay systems

This positions AINative as infrastructure for:

**AI-native game development.**

---
