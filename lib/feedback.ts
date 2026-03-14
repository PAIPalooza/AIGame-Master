/**
 * Feedback System for AIGame-Master
 * Handles player feedback submission and retrieval
 * Refs #17
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { PlayerFeedback } from './types';

const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function atomicWrite(filePath: string, data: unknown): void {
  ensureDataDir();
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch {}
    throw new Error(`Failed to write file ${filePath}: ${error}`);
  }
}

function readJSON<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`);
  }
}

function getDataPath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

// ============================================================================
// Feedback CRUD
// ============================================================================

export function submitFeedback(
  playerId: string,
  targetType: PlayerFeedback['targetType'],
  rating: number,
  options?: {
    targetId?: string;
    comment?: string;
  }
): PlayerFeedback {
  if (!playerId) throw new Error('playerId is required');
  if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
  if (!Number.isInteger(rating)) throw new Error('Rating must be an integer');

  const feedback: PlayerFeedback = {
    id: randomUUID(),
    playerId,
    targetType,
    targetId: options?.targetId,
    rating,
    comment: options?.comment,
    createdAt: new Date().toISOString(),
  };

  const filePath = getDataPath(`feedback_${feedback.id}.json`);
  atomicWrite(filePath, feedback);
  return feedback;
}

export function getFeedbackById(feedbackId: string): PlayerFeedback | null {
  const filePath = getDataPath(`feedback_${feedbackId}.json`);
  return readJSON<PlayerFeedback>(filePath);
}

export function getFeedbackByTarget(
  targetType: PlayerFeedback['targetType'],
  targetId?: string
): PlayerFeedback[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const feedbackFiles = files.filter(f => f.startsWith('feedback_') && f.endsWith('.json'));

  return feedbackFiles
    .map(file => readJSON<PlayerFeedback>(getDataPath(file)))
    .filter((f): f is PlayerFeedback => {
      if (f === null) return false;
      if (f.targetType !== targetType) return false;
      if (targetId && f.targetId !== targetId) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPlayerFeedback(playerId: string): PlayerFeedback[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const feedbackFiles = files.filter(f => f.startsWith('feedback_') && f.endsWith('.json'));

  return feedbackFiles
    .map(file => readJSON<PlayerFeedback>(getDataPath(file)))
    .filter((f): f is PlayerFeedback => f !== null && f.playerId === playerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAverageRating(
  targetType: PlayerFeedback['targetType'],
  targetId?: string
): { average: number; count: number } {
  const feedback = getFeedbackByTarget(targetType, targetId);

  if (feedback.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = feedback.reduce((sum, f) => sum + f.rating, 0);
  return {
    average: Math.round((total / feedback.length) * 100) / 100,
    count: feedback.length,
  };
}

export function getAllFeedback(): PlayerFeedback[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const feedbackFiles = files.filter(f => f.startsWith('feedback_') && f.endsWith('.json'));

  return feedbackFiles
    .map(file => readJSON<PlayerFeedback>(getDataPath(file)))
    .filter((f): f is PlayerFeedback => f !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
