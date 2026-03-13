import { Terminal, CircleCheck as CheckCircle2, Brain, Zap } from 'lucide-react';

export function DemoScenarioSection() {
  return (
    <section className="py-24 bg-brand-purple relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-[#3d2159] to-brand-purple opacity-90" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-sm font-semibold mb-6">
              See It In Action
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              Experience <span className="text-brand-pink">Living Narratives</span>
            </h2>
            <p className="font-body text-xl text-gray-300">
              Watch how AI Game Master transforms simple player input into immersive, context-aware experiences
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-brand-cyan/30 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20 border-b border-brand-cyan/30 px-4 py-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-cyan" />
              <span className="font-mono text-sm text-brand-cyan">game-session.log</span>
              <div className="flex-1" />
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand-pink/50" />
                <div className="w-3 h-3 rounded-full bg-brand-gold/50" />
                <div className="w-3 h-3 rounded-full bg-brand-emerald/50" />
              </div>
            </div>

            <div className="p-6 space-y-6 font-mono text-sm">
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-brand-cyan flex-shrink-0">PLAYER INPUT:</span>
                </div>
                <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded p-4 ml-6">
                  <p className="text-white">"Investigate the Ember Tower ruins."</p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-6 text-brand-cyan/60">
                <div className="flex-1 h-px bg-brand-cyan/20" />
                <span className="text-xs">AI PROCESSING</span>
                <div className="flex-1 h-px bg-brand-cyan/20" />
              </div>

              <div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-brand-emerald flex-shrink-0">AI RESPONSE:</span>
                </div>
                <div className="bg-brand-emerald/5 border border-brand-emerald/20 rounded p-4 ml-6">
                  <p className="text-white leading-relaxed">
                    "The ruins still whisper with arcane energy. Beneath the rubble you notice a faint glow—the same
                    ethereal light you saw in the merchant's amulet three days ago. Your investigation of the tower
                    collapse revealed traces of dark magic, but something feels different this time. The air crackles
                    with recognition."
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 ml-6 mt-6">
                <div className="bg-black/30 border border-brand-gold/20 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    <span className="text-brand-gold text-xs font-semibold">QUEST GENERATED</span>
                  </div>
                  <p className="text-gray-400 text-xs">Unravel the Ember Tower Mystery</p>
                </div>

                <div className="bg-black/30 border border-brand-pink/20 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-brand-pink" />
                    <span className="text-brand-pink text-xs font-semibold">MEMORY RECALLED</span>
                  </div>
                  <p className="text-gray-400 text-xs">Referenced merchant encounter from session #47</p>
                </div>

                <div className="bg-black/30 border border-brand-cyan/20 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-brand-cyan" />
                    <span className="text-brand-cyan text-xs font-semibold">WORLD UPDATED</span>
                  </div>
                  <p className="text-gray-400 text-xs">Faction standing adjusted +5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-gray-400">
              Every interaction is unique, contextual, and builds on player history
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
