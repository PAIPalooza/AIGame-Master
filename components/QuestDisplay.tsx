/**
 * QuestDisplay Component
 * Shows active quests with objective progress tracking
 * Refs #20
 */

'use client';

interface QuestObjectiveView {
  id: string;
  description: string;
  currentCount: number;
  targetCount: number;
  isCompleted: boolean;
}

interface QuestView {
  questId: string;
  status: string;
  objectives: QuestObjectiveView[];
}

interface QuestDisplayProps {
  quests: QuestView[];
  loading?: boolean;
}

export default function QuestDisplay({
  quests,
  loading = false,
}: QuestDisplayProps) {
  return (
    <section
      data-testid="quest-display"
      role="region"
      aria-label="Quest tracker"
    >
      {loading ? (
        <div
          data-testid="loading-indicator"
          className="inline-flex items-center gap-2 text-gray-400"
        >
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading quests...
        </div>
      ) : quests.length === 0 ? (
        <p className="text-gray-400 italic">No active quests</p>
      ) : (
        <div className="space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.questId}
              className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    quest.status === 'completed'
                      ? 'bg-green-600/30 text-green-300'
                      : quest.status === 'failed'
                      ? 'bg-red-600/30 text-red-300'
                      : 'bg-yellow-600/30 text-yellow-300'
                  }`}
                >
                  {quest.status}
                </span>
              </div>

              <div className="space-y-2">
                {quest.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    data-testid={`objective-${obj.id}`}
                    data-completed={obj.isCompleted ? 'true' : 'false'}
                    className={`flex items-center justify-between text-sm ${
                      obj.isCompleted ? 'text-green-300 line-through' : 'text-gray-300'
                    }`}
                  >
                    <span>{obj.description}</span>
                    <span className="text-xs font-mono ml-2">
                      {obj.currentCount}/{obj.targetCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
