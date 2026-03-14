import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateNPCResponse, storeActionMemory } from '../lib/npc';
import { getMemories } from '../lib/memory';
import { clearAllData } from '../lib/data';

describe('NPC Dialogue Debug', () => {
  const npcId = 'elarin-1';
  const playerId = 'player-1';

  beforeEach(() => {
    clearAllData();
  });

  afterEach(() => {
    clearAllData();
  });

  it('should store wolf kill memory and retrieve it', async () => {
    // Store wolf kill action
    await storeActionMemory(npcId, playerId, 'wolf_kill');

    // Check if memory was stored
    const memories = getMemories(npcId, playerId);
    console.log('Memories after wolf_kill:', JSON.stringify(memories, null, 2));

    expect(memories.length).toBeGreaterThan(0);
    expect(memories[0].memory).toBe('Player defeated wolves near Moonvale');
  });

  it('should use wolf memory in response', async () => {
    // Store wolf kill action
    await storeActionMemory(npcId, playerId, 'wolf_kill');

    // Get memories
    const memories = getMemories(npcId, playerId);
    console.log('Memories before asking:', JSON.stringify(memories, null, 2));

    // Ask about wolves
    const response = await generateNPCResponse(npcId, playerId, 'Tell me about wolves');

    console.log('Response:', response.response);
    console.log('Memories referenced:', JSON.stringify(response.memoriesReferenced, null, 2));

    expect(response.memoriesReferenced.length).toBeGreaterThan(0);
  });
});
