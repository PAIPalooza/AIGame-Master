/**
 * Unit tests for lib/reset.ts — Demo Reset module
 *
 * Tests resetWorld() and getResetStatus() against the contract:
 * - resetWorld() clears all data, re-seeds Elarin NPC + 3 lore entries,
 *   returns a structured summary.
 * - getResetStatus() returns a live snapshot of world state counts.
 *
 * These are RED tests: lib/reset.ts does not exist yet.
 *
 * Refs #23
 */

import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { clearAllData, getDataStats, savePlayer, saveGameEvent } from '../lib/data';
import { resetWorld, getResetStatus } from '../lib/reset';

describe('Demo Reset', () => {
  beforeEach(() => {
    clearAllData();
  });

  afterAll(() => {
    clearAllData();
  });

  // ---------------------------------------------------------------------------
  // resetWorld()
  // ---------------------------------------------------------------------------

  describe('resetWorld', () => {
    it('should clear all existing data', async () => {
      // Arrange — write some data that should be wiped
      savePlayer({
        username: 'TestPlayer',
        class: 'Warrior',
        faction: 'Test',
        level: 5,
        xp: 999,
        inventory: [],
        reputation: 10,
      });

      // Act
      await resetWorld();

      // Assert — players written before reset are gone
      const stats = getDataStats();
      expect(stats.players).toBe(0);
    });

    it('should re-seed Elarin NPC', async () => {
      // Act
      await resetWorld();

      // Assert — exactly one NPC exists and it is Elarin
      const stats = getDataStats();
      expect(stats.totalFiles).toBeGreaterThan(0);

      // getResetStatus exposes seeded NPC name, verified via summary
      const result = await resetWorld();
      expect(result.seeded.npc).toBe('Elarin');
    });

    it('should re-seed 3 lore entries', async () => {
      // Act
      const result = await resetWorld();

      // Assert
      expect(result.seeded.loreCount).toBe(3);
    });

    it('should return reset summary', async () => {
      // Act
      const result = await resetWorld();

      // Assert — shape of the summary object
      expect(result).toHaveProperty('cleared');
      expect(result).toHaveProperty('seeded');
      expect(result.cleared).toBe(true);
      expect(result.seeded).toHaveProperty('npc');
      expect(result.seeded).toHaveProperty('loreCount');
    });

    it('should be idempotent (safe to call multiple times)', async () => {
      // Act — call twice
      await resetWorld();
      const result = await resetWorld();

      // Assert — second call succeeds with same summary shape
      expect(result.cleared).toBe(true);
      expect(result.seeded.npc).toBe('Elarin');
      expect(result.seeded.loreCount).toBe(3);

      // And world state reflects exactly one round of seeding
      const status = await getResetStatus();
      expect(status.loreCount).toBe(3);
    });
  });

  // ---------------------------------------------------------------------------
  // getResetStatus()
  // ---------------------------------------------------------------------------

  describe('getResetStatus', () => {
    it('should return world state summary', async () => {
      // Arrange — seed some data
      await resetWorld();

      // Act
      const status = await getResetStatus();

      // Assert — required summary fields
      expect(status).toHaveProperty('playerCount');
      expect(status).toHaveProperty('loreCount');
      expect(status).toHaveProperty('eventCount');
    });

    it('should reflect empty state after reset', async () => {
      // Arrange — create a player and an event before reset
      const player = savePlayer({
        username: 'WillBeGone',
        class: 'Mage',
        faction: 'None',
        level: 1,
        xp: 0,
        inventory: [],
        reputation: 0,
      });
      saveGameEvent({
        player_id: player.id,
        event_type: 'explore',
        location: 'Forest',
        metadata: {},
      });

      // Act
      await resetWorld();
      const status = await getResetStatus();

      // Assert — player and event counts are zero after reset
      expect(status.playerCount).toBe(0);
      expect(status.eventCount).toBe(0);
    });
  });
});
