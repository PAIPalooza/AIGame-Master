/**
 * Unit tests for world-engine.ts
 * Tests world state management, metrics, and trigger rules
 *
 * Refs #14, #15
 */

import {
  setWorldState,
  getWorldState,
  getWorldStatesByScope,
  getAllWorldStates,
  setWorldMetric,
  getWorldMetric,
  updateWorldMetric,
  getAllWorldMetrics,
  initializeDefaultMetrics,
  registerTriggerRule,
  getTriggerRules,
  clearTriggerRules,
  initializePredefinedRules,
  evaluateWorldTriggers,
} from '../lib/world-engine';
import { clearAllData, savePlayer, saveGameEvent } from '../lib/data';

describe('World Engine', () => {
  let testPlayerId: string;

  beforeEach(() => {
    clearAllData();
    clearTriggerRules();

    const player = savePlayer({
      username: 'TestPlayer',
      class: 'Ranger',
      faction: 'Forest Guild',
      level: 1,
      xp: 0,
      inventory: [],
      reputation: 0,
    });
    testPlayerId = player.id;
  });

  afterEach(() => {
    clearAllData();
    clearTriggerRules();
  });

  // ===========================================================================
  // World State (Issue #14)
  // ===========================================================================

  describe('World State', () => {
    describe('setWorldState / getWorldState', () => {
      it('should set and get global world state', () => {
        const state = setWorldState('global', 'world', 'weather', 'stormy');

        expect(state).toBeDefined();
        expect(state.id).toBeDefined();
        expect(state.scopeType).toBe('global');
        expect(state.scopeId).toBe('world');
        expect(state.key).toBe('weather');
        expect(state.value).toBe('stormy');

        const retrieved = getWorldState('global', 'world', 'weather');
        expect(retrieved).not.toBeNull();
        expect(retrieved?.value).toBe('stormy');
      });

      it('should set and get regional world state', () => {
        const state = setWorldState('region', 'moonvale', 'safety_level', 'moderate');

        expect(state.scopeType).toBe('region');
        expect(state.scopeId).toBe('moonvale');

        const retrieved = getWorldState('region', 'moonvale', 'safety_level');
        expect(retrieved?.value).toBe('moderate');
      });

      it('should upsert existing state (update value)', () => {
        setWorldState('global', 'world', 'weather', 'sunny');
        const updated = setWorldState('global', 'world', 'weather', 'rainy');

        expect(updated.value).toBe('rainy');

        const all = getAllWorldStates();
        const weatherStates = all.filter(s => s.key === 'weather');
        expect(weatherStates).toHaveLength(1);
      });

      it('should support numeric values', () => {
        const state = setWorldState('global', 'world', 'time_of_day', 14);
        expect(state.value).toBe(14);
      });

      it('should support boolean values', () => {
        const state = setWorldState('global', 'world', 'is_night', true);
        expect(state.value).toBe(true);
      });

      it('should return null for non-existent state', () => {
        const result = getWorldState('global', 'world', 'nonexistent');
        expect(result).toBeNull();
      });

      it('should store optional metadata', () => {
        const state = setWorldState('global', 'world', 'weather', 'stormy', {
          lastChanged: 'player-action',
        });
        expect(state.metadata).toEqual({ lastChanged: 'player-action' });
      });
    });

    describe('getWorldStatesByScope', () => {
      it('should get all states by scope', () => {
        setWorldState('region', 'moonvale', 'safety', 'high');
        setWorldState('region', 'moonvale', 'population', 120);
        setWorldState('region', 'forest', 'danger', 'medium');

        const moonvaleStates = getWorldStatesByScope('region', 'moonvale');
        expect(moonvaleStates).toHaveLength(2);
      });

      it('should return empty array for unknown scope', () => {
        const result = getWorldStatesByScope('region', 'unknown');
        expect(result).toEqual([]);
      });
    });
  });

  // ===========================================================================
  // World Metrics (Issue #14)
  // ===========================================================================

  describe('World Metrics', () => {
    describe('setWorldMetric / getWorldMetric', () => {
      it('should set and retrieve a metric', () => {
        const metric = setWorldMetric('wolf_population', 12, {
          category: 'wildlife',
          description: 'Wolf count',
        });

        expect(metric).toBeDefined();
        expect(metric.name).toBe('wolf_population');
        expect(metric.value).toBe(12);
        expect(metric.category).toBe('wildlife');

        const retrieved = getWorldMetric('wolf_population');
        expect(retrieved?.value).toBe(12);
      });

      it('should clamp value to min/max on update', () => {
        setWorldMetric('test_metric', 50, { minValue: 0, maxValue: 100 });

        const updated = setWorldMetric('test_metric', 150);
        expect(updated.value).toBe(100); // Clamped to max

        const updated2 = setWorldMetric('test_metric', -10);
        expect(updated2.value).toBe(0); // Clamped to min
      });

      it('should return null for non-existent metric', () => {
        expect(getWorldMetric('nonexistent')).toBeNull();
      });

      it('should use defaults for missing options', () => {
        const metric = setWorldMetric('simple_metric', 42);

        expect(metric.minValue).toBe(0);
        expect(metric.maxValue).toBe(100);
        expect(metric.category).toBe('general');
        expect(metric.description).toBe('');
      });
    });

    describe('updateWorldMetric', () => {
      it('should update metric by positive delta', () => {
        setWorldMetric('wolf_population', 12);
        const updated = updateWorldMetric('wolf_population', 3);

        expect(updated?.value).toBe(15);
      });

      it('should update metric by negative delta', () => {
        setWorldMetric('wolf_population', 12);
        const updated = updateWorldMetric('wolf_population', -5);

        expect(updated?.value).toBe(7);
      });

      it('should clamp at min value', () => {
        setWorldMetric('wolf_population', 5, { minValue: 0, maxValue: 100 });
        const updated = updateWorldMetric('wolf_population', -10);

        expect(updated?.value).toBe(0);
      });

      it('should clamp at max value', () => {
        setWorldMetric('wolf_population', 95, { minValue: 0, maxValue: 100 });
        const updated = updateWorldMetric('wolf_population', 10);

        expect(updated?.value).toBe(100);
      });

      it('should return null for non-existent metric', () => {
        expect(updateWorldMetric('nonexistent', 5)).toBeNull();
      });
    });

    describe('getAllWorldMetrics', () => {
      it('should return all metrics sorted by name', () => {
        setWorldMetric('zebra_count', 5);
        setWorldMetric('alpha_metric', 10);
        setWorldMetric('beta_metric', 20);

        const metrics = getAllWorldMetrics();
        expect(metrics).toHaveLength(3);
        expect(metrics[0].name).toBe('alpha_metric');
        expect(metrics[1].name).toBe('beta_metric');
        expect(metrics[2].name).toBe('zebra_count');
      });
    });

    describe('initializeDefaultMetrics', () => {
      it('should initialize 4 default metrics', () => {
        const metrics = initializeDefaultMetrics();

        expect(metrics).toHaveLength(4);

        const names = metrics.map(m => m.name).sort();
        expect(names).toEqual([
          'forest_fear',
          'trade_flow',
          'village_safety',
          'wolf_population',
        ]);
      });

      it('should set correct default values', () => {
        const metrics = initializeDefaultMetrics();

        const byName = Object.fromEntries(metrics.map(m => [m.name, m]));
        expect(byName['wolf_population'].value).toBe(12);
        expect(byName['village_safety'].value).toBe(68);
        expect(byName['forest_fear'].value).toBe(45);
        expect(byName['trade_flow'].value).toBe(31);
      });

      it('should not overwrite existing metrics', () => {
        setWorldMetric('wolf_population', 5, { category: 'wildlife' });

        const metrics = initializeDefaultMetrics();
        const wolf = metrics.find(m => m.name === 'wolf_population');

        expect(wolf?.value).toBe(5); // Kept original value
      });
    });
  });

  // ===========================================================================
  // Trigger Rules (Issue #15)
  // ===========================================================================

  describe('Trigger Rules', () => {
    describe('registerTriggerRule', () => {
      it('should register a trigger rule', () => {
        const rule = registerTriggerRule({
          name: 'Test Rule',
          description: 'A test trigger',
          conditionType: 'event_count',
          conditionConfig: {
            eventType: 'explore',
            threshold: 5,
            comparison: 'gte',
          },
          eventName: 'Test Event',
          eventDescription: 'Something happened',
          oneTimePerPlayer: true,
          isActive: true,
        });

        expect(rule).toBeDefined();
        expect(rule.id).toBeDefined();
        expect(rule.name).toBe('Test Rule');
        expect(rule.createdAt).toBeDefined();
      });
    });

    describe('getTriggerRules', () => {
      it('should return only active rules', () => {
        registerTriggerRule({
          name: 'Active',
          description: 'Active rule',
          conditionType: 'event_count',
          conditionConfig: { threshold: 1, comparison: 'gte' },
          eventName: 'Active Event',
          eventDescription: 'Active',
          oneTimePerPlayer: false,
          isActive: true,
        });

        registerTriggerRule({
          name: 'Inactive',
          description: 'Inactive rule',
          conditionType: 'event_count',
          conditionConfig: { threshold: 1, comparison: 'gte' },
          eventName: 'Inactive Event',
          eventDescription: 'Inactive',
          oneTimePerPlayer: false,
          isActive: false,
        });

        const rules = getTriggerRules();
        expect(rules).toHaveLength(1);
        expect(rules[0].name).toBe('Active');
      });
    });

    describe('initializePredefinedRules', () => {
      it('should register Wolf Pack Retreat, Arcane Instability, and Forest Guild Patrol', () => {
        const rules = initializePredefinedRules();

        expect(rules).toHaveLength(3);

        const names = rules.map(r => r.name).sort();
        expect(names).toEqual([
          'Arcane Instability',
          'Forest Guild Patrol',
          'Wolf Pack Retreat',
        ]);
      });

      it('should configure Wolf Pack Retreat at threshold 3', () => {
        const rules = initializePredefinedRules();
        const wolfRule = rules.find(r => r.name === 'Wolf Pack Retreat');

        expect(wolfRule?.conditionConfig.eventType).toBe('wolf_kill');
        expect(wolfRule?.conditionConfig.threshold).toBe(3);
        expect(wolfRule?.conditionConfig.comparison).toBe('gte');
        expect(wolfRule?.oneTimePerPlayer).toBe(true);
      });
    });

    describe('evaluateWorldTriggers', () => {
      it('should trigger Wolf Pack Retreat at 3 wolf kills', () => {
        initializePredefinedRules();

        // Create 3 wolf_kill events
        for (let i = 0; i < 3; i++) {
          saveGameEvent({
            player_id: testPlayerId,
            event_type: 'wolf_kill',
            location: 'Northern Forest',
            metadata: { description: `Wolf kill ${i + 1}` },
          });
        }

        const triggered = evaluateWorldTriggers(testPlayerId);

        expect(triggered.length).toBeGreaterThanOrEqual(1);
        const wolfEvent = triggered.find(e => e.event_name === 'Wolf Pack Retreat');
        expect(wolfEvent).toBeDefined();
        expect(wolfEvent?.description).toBe('Wolf activity around Moonvale has suddenly decreased.');
      });

      it('should not trigger when below threshold', () => {
        initializePredefinedRules();

        saveGameEvent({
          player_id: testPlayerId,
          event_type: 'wolf_kill',
          location: 'Northern Forest',
          metadata: { description: 'Wolf kill 1' },
        });

        const triggered = evaluateWorldTriggers(testPlayerId);
        const wolfEvent = triggered.find(e => e.event_name === 'Wolf Pack Retreat');
        expect(wolfEvent).toBeUndefined();
      });

      it('should not duplicate trigger for same player', () => {
        initializePredefinedRules();

        // Create 3 wolf kills
        for (let i = 0; i < 3; i++) {
          saveGameEvent({
            player_id: testPlayerId,
            event_type: 'wolf_kill',
            location: 'Northern Forest',
            metadata: { description: `Wolf kill ${i + 1}` },
          });
        }

        // First evaluation triggers
        const first = evaluateWorldTriggers(testPlayerId);
        const wolfEvents1 = first.filter(e => e.event_name === 'Wolf Pack Retreat');
        expect(wolfEvents1).toHaveLength(1);

        // Second evaluation should not trigger again
        const second = evaluateWorldTriggers(testPlayerId);
        const wolfEvents2 = second.filter(e => e.event_name === 'Wolf Pack Retreat');
        expect(wolfEvents2).toHaveLength(0);
      });

      it('should evaluate multiple rules independently', () => {
        initializePredefinedRules();

        // Create 3 wolf_kill events
        for (let i = 0; i < 3; i++) {
          saveGameEvent({
            player_id: testPlayerId,
            event_type: 'wolf_kill',
            location: 'Forest',
            metadata: {},
          });
        }

        // Create 5 explore events
        for (let i = 0; i < 5; i++) {
          saveGameEvent({
            player_id: testPlayerId,
            event_type: 'explore',
            location: 'Ember Tower',
            metadata: {},
          });
        }

        const triggered = evaluateWorldTriggers(testPlayerId);

        expect(triggered.length).toBe(2);
        const names = triggered.map(e => e.event_name).sort();
        expect(names).toContain('Arcane Instability');
        expect(names).toContain('Wolf Pack Retreat');
      });
    });
  });
});
