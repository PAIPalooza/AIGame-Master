/**
 * @jest-environment jsdom
 */

/**
 * Unit tests for QuestDisplay component
 * Tests quest list rendering, objective progress, loading state, and accessibility
 *
 * Refs #20
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestDisplay from '../../components/QuestDisplay';

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const inProgressQuest = {
  questId: 'quest-001',
  status: 'in_progress',
  objectives: [
    {
      id: 'obj-001',
      description: 'Defeat wolves near Moonvale',
      currentCount: 2,
      targetCount: 3,
      isCompleted: false,
    },
  ],
};

const completedQuest = {
  questId: 'quest-002',
  status: 'completed',
  objectives: [
    {
      id: 'obj-002',
      description: 'Speak with Elarin the Historian',
      currentCount: 1,
      targetCount: 1,
      isCompleted: true,
    },
  ],
};

const multiObjectiveQuest = {
  questId: 'quest-003',
  status: 'in_progress',
  objectives: [
    {
      id: 'obj-003',
      description: 'Collect ancient rune stones',
      currentCount: 4,
      targetCount: 5,
      isCompleted: false,
    },
    {
      id: 'obj-004',
      description: 'Return to the village shrine',
      currentCount: 0,
      targetCount: 1,
      isCompleted: false,
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('QuestDisplay', () => {
  describe('Empty State', () => {
    it('should show no quests message when quests array is empty', () => {
      render(<QuestDisplay quests={[]} />);

      expect(screen.getByText('No active quests')).toBeInTheDocument();
    });

    it('should not show no quests message when loading', () => {
      render(<QuestDisplay quests={[]} loading={true} />);

      expect(screen.queryByText('No active quests')).not.toBeInTheDocument();
    });
  });

  describe('Quest Rendering', () => {
    it('should display quest with in_progress status badge', () => {
      render(<QuestDisplay quests={[inProgressQuest]} />);

      expect(screen.getByText('in_progress')).toBeInTheDocument();
    });

    it('should display quest with completed status badge', () => {
      render(<QuestDisplay quests={[completedQuest]} />);

      expect(screen.getByText('completed')).toBeInTheDocument();
    });

    it('should display multiple quests', () => {
      render(<QuestDisplay quests={[inProgressQuest, completedQuest]} />);

      expect(screen.getByText('in_progress')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
    });
  });

  describe('Objective Progress', () => {
    it('should show objective description and progress count', () => {
      render(<QuestDisplay quests={[inProgressQuest]} />);

      expect(
        screen.getByText('Defeat wolves near Moonvale')
      ).toBeInTheDocument();
    });

    it('should show completed objectives with visual indicator', () => {
      render(<QuestDisplay quests={[completedQuest]} />);

      const completedObjective = screen.getByTestId('objective-obj-002');
      expect(completedObjective).toHaveAttribute('data-completed', 'true');
    });

    it('should show progress as fraction (currentCount/targetCount)', () => {
      render(<QuestDisplay quests={[inProgressQuest]} />);

      expect(screen.getByText('2/3')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading', () => {
      render(<QuestDisplay quests={[]} loading={true} />);

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have data-testid quest-display', () => {
      render(<QuestDisplay quests={[]} />);

      expect(screen.getByTestId('quest-display')).toBeInTheDocument();
    });

    it('should have aria-label quest tracker', () => {
      render(<QuestDisplay quests={[]} />);

      expect(
        screen.getByRole('region', { name: 'Quest tracker' })
      ).toBeInTheDocument();
    });
  });
});
