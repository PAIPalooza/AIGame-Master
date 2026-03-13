import { Cpu, Map, Database, Users, Swords, TrendingUp } from 'lucide-react';

export function FeatureDeepDiveSection() {
  const features = [
    {
      icon: Cpu,
      title: 'AI Narrative Engine',
      description: 'Advanced language models fine-tuned for game storytelling with deep understanding of narrative structure, character development, and world consistency.',
    },
    {
      icon: Map,
      title: 'Dynamic Quest System',
      description: 'Procedurally generated quests that adapt to player level, choices, and play style while maintaining narrative coherence and emotional impact.',
    },
    {
      icon: Database,
      title: 'Persistent World Memory',
      description: 'Every action, conversation, and decision is stored and referenced by AI to create truly personalized experiences across sessions.',
    },
    {
      icon: Users,
      title: 'Faction Politics',
      description: 'Complex relationship systems where NPC factions remember player actions and evolve their attitudes, alliances, and hostilities dynamically.',
    },
    {
      icon: Swords,
      title: 'Adaptive Encounters',
      description: 'Combat and challenge difficulty adjusts in real-time based on player performance, rewarding creativity and strategic thinking over grinding.',
    },
    {
      icon: TrendingUp,
      title: 'Player-Driven Economies',
      description: 'Living economic systems that respond to player trading patterns, resource extraction, and market manipulation with realistic consequences.',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-brand-purple to-[#2d1a4d] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              The Complete <span className="text-brand-gold">Game Master Suite</span>
            </h2>
            <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to build next-generation game experiences with AI-powered narrative systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm border border-brand-cyan/20 rounded-lg p-6 hover:border-brand-gold/50 hover:shadow-lg hover:shadow-brand-gold/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan/20 to-brand-emerald/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-brand-gold/20 group-hover:to-brand-pink/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-cyan group-hover:text-brand-gold transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-gray-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
