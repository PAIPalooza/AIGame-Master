import { Zap, Brain, BookOpen, TrendingUp, Globe } from "lucide-react";

export function SolutionSection() {
  const features = [
    {
      icon: Zap,
      title: "Dynamic Quests",
      description: "Generate unique missions based on player actions, world state, and narrative context. Every playthrough tells a different story."
    },
    {
      icon: Brain,
      title: "Persistent NPC Memory",
      description: "NPCs remember every interaction, forming relationships and grudges that evolve naturally over time."
    },
    {
      icon: BookOpen,
      title: "Emergent Narrative",
      description: "Stories unfold organically from player choices and world events, creating truly unique experiences."
    },
    {
      icon: TrendingUp,
      title: "Adaptive Difficulty",
      description: "Challenge scales intelligently based on player skill, playstyle, and progression, keeping gameplay engaging."
    },
    {
      icon: Globe,
      title: "World Simulation",
      description: "Living ecosystems where factions compete, economies shift, and events cascade through interconnected systems."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Meet <span className="text-blue-600">AI Game Master</span>
          </h2>
          <p className="text-xl text-slate-600">
            An AI-native narrative engine that transforms static game worlds into living, breathing universes that respond to player choices in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
