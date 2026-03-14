/**
 * API route tests for app/api/admin/reset/route.ts
 *
 * Tests POST /api/admin/reset and GET /api/admin/reset against the contract:
 * - POST calls resetWorld() and returns the reset summary.
 * - GET calls getResetStatus() and returns the current world snapshot.
 *
 * These are RED tests: the POST and GET handlers do not exist yet.
 * The existing route only exposes DELETE; POST and GET must be added.
 *
 * Refs #23
 */

import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { POST, GET } from '@/app/api/admin/reset/route';
import { clearAllData, savePlayer } from '@/lib/data';

describe('Admin Reset API', () => {
  beforeEach(() => {
    clearAllData();
  });

  afterAll(() => {
    clearAllData();
  });

  // ---------------------------------------------------------------------------
  // POST /api/admin/reset
  // ---------------------------------------------------------------------------

  describe('POST /api/admin/reset', () => {
    it('should reset world and return summary', async () => {
      // Act
      const request = new Request('http://localhost/api/admin/reset', {
        method: 'POST',
      });
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.result.cleared).toBe(true);
      expect(data.result.seeded).toBeDefined();
      expect(data.result.seeded.npc).toBe('Elarin');
      expect(data.result.seeded.loreCount).toBe(3);
    });

    it('should clear player data', async () => {
      // Arrange — create a player before the reset
      savePlayer({
        username: 'ShouldDisappear',
        class: 'Ranger',
        faction: 'Forest Guild',
        level: 3,
        xp: 450,
        inventory: [],
        reputation: 5,
      });

      // Act
      const request = new Request('http://localhost/api/admin/reset', {
        method: 'POST',
      });
      const response = await POST(request);
      const data = await response.json();

      // Assert — reset succeeded and the summary confirms data was cleared
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result.cleared).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /api/admin/reset
  // ---------------------------------------------------------------------------

  describe('GET /api/admin/reset', () => {
    it('should return current world status', async () => {
      // Act
      const request = new Request('http://localhost/api/admin/reset', {
        method: 'GET',
      });
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.status).toBeDefined();
      expect(data.status).toHaveProperty('playerCount');
      expect(data.status).toHaveProperty('loreCount');
      expect(data.status).toHaveProperty('eventCount');
    });
  });
});
