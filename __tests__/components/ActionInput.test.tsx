/**
 * @jest-environment jsdom
 */

/**
 * Unit tests for ActionInput component
 * Tests text input, submission, disabled/loading states, accessibility
 *
 * Refs #18
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ActionInput from '../../components/ActionInput';

describe('ActionInput', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Rendering', () => {
    it('should render a text input with placeholder', () => {
      render(<ActionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText('Action input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter your action...');
    });

    it('should render a send button', () => {
      render(<ActionInput onSubmit={mockOnSubmit} />);

      const button = screen.getByLabelText('Send action');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Send');
    });

    it('should accept custom placeholder', () => {
      render(<ActionInput onSubmit={mockOnSubmit} placeholder="Investigate..." />);

      const input = screen.getByLabelText('Action input');
      expect(input).toHaveAttribute('placeholder', 'Investigate...');
    });
  });

  describe('Submission', () => {
    it('should call onSubmit with trimmed text when send is clicked', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText('Action input');
      await user.type(input, '  Investigate Ember Tower  ');
      await user.click(screen.getByLabelText('Send action'));

      expect(mockOnSubmit).toHaveBeenCalledWith('Investigate Ember Tower');
    });

    it('should call onSubmit when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText('Action input');
      await user.type(input, 'Follow wolf tracks{Enter}');

      expect(mockOnSubmit).toHaveBeenCalledWith('Follow wolf tracks');
    });

    it('should clear input after submission', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText('Action input');
      await user.type(input, 'Explore forest{Enter}');

      expect(input).toHaveValue('');
    });

    it('should not submit when input is empty', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} />);

      await user.click(screen.getByLabelText('Send action'));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should not submit when input is only whitespace', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByLabelText('Action input');
      await user.type(input, '   ');
      await user.click(screen.getByLabelText('Send action'));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should disable input and button when disabled prop is true', () => {
      render(<ActionInput onSubmit={mockOnSubmit} disabled={true} />);

      expect(screen.getByLabelText('Action input')).toBeDisabled();
      expect(screen.getByLabelText('Send action')).toBeDisabled();
    });

    it('should not submit when disabled', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} disabled={true} />);

      const input = screen.getByLabelText('Action input');
      fireEvent.change(input, { target: { value: 'test' } });
      await user.click(screen.getByLabelText('Send action'));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable input and button when loading', () => {
      render(<ActionInput onSubmit={mockOnSubmit} loading={true} />);

      expect(screen.getByLabelText('Action input')).toBeDisabled();
      expect(screen.getByLabelText('Send action')).toBeDisabled();
    });

    it('should show loading text when loading', () => {
      render(<ActionInput onSubmit={mockOnSubmit} loading={true} />);

      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });

    it('should not submit when loading', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} loading={true} />);

      const input = screen.getByLabelText('Action input');
      fireEvent.change(input, { target: { value: 'test' } });
      await user.click(screen.getByLabelText('Send action'));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Button State', () => {
    it('should disable send button when input is empty', () => {
      render(<ActionInput onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText('Send action')).toBeDisabled();
    });

    it('should enable send button when input has text', async () => {
      const user = userEvent.setup();
      render(<ActionInput onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText('Action input'), 'hello');

      expect(screen.getByLabelText('Send action')).not.toBeDisabled();
    });
  });
});
