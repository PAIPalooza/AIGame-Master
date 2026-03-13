---

# ZeroDB Data Model

# AI Game Master

# Moonvale AI-Native Game World

Version: 1.0
Platform: ZeroDB
Database Style: Postgres-compatible + vector search + JSONB

---

# 1. Design Goals

This schema must support:

* persistent player identity and progression
* NPC memory of specific players
* lore retrieval with embeddings
* gameplay telemetry and event history
* dynamic quest generation and tracking
* AI Game Master narrative logs
* persistent world state changes
* world events triggered by player actions
* RLHF / player feedback for improving the GM

---

# 2. High-Level Entity Map

```text
players
  ├── player_profiles
  ├── player_inventory
  ├── game_events
  ├── quests
  ├── quest_progress
  ├── narrative_logs
  ├── player_feedback
  └── npc_memories

npcs
  ├── npc_memories
  ├── npc_relationships
  └── npc_dialogue_states

lore_entries
  └── used by AI GM + NPC retrieval

world_state
  ├── world_regions
  ├── world_factions
  ├── world_metrics
  └── world_events

game_sessions
  ├── narrative_logs
  ├── game_events
  └── player actions
```

---

# 3. Core Tables

## 3.1 Players

Stores the core player identity.

```sql
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    class TEXT NOT NULL,
    faction_id UUID NULL,
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    reputation INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Purpose

This is the primary player entity used everywhere else.

### Example

* TobyTheExplorer
* Ranger
* level 1
* reputation 0

---

## 3.2 Player Profiles

Stores richer player information separately from the main identity record.

```sql
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    backstory TEXT,
    play_style_tags TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(player_id)
);
```

### Purpose

Useful for:

* adaptive quest generation
* tailored narration
* player style modeling

### Example `play_style_tags`

* explorer
* aggressive
* lore-seeker
* creative

---

## 3.3 Factions

```sql
CREATE TABLE factions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    alignment TEXT,
    influence_score INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Example

* Forest Guild
* Ashen Circle
* Moonvale Wardens

---

## 3.4 Player Faction Reputation

Tracks player standing with different factions.

```sql
CREATE TABLE player_faction_reputation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    faction_id UUID NOT NULL REFERENCES factions(id) ON DELETE CASCADE,
    reputation_score INTEGER NOT NULL DEFAULT 0,
    reputation_label TEXT DEFAULT 'neutral',
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(player_id, faction_id)
);
```

### Purpose

Drives dynamic quests, NPC trust, and story branches.

---

# 4. NPC System

## 4.1 NPCs

```sql
CREATE TABLE npcs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    faction_id UUID NULL REFERENCES factions(id),
    location_region_id UUID NULL,
    personality JSONB DEFAULT '{}'::jsonb,
    narrative_style JSONB DEFAULT '{}'::jsonb,
    importance INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Example

* Elarin
* Village Historian
* Moonvale

### `personality` example

```json
{
  "tone": "wise",
  "temperament": "calm",
  "traits": ["observant", "scholarly", "loyal"]
}
```

---

## 4.2 NPC Memories

This is one of the most important tables.

```sql
CREATE TABLE npc_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npc_id UUID NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL,
    memory_text TEXT NOT NULL,
    importance INTEGER NOT NULL DEFAULT 1,
    related_event_id UUID NULL,
    related_quest_id UUID NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_referenced_at TIMESTAMP NULL
);
```

### `memory_type` examples

* conversation
* combat
* quest
* reputation
* rumor
* world_event

### Example rows

* Player asked about Ember Tower
* Player defeated wolves near Moonvale
* Player helped the village
* Player completed the Alpha Wolf trail

### Purpose

Allows the GM and NPCs to reference real player history.

---

## 4.3 NPC Relationships

Tracks how an NPC feels about a player.

```sql
CREATE TABLE npc_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npc_id UUID NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    affinity_score INTEGER NOT NULL DEFAULT 0,
    trust_score INTEGER NOT NULL DEFAULT 0,
    fear_score INTEGER NOT NULL DEFAULT 0,
    respect_score INTEGER NOT NULL DEFAULT 0,
    relationship_label TEXT DEFAULT 'neutral',
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(npc_id, player_id)
);
```

### Purpose

Supports more nuanced NPC reactions than simple memory.

---

## 4.4 NPC Dialogue State

Stores recent conversational context if needed.

```sql
CREATE TABLE npc_dialogue_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npc_id UUID NOT NULL REFERENCES npcs(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    last_topic TEXT,
    conversation_summary TEXT,
    state JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(npc_id, player_id)
);
```

---

# 5. Lore and Retrieval

## 5.1 Lore Entries

```sql
CREATE TABLE lore_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    region_id UUID NULL,
    faction_id UUID NULL REFERENCES factions(id),
    tags TEXT[] DEFAULT '{}',
    lore_type TEXT DEFAULT 'history',
    canonical_importance INTEGER NOT NULL DEFAULT 1,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `lore_type` examples

