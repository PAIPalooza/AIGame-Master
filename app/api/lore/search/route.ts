/**
 * Lore Search API
 * GET: Search lore using semantic/hybrid search
 * Refs #16
 */

import { NextResponse } from 'next/server';
import { searchLoreSemantic, searchLoreHybrid } from '@/lib/lore-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const mode = searchParams.get('mode') || 'hybrid';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    if (!query) {
      return NextResponse.json(
        { error: 'query parameter is required' },
        { status: 400 }
      );
    }

    const results = mode === 'semantic'
      ? searchLoreSemantic(query, limit)
      : searchLoreHybrid(query, tags, limit);

    return NextResponse.json({
      query,
      mode,
      results,
      count: results.length,
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to search lore:', error);
    return NextResponse.json(
      { error: 'Failed to search lore' },
      { status: 500 }
    );
  }
}
