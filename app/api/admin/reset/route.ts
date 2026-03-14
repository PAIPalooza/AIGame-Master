/**
 * Admin Reset API route — POST, GET, and DELETE handlers.
 *
 * POST  /api/admin/reset — calls resetWorld(), returns reset summary.
 * GET   /api/admin/reset — calls getResetStatus(), returns world snapshot.
 * DELETE /api/admin/reset — clears all data (requires confirmation string).
 *
 * Refs #23
 */

import { NextResponse } from 'next/server';
import { clearAllData } from '@/lib/data';
import { resetWorld, getResetStatus } from '@/lib/reset';

// ============================================================================
// POST /api/admin/reset — reset world and return summary
// ============================================================================

export async function POST(_request: Request) {
  try {
    const result = await resetWorld();
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error('Failed to reset world:', error);
    return NextResponse.json({ error: 'Failed to reset world' }, { status: 500 });
  }
}

// ============================================================================
// GET /api/admin/reset — return current world status snapshot
// ============================================================================

export async function GET(_request: Request) {
  try {
    const status = await getResetStatus();
    return NextResponse.json({ success: true, status }, { status: 200 });
  } catch (error) {
    console.error('Failed to get reset status:', error);
    return NextResponse.json({ error: 'Failed to get reset status' }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/admin/reset — hard clear (requires confirmation string)
// ============================================================================

export async function DELETE(request: Request) {
  try {
    const { confirm } = await request.json();

    if (confirm !== 'DELETE_ALL_DATA') {
      return NextResponse.json(
        { error: 'Confirmation string required: "DELETE_ALL_DATA"' },
        { status: 400 }
      );
    }

    clearAllData();

    return NextResponse.json(
      { success: true, message: 'All data cleared successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to clear data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}
