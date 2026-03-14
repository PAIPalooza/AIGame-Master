/**
 * World State API
 * GET: Query world state by scope_type/scope_id/key
 * PUT: Upsert world state
 * Refs #14
 */

import { NextResponse } from 'next/server';
import {
  getWorldState,
  setWorldState,
  getWorldStatesByScope,
  getAllWorldStates,
  getWorldMetric,
  setWorldMetric,
  updateWorldMetric,
  getAllWorldMetrics,
} from '@/lib/world-engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scopeType = searchParams.get('scopeType') as 'global' | 'region' | 'faction' | 'npc' | null;
    const scopeId = searchParams.get('scopeId');
    const key = searchParams.get('key');
    const type = searchParams.get('type'); // 'state' or 'metric'

    // If requesting metrics
    if (type === 'metric') {
      const metricName = searchParams.get('name');
      if (metricName) {
        const metric = getWorldMetric(metricName);
        if (!metric) {
          return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
        }
        return NextResponse.json(metric, { status: 200 });
      }
      return NextResponse.json(getAllWorldMetrics(), { status: 200 });
    }

    // If all three params provided, get specific state
    if (scopeType && scopeId && key) {
      const state = getWorldState(scopeType, scopeId, key);
      if (!state) {
        return NextResponse.json({ error: 'State not found' }, { status: 404 });
      }
      return NextResponse.json(state, { status: 200 });
    }

    // If scope params provided, get all states for that scope
    if (scopeType && scopeId) {
      const states = getWorldStatesByScope(scopeType, scopeId);
      return NextResponse.json(states, { status: 200 });
    }

    // Return all states
    return NextResponse.json(getAllWorldStates(), { status: 200 });
  } catch (error) {
    console.error('Failed to get world state:', error);
    return NextResponse.json(
      { error: 'Failed to get world state' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    // Handle metric updates
    if (type === 'metric') {
      const { name, value, delta, ...options } = body;
      if (!name) {
        return NextResponse.json({ error: 'name is required for metrics' }, { status: 400 });
      }

      if (delta !== undefined) {
        const updated = updateWorldMetric(name, delta);
        if (!updated) {
          return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
        }
        return NextResponse.json(updated, { status: 200 });
      }

      if (value === undefined) {
        return NextResponse.json({ error: 'value or delta is required' }, { status: 400 });
      }

      const metric = setWorldMetric(name, value, options);
      return NextResponse.json(metric, { status: 200 });
    }

    // Handle state upsert
    const { scopeType, scopeId, key, value, metadata } = body;

    if (!scopeType || !scopeId || !key || value === undefined) {
      return NextResponse.json(
        { error: 'scopeType, scopeId, key, and value are required' },
        { status: 400 }
      );
    }

    const state = setWorldState(scopeType, scopeId, key, value, metadata);
    return NextResponse.json(state, { status: 200 });
  } catch (error) {
    console.error('Failed to update world state:', error);
    return NextResponse.json(
      { error: 'Failed to update world state' },
      { status: 500 }
    );
  }
}
