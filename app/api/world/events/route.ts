/**
 * World Events API
 * GET: List world events, optionally evaluate triggers
 * Refs #15
 */

import { NextResponse } from 'next/server';
import { getWorldEvents } from '@/lib/data';
import { evaluateWorldTriggers } from '@/lib/world-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const evaluate = searchParams.get('evaluate') === 'true';

    // Optionally evaluate triggers for a player
    let newEvents: ReturnType<typeof evaluateWorldTriggers> = [];
    if (evaluate && playerId) {
      newEvents = evaluateWorldTriggers(playerId);
    }

    const allEvents = getWorldEvents();

    return NextResponse.json({
      worldEvents: allEvents,
      newlyTriggered: newEvents,
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to get world events:', error);
    return NextResponse.json(
      { error: 'Failed to get world events' },
      { status: 500 }
    );
  }
}
