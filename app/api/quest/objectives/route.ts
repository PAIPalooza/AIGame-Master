/**
 * Quest Objectives API
 * GET: List objectives by questId
 * POST: Create a new objective
 * PUT: Update an objective
 * DELETE: Delete an objective
 * Refs #12
 */

import { NextResponse } from 'next/server';
import {
  createQuestObjective,
  getQuestObjectives,
  updateQuestObjective,
  deleteQuestObjective,
} from '@/lib/quest-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const questId = searchParams.get('questId');

    if (!questId) {
      return NextResponse.json(
        { error: 'questId query parameter is required' },
        { status: 400 }
      );
    }

    const objectives = getQuestObjectives(questId);
    return NextResponse.json(objectives, { status: 200 });
  } catch (error) {
    console.error('Failed to get quest objectives:', error);
    return NextResponse.json(
      { error: 'Failed to get quest objectives' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questId, description, type, targetCount, orderIndex, metadata } = body;

    if (!questId || !description || !type || !targetCount) {
      return NextResponse.json(
        { error: 'questId, description, type, and targetCount are required' },
        { status: 400 }
      );
    }

    const objective = createQuestObjective(
      questId,
      description,
      type,
      targetCount,
      orderIndex ?? 0,
      metadata
    );

    return NextResponse.json(objective, { status: 201 });
  } catch (error) {
    console.error('Failed to create quest objective:', error);
    return NextResponse.json(
      { error: 'Failed to create quest objective' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { objectiveId, ...updates } = body;

    if (!objectiveId) {
      return NextResponse.json(
        { error: 'objectiveId is required' },
        { status: 400 }
      );
    }

    const updated = updateQuestObjective(objectiveId, updates);

    if (!updated) {
      return NextResponse.json(
        { error: 'Objective not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Failed to update quest objective:', error);
    return NextResponse.json(
      { error: 'Failed to update quest objective' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const objectiveId = searchParams.get('objectiveId');

    if (!objectiveId) {
      return NextResponse.json(
        { error: 'objectiveId query parameter is required' },
        { status: 400 }
      );
    }

    const deleted = deleteQuestObjective(objectiveId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Objective not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete quest objective:', error);
    return NextResponse.json(
      { error: 'Failed to delete quest objective' },
      { status: 500 }
    );
  }
}
