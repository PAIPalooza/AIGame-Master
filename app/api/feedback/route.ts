/**
 * Feedback API
 * POST: Submit feedback (rating 1-5 validation)
 * GET: Query feedback by player or target
 * Refs #17
 */

import { NextResponse } from 'next/server';
import {
  submitFeedback,
  getPlayerFeedback,
  getFeedbackByTarget,
  getAverageRating,
} from '@/lib/feedback';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, targetType, rating, targetId, comment } = body;

    if (!playerId || !targetType || rating === undefined) {
      return NextResponse.json(
        { error: 'playerId, targetType, and rating are required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    const validTypes = ['narrative', 'quest', 'npc', 'world_event', 'general'];
    if (!validTypes.includes(targetType)) {
      return NextResponse.json(
        { error: `targetType must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const feedback = submitFeedback(playerId, targetType, rating, { targetId, comment });
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const targetType = searchParams.get('targetType') as 'narrative' | 'quest' | 'npc' | 'world_event' | 'general' | null;
    const targetId = searchParams.get('targetId');
    const average = searchParams.get('average') === 'true';

    if (average && targetType) {
      const avg = getAverageRating(targetType, targetId || undefined);
      return NextResponse.json(avg, { status: 200 });
    }

    if (playerId) {
      const feedback = getPlayerFeedback(playerId);
      return NextResponse.json(feedback, { status: 200 });
    }

    if (targetType) {
      const feedback = getFeedbackByTarget(targetType, targetId || undefined);
      return NextResponse.json(feedback, { status: 200 });
    }

    return NextResponse.json(
      { error: 'playerId or targetType query parameter is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Failed to get feedback:', error);
    return NextResponse.json(
      { error: 'Failed to get feedback' },
      { status: 500 }
    );
  }
}
