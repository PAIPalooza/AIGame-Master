/**
 * Quest Engine for AIGame-Master
 * Handles quest objectives CRUD and progress tracking
 * Refs #12, #13
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { QuestObjective, QuestProgress } from './types';

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
// Quest Objective CRUD (Issue #12)
// ============================================================================

export function createQuestObjective(
  questId: string,
  description: string,
  type: QuestObjective['type'],
  targetCount: number,
  orderIndex: number,
  metadata?: Record<string, unknown>
): QuestObjective {
  if (!questId) throw new Error('questId is required');
  if (!description) throw new Error('description is required');
  if (targetCount < 1) throw new Error('targetCount must be at least 1');

  const now = new Date().toISOString();
  const objective: QuestObjective = {
    id: randomUUID(),
    questId,
    description,
    type,
    targetCount,
    currentCount: 0,
    isCompleted: false,
    orderIndex,
    metadata,
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getDataPath(`quest_objective_${objective.id}.json`);
  atomicWrite(filePath, objective);
  return objective;
}

export function getQuestObjectives(questId: string): QuestObjective[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const objectiveFiles = files.filter(f => f.startsWith('quest_objective_') && f.endsWith('.json'));

  return objectiveFiles
    .map(file => readJSON<QuestObjective>(getDataPath(file)))
    .filter((o): o is QuestObjective => o !== null && o.questId === questId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getQuestObjective(objectiveId: string): QuestObjective | null {
  const filePath = getDataPath(`quest_objective_${objectiveId}.json`);
  return readJSON<QuestObjective>(filePath);
}

export function updateQuestObjective(
  objectiveId: string,
  updates: Partial<Pick<QuestObjective, 'description' | 'targetCount' | 'currentCount' | 'isCompleted' | 'orderIndex' | 'metadata'>>
): QuestObjective | null {
  const objective = getQuestObjective(objectiveId);
  if (!objective) return null;

  const updated: QuestObjective = {
    ...objective,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Auto-complete if currentCount >= targetCount
  if (updated.currentCount >= updated.targetCount) {
    updated.isCompleted = true;
  }

  const filePath = getDataPath(`quest_objective_${objectiveId}.json`);
  atomicWrite(filePath, updated);
  return updated;
}

export function deleteQuestObjective(objectiveId: string): boolean {
  const filePath = getDataPath(`quest_objective_${objectiveId}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

// ============================================================================
// Quest Progress Tracking (Issue #13)
// ============================================================================

export function initQuestProgress(questId: string, playerId: string): QuestProgress {
  if (!questId) throw new Error('questId is required');
  if (!playerId) throw new Error('playerId is required');

  // Check for existing progress
  const existing = getQuestProgress(questId, playerId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const progress: QuestProgress = {
    id: randomUUID(),
    questId,
    playerId,
    status: 'not_started',
    objectiveProgress: {},
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getDataPath(`quest_progress_${progress.id}.json`);
  atomicWrite(filePath, progress);
  return progress;
}

export function getQuestProgress(questId: string, playerId: string): QuestProgress | null {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const progressFiles = files.filter(f => f.startsWith('quest_progress_') && f.endsWith('.json'));

  for (const file of progressFiles) {
    const progress = readJSON<QuestProgress>(getDataPath(file));
    if (progress && progress.questId === questId && progress.playerId === playerId) {
      return progress;
    }
  }
  return null;
}

export function updateQuestProgress(
  questId: string,
  playerId: string,
  objectiveId: string,
  increment: number = 1
): QuestProgress {
  let progress = getQuestProgress(questId, playerId);
  if (!progress) {
    progress = initQuestProgress(questId, playerId);
  }

  // Update status to in_progress if not_started
  if (progress.status === 'not_started') {
    progress.status = 'in_progress';
    progress.startedAt = new Date().toISOString();
  }

  // Increment objective progress
  const currentVal = progress.objectiveProgress[objectiveId] || 0;
  progress.objectiveProgress[objectiveId] = currentVal + increment;
  progress.updatedAt = new Date().toISOString();

  // Also update the objective's currentCount
  const objective = getQuestObjective(objectiveId);
  if (objective) {
    updateQuestObjective(objectiveId, {
      currentCount: progress.objectiveProgress[objectiveId],
    });
  }

  const filePath = getDataPath(`quest_progress_${progress.id}.json`);
  atomicWrite(filePath, progress);

  return progress;
}

export function checkQuestCompletion(questId: string, playerId: string): boolean {
  const objectives = getQuestObjectives(questId);
  if (objectives.length === 0) return false;

  const progress = getQuestProgress(questId, playerId);
  if (!progress) return false;

  return objectives.every(obj => {
    const progressCount = progress.objectiveProgress[obj.id] || 0;
    return progressCount >= obj.targetCount;
  });
}

export function completeQuest(questId: string, playerId: string): QuestProgress | null {
  const progress = getQuestProgress(questId, playerId);
  if (!progress) return null;

  if (!checkQuestCompletion(questId, playerId)) return null;

  progress.status = 'completed';
  progress.completedAt = new Date().toISOString();
  progress.updatedAt = new Date().toISOString();

  const filePath = getDataPath(`quest_progress_${progress.id}.json`);
  atomicWrite(filePath, progress);

  return progress;
}

export function getPlayerQuests(playerId: string): QuestProgress[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const progressFiles = files.filter(f => f.startsWith('quest_progress_') && f.endsWith('.json'));

  return progressFiles
    .map(file => readJSON<QuestProgress>(getDataPath(file)))
    .filter((p): p is QuestProgress => p !== null && p.playerId === playerId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
