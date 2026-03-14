/**
 * Tests for Events and Memories API routes
 * GET /api/events
 * GET /api/memories
 *
 * Refs #9
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { POST as createPlayer } from '@/app/api/player/create/route';
import { GET as getEvents } from '@/app/api/events/route';
import { GET as getMemories } from '@/app/api/memories/route';
import { clearAllData, saveGameEvent } from '@/lib/data';
import { storeMemory } from '@/lib/memory';

function makeRequest(url: string): Request {
  return new Request(url);
}

function makeRequestWithParams(baseUrl: string, params: Record<string, string>): Request {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString());
}

describe('Events and Memories API Routes', () => {
  let playerId: string;

  beforeEach(async () => {
    // Clear all data
    clearAllData();

    // Create a player and get their ID
    const playerResponse = await createPlayer();
    const playerData = await playerResponse.json();
    playerId = playerData.player.id;
  });

  afterEach(() => {
    clearAllData();
  });

  describe('GET /api/events', () => {
    it('returns empty array when no events exist', async () => {
      const response = await getEvents(makeRequest('http://localhost:3000/api/events'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it('returns events for the current player', async () => {
      // Create some game events
      saveGameEvent({
        player_id: playerId,
        event_type: 'explore',
        location: 'Moonvale',
        metadata: { description: 'Player explored the forest' },
      });

      saveGameEvent({
        player_id: playerId,
        event_type: 'wolf_kill',
        location: 'Northern Forest',
        metadata: { description: 'Player defeated a wolf' },
      });

      const response = await getEvents(makeRequest('http://localhost:3000/api/events'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
    });

    it('sorts events by most recent first', async () => {
      // Create events with slight time gaps
      const event1 = saveGameEvent({
        player_id: playerId,
        event_type: 'explore',
        location: 'Moonvale',
        metadata: {},
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      const event2 = saveGameEvent({
        player_id: playerId,
        event_type: 'wolf_kill',
        location: 'Forest',
        metadata: {},
      });

      const response = await getEvents(makeRequest('http://localhost:3000/api/events'));
      const data = await response.json();

      expect(data[0].id).toBe(event2.id);
      expect(data[1].id).toBe(event1.id);
    });

    it('includes event attributes', async () => {
      saveGameEvent({
        player_id: playerId,
        event_type: 'npc_conversation',
        location: 'Moonvale',
        metadata: { npc_name: 'Elarin' },
      });

      const response = await getEvents(makeRequest('http://localhost:3000/api/events'));
      const data = await response.json();

      const event = data[0];
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('player_id');
      expect(event).toHaveProperty('event_type');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('metadata');
      expect(event).toHaveProperty('created_at');
    });

    it('returns empty array when no events exist for player', async () => {
      clearAllData();

      const response = await getEvents(makeRequest('http://localhost:3000/api/events'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });
  });

  describe('GET /api/memories', () => {
    it('returns 400 when playerId is missing', async () => {
      const response = await getMemories(makeRequest('http://localhost:3000/api/memories'));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('returns empty array when no memories exist for player', async () => {
      const response = await getMemories(
        makeRequestWithParams('http://localhost:3000/api/memories', { playerId })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it('returns memories for the current player', async () => {
      // Store some NPC memories
      storeMemory('npc-elarin-001', playerId, 'Player asked about Ember Tower', 2);
      storeMemory('npc-elarin-001', playerId, 'Player defeated wolves', 3);

      const response = await getMemories(
        makeRequestWithParams('http://localhost:3000/api/memories', { playerId })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
    });

    it('includes memory attributes', async () => {
      storeMemory('npc-elarin-001', playerId, 'Test memory', 1);

      const response = await getMemories(
        makeRequestWithParams('http://localhost:3000/api/memories', { playerId })
      );
      const data = await response.json();

      const memory = data[0];
      expect(memory).toHaveProperty('id');
      expect(memory).toHaveProperty('npcId');
      expect(memory).toHaveProperty('playerId');
      expect(memory).toHaveProperty('memory');
      expect(memory).toHaveProperty('importance');
      expect(memory).toHaveProperty('createdAt');
    });
  });
});
