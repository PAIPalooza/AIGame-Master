/**
 * Tests for NPC Talk API route
 * POST /api/npc/talk
 *
 * Refs #7
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { POST as createPlayer } from '@/app/api/player/create/route';
import { POST as npcTalk } from '@/app/api/npc/talk/route';
import { clearAllData, saveLore, saveNPC } from '@/lib/data';
import { clearMemories } from '@/lib/memory';

describe('NPC Talk API Route', () => {
  let playerId: string;

  beforeEach(async () => {
    // Clear all data before each test
    clearAllData();
    clearMemories();

    // Seed lore entries
    saveLore({
      title: 'The Fall of Ember Tower',
      content: 'The Ember Tower collapsed after a magical experiment went wrong many years ago.',
      region: 'Moonvale',
      tags: ['ember tower', 'collapse', 'magic', 'history'],
    });

    saveLore({
      title: 'Founding of Moonvale',
      content: 'Moonvale was founded by the Forest Guild.',
      region: 'Moonvale',
      tags: ['moonvale', 'founding', 'forest guild'],
    });

    saveLore({
      title: 'Wolves of the Northern Forest',
      content: 'Wolves often attack travelers near the northern forest.',
      region: 'Northern Forest',
      tags: ['wolves', 'northern forest', 'danger'],
    });

    // Seed NPC Elarin (required by the route)
    saveNPC({
      name: 'Elarin',
      role: 'Historian',
      location: 'Moonvale',
      personality: {},
    });

    // Create a demo player and capture the ID
    const playerResponse = await createPlayer();
    const playerData = await playerResponse.json();
    playerId = playerData.player.id;
  });

  afterEach(() => {
    clearAllData();
    clearMemories();
  });

  describe('Input Validation', () => {
    it('returns 400 when message is missing', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('returns 400 when playerId is missing', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('returns 400 when both playerId and message are missing', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('NPC Response Generation', () => {
    it('generates response for Ember Tower query', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, message: 'What happened to Ember Tower?' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.npcName).toBe('Elarin');
      expect(data.response).toBeDefined();
      expect(data.response.response).toBeDefined();
      expect(typeof data.response.response).toBe('string');
      expect(data.response.response.length).toBeGreaterThan(0);
    });

    it('generates response for Moonvale query', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, message: 'Tell me about Moonvale' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.npcName).toBe('Elarin');
      expect(data.response).toBeDefined();
      expect(data.response.response).toBeDefined();
    });

    it('generates response for wolves query', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, message: 'Are there wolves nearby?' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.npcName).toBe('Elarin');
      expect(data.response).toBeDefined();
    });

    it('includes lore used in response', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, message: 'What happened to Ember Tower?' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(data.response.loreUsed).toBeDefined();
      expect(Array.isArray(data.response.loreUsed)).toBe(true);
    });

    it('includes memories referenced in response', async () => {
      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, message: 'Hello' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(data.response.memoriesReferenced).toBeDefined();
      expect(Array.isArray(data.response.memoriesReferenced)).toBe(true);
    });
  });

  describe('NPC Requirement', () => {
    it('returns error when no NPC named Elarin exists', async () => {
      // Clear all data (removes NPC) but keep lore
      clearAllData();

      // Re-seed lore only (no NPC)
      saveLore({
        title: 'Test Lore',
        content: 'Test content',
        region: 'Test',
        tags: ['test'],
      });

      const request = new Request('http://localhost:3000/api/npc/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: 'some-player-id', message: 'Hello' }),
      });

      const response = await npcTalk(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('NPC not found');
    });
  });
});
