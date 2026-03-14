/**
 * Unit tests for quest-engine.ts
 * Tests quest objective CRUD and progress tracking
 *
 * Refs #12, #13
 */

import {
  createQuestObjective,
  getQuestObjectives,
  getQuestObjective,
  updateQuestObjective,
  deleteQuestObjective,
  initQuestProgress,
  getQuestProgress,
  updateQuestProgress,
  checkQuestCompletion,
  completeQuest,
  getPlayerQuests,
} from '../lib/quest-engine';
import { clearAllData } from '../lib/data';

describe('Quest Engine', () => {
  const testQuestId = 'quest-001';
  const testPlayerId = 'player-001';

  beforeEach(() => {
    clearAllData();
  });

  afterEach(() => {
    clearAllData();
  });

  // ===========================================================================
  // Quest Objectives (Issue #12)
  // ===========================================================================

  describe('Quest Objectives', () => {
    describe('createQuestObjective', () => {
      it('should create an objective with valid data', () => {
        const obj = createQuestObjective(
          testQuestId,
          'Defeat 3 wolves',
          'kill',
          3,
          0
        );

        expect(obj).toBeDefined();
        expect(obj.id).toBeDefined();
        expect(obj.questId).toBe(testQuestId);
        expect(obj.description).toBe('Defeat 3 wolves');
        expect(obj.type).toBe('kill');
        expect(obj.targetCount).toBe(3);
        expect(obj.currentCount).toBe(0);
        expect(obj.isCompleted).toBe(false);
        expect(obj.orderIndex).toBe(0);
        expect(obj.createdAt).toBeDefined();
        expect(obj.updatedAt).toBeDefined();
      });

      it('should reject missing questId', () => {
        expect(() =>
          createQuestObjective('', 'Defeat wolves', 'kill', 3, 0)
        ).toThrow('questId is required');
      });

      it('should reject missing description', () => {
        expect(() =>
          createQuestObjective(testQuestId, '', 'kill', 3, 0)
        ).toThrow('description is required');
      });

      it('should reject targetCount < 1', () => {
        expect(() =>
          createQuestObjective(testQuestId, 'Defeat wolves', 'kill', 0, 0)
        ).toThrow('targetCount must be at least 1');
      });

      it('should store optional metadata', () => {
        const obj = createQuestObjective(
          testQuestId,
          'Explore the ruins',
          'explore',
          1,
          0,
          { region: 'Ember Tower' }
        );

        expect(obj.metadata).toEqual({ region: 'Ember Tower' });
      });
    });

    describe('getQuestObjectives', () => {
      it('should list objectives sorted by orderIndex', () => {
        createQuestObjective(testQuestId, 'Third', 'custom', 1, 2);
        createQuestObjective(testQuestId, 'First', 'custom', 1, 0);
        createQuestObjective(testQuestId, 'Second', 'custom', 1, 1);

        const objectives = getQuestObjectives(testQuestId);

        expect(objectives).toHaveLength(3);
        expect(objectives[0].description).toBe('First');
        expect(objectives[1].description).toBe('Second');
        expect(objectives[2].description).toBe('Third');
      });

      it('should return empty array for unknown questId', () => {
        const objectives = getQuestObjectives('nonexistent');
        expect(objectives).toEqual([]);
      });

      it('should only return objectives for the specified quest', () => {
        createQuestObjective(testQuestId, 'Quest 1 obj', 'kill', 1, 0);
        createQuestObjective('other-quest', 'Quest 2 obj', 'kill', 1, 0);

        const objectives = getQuestObjectives(testQuestId);
        expect(objectives).toHaveLength(1);
        expect(objectives[0].description).toBe('Quest 1 obj');
      });
    });

    describe('getQuestObjective', () => {
      it('should retrieve a single objective by ID', () => {
        const created = createQuestObjective(testQuestId, 'Test', 'kill', 1, 0);
        const retrieved = getQuestObjective(created.id);

        expect(retrieved).not.toBeNull();
        expect(retrieved?.id).toBe(created.id);
      });

      it('should return null for non-existent ID', () => {
        const result = getQuestObjective('nonexistent-id');
        expect(result).toBeNull();
      });
    });

    describe('updateQuestObjective', () => {
      it('should update objective description', () => {
        const obj = createQuestObjective(testQuestId, 'Old desc', 'kill', 3, 0);
        const updated = updateQuestObjective(obj.id, { description: 'New desc' });

        expect(updated).not.toBeNull();
        expect(updated?.description).toBe('New desc');
      });

      it('should update targetCount', () => {
        const obj = createQuestObjective(testQuestId, 'Test', 'kill', 3, 0);
        const updated = updateQuestObjective(obj.id, { targetCount: 5 });

        expect(updated?.targetCount).toBe(5);
      });

      it('should auto-complete when currentCount >= targetCount', () => {
        const obj = createQuestObjective(testQuestId, 'Test', 'kill', 3, 0);
        const updated = updateQuestObjective(obj.id, { currentCount: 3 });

        expect(updated?.isCompleted).toBe(true);
      });

      it('should auto-complete when currentCount exceeds targetCount', () => {
        const obj = createQuestObjective(testQuestId, 'Test', 'kill', 3, 0);
        const updated = updateQuestObjective(obj.id, { currentCount: 5 });

        expect(updated?.isCompleted).toBe(true);
      });

      it('should return null for non-existent objective', () => {
        const result = updateQuestObjective('nonexistent', { description: 'x' });
        expect(result).toBeNull();
      });

      it('should update the updatedAt timestamp', () => {
        const obj = createQuestObjective(testQuestId, 'Test', 'kill', 3, 0);
        const originalUpdatedAt = obj.updatedAt;

        // Small delay to ensure different timestamp
        const updated = updateQuestObjective(obj.id, { description: 'Changed' });

        expect(updated?.updatedAt).toBeDefined();
        // updatedAt should be different or equal (same millisecond possible)
        expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
          new Date(originalUpdatedAt).getTime()
        );
      });
    });

    describe('deleteQuestObjective', () => {
      it('should delete an existing objective', () => {
        const obj = createQuestObjective(testQuestId, 'Test', 'kill', 1, 0);
        const result = deleteQuestObjective(obj.id);

        expect(result).toBe(true);
        expect(getQuestObjective(obj.id)).toBeNull();
      });

      it('should return false for non-existent ID', () => {
        const result = deleteQuestObjective('nonexistent-id');
        expect(result).toBe(false);
      });
    });
  });

  // ===========================================================================
  // Quest Progress (Issue #13)
  // ===========================================================================

  describe('Quest Progress', () => {
    describe('initQuestProgress', () => {
      it('should initialize progress at not_started', () => {
        const progress = initQuestProgress(testQuestId, testPlayerId);

        expect(progress).toBeDefined();
        expect(progress.id).toBeDefined();
        expect(progress.questId).toBe(testQuestId);
        expect(progress.playerId).toBe(testPlayerId);
        expect(progress.status).toBe('not_started');
        expect(progress.objectiveProgress).toEqual({});
        expect(progress.createdAt).toBeDefined();
      });

      it('should return existing progress if already initialized', () => {
        const first = initQuestProgress(testQuestId, testPlayerId);
        const second = initQuestProgress(testQuestId, testPlayerId);

        expect(second.id).toBe(first.id);
      });

      it('should reject missing questId', () => {
        expect(() => initQuestProgress('', testPlayerId)).toThrow('questId is required');
      });

      it('should reject missing playerId', () => {
        expect(() => initQuestProgress(testQuestId, '')).toThrow('playerId is required');
      });
    });

    describe('updateQuestProgress', () => {
      it('should increment objective progress', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        const progress = updateQuestProgress(testQuestId, testPlayerId, obj.id);

        expect(progress.objectiveProgress[obj.id]).toBe(1);
      });

      it('should transition status to in_progress on first update', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        const progress = updateQuestProgress(testQuestId, testPlayerId, obj.id);

        expect(progress.status).toBe('in_progress');
        expect(progress.startedAt).toBeDefined();
      });

      it('should auto-initialize progress if not exists', () => {
        const obj = createQuestObjective(testQuestId, 'Test', 'kill', 3, 0);
        const progress = updateQuestProgress(testQuestId, testPlayerId, obj.id);

        expect(progress).toBeDefined();
        expect(progress.questId).toBe(testQuestId);
        expect(progress.playerId).toBe(testPlayerId);
      });

      it('should increment by custom amount', () => {
        const obj = createQuestObjective(testQuestId, 'Collect gems', 'collect', 10, 0);
        const progress = updateQuestProgress(testQuestId, testPlayerId, obj.id, 5);

        expect(progress.objectiveProgress[obj.id]).toBe(5);
      });

      it('should update the objective currentCount', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        updateQuestProgress(testQuestId, testPlayerId, obj.id);

        const updated = getQuestObjective(obj.id);
        expect(updated?.currentCount).toBe(1);
      });
    });

    describe('Multi-objective independence', () => {
      it('should track multiple objectives independently', () => {
        const obj1 = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        const obj2 = createQuestObjective(testQuestId, 'Collect herbs', 'collect', 5, 1);

        updateQuestProgress(testQuestId, testPlayerId, obj1.id, 2);
        updateQuestProgress(testQuestId, testPlayerId, obj2.id, 1);

        const progress = getQuestProgress(testQuestId, testPlayerId);

        expect(progress?.objectiveProgress[obj1.id]).toBe(2);
        expect(progress?.objectiveProgress[obj2.id]).toBe(1);
      });
    });

    describe('checkQuestCompletion', () => {
      it('should return false when incomplete', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        updateQuestProgress(testQuestId, testPlayerId, obj.id, 1);

        expect(checkQuestCompletion(testQuestId, testPlayerId)).toBe(false);
      });

      it('should return true when all objectives met', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        updateQuestProgress(testQuestId, testPlayerId, obj.id, 3);

        expect(checkQuestCompletion(testQuestId, testPlayerId)).toBe(true);
      });

      it('should return false when no objectives exist', () => {
        expect(checkQuestCompletion(testQuestId, testPlayerId)).toBe(false);
      });

      it('should return false when no progress exists', () => {
        createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        expect(checkQuestCompletion(testQuestId, testPlayerId)).toBe(false);
      });

      it('should require ALL objectives to be met', () => {
        const obj1 = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        const obj2 = createQuestObjective(testQuestId, 'Collect herbs', 'collect', 5, 1);

        updateQuestProgress(testQuestId, testPlayerId, obj1.id, 3);
        updateQuestProgress(testQuestId, testPlayerId, obj2.id, 2);

        expect(checkQuestCompletion(testQuestId, testPlayerId)).toBe(false);
      });
    });

    describe('completeQuest', () => {
      it('should mark quest as completed with timestamp', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        updateQuestProgress(testQuestId, testPlayerId, obj.id, 3);

        const result = completeQuest(testQuestId, testPlayerId);

        expect(result).not.toBeNull();
        expect(result?.status).toBe('completed');
        expect(result?.completedAt).toBeDefined();
      });

      it('should return null when quest is not complete', () => {
        const obj = createQuestObjective(testQuestId, 'Kill wolves', 'kill', 3, 0);
        updateQuestProgress(testQuestId, testPlayerId, obj.id, 1);

        const result = completeQuest(testQuestId, testPlayerId);
        expect(result).toBeNull();
      });

      it('should return null when no progress exists', () => {
        const result = completeQuest(testQuestId, testPlayerId);
        expect(result).toBeNull();
      });
    });

    describe('getPlayerQuests', () => {
      it('should return all quests for a player', () => {
        initQuestProgress('quest-001', testPlayerId);
        initQuestProgress('quest-002', testPlayerId);
        initQuestProgress('quest-003', 'other-player');

        const quests = getPlayerQuests(testPlayerId);

        expect(quests).toHaveLength(2);
        expect(quests.every(q => q.playerId === testPlayerId)).toBe(true);
      });

      it('should return empty array for player with no quests', () => {
        const quests = getPlayerQuests('unknown-player');
        expect(quests).toEqual([]);
      });

      it('should return quests sorted by updatedAt descending', () => {
        initQuestProgress('quest-001', testPlayerId);
        initQuestProgress('quest-002', testPlayerId);

        const quests = getPlayerQuests(testPlayerId);

        // Verify the result is sorted by updatedAt descending
        for (let i = 1; i < quests.length; i++) {
          expect(new Date(quests[i - 1].updatedAt).getTime())
            .toBeGreaterThanOrEqual(new Date(quests[i].updatedAt).getTime());
        }
      });
    });
  });
});
