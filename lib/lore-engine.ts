/**
 * Lore Engine for AIGame-Master
 * Provides semantic and hybrid lore search using vector embeddings
 * Falls back to keyword search when embeddings are unavailable
 * Refs #16
 */

import { getAllLore, searchLore as keywordSearchLore } from './data';
import type { LoreEntry } from './types';

// ============================================================================
// Embedding Cache (in-memory for development)
// ============================================================================

const embeddingCache: Map<string, number[]> = new Map();

/**
 * Generate a simple hash-based pseudo-embedding for development/testing.
 * In production, this would call Claude API or another embedding model.
 */
function generatePseudoEmbedding(text: string): number[] {
  const dimensions = 128;
  const embedding: number[] = new Array(dimensions).fill(0);

  const normalized = text.toLowerCase().trim();
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const idx = (charCode * (i + 1)) % dimensions;
    embedding[idx] += 1 / (i + 1);
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

// ============================================================================
// Lore Indexing
// ============================================================================

/**
 * Index a lore entry by generating and caching its embedding
 */
export function indexLoreEntry(loreId: string): boolean {
  const allLore = getAllLore();
  const entry = allLore.find(l => l.id === loreId);
  if (!entry) return false;

  const text = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`;
  const embedding = generatePseudoEmbedding(text);
  embeddingCache.set(loreId, embedding);
  return true;
}

/**
 * Index all lore entries
 */
export function indexAllLore(): number {
  const allLore = getAllLore();
  let indexed = 0;

  for (const entry of allLore) {
    const text = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`;
    const embedding = generatePseudoEmbedding(text);
    embeddingCache.set(entry.id, embedding);
    indexed++;
  }

  return indexed;
}

// ============================================================================
// Search Functions
// ============================================================================

export interface LoreSearchResult {
  entry: LoreEntry;
  score: number;
  matchType: 'semantic' | 'keyword' | 'hybrid';
}

/**
 * Semantic search using vector similarity
 */
export function searchLoreSemantic(query: string, limit: number = 5): LoreSearchResult[] {
  const allLore = getAllLore();

  // Ensure all lore is indexed
  for (const entry of allLore) {
    if (!embeddingCache.has(entry.id)) {
      const text = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`;
      embeddingCache.set(entry.id, generatePseudoEmbedding(text));
    }
  }

  const queryEmbedding = generatePseudoEmbedding(query);

  const results: LoreSearchResult[] = allLore
    .map(entry => {
      const entryEmbedding = embeddingCache.get(entry.id);
      if (!entryEmbedding) return null;

      const score = cosineSimilarity(queryEmbedding, entryEmbedding);
      return { entry, score, matchType: 'semantic' as const };
    })
    .filter((r): r is LoreSearchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

/**
 * Hybrid search combining semantic similarity and keyword matching
 */
export function searchLoreHybrid(
  query: string,
  tags?: string[],
  limit: number = 5
): LoreSearchResult[] {
  // Get semantic results
  const semanticResults = searchLoreSemantic(query, limit * 2);

  // Get keyword results
  const keywordMatches = keywordSearchLore(query);
  const keywordIds = new Set(keywordMatches.map(l => l.id));

  // Filter by tags if provided
  let tagFilteredIds: Set<string> | null = null;
  if (tags && tags.length > 0) {
    const allLore = getAllLore();
    tagFilteredIds = new Set(
      allLore
        .filter(l => tags.some(tag => l.tags.includes(tag)))
        .map(l => l.id)
    );
  }

  // Combine scores: boost entries that match both semantic and keyword
  const results: LoreSearchResult[] = semanticResults.map(result => {
    let score = result.score;

    // Boost keyword matches
    if (keywordIds.has(result.entry.id)) {
      score += 0.2;
    }

    // Filter by tags if specified
    if (tagFilteredIds && !tagFilteredIds.has(result.entry.id)) {
      score *= 0.1; // Heavily penalize non-matching tags
    }

    return { ...result, score, matchType: 'hybrid' as const };
  });

  // Add keyword results not in semantic results
  for (const entry of keywordMatches) {
    if (!results.find(r => r.entry.id === entry.id)) {
      let score = 0.3; // Base score for keyword-only matches
      if (tagFilteredIds && !tagFilteredIds.has(entry.id)) {
        score *= 0.1;
      }
      results.push({ entry, score, matchType: 'keyword' });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Clear the embedding cache (for testing)
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}
