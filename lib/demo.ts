/**
 * Demo Scenario for ZDBGame - Moonvale 2-Minute Demo
 *
 * Implements the full demo script from PRD Section 8:
 *   Step 1: Create Player
 *   Step 2: Ask NPC "What happened to Ember Tower?" — NPC answers using lore
 *   Steps 3-5: Fight Wolf × 3
 *   Step 4 (auto): World Event "Wolf Pack Retreat" triggers on 3rd wolf kill
 *   Step 6: Talk to NPC again — NPC references wolf memory
 *
 * Refs #22
 */

import { savePlayer } from './data';
import { processGameplayEvent } from './game-engine';
import { generateNPCResponse, storeActionMemory } from './npc';

// ============================================================================
// Types
// ============================================================================

export interface DemoStep {
    id: string;
    action: string;
    description: string;
    expectedOutcome: string;
}

export interface DemoStepResult {
    stepId: string;
    success: boolean;
    data: any;
    error?: string;
}

// ============================================================================
// Constants
// ============================================================================

/** Fixed NPC ID for Elarin, the Village Historian used throughout the demo */
const DEMO_NPC_ID = 'elarin-1';

/** Default player definition for the demo */
const DEMO_PLAYER = {
    username: 'DemoAdventurer',
    class: 'Ranger',
    faction: 'Forest Guild',
    level: 1,
    xp: 0,
    inventory: [],
    reputation: 0,
};

// ============================================================================
// getDemoSteps
// ============================================================================

/**
 * Returns the ordered list of demo steps that constitute the 2-minute demo.
 * Steps map directly to executeDemoStep() calls.
 */
export function getDemoSteps(): DemoStep[] {
    return [
        {
            id: 'create_player',
            action: 'Create a new player character',
            description: 'Initialize a new adventurer who will explore Moonvale',
            expectedOutcome: 'Player is created with a unique ID and default stats',
        },
        {
            id: 'ask_ember_tower',
            action: 'Ask Elarin about the ember tower',
            description: 'Player queries the village historian about Ember Tower history',
            expectedOutcome: 'NPC responds with lore about Ember Tower drawn from the knowledge base',
        },
        {
            id: 'fight_wolf_1',
            action: 'Fight and defeat a wolf (1st wolf kill)',
            description: 'Player engages a wolf near the northern forest',
            expectedOutcome: 'Wolf kill event recorded; no world event yet',
        },
        {
            id: 'fight_wolf_2',
            action: 'Fight and defeat a wolf (2nd wolf kill)',
            description: 'Player defeats a second wolf patrolling the forest edge',
            expectedOutcome: 'Second wolf kill recorded; world event threshold not yet reached',
        },
        {
            id: 'fight_wolf_3',
            action: 'Fight and defeat a wolf (3rd wolf kill)',
            description: 'Player slays a third wolf, tipping the balance in Moonvale',
            expectedOutcome: 'Third wolf kill triggers the Wolf Pack Retreat world event',
        },
        {
            id: 'ask_about_wolves',
            action: 'Ask Elarin about wolves and recent events',
            description: 'Player returns to the historian after driving off the wolves',
            expectedOutcome: 'NPC references the wolf kills in their response, demonstrating persistent memory',
        },
    ];
}

// ============================================================================
// executeDemoStep
// ============================================================================

/**
 * Execute a single demo step by ID.
 *
 * NPC steps require a playerId; if omitted they return an error result.
 * Wolf kill steps also store action memories so the NPC can reference them later.
 */
export async function executeDemoStep(
    stepId: string,
    playerId?: string,
): Promise<DemoStepResult> {
    try {
        switch (stepId) {
            case 'create_player': {
                const player = savePlayer(DEMO_PLAYER);
                return {
                    stepId,
                    success: true,
                    data: { player },
                };
            }

            case 'ask_ember_tower': {
                if (!playerId) {
                    return {
                        stepId,
                        success: false,
                        error: 'playerId is required',
                        data: {},
                    };
                }
                const npcResponse = await generateNPCResponse(
                    DEMO_NPC_ID,
                    playerId,
                    'What happened to the ember tower?',
                );
                return {
                    stepId,
                    success: true,
                    data: { npcResponse },
                };
            }

            case 'fight_wolf_1':
            case 'fight_wolf_2':
            case 'fight_wolf_3': {
                if (!playerId) {
                    return {
                        stepId,
                        success: false,
                        error: 'playerId is required',
                        data: {},
                    };
                }
                const { gameEvent, worldEvent } = processGameplayEvent(
                    playerId,
                    'wolf_kill',
                    'Player defeated a wolf near the northern forest',
                    'Northern Forest',
                );
                // Store NPC memory of the wolf kill so Elarin can reference it
                await storeActionMemory(DEMO_NPC_ID, playerId, 'wolf_kill');
                return {
                    stepId,
                    success: true,
                    data: worldEvent ? { gameEvent, worldEvent } : { gameEvent },
                };
            }

            case 'ask_about_wolves': {
                if (!playerId) {
                    return {
                        stepId,
                        success: false,
                        error: 'playerId is required',
                        data: {},
                    };
                }
                const npcResponse = await generateNPCResponse(
                    DEMO_NPC_ID,
                    playerId,
                    'Tell me about wolves',
                );
                return {
                    stepId,
                    success: true,
                    data: { npcResponse },
                };
            }

            default: {
                return {
                    stepId,
                    success: false,
                    error: `Unknown step ID: ${stepId}`,
                    data: {},
                };
            }
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            stepId,
            success: false,
            error: message,
            data: {},
        };
    }
}

// ============================================================================
// runFullDemo
// ============================================================================

/**
 * Run the complete 2-minute demo from start to finish.
 *
 * Executes all steps in order, threading the playerId created in step 1
 * through every subsequent step.
 *
 * Returns the ordered array of DemoStepResult values.
 */
export async function runFullDemo(): Promise<DemoStepResult[]> {
    const steps = getDemoSteps();
    const results: DemoStepResult[] = [];
    let playerId: string | undefined;

    for (const step of steps) {
        const result = await executeDemoStep(step.id, playerId);
        results.push(result);

        // Capture the playerId from the create_player step
        if (step.id === 'create_player' && result.success && result.data?.player?.id) {
            playerId = result.data.player.id;
        }
    }

    return results;
}
