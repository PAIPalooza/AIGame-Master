import { Network, ScrollText, Database, Users, Sword, DollarSign } from "lucide-react";

export function FeatureDeepDiveSection() {
  const features = [
    {
      icon: Network,
      title: "AI Narrative Engine",
      description: "Advanced language models fine-tuned for game narrative, understanding context, player history, and world state to generate coherent, engaging stories."
    },
    {
      icon: ScrollText,
      title: "Dynamic Quest System",
      description: "Quest generation that adapts to player level, playstyle, faction relationships, and world events. No two playthroughs are the same."
    },
    {
      icon: Database,
      title: "Persistent World Memory",
      description: "Every action, conversation, and decision is stored and influences future interactions. NPCs and factions remember everything."
    },
    {
      icon: Users,
      title: "Faction Politics",
      description: "Complex faction systems where your actions affect relationships, trigger political events, and reshape power dynamics across the world."
    },
    {
      icon: Sword,
      title: "Adaptive Encounters",
      description: "Combat and challenges that scale intelligently based on player performance, creating balanced difficulty without artificial level caps."
    },
    {
      icon: DollarSign,
      title: "Player-Driven Economies",
      description: "Economic systems that respond to player actions, creating supply and demand dynamics that affect prices, availability, and quest opportunities."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Built for Serious Game Developers
          </h2>
          <p className="text-xl text-slate-600">
            Deep capabilities designed for developers building the next generation of narrative games.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg">
                <feature.icon className="w-6 h-6 text-white" />
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
