import { Sparkles, Brain, BookOpen, Gauge, Globe } from 'lucide-react';

export function SolutionSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Dynamic Quests',
      description: 'AI-generated quests that adapt to player choices and evolve based on world state',
    },
    {
      icon: Brain,
      title: 'Persistent NPC Memory',
      description: 'NPCs remember past interactions and build relationships with players over time',
    },
    {
      icon: BookOpen,
      title: 'Emergent Narrative',
      description: 'Stories that emerge naturally from player actions rather than following scripts',
    },
    {
      icon: Gauge,
      title: 'Adaptive Difficulty',
      description: 'Real-time adjustment based on player skill and creative problem-solving',
    },
    {
      icon: Globe,
      title: 'World Simulation',
      description: 'Living economies, faction politics, and events that happen even when players are offline',
    },
  ];

  return (
    <section className="py-24 bg-[#2d1a4d] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-sm font-semibold mb-6">
              The Solution
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              AI-Native Game Infrastructure
            </h2>
            <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
              AI Game Master powers living game worlds with intelligent narrative systems
              that understand context, remember history, and generate authentic experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-brand-cyan/20 rounded-lg p-6 hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-cyan/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-cyan/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-cyan/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-cyan" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
            {features.slice(3).map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-brand-cyan/20 rounded-lg p-6 hover:border-brand-cyan/50 hover:shadow-lg hover:shadow-brand-cyan/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-cyan/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-cyan/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-cyan" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-gray-400 leading-relaxed">
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
