/**
 * WorldEventsDisplay Component
 * Shows triggered world events sorted by most recent first
 * Refs #21
 */

'use client';

interface WorldEventView {
  id: string;
  name: string;
  description: string;
  timestamp: string;
}

interface WorldEventsDisplayProps {
  events: WorldEventView[];
  loading?: boolean;
}

export default function WorldEventsDisplay({
  events,
  loading = false,
}: WorldEventsDisplayProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div
      data-testid="world-events-display"
      role="log"
      aria-label="World events"
    >
      {loading ? (
        <div
          data-testid="loading-indicator"
          className="inline-flex items-center gap-2 text-gray-400"
        >
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading events...
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-gray-400 italic">No world events triggered yet</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4
                    data-testid={`world-event-name-${event.id}`}
                    className="text-xl font-bold text-yellow-300"
                  >
                    {event.name}
                  </h4>
                  <p className="text-gray-300 mt-1">{event.description}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
