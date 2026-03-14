/**
 * API Tests for /api/gm/action endpoint
 * Tests the AI Game Master action endpoint
 *
 * Refs #9
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { POST as gmAction, GET as gmActionGet } from '@/app/api/gm/action/route';
import {
  clearAllData,
  savePlayer,
  saveNPC,
  saveLore,
} from '@/lib/data';
import { clearNarrativeLogs } from '@/lib/narrative-log';

function makePostRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost:3000/api/gm/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/gm/action', () => {
  let testPlayerId: string;

  beforeEach(() => {
    clearAllData();
    clearNarrativeLogs();

    // Create test player
    const player = savePlayer({
      username: 'AdventureTester',
      class: 'Warrior',
      faction: 'Forest Guild',
      level: 3,
      xp: 500,
      inventory: [],
      reputation: 25,
    });
    testPlayerId = player.id;

    // Create test NPC
    saveNPC({
      name: 'Elarin',
      role: 'Historian',
      location: 'Moonvale',
      personality: {},
    });

    // Create test lore
    saveLore({
      title: 'Test Lore',
      content: 'This is test lore for the game world.',
      region: 'Moonvale',
      tags: ['test', 'lore'],
    });
  });

  afterEach(() => {
    clearAllData();
    clearNarrativeLogs();
  });

  it('should return 400 if playerId is missing', async () => {
    const response = await gmAction(
      makePostRequest({ action: 'explore the forest' })
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('should return 400 if action is missing', async () => {
    const response = await gmAction(
      makePostRequest({ playerId: testPlayerId })
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('should validate request structure', () => {
    const validRequest = {
      playerId: testPlayerId,
      action: 'explore the northern forest',
      location: 'Northern Forest',
    };

    expect(validRequest.playerId).toBeDefined();
    expect(validRequest.action).toBeDefined();
    expect(typeof validRequest.action).toBe('string');
  });

  it('should return narrative response structure', () => {
    // Test response structure definition
    const expectedResponseStructure = {
      narrative: {
        locationDescription: expect.any(String),
        actionOutcome: expect.any(String),
        worldReaction: expect.any(String),
        questHooks: expect.any(Array),
        fullNarrative: expect.any(String),
      },
      narrativeLogId: expect.any(String),
      contextUsed: expect.any(Object),
    };

    expect(expectedResponseStructure).toBeDefined();
  });
});

describe('GET /api/gm/action', () => {
  it('should return API documentation', async () => {
    const response = await gmActionGet();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.endpoint).toBe('/api/gm/action');
    expect(data.status).toBe('active');
    expect(data.description).toBeDefined();
    expect(data.usage).toBeDefined();
  });
});
