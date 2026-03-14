import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateNPCResponse, storeActionMemory } from '../lib/npc';
import { searchLore } from '../lib/lore';
import { getMemories } from '../lib/memory';
import { clearAllData } from '../lib/data';

describe('NPC Dialogue System', () => {
  const npcId = 'elarin-1';
  const playerId = 'player-1';

  beforeEach(() => {
    clearAllData();
  });

  afterEach(() => {
    clearAllData();
  });

  describe('Lore Retrieval', () => {
    it('should search lore by keyword - ember tower', () => {
      const results = searchLore('ember tower');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Ember Tower');
    });

    it('should search lore by keyword - moonvale', () => {
      const results = searchLore('moonvale');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tags).toContain('moonvale');
    });

    it('should search lore by keyword - wolves', () => {
      const results = searchLore('wolves');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].tags).toContain('wolves');
    });

    it('should return empty array for unknown keywords', () => {
      const results = searchLore('unicorns');
      expect(results.length).toBe(0);
    });
  });

  describe('NPC Response Generation', () => {
    it('should return Ember Tower lore when asked', async () => {
      const response = await generateNPCResponse(npcId, playerId, 'What happened to Ember Tower?');
      
      expect(response.response).toBeTruthy();
      expect(response.response.toLowerCase()).toContain('tower');
      expect(response.loreUsed.length).toBeGreaterThan(0);
      expect(response.loreUsed[0].tags).toContain('ember tower');
    });

    it('should return Moonvale lore when asked', async () => {
      const response = await generateNPCResponse(npcId, playerId, 'Tell me about Moonvale');
      
      expect(response.response).toBeTruthy();
      expect(response.response.toLowerCase()).toContain('moonvale');
      expect(response.loreUsed.length).toBeGreaterThan(0);
      expect(response.loreUsed[0].tags).toContain('moonvale');
    });

    it('should return wolves lore when asked', async () => {
      const response = await generateNPCResponse(npcId, playerId, 'Are there wolves in the forest?');
      
      expect(response.response).toBeTruthy();
      expect(response.response.toLowerCase()).toContain('wolves');
      expect(response.loreUsed.length).toBeGreaterThan(0);
      expect(response.loreUsed[0].tags).toContain('wolves');
    });

    it('should provide greeting response', async () => {
      const response = await generateNPCResponse(npcId, playerId, 'Hello');
      
      expect(response.response).toBeTruthy();
      expect(response.response.toLowerCase()).toMatch(/greetings|welcome|elarin/);
    });

    it('should provide help response', async () => {
      const response = await generateNPCResponse(npcId, playerId, 'Can you help me?');
      
      expect(response.response).toBeTruthy();
      expect(response.response.toLowerCase()).toContain('knowledge');
    });
  });

  describe('Memory Integration', () => {
    it('should store memory when player asks about Ember Tower', async () => {
      await generateNPCResponse(npcId, playerId, 'What happened to Ember Tower?');
      
      const memories = getMemories(npcId, playerId);
      expect(memories.length).toBeGreaterThan(0);
      expect(memories[0].memory).toContain('Ember Tower');
    });

    it('should reference player actions in responses', async () => {
      // Simulate player defeating wolves
      await storeActionMemory(npcId, playerId, 'wolf_kill');

      // Ask about wolves
      const response = await generateNPCResponse(npcId, playerId, 'Tell me about wolves');
      
      expect(response.response).toContain('drove the wolves back');
      expect(response.memoriesReferenced.length).toBeGreaterThan(0);
    });

    it('should not create duplicate memories', async () => {
      // Ask the same question twice
      await generateNPCResponse(npcId, playerId, 'What happened to Ember Tower?');
      await generateNPCResponse(npcId, playerId, 'What happened to Ember Tower?');
      
      const memories = getMemories(npcId, playerId);
      // Should only have one memory entry for Ember Tower question
      const emberMemories = memories.filter(m => m.memory.includes('Ember Tower'));
      expect(emberMemories.length).toBe(1);
    });

    it('should store action memories correctly', async () => {
      await storeActionMemory(npcId, playerId, 'explore');
      await storeActionMemory(npcId, playerId, 'help_village');
      await storeActionMemory(npcId, playerId, 'wolf_kill');
      
      const memories = getMemories(npcId, playerId);
      expect(memories.length).toBe(3);
      
      const actionTypes = memories.map(m => m.memory);
      expect(actionTypes).toContain('Player explored the northern forest');
      expect(actionTypes).toContain('Player helped the village');
      expect(actionTypes).toContain('Player defeated wolves near Moonvale');
    });
  });

  describe('Deterministic Behavior', () => {
    it('should return same response for same input without memory', async () => {
      clearAllData();

      const response1 = await generateNPCResponse(npcId, 'player-test-1', 'What happened to Ember Tower?');
      clearAllData();
      const response2 = await generateNPCResponse(npcId, 'player-test-2', 'What happened to Ember Tower?');
      
      // Both should contain the same lore content
      expect(response1.loreUsed[0].id).toBe(response2.loreUsed[0].id);
    });

    it('should always work without external API calls', async () => {
      // This test verifies no external dependencies
      const testCases = [
        'What happened to Ember Tower?',
        'Tell me about Moonvale',
        'Are there wolves?',
        'Hello',
        'Can you help me?'
      ];

      for (const message of testCases) {
        const response = await generateNPCResponse(npcId, playerId, message);
        expect(response.response).toBeTruthy();
        expect(typeof response.response).toBe('string');
        expect(response.response.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', async () => {
      const response = await generateNPCResponse(npcId, playerId, '');
      expect(response.response).toBeTruthy();
    });

    it('should handle message with mixed case', async () => {
      const response = await generateNPCResponse(npcId, playerId, 'What Happened To EMBER TOWER?');
      expect(response.response.toLowerCase()).toContain('tower');
      expect(response.loreUsed.length).toBeGreaterThan(0);
    });

    it('should handle message with extra whitespace', async () => {
      const response = await generateNPCResponse(npcId, playerId, '  ember   tower  ');
      expect(response.response.toLowerCase()).toContain('tower');
      expect(response.loreUsed.length).toBeGreaterThan(0);
    });
  });
});
