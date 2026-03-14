/**
 * World Engine for AIGame-Master
 * Handles world state management, metrics, and event triggers
 * Refs #14, #15
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { WorldState, WorldMetric, TriggerRule, WorldEvent } from './types';
import { countGameEvents, saveWorldEvent, getWorldEvents } from './data';

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
// World State CRUD (Issue #14)
// ============================================================================

export function setWorldState(
  scopeType: WorldState['scopeType'],
  scopeId: string,
  key: string,
  value: string | number | boolean,
  metadata?: Record<string, unknown>
): WorldState {
  // Upsert: find existing or create new
  const existing = getWorldState(scopeType, scopeId, key);

  if (existing) {
    const updated: WorldState = {
      ...existing,
      value,
      metadata: metadata ?? existing.metadata,
      updatedAt: new Date().toISOString(),
    };
    const filePath = getDataPath(`world_state_${existing.id}.json`);
    atomicWrite(filePath, updated);
    return updated;
  }

  const now = new Date().toISOString();
  const state: WorldState = {
    id: randomUUID(),
    scopeType,
    scopeId,
    key,
    value,
    metadata,
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getDataPath(`world_state_${state.id}.json`);
  atomicWrite(filePath, state);
  return state;
}

export function getWorldState(
  scopeType: WorldState['scopeType'],
  scopeId: string,
  key: string
): WorldState | null {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const stateFiles = files.filter(f => f.startsWith('world_state_') && f.endsWith('.json'));

  for (const file of stateFiles) {
    const state = readJSON<WorldState>(getDataPath(file));
    if (state && state.scopeType === scopeType && state.scopeId === scopeId && state.key === key) {
      return state;
    }
  }
  return null;
}

export function getWorldStatesByScope(
  scopeType: WorldState['scopeType'],
  scopeId: string
): WorldState[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const stateFiles = files.filter(f => f.startsWith('world_state_') && f.endsWith('.json'));

  return stateFiles
    .map(file => readJSON<WorldState>(getDataPath(file)))
    .filter((s): s is WorldState => s !== null && s.scopeType === scopeType && s.scopeId === scopeId);
}

export function getAllWorldStates(): WorldState[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const stateFiles = files.filter(f => f.startsWith('world_state_') && f.endsWith('.json'));

  return stateFiles
    .map(file => readJSON<WorldState>(getDataPath(file)))
    .filter((s): s is WorldState => s !== null);
}

// ============================================================================
// World Metrics (Issue #14)
// ============================================================================

export function getWorldMetric(name: string): WorldMetric | null {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const metricFiles = files.filter(f => f.startsWith('world_metric_') && f.endsWith('.json'));

  for (const file of metricFiles) {
    const metric = readJSON<WorldMetric>(getDataPath(file));
    if (metric && metric.name === name) {
      return metric;
    }
  }
  return null;
}

export function setWorldMetric(
  name: string,
  value: number,
  options?: {
    minValue?: number;
    maxValue?: number;
    category?: string;
    description?: string;
  }
): WorldMetric {
  const existing = getWorldMetric(name);

  if (existing) {
    const clamped = Math.max(existing.minValue, Math.min(existing.maxValue, value));
    const updated: WorldMetric = {
      ...existing,
      value: clamped,
      updatedAt: new Date().toISOString(),
    };
    const filePath = getDataPath(`world_metric_${existing.id}.json`);
    atomicWrite(filePath, updated);
    return updated;
  }

  const now = new Date().toISOString();
  const metric: WorldMetric = {
    id: randomUUID(),
    name,
    value,
    minValue: options?.minValue ?? 0,
    maxValue: options?.maxValue ?? 100,
    category: options?.category ?? 'general',
    description: options?.description ?? '',
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getDataPath(`world_metric_${metric.id}.json`);
  atomicWrite(filePath, metric);
  return metric;
}

export function updateWorldMetric(name: string, delta: number): WorldMetric | null {
  const metric = getWorldMetric(name);
  if (!metric) return null;

  const newValue = Math.max(metric.minValue, Math.min(metric.maxValue, metric.value + delta));
  return setWorldMetric(name, newValue);
}

export function getAllWorldMetrics(): WorldMetric[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR);
  const metricFiles = files.filter(f => f.startsWith('world_metric_') && f.endsWith('.json'));

  return metricFiles
    .map(file => readJSON<WorldMetric>(getDataPath(file)))
    .filter((m): m is WorldMetric => m !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Initialize default world metrics for Moonvale
 */
export function initializeDefaultMetrics(): WorldMetric[] {
  const defaults = [
    { name: 'wolf_population', value: 12, category: 'wildlife', description: 'Wolf population in the northern forest' },
    { name: 'village_safety', value: 68, category: 'settlement', description: 'Safety level of Moonvale village' },
    { name: 'forest_fear', value: 45, category: 'atmosphere', description: 'Fear level in the forest regions' },
    { name: 'trade_flow', value: 31, category: 'economy', description: 'Volume of trade through Moonvale' },
  ];

  return defaults.map(d => {
    const existing = getWorldMetric(d.name);
    if (existing) return existing;
    return setWorldMetric(d.name, d.value, {
      category: d.category,
      description: d.description,
    });
  });
}

