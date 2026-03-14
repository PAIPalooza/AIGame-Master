/**
 * Unit tests for feedback.ts
 * Tests player feedback submission, retrieval, and rating calculation
 *
 * Refs #17
 */

import {
  submitFeedback,
  getFeedbackById,
  getPlayerFeedback,
  getFeedbackByTarget,
  getAverageRating,
  getAllFeedback,
} from '../lib/feedback';
import { clearAllData } from '../lib/data';

describe('Feedback System', () => {
  const testPlayerId = 'player-001';
  const testPlayerId2 = 'player-002';

  beforeEach(() => {
    clearAllData();
  });

  afterEach(() => {
    clearAllData();
  });

  describe('submitFeedback', () => {
    it('should submit feedback with valid rating (1-5)', () => {
      const feedback = submitFeedback(testPlayerId, 'narrative', 4, {
        comment: 'Great storytelling!',
      });

      expect(feedback).toBeDefined();
      expect(feedback.id).toBeDefined();
      expect(feedback.playerId).toBe(testPlayerId);
      expect(feedback.targetType).toBe('narrative');
      expect(feedback.rating).toBe(4);
      expect(feedback.comment).toBe('Great storytelling!');
      expect(feedback.createdAt).toBeDefined();
    });

    it('should accept rating of 1', () => {
      const feedback = submitFeedback(testPlayerId, 'quest', 1);
      expect(feedback.rating).toBe(1);
    });

    it('should accept rating of 5', () => {
      const feedback = submitFeedback(testPlayerId, 'quest', 5);
      expect(feedback.rating).toBe(5);
    });

    it('should reject rating < 1', () => {
      expect(() =>
        submitFeedback(testPlayerId, 'narrative', 0)
      ).toThrow('Rating must be between 1 and 5');
    });

    it('should reject rating > 5', () => {
      expect(() =>
        submitFeedback(testPlayerId, 'narrative', 6)
      ).toThrow('Rating must be between 1 and 5');
    });

    it('should reject non-integer rating', () => {
      expect(() =>
        submitFeedback(testPlayerId, 'narrative', 3.5)
      ).toThrow('Rating must be an integer');
    });

    it('should reject missing playerId', () => {
      expect(() =>
        submitFeedback('', 'narrative', 3)
      ).toThrow('playerId is required');
    });

    it('should store optional targetId', () => {
      const feedback = submitFeedback(testPlayerId, 'quest', 4, {
        targetId: 'quest-001',
      });

      expect(feedback.targetId).toBe('quest-001');
    });

    it('should accept all target types', () => {
      const types: Array<'narrative' | 'quest' | 'npc' | 'world_event' | 'general'> = [
        'narrative', 'quest', 'npc', 'world_event', 'general',
      ];

      for (const type of types) {
        const feedback = submitFeedback(testPlayerId, type, 3);
        expect(feedback.targetType).toBe(type);
      }
    });
  });

  describe('getFeedbackById', () => {
    it('should retrieve feedback by ID', () => {
      const created = submitFeedback(testPlayerId, 'narrative', 4);
      const retrieved = getFeedbackById(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.rating).toBe(4);
    });

    it('should return null for non-existent ID', () => {
      expect(getFeedbackById('nonexistent')).toBeNull();
    });
  });

  describe('getPlayerFeedback', () => {
    it('should retrieve all feedback by a player', () => {
      submitFeedback(testPlayerId, 'narrative', 4);
      submitFeedback(testPlayerId, 'quest', 3);
      submitFeedback(testPlayerId2, 'narrative', 5);

      const playerFeedback = getPlayerFeedback(testPlayerId);

      expect(playerFeedback).toHaveLength(2);
      expect(playerFeedback.every(f => f.playerId === testPlayerId)).toBe(true);
    });

    it('should return empty array for player with no feedback', () => {
      const result = getPlayerFeedback('unknown-player');
      expect(result).toEqual([]);
    });

    it('should sort by createdAt descending', () => {
      submitFeedback(testPlayerId, 'narrative', 1);
      submitFeedback(testPlayerId, 'quest', 2);
      submitFeedback(testPlayerId, 'npc', 3);

      const result = getPlayerFeedback(testPlayerId);

      for (let i = 1; i < result.length; i++) {
        expect(new Date(result[i - 1].createdAt).getTime())
          .toBeGreaterThanOrEqual(new Date(result[i].createdAt).getTime());
      }
    });
  });

  describe('getFeedbackByTarget', () => {
    it('should retrieve feedback by target type', () => {
      submitFeedback(testPlayerId, 'narrative', 4);
      submitFeedback(testPlayerId, 'narrative', 3);
      submitFeedback(testPlayerId, 'quest', 5);

      const narrativeFeedback = getFeedbackByTarget('narrative');

      expect(narrativeFeedback).toHaveLength(2);
      expect(narrativeFeedback.every(f => f.targetType === 'narrative')).toBe(true);
    });

    it('should filter by targetId when provided', () => {
      submitFeedback(testPlayerId, 'quest', 4, { targetId: 'quest-001' });
      submitFeedback(testPlayerId, 'quest', 3, { targetId: 'quest-002' });
      submitFeedback(testPlayerId, 'quest', 5, { targetId: 'quest-001' });

      const result = getFeedbackByTarget('quest', 'quest-001');

      expect(result).toHaveLength(2);
      expect(result.every(f => f.targetId === 'quest-001')).toBe(true);
    });
  });

  describe('getAverageRating', () => {
    it('should calculate average rating', () => {
      submitFeedback(testPlayerId, 'narrative', 4);
      submitFeedback(testPlayerId2, 'narrative', 2);

      const result = getAverageRating('narrative');

      expect(result.average).toBe(3);
      expect(result.count).toBe(2);
    });

    it('should return 0 average for empty set', () => {
      const result = getAverageRating('narrative');

      expect(result.average).toBe(0);
      expect(result.count).toBe(0);
    });

    it('should round average to 2 decimal places', () => {
      submitFeedback(testPlayerId, 'narrative', 4);
      submitFeedback(testPlayerId2, 'narrative', 3);
      submitFeedback('player-003', 'narrative', 5);

      const result = getAverageRating('narrative');

      expect(result.average).toBe(4); // (4+3+5)/3 = 4.0
      expect(result.count).toBe(3);
    });

    it('should filter by targetId', () => {
      submitFeedback(testPlayerId, 'quest', 5, { targetId: 'quest-001' });
      submitFeedback(testPlayerId2, 'quest', 3, { targetId: 'quest-001' });
      submitFeedback(testPlayerId, 'quest', 1, { targetId: 'quest-002' });

      const result = getAverageRating('quest', 'quest-001');

      expect(result.average).toBe(4);
      expect(result.count).toBe(2);
    });
  });

  describe('getAllFeedback', () => {
    it('should return all feedback entries', () => {
      submitFeedback(testPlayerId, 'narrative', 4);
      submitFeedback(testPlayerId2, 'quest', 3);

      const all = getAllFeedback();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no feedback exists', () => {
      const all = getAllFeedback();
      expect(all).toEqual([]);
    });
  });
});
