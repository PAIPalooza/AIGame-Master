/**
 * NarrativeOutput Component
 * Displays NPC narrative responses with lore references and loading state
 * Refs #19
 */

'use client';

interface NarrativeOutputProps {
  npcName: string;
  response: string;
  loreUsed?: Array<{ id: string; title: string }>;
  loading?: boolean;
}

export default function NarrativeOutput({
  npcName,
  response,
  loreUsed,
  loading = false,
}: NarrativeOutputProps) {
  if (!response && !loading) return null;

  return (
    <div data-testid="narrative-output">
      <div
        data-testid="narrative-response"
        aria-live="polite"
        className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4"
      >
        <p className="text-sm text-purple-300 font-semibold mb-2">
          {npcName} says:
        </p>

        {loading ? (
          <div
            data-testid="loading-indicator"
            className="inline-flex items-center gap-2 text-gray-400"
          >
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Typing...
          </div>
        ) : (
          <p className="text-gray-100">{response}</p>
        )}

        {loreUsed && loreUsed.length > 0 && (
          <div
            data-testid="lore-references"
            className="mt-3 pt-3 border-t border-purple-500/20"
          >
            <p className="text-xs text-purple-400 font-semibold mb-1 uppercase tracking-wide">
              Lore Referenced:
            </p>
            <ul className="space-y-1">
              {loreUsed.map((lore) => (
                <li key={lore.id} className="text-xs text-purple-300/80">
                  {lore.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