// ============================================================================
// Trigger Rules (Issue #15)
// ============================================================================

// In-memory trigger rule registry
const triggerRules: Map<string, TriggerRule> = new Map();

export function registerTriggerRule(rule: Omit<TriggerRule, 'id' | 'createdAt'>): TriggerRule {
  const fullRule: TriggerRule = {
    ...rule,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  triggerRules.set(fullRule.id, fullRule);
  return fullRule;
}

export function getTriggerRules(): TriggerRule[] {
  return Array.from(triggerRules.values()).filter(r => r.isActive);
}

/**
 * Clear all registered trigger rules (for testing)
 */
export function clearTriggerRules(): void {
  triggerRules.clear();
}

/**
 * Initialize predefined trigger rules for Moonvale
 */
export function initializePredefinedRules(): TriggerRule[] {
  const rules: Omit<TriggerRule, 'id' | 'createdAt'>[] = [
    {
      name: 'Wolf Pack Retreat',
      description: 'Wolf activity decreases after multiple wolf kills',
      conditionType: 'event_count',
      conditionConfig: {
        eventType: 'wolf_kill',
        threshold: 3,
        comparison: 'gte',
      },
      eventName: 'Wolf Pack Retreat',
      eventDescription: 'Wolf activity around Moonvale has suddenly decreased.',
      oneTimePerPlayer: true,
      isActive: true,
    },
    {
      name: 'Arcane Instability',
      description: 'Magical disturbances increase after exploring Ember Tower',
      conditionType: 'event_count',
      conditionConfig: {
        eventType: 'explore',
        threshold: 5,
        comparison: 'gte',
      },
      eventName: 'Arcane Instability',
      eventDescription: 'Strange magical disturbances have been detected near Ember Tower.',
      oneTimePerPlayer: true,
      isActive: true,
    },
    {
      name: 'Forest Guild Patrol',
      description: 'Forest Guild sends patrols after villagers receive help',
      conditionType: 'event_count',
      conditionConfig: {
        eventType: 'help_village',
        threshold: 3,
        comparison: 'gte',
      },
      eventName: 'Forest Guild Patrol',
      eventDescription: 'The Forest Guild has sent patrols to secure the trade routes.',
      oneTimePerPlayer: true,
      isActive: true,
    },
  ];

  return rules.map(r => registerTriggerRule(r));
}

/**
 * Check if a world event already exists for a specific trigger and player
 */
function worldEventExistsForTrigger(eventName: string, playerId: string): boolean {
  const allWorldEvents = getWorldEvents();
  return allWorldEvents.some(
    e => e.event_name === eventName && e.trigger_source === playerId
  );
}

/**
 * Evaluate all active trigger rules for a player
 * Returns any newly triggered world events
 */
export function evaluateWorldTriggers(playerId: string): WorldEvent[] {
  const triggeredEvents: WorldEvent[] = [];
  const rules = getTriggerRules();

  for (const rule of rules) {
    // Skip if one-time and already triggered
    if (rule.oneTimePerPlayer && worldEventExistsForTrigger(rule.eventName, playerId)) {
      continue;
    }

    let conditionMet = false;

    if (rule.conditionType === 'event_count' && rule.conditionConfig.eventType) {
      const count = countGameEvents(playerId, rule.conditionConfig.eventType);
      conditionMet = evaluateComparison(count, rule.conditionConfig.threshold, rule.conditionConfig.comparison);
    } else if (rule.conditionType === 'metric_threshold' && rule.conditionConfig.metricName) {
      const metric = getWorldMetric(rule.conditionConfig.metricName);
      if (metric) {
        conditionMet = evaluateComparison(metric.value, rule.conditionConfig.threshold, rule.conditionConfig.comparison);
      }
    } else if (rule.conditionType === 'state_value' && rule.conditionConfig.stateKey) {
      const state = getWorldState('global', 'world', rule.conditionConfig.stateKey);
      if (state && typeof state.value === 'number') {
        conditionMet = evaluateComparison(state.value, rule.conditionConfig.threshold, rule.conditionConfig.comparison);
      }
    }

    if (conditionMet) {
      const worldEvent = saveWorldEvent({
        event_name: rule.eventName,
        description: rule.eventDescription,
        trigger_source: playerId,
        metadata: {
          ruleId: rule.id,
          ruleName: rule.name,
        },
      });
      triggeredEvents.push(worldEvent);
    }
  }

  return triggeredEvents;
}

function evaluateComparison(value: number, threshold: number, comparison: TriggerRule['conditionConfig']['comparison']): boolean {
  switch (comparison) {
    case 'gte': return value >= threshold;
    case 'lte': return value <= threshold;
    case 'eq': return value === threshold;
    case 'gt': return value > threshold;
    case 'lt': return value < threshold;
    default: return false;
  }
}