* history
* rumor
* geography
* magic
* creature
* faction
* quest_hook

### Purpose

Drives:

* AI GM context retrieval
* lore-based narration
* NPC informed responses

### Seed examples

* The Fall of Ember Tower
* Founding of Moonvale
* Wolves of the Northern Forest

---

## 5.2 Lore Index

```sql
CREATE INDEX lore_entries_embedding_idx
ON lore_entries
USING ivfflat (embedding vector_cosine_ops);
```

Also add:

```sql
CREATE INDEX lore_entries_tags_idx ON lore_entries USING GIN(tags);
CREATE INDEX lore_entries_type_idx ON lore_entries(lore_type);
```

---

# 6. World Model

## 6.1 World Regions

```sql
CREATE TABLE world_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    danger_level INTEGER NOT NULL DEFAULT 1,
    prosperity_score INTEGER NOT NULL DEFAULT 0,
    stability_score INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Example

* Moonvale
* Northern Forest
* Ember Tower Ruins

---

## 6.2 World State

A flexible key/value store for simulation variables.

```sql
CREATE TABLE world_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope_type TEXT NOT NULL,
    scope_id UUID NULL,
    state_key TEXT NOT NULL,
    state_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(scope_type, scope_id, state_key)
);
```

### `scope_type` examples

* global
* region
* faction
* npc
* player

### Example rows

* region / Northern Forest / wolf_population
* region / Moonvale / trade_activity
* global / story_phase
* faction / Forest Guild / influence_score

### Example `state_value`

```json
{
  "value": "reduced",
  "reason": "wolf_kill_threshold_reached",
  "source_event_id": "..."
}
```

---

## 6.3 World Events

```sql
CREATE TABLE world_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    description TEXT NOT NULL,
    region_id UUID NULL REFERENCES world_regions(id),
    trigger_type TEXT,
    trigger_source TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    severity INTEGER NOT NULL DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Examples

* Wolf Pack Retreat
* Arcane Instability Rising
* Forest Guild Patrol Expansion

### Purpose

Used for:

* visible world reactions
* quest generation input
* narration context

---

## 6.4 World Metrics

Useful for simple emergent simulation.

```sql
CREATE TABLE world_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID NULL REFERENCES world_regions(id),
    metric_key TEXT NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(region_id, metric_key)
);
```

### Examples

* wolf_population = 12
* village_safety = 68
* forest_fear = 45
* trade_flow = 31

---

# 7. Gameplay Telemetry

## 7.1 Game Sessions

```sql
CREATE TABLE game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    session_label TEXT,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### Purpose

Groups gameplay into sessions for replay and analytics.

---

## 7.2 Game Events

This is the event log that powers world reactions.

```sql
CREATE TABLE game_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NULL REFERENCES game_sessions(id) ON DELETE SET NULL,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    region_id UUID NULL REFERENCES world_regions(id),
    event_type TEXT NOT NULL,
    event_subtype TEXT NULL,
    description TEXT,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `event_type` examples

* explore
* combat
* conversation
* quest
* discovery
* crafting
* help
* choice
* reward

### `event_subtype` examples

* wolf_kill
* ask_ember_tower
* help_village
* investigate_ruins

### Purpose

This is the main telemetry table for:

* world triggers
* memory creation
* adaptive GM logic
* analytics

---

## 7.3 Game Event Indexes

```sql
CREATE INDEX game_events_player_idx ON game_events(player_id, created_at DESC);
CREATE INDEX game_events_type_idx ON game_events(event_type, event_subtype);
CREATE INDEX game_events_region_idx ON game_events(region_id, created_at DESC);
```

---

# 8. Quest System

## 8.1 Quests

