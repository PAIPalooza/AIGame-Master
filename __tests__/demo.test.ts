/**
 * Tests for lib/demo.ts — Demo Scenario (Issue #22)
 *
 * Verifies the full 2-minute demo script from PRD Section 8:
 *   Step 1: Create Player
 *   Step 2: Ask NPC "What happened to Ember Tower?" → NPC answers using lore
 *   Steps 3-5: Click Fight Wolf × 3
 *   Step 4 (auto): World Event "Wolf Pack Retreat" triggers on 3rd wolf kill
 *   Step 6: Talk to NPC again → NPC references wolf memory
 *
 * Refs #22
 */

import {
    getDemoSteps,
    executeDemoStep,
    runFullDemo,
    DemoStep,
    DemoStepResult,
} from '../lib/demo';
import { clearAllData } from '../lib/data';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEMO_STEP_COUNT = 6;
const EMBER_TOWER_STEP_ID = 'ask_ember_tower';
const WOLF_KILL_STEP_IDS = ['fight_wolf_1', 'fight_wolf_2', 'fight_wolf_3'];
const NPC_MEMORY_STEP_ID = 'ask_about_wolves';
const CREATE_PLAYER_STEP_ID = 'create_player';

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

describe('Demo Scenario', () => {
    beforeEach(() => {
        clearAllData();
    });

    afterEach(() => {
        clearAllData();
    });

    // -----------------------------------------------------------------------
    // getDemoSteps
    // -----------------------------------------------------------------------

    describe('getDemoSteps', () => {
        it('should return 6 ordered demo steps', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert
            expect(steps).toBeDefined();
            expect(Array.isArray(steps)).toBe(true);
            expect(steps.length).toBe(DEMO_STEP_COUNT);
        });

        it('should return steps with required fields on each step', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert — every step must carry all required fields
            steps.forEach((step: DemoStep) => {
                expect(step.id).toBeDefined();
                expect(typeof step.id).toBe('string');
                expect(step.action).toBeDefined();
                expect(typeof step.action).toBe('string');
                expect(step.description).toBeDefined();
                expect(typeof step.description).toBe('string');
                expect(step.expectedOutcome).toBeDefined();
                expect(typeof step.expectedOutcome).toBe('string');
            });
        });

        it('should include Ember Tower question step', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert
            const emberStep = steps.find((s: DemoStep) => s.id === EMBER_TOWER_STEP_ID);
            expect(emberStep).toBeDefined();
            expect(emberStep!.action).toMatch(/ember tower/i);
        });

        it('should include 3 wolf kill steps', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert — all three wolf kill step IDs must be present
            WOLF_KILL_STEP_IDS.forEach(wolfStepId => {
                const wolfStep = steps.find((s: DemoStep) => s.id === wolfStepId);
                expect(wolfStep).toBeDefined();
                expect(wolfStep!.action).toMatch(/wolf/i);
            });
        });

        it('should include final NPC memory check step', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert
            const memoryStep = steps.find((s: DemoStep) => s.id === NPC_MEMORY_STEP_ID);
            expect(memoryStep).toBeDefined();
            expect(memoryStep!.expectedOutcome).toMatch(/wolf/i);
        });

        it('should list create_player as the first step', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert
            expect(steps[0].id).toBe(CREATE_PLAYER_STEP_ID);
        });

        it('should list NPC memory check as the last step', () => {
            // Arrange / Act
            const steps = getDemoSteps();

            // Assert
            expect(steps[steps.length - 1].id).toBe(NPC_MEMORY_STEP_ID);
        });
    });

    // -----------------------------------------------------------------------
    // executeDemoStep
    // -----------------------------------------------------------------------

    describe('executeDemoStep', () => {
        it('should create player on step 1', async () => {
            // Act
            const result = await executeDemoStep(CREATE_PLAYER_STEP_ID);

            // Assert
            expect(result).toBeDefined();
            expect(result.stepId).toBe(CREATE_PLAYER_STEP_ID);
            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data.player).toBeDefined();
            expect(result.data.player.id).toBeDefined();
            expect(typeof result.data.player.username).toBe('string');
            expect(result.data.player.username.length).toBeGreaterThan(0);
        });

        it('should get NPC response about Ember Tower on step 2', async () => {
            // Arrange — player must exist before NPC interaction
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            // Act
            const result = await executeDemoStep(EMBER_TOWER_STEP_ID, playerId);

            // Assert
            expect(result.success).toBe(true);
            expect(result.stepId).toBe(EMBER_TOWER_STEP_ID);
            expect(result.data.npcResponse).toBeDefined();
            expect(typeof result.data.npcResponse.response).toBe('string');
            expect(result.data.npcResponse.response.toLowerCase()).toMatch(/ember tower/i);
        });

        it('should reference lore when responding to Ember Tower question', async () => {
            // Arrange
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            // Act
            const result = await executeDemoStep(EMBER_TOWER_STEP_ID, playerId);

            // Assert — lore retrieval is core to the demo proof point
            expect(result.data.npcResponse.loreUsed).toBeDefined();
            expect(Array.isArray(result.data.npcResponse.loreUsed)).toBe(true);
            expect(result.data.npcResponse.loreUsed.length).toBeGreaterThan(0);
        });

        it('should create wolf kill events on steps 3-5', async () => {
            // Arrange
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            // Act — first two wolf kills
            const kill1 = await executeDemoStep('fight_wolf_1', playerId);
            const kill2 = await executeDemoStep('fight_wolf_2', playerId);

            // Assert
            expect(kill1.success).toBe(true);
            expect(kill1.data.gameEvent).toBeDefined();
            expect(kill1.data.gameEvent.player_id).toBe(playerId);

            expect(kill2.success).toBe(true);
            expect(kill2.data.gameEvent).toBeDefined();
            expect(kill2.data.gameEvent.player_id).toBe(playerId);
        });

        it('should not trigger Wolf Pack Retreat on steps 3 or 4', async () => {
            // Arrange
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            // Act
            const kill1 = await executeDemoStep('fight_wolf_1', playerId);
            const kill2 = await executeDemoStep('fight_wolf_2', playerId);

            // Assert — world event must not fire before the 3rd kill
            expect(kill1.data.worldEvent).toBeUndefined();
            expect(kill2.data.worldEvent).toBeUndefined();
        });

        it('should trigger Wolf Pack Retreat on step 5 (3rd wolf kill)', async () => {
            // Arrange
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            await executeDemoStep('fight_wolf_1', playerId);
            await executeDemoStep('fight_wolf_2', playerId);

            // Act — third kill is the trigger
            const kill3 = await executeDemoStep('fight_wolf_3', playerId);

            // Assert
            expect(kill3.success).toBe(true);
            expect(kill3.data.worldEvent).toBeDefined();
            expect(kill3.data.worldEvent.event_name).toBe('Wolf Pack Retreat');
            expect(kill3.data.worldEvent.trigger_source).toBe(playerId);
        });

        it('should get NPC response referencing wolf memory on step 6', async () => {
            // Arrange — run through all preceding steps
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            await executeDemoStep(EMBER_TOWER_STEP_ID, playerId);
            await executeDemoStep('fight_wolf_1', playerId);
            await executeDemoStep('fight_wolf_2', playerId);
            await executeDemoStep('fight_wolf_3', playerId);

            // Act
            const result = await executeDemoStep(NPC_MEMORY_STEP_ID, playerId);

            // Assert — NPC must surface wolf-related memory in the response
            expect(result.success).toBe(true);
            expect(result.data.npcResponse).toBeDefined();
            expect(result.data.npcResponse.response.toLowerCase()).toMatch(/wolf|wolves/);
        });

        it('should include memoriesReferenced in final NPC response', async () => {
            // Arrange
            const playerResult = await executeDemoStep(CREATE_PLAYER_STEP_ID);
            const playerId = playerResult.data.player.id;

            await executeDemoStep(EMBER_TOWER_STEP_ID, playerId);
            await executeDemoStep('fight_wolf_1', playerId);
            await executeDemoStep('fight_wolf_2', playerId);
            await executeDemoStep('fight_wolf_3', playerId);

            // Act
            const result = await executeDemoStep(NPC_MEMORY_STEP_ID, playerId);

            // Assert — memory array proves the NPC remembers player's actions
            expect(result.data.npcResponse.memoriesReferenced).toBeDefined();
            expect(Array.isArray(result.data.npcResponse.memoriesReferenced)).toBe(true);
            expect(result.data.npcResponse.memoriesReferenced.length).toBeGreaterThan(0);
        });

        it('should return an error result when playerId is missing for NPC steps', async () => {
            // Act — no playerId supplied for a step that requires one
            const result = await executeDemoStep(EMBER_TOWER_STEP_ID, undefined);

            // Assert
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    // -----------------------------------------------------------------------
    // runFullDemo
    // -----------------------------------------------------------------------

    describe('runFullDemo', () => {
        it('should execute all steps and return results', async () => {
            // Act
            const results = await runFullDemo();

            // Assert
            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBe(DEMO_STEP_COUNT);
        });

        it('should mark every step as successful', async () => {
            // Act
            const results = await runFullDemo();

            // Assert
            results.forEach((result: DemoStepResult) => {
                expect(result.success).toBe(true);
            });
        });

        it('should trigger exactly one world event across the full demo', async () => {
            // Act
            const results = await runFullDemo();

            // Assert — count world events from results
            const worldEvents = results
                .map((r: DemoStepResult) => r.data?.worldEvent)
                .filter(Boolean);

            expect(worldEvents.length).toBe(1);
            expect(worldEvents[0].event_name).toBe('Wolf Pack Retreat');
        });

        it('should produce results in the same order as getDemoSteps', async () => {
            // Arrange
            const steps = getDemoSteps();

            // Act
            const results = await runFullDemo();

            // Assert — result order must mirror step definition order
            results.forEach((result: DemoStepResult, index: number) => {
                expect(result.stepId).toBe(steps[index].id);
            });
        });

        it('should carry a player id through all steps after creation', async () => {
            // Act
            const results = await runFullDemo();

            // Assert — every result after the first should reference the same player
            const playerId = results[0].data?.player?.id;
            expect(playerId).toBeDefined();

            // All subsequent results that carry a player reference must match
            results.slice(1).forEach((result: DemoStepResult) => {
                if (result.data?.player) {
                    expect(result.data.player.id).toBe(playerId);
                }
            });
        });
    });
});
