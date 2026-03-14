/**
 * @jest-environment jsdom
 */

/**
 * Unit tests for WorldEventsDisplay component
 * Tests triggered world event rendering, loading state, ordering, and accessibility
 *
 * Refs #21
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorldEventsDisplay from '../../components/WorldEventsDisplay';

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const wolfPackRetreat = {
  id: 'event-001',
  name: 'Wolf Pack Retreat',
  description: 'Wolf activity around Moonvale has suddenly decreased.',
  timestamp: '2024-03-12T10:40:00Z',
};

const emberTowerCollapse = {
  id: 'event-002',
  name: 'Ember Tower Collapse',
  description: 'The Ember Tower has begun to crumble after years of neglect.',
  timestamp: '2024-03-12T09:15:00Z',
};

const moonvaleFlood = {
  id: 'event-003',
  name: 'Moonvale River Flood',
  description: 'Rising waters have cut off the southern trade road from Moonvale.',
  timestamp: '2024-03-12T11:05:00Z',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('WorldEventsDisplay', () => {
  describe('Empty State', () => {
    it('should show empty message when no events', () => {
      render(<WorldEventsDisplay events={[]} />);

      expect(
        screen.getByText('No world events triggered yet')
      ).toBeInTheDocument();
    });

    it('should not show empty message when loading', () => {
      render(<WorldEventsDisplay events={[]} loading={true} />);

      expect(
        screen.queryByText('No world events triggered yet')
      ).not.toBeInTheDocument();
    });
  });

  describe('Event Rendering', () => {
    it('should display event name', () => {
      render(<WorldEventsDisplay events={[wolfPackRetreat]} />);

      expect(screen.getByText('Wolf Pack Retreat')).toBeInTheDocument();
    });

    it('should display event description', () => {
      render(<WorldEventsDisplay events={[wolfPackRetreat]} />);

      expect(
        screen.getByText(
          'Wolf activity around Moonvale has suddenly decreased.'
        )
      ).toBeInTheDocument();
    });

    it('should display Wolf Pack Retreat event correctly', () => {
      render(<WorldEventsDisplay events={[wolfPackRetreat]} />);

      const eventName = screen.getByText('Wolf Pack Retreat');
      expect(eventName).toBeInTheDocument();
      expect(eventName).toHaveStyle({ fontWeight: expect.stringMatching(/bold|700/) });

      expect(
        screen.getByText(
          'Wolf activity around Moonvale has suddenly decreased.'
        )
      ).toBeInTheDocument();
    });

    it('should display multiple events', () => {
      render(
        <WorldEventsDisplay events={[wolfPackRetreat, emberTowerCollapse]} />
      );

      expect(screen.getByText('Wolf Pack Retreat')).toBeInTheDocument();
      expect(screen.getByText('Ember Tower Collapse')).toBeInTheDocument();
    });
  });

  describe('Timestamp Formatting', () => {
    it('should display timestamps in a human-readable format not raw ISO', () => {
      render(<WorldEventsDisplay events={[wolfPackRetreat]} />);

      // Raw ISO string should not appear verbatim; a formatted representation must exist
      expect(
        screen.queryByText('2024-03-12T10:40:00Z')
      ).not.toBeInTheDocument();

      // Some formatted timestamp text must be present in the component
      const display = screen.getByTestId('world-events-display');
      // The timestamp "2024" and "Mar" or a locale equivalent should appear somewhere
      expect(display.textContent).toMatch(/2024|Mar|march/i);
    });
  });

  describe('Event Ordering', () => {
    it('should show most recent events first', () => {
      // moonvaleFlood (11:05) is most recent, emberTowerCollapse (09:15) is oldest
      render(
        <WorldEventsDisplay
          events={[emberTowerCollapse, wolfPackRetreat, moonvaleFlood]}
        />
      );

      const eventNames = screen
        .getAllByTestId(/^world-event-name-/)
        .map((el) => el.textContent);

      expect(eventNames[0]).toBe('Moonvale River Flood');
      expect(eventNames[1]).toBe('Wolf Pack Retreat');
      expect(eventNames[2]).toBe('Ember Tower Collapse');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading', () => {
      render(<WorldEventsDisplay events={[]} loading={true} />);

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have data-testid world-events-display', () => {
      render(<WorldEventsDisplay events={[]} />);

      expect(screen.getByTestId('world-events-display')).toBeInTheDocument();
    });

    it('should have role log and aria-label', () => {
      render(<WorldEventsDisplay events={[]} />);

      expect(
        screen.getByRole('log', { name: 'World events' })
      ).toBeInTheDocument();
    });
  });
});
