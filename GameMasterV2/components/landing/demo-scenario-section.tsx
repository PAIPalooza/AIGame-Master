import { Terminal, Sparkles } from "lucide-react";

export function DemoScenarioSection() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            See It In Action
          </h2>
          <p className="text-xl text-slate-300">
            Watch how a simple player action transforms into a rich, contextual narrative experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-slate-400">Player Input</span>
            </div>
            <p className="text-lg text-white font-mono">
              "Investigate the Ember Tower ruins."
            </p>
          </div>

          <div className="flex justify-center">
            <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-slate-800 rounded-xl p-8 border border-blue-700 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">AI Game Master Response</span>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-slate-100 leading-relaxed">
                The ruins still whisper with arcane energy. Beneath the rubble, you notice a faint glow emanating from what appears to be a concealed entrance. The air grows colder as you approach.
              </p>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400 mb-2">Quest Generated:</p>
                <p className="text-slate-200">
                  <span className="font-semibold">The Ember Tower Mystery</span> - Investigate the source of the arcane energy. Your reputation for defeating the Shadow Thief has reached the ears of those watching from the darkness.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400 mb-1">Contextual</div>
                <div className="text-sm text-slate-400">References past actions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">Dynamic</div>
                <div className="text-sm text-slate-400">Generates new quest</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400 mb-1">Immersive</div>
                <div className="text-sm text-slate-400">Rich narrative detail</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
