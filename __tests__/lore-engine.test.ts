/**
 * Unit tests for lore-engine.ts
 * Tests semantic search, hybrid search, and lore indexing
 *
 * Refs #16
 */

import {
  indexLoreEntry,
  indexAllLore,
  searchLoreSemantic,
  searchLoreHybrid,
  clearEmbeddingCache,
} from '../lib/lore-engine';
import { clearAllData, saveLore } from '../lib/data';

describe('Lore Engine', () => {
  let loreIds: string[];

  beforeEach(() => {
    clearAllData();
    clearEmbeddingCache();

    // Seed lore entries
    const lore1 = saveLore({
      title: 'The Fall of Ember Tower',
      content: 'The Ember Tower collapsed after a magical experiment went wrong. Arcane energy scattered across the region.',
      region: 'Moonvale',
      tags: ['ember tower', 'magic', 'history'],
    });

    const lore2 = saveLore({
      title: 'Forest Wolf Pack',
      content: 'The northern forest is home to a large wolf pack. They have been growing bolder near the village.',
      region: 'Northern Forest',
      tags: ['wolves', 'forest', 'danger'],
    });

    const lore3 = saveLore({
      title: 'Moonvale Trade Routes',
      content: 'Trade routes through Moonvale connect the eastern kingdoms. Merchants pass through daily.',
      region: 'Moonvale',
      tags: ['trade', 'moonvale', 'economy'],
    });

    const lore4 = saveLore({
      title: 'Ancient Elven Artifacts',
      content: 'Ancient elven artifacts were found deep within the forest ruins. They radiate a strange magical energy.',
      region: 'Forest Ruins',
      tags: ['elven', 'artifacts', 'magic'],
    });

    loreIds = [lore1.id, lore2.id, lore3.id, lore4.id];
  });

  afterEach(() => {
    clearAllData();
    clearEmbeddingCache();
  });

  describe('indexLoreEntry', () => {
    it('should index a lore entry and create embedding', () => {
      const result = indexLoreEntry(loreIds[0]);
      expect(result).toBe(true);
    });

    it('should return false for non-existent lore', () => {
      const result = indexLoreEntry('nonexistent-id');
      expect(result).toBe(false);
    });
  });

  describe('indexAllLore', () => {
    it('should index all lore entries', () => {
      const count = indexAllLore();
      expect(count).toBe(4);
    });
  });

  describe('searchLoreSemantic', () => {
    it('should return ranked results', () => {
      indexAllLore();
      const results = searchLoreSemantic('wolf forest danger');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThanOrEqual(results[results.length - 1].score);
      expect(results[0].matchType).toBe('semantic');
    });

    it('should respect limit parameter', () => {
      indexAllLore();
      const results = searchLoreSemantic('magic', 2);

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should auto-index unindexed lore', () => {
      // Don't manually index - searchLoreSemantic should auto-index
      const results = searchLoreSemantic('wolf');

      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results with entry and score', () => {
      indexAllLore();
      const results = searchLoreSemantic('magic tower');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].entry).toBeDefined();
      expect(results[0].entry.title).toBeDefined();
      expect(results[0].score).toBeGreaterThan(0);
    });
  });

  describe('searchLoreHybrid', () => {
    it('should combine semantic and keyword results', () => {
      indexAllLore();
      const results = searchLoreHybrid('wolf pack forest');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchType).toBe('hybrid');
    });

    it('should filter by tags', () => {
      indexAllLore();
      const results = searchLoreHybrid('magic', ['magic']);

      expect(results.length).toBeGreaterThan(0);
      // Magic-tagged entries should score higher
      const magicTagged = results.filter(r =>
        r.entry.tags.includes('magic')
      );
      const nonMagicTagged = results.filter(r =>
        !r.entry.tags.includes('magic')
      );

      if (magicTagged.length > 0 && nonMagicTagged.length > 0) {
        expect(magicTagged[0].score).toBeGreaterThan(nonMagicTagged[0].score);
      }
    });

    it('should respect limit parameter', () => {
      indexAllLore();
      const results = searchLoreHybrid('forest', undefined, 2);

      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should boost keyword matches in hybrid scoring', () => {
      indexAllLore();

      // Search for an exact keyword that appears in lore content
      const results = searchLoreHybrid('Ember Tower');

      expect(results.length).toBeGreaterThan(0);
      // The entry with "Ember Tower" in the title should be highly ranked
      const topResult = results[0];
      expect(topResult.entry.title).toContain('Ember');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty lore database gracefully', () => {
      clearAllData();
      clearEmbeddingCache();

      const semantic = searchLoreSemantic('anything');
      expect(semantic).toEqual([]);

      const hybrid = searchLoreHybrid('anything');
      expect(hybrid).toEqual([]);
    });

    it('should work after clearing and re-indexing', () => {
      indexAllLore();
      clearEmbeddingCache();

      // Should still work because searchLoreSemantic auto-indexes
      const results = searchLoreSemantic('wolf');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
