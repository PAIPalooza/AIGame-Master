/**
 * @jest-environment jsdom
 */

/**
 * Unit tests for NarrativeOutput component
 * Tests NPC response rendering, loading state, lore references, and accessibility
 *
 * Refs #19
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NarrativeOutput from '../../components/NarrativeOutput';

describe('NarrativeOutput', () => {
  describe('Rendering', () => {
    it('should render nothing when response is empty and not loading', () => {
      const { container } = render(
        <NarrativeOutput npcName="Elarin" response="" />
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('should render NPC name and response text', () => {
      render(
        <NarrativeOutput
          npcName="Elarin"
          response="The Ember Tower has stood for three hundred years."
        />
      );

      expect(screen.getByText('Elarin says:')).toBeInTheDocument();
      expect(
        screen.getByText('The Ember Tower has stood for three hundred years.')
      ).toBeInTheDocument();
    });

    it('should render with custom NPC name', () => {
      render(
        <NarrativeOutput
          npcName="Thorn"
          response="I know nothing of the northern pass."
        />
      );

      expect(screen.getByText('Thorn says:')).toBeInTheDocument();
      expect(
        screen.getByText('I know nothing of the northern pass.')
      ).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading is true', () => {
      render(
        <NarrativeOutput
          npcName="Elarin"
          response="The ancient ruins hold many secrets."
          loading={true}
        />
      );

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should show loading indicator even without response', () => {
      render(
        <NarrativeOutput npcName="Elarin" response="" loading={true} />
      );

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should not show loading indicator when loading is false', () => {
      render(
        <NarrativeOutput
          npcName="Elarin"
          response="The forest is quiet tonight."
          loading={false}
        />
      );

      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Lore References', () => {
    it('should display lore titles when loreUsed is provided', () => {
      const loreUsed = [
        { id: 'lore-1', title: 'History of the Ember Tower' },
        { id: 'lore-2', title: 'The Wolf Clan Chronicles' },
      ];

      render(
        <NarrativeOutput
          npcName="Elarin"
          response="The tower was built by the Wolf Clan."
          loreUsed={loreUsed}
        />
      );

      expect(screen.getByText('History of the Ember Tower')).toBeInTheDocument();
      expect(screen.getByText('The Wolf Clan Chronicles')).toBeInTheDocument();
    });

    it('should not show lore section when loreUsed is empty', () => {
      render(
        <NarrativeOutput
          npcName="Elarin"
          response="I recall nothing of that place."
          loreUsed={[]}
        />
      );

      expect(screen.queryByTestId('lore-references')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-live polite on response container', () => {
      render(
        <NarrativeOutput
          npcName="Elarin"
          response="The stars guide travelers through the dark."
        />
      );

      const responseContainer = screen.getByTestId('narrative-response');
      expect(responseContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('should have data-testid narrative-output', () => {
      render(
        <NarrativeOutput
          npcName="Elarin"
          response="Follow the river east to find the ruins."
        />
      );

      expect(screen.getByTestId('narrative-output')).toBeInTheDocument();
    });
  });
});
