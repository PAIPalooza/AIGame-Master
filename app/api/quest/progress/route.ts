/**
 * Quest Progress API
 * GET: Get progress by questId + playerId
 * POST: Increment objective progress
 * Refs #13
 */

import { NextResponse } from 'next/server';
import {
  getQuestProgress,
  updateQuestProgress,
  checkQuestCompletion,
  completeQuest,
} from '@/lib/quest-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const questId = searchParams.get('questId');
    const playerId = searchParams.get('playerId');

    if (!questId || !playerId) {
      return NextResponse.json(
        { error: 'questId and playerId query parameters are required' },
        { status: 400 }
      );
    }

    const progress = getQuestProgress(questId, playerId);

    if (!progress) {
      return NextResponse.json(
        { error: 'No progress found for this quest and player' },
        { status: 404 }
      );
    }

    const isComplete = checkQuestCompletion(questId, playerId);

    return NextResponse.json({ ...progress, isComplete }, { status: 200 });
  } catch (error) {
    console.error('Failed to get quest progress:', error);
    return NextResponse.json(
      { error: 'Failed to get quest progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questId, playerId, objectiveId, increment } = body;

    if (!questId || !playerId || !objectiveId) {
      return NextResponse.json(
        { error: 'questId, playerId, and objectiveId are required' },
        { status: 400 }
      );
    }

    const progress = updateQuestProgress(questId, playerId, objectiveId, increment ?? 1);
    const isComplete = checkQuestCompletion(questId, playerId);

    // Auto-complete quest if all objectives are met
    if (isComplete && progress.status !== 'completed') {
      const completed = completeQuest(questId, playerId);
      if (completed) {
        return NextResponse.json(
          { ...completed, isComplete: true, justCompleted: true },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ ...progress, isComplete }, { status: 200 });
  } catch (error) {
    console.error('Failed to update quest progress:', error);
    return NextResponse.json(
      { error: 'Failed to update quest progress' },
      { status: 500 }
    );
  }
}
