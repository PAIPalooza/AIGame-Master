/**
 * Demo Reset module for ZDBGame - Moonvale
 *
 * Provides resetWorld() and getResetStatus() for the admin reset API.
 * resetWorld() clears all data and re-seeds the initial Elarin NPC and 3 lore entries.
 * getResetStatus() returns a live snapshot of world state counts.
 *
 * Refs #23
 */

import { clearAllData, getDataStats, saveNPC, saveLore } from './data';
import { getSeedNPC, getSeedLore } from './seed';

// ============================================================================
// resetWorld
// ============================================================================

/**
 * Reset the demo world to its initial state.
 *
 * 1. Clears all persisted data.
 * 2. Re-seeds the Elarin NPC and 3 canonical lore entries.
 * 3. Returns a structured summary of what was created.
 *
 * Safe to call multiple times (idempotent — each call produces exactly
 * one NPC and three lore entries).
 *
 * Refs #23
 */
export async function resetWorld(): Promise<{
  cleared: boolean;
  seeded: { npc: string; loreCount: number };
}> {
  // Clear all existing data
  clearAllData();

  // Seed Elarin NPC
  const seedNPC = getSeedNPC();
  saveNPC({
    name: seedNPC.name,
    role: seedNPC.role,
    location: seedNPC.location,
    personality: {},
  });

  // Seed the 3 canonical lore entries
  const seedLore = getSeedLore();
  for (const entry of seedLore) {
    saveLore({
      title: entry.title,
      content: entry.content,
      region: 'Moonvale',
      tags: entry.tags,
    });
  }

  return {
    cleared: true,
    seeded: {
      npc: seedNPC.name,
      loreCount: seedLore.length,
    },
  };
}

// ============================================================================
// getResetStatus
// ============================================================================

/**
 * Return a live snapshot of world state counts.
 *
 * Maps getDataStats() fields to the public API surface:
 *   players    → playerCount
 *   lore       → loreCount
 *   gameEvents → eventCount
 *
 * Refs #23
 */
export async function getResetStatus(): Promise<{
  playerCount: number;
  loreCount: number;
  eventCount: number;
}> {
  const stats = getDataStats();

  return {
    playerCount: stats.players,
    loreCount: stats.lore,
    eventCount: stats.gameEvents,
  };
}
