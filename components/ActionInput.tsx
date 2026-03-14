/**
 * ActionInput Component
 * Text input for player actions with send button and loading state
 * Refs #18
 */

'use client';

import { useState } from 'react';

interface ActionInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export default function ActionInput({
  onSubmit,
  disabled = false,
  loading = false,
  placeholder = 'Enter your action...',
}: ActionInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled || loading) return;
    onSubmit(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isDisabled = disabled || loading;
  const isEmpty = !message.trim();

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        aria-label="Action input"
        className="flex-1 bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled || isEmpty}
        aria-label="Send action"
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
}