```sql
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    quest_type TEXT DEFAULT 'dynamic',
    status TEXT NOT NULL DEFAULT 'active',
    difficulty INTEGER NOT NULL DEFAULT 1,
    recommended_level INTEGER NOT NULL DEFAULT 1,
    source_type TEXT DEFAULT 'ai_gm',
    source_event_id UUID NULL REFERENCES game_events(id),
    region_id UUID NULL REFERENCES world_regions(id),
    faction_id UUID NULL REFERENCES factions(id),
    reward_data JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `status` values

* active
* completed
* failed
* abandoned
* archived

### Example

* Track the Alpha Wolf
* Recover Ember Shards
* Aid Moonvale Watch

---

## 8.2 Quest Objectives

```sql
CREATE TABLE quest_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    objective_order INTEGER NOT NULL DEFAULT 1,
    objective_text TEXT NOT NULL,
    objective_type TEXT DEFAULT 'action',
    target_count INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Examples

* Defeat 3 wolves
* Speak with Elarin
* Search the northern trail

---

## 8.3 Quest Progress

```sql
CREATE TABLE quest_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    objective_id UUID NULL REFERENCES quest_objectives(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    progress_count INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(quest_id, objective_id, player_id)
);
```

---

# 9. AI Game Master Narration

## 9.1 Narrative Logs

This is the canonical history of what the AI GM said.

```sql
CREATE TABLE narrative_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NULL REFERENCES game_sessions(id) ON DELETE SET NULL,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    input_type TEXT NOT NULL DEFAULT 'player_action',
    player_input TEXT NOT NULL,
    gm_response TEXT NOT NULL,
    tone TEXT DEFAULT 'cinematic',
    difficulty_context JSONB DEFAULT '{}'::jsonb,
    retrieved_context JSONB DEFAULT '{}'::jsonb,
    resulting_event_id UUID NULL REFERENCES game_events(id),
    resulting_quest_id UUID NULL REFERENCES quests(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Purpose

Supports:

* replaying prior story
* debugging AI GM behavior
* referencing actual play history
* future evaluation/training

### `retrieved_context` example

```json
{
  "memories": ["Player defeated wolves near Moonvale"],
  "lore_titles": ["Wolves of the Northern Forest"],
  "world_events": ["Wolf Pack Retreat"]
}
```

---

## 9.2 AI Decisions

Optional but very useful.

```sql
CREATE TABLE ai_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    decision_type TEXT NOT NULL,
    input_summary JSONB DEFAULT '{}'::jsonb,
    output_summary JSONB DEFAULT '{}'::jsonb,
    confidence_score NUMERIC NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Example `decision_type`

* quest_generation
* difficulty_adjustment
* narration_resolution
* memory_selection
* world_state_update

---

# 10. Inventory and Rewards

## 10.1 Player Inventory

```sql
CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_type TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    rarity TEXT DEFAULT 'common',
    metadata JSONB DEFAULT '{}'::jsonb,
    acquired_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Purpose

Lets quests and narration reference actual possessions.

---

## 10.2 Rewards Ledger

```sql
CREATE TABLE rewards_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL,
    reward_value JSONB NOT NULL,
    source_type TEXT,
    source_id UUID NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Examples

* xp
* item
* reputation
* faction_boost
* lore_unlock

---

# 11. Feedback / RLHF

## 11.1 Player Feedback

```sql
CREATE TABLE player_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL,
    target_id UUID NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    sentiment TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `target_type` examples

* gm_response
* quest
* npc_dialogue
* world_event
* combat_outcome

### Purpose

Supports future improvement of:

* AI GM narration
* quest quality
* difficulty tuning

---

# 12. Suggested Seed Data

## 12.1 Regions

```sql
INSERT INTO world_regions (name, description, danger_level, prosperity_score, stability_score)
VALUES
('Moonvale', 'A woodland settlement protected by memory, trade, and old stories.', 2, 55, 70),
('Northern Forest', 'A dense forest where wolves and older things still move unseen.', 4, 20, 40),
('Ember Tower Ruins', 'The shattered remains of a magical tower destroyed long ago.', 5, 10, 25);
```

## 12.2 Faction

```sql
INSERT INTO factions (name, description, alignment, influence_score)
VALUES
('Forest Guild', 'Guardians of the woods and keepers of Moonvale tradition.', 'protective', 70);
```

## 12.3 NPC

```sql
INSERT INTO npcs (name, role, personality, importance)
VALUES
(
  'Elarin',
  'Village Historian',
  '{"tone":"wise","temperament":"calm","traits":["scholarly","observant","loyal"]}'::jsonb,
  5
);
```

## 12.4 Lore

```sql
INSERT INTO lore_entries (title, content, tags, lore_type, canonical_importance)
VALUES
(
  'The Fall of Ember Tower',
  'The Ember Tower collapsed after a magical experiment went wrong many years ago, scattering ash and arcane debris across the valley.',
  ARRAY['ember tower','collapse','magic','history'],
  'history',
  5
),
(
  'Founding of Moonvale',
  'Moonvale was founded by the Forest Guild as a settlement devoted to protecting the ancient woods and preserving old knowledge.',
  ARRAY['moonvale','founding','forest guild'],
  'history',
  4
),
(
  'Wolves of the Northern Forest',
  'Wolves often attack travelers near the northern forest, especially when food is scarce or the woods are disturbed.',
  ARRAY['wolves','northern forest','danger'],
  'creature',
  4
);
```

---

# 13. Example Trigger Rules for API Layer

These are not DB constraints; they are application rules Claude should implement.

## Rule 1: Wolf Pack Retreat

If:

* `game_events.event_type = 'combat'`
* `game_events.event_subtype = 'wolf_kill'`
* player count >= 3 in relevant region

Then:

* create `world_events` record:

  * event_name = `Wolf Pack Retreat`
* update `world_state` for region:

  * `wolf_population = reduced`
* add `npc_memories` entry:

  * `Player defeated wolves near Moonvale`

---

## Rule 2: Ask About Ember Tower

If player asks about Ember Tower:

* create `game_events` row
* create `npc_memories` row:

  * `Player asked about Ember Tower`
* retrieve lore entry: `The Fall of Ember Tower`
* write `narrative_logs` row

---

## Rule 3: Help Village

If player uses Help Village action:

* create `game_events` row
* create `npc_memories` row:

  * `Player helped the village`
* increase faction reputation with Forest Guild
* optionally generate quest

---

# 14. Recommended SQL Indexes

```sql
CREATE INDEX npc_memories_player_npc_idx
ON npc_memories(player_id, npc_id, created_at DESC);

CREATE INDEX narrative_logs_player_idx
ON narrative_logs(player_id, created_at DESC);

CREATE INDEX quests_player_status_idx
ON quests(player_id, status, updated_at DESC);

CREATE INDEX world_events_region_idx
ON world_events(region_id, created_at DESC);

CREATE INDEX player_feedback_target_idx
ON player_feedback(target_type, target_id, created_at DESC);

CREATE INDEX world_state_scope_idx
ON world_state(scope_type, scope_id, state_key);
```

---

# 15. Minimal Relationship Summary

```text
players
  ├── player_profiles
  ├── player_faction_reputation
  ├── player_inventory
  ├── game_sessions
  ├── game_events
  ├── quests
  ├── quest_progress
  ├── narrative_logs
  ├── player_feedback
  ├── rewards_ledger
  ├── npc_memories
  └── npc_relationships

npcs
  ├── npc_memories
  ├── npc_relationships
  └── npc_dialogue_states

factions
  ├── players
  ├── player_faction_reputation
  ├── npcs
  ├── quests
  └── lore_entries

world_regions
  ├── npcs
  ├── lore_entries
  ├── game_events
  ├── quests
  ├── world_events
  ├── world_metrics
  └── world_state

quests
  ├── quest_objectives
  └── quest_progress
```

---

# 16. Claude Code Implementation Notes

Add this at the top of the schema file or in a companion readme:

```text
This schema defines the ZeroDB backend for the AI Game Master system in Moonvale.

Claude Code should:

1. apply this schema to ZeroDB
2. seed world_regions, factions, Elarin, and core lore entries
3. build API routes that read/write from these tables
4. use npc_memories + lore_entries + world_state + recent game_events to generate AI GM context
5. store all narrative outputs in narrative_logs
6. trigger world_events and update world_state based on gameplay thresholds
7. support dynamic quest generation using players, faction reputation, world events, and recent narrative history
```

---

# 17. Best “Demo-First” Table Set

If you want the fastest build, Claude only needs these first:

* `players`
* `factions`
* `npcs`
* `npc_memories`
* `lore_entries`
* `world_regions`
* `world_state`
* `game_events`
* `world_events`
* `quests`
* `narrative_logs`
* `player_feedback`

