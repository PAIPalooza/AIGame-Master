import { ArrowRight } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Player Interacts',
      description: 'Player actions are captured in real-time as they explore the world',
    },
    {
      number: '02',
      title: 'Events Stored',
      description: 'Game events and context are persisted in ZeroDB for instant retrieval',
    },
    {
      number: '03',
      title: 'AI Retrieves Context',
      description: 'AI Game Master accesses relevant history and world state',
    },
    {
      number: '04',
      title: 'Narrative Generated',
      description: 'AIKit generates contextual outcomes based on player history',
    },
    {
      number: '05',
      title: 'World Updates',
      description: 'Game world state dynamically updates to reflect new narrative',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#2d1a4d] to-brand-purple relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-cyan rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-brand-emerald rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-brand-pink rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-semibold mb-6">
              How It Works
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              Built for <span className="text-brand-cyan">AI-Native</span> Game Development
            </h2>
            <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
              A seamless integration between your game engine and intelligent narrative systems
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent -translate-y-1/2" />

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-sm border border-brand-cyan/30 rounded-lg p-6 hover:border-brand-cyan/50 transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-brand-cyan/10 border-2 border-brand-cyan rounded-full flex items-center justify-center mb-4 relative z-10">
                        <span className="font-mono text-brand-cyan font-bold text-lg">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-2 z-20">
                      <ArrowRight className="w-4 h-4 text-brand-cyan/50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-brand-purple/50 to-brand-cyan/20 border border-brand-cyan/30 rounded-lg p-8 backdrop-blur-sm max-w-3xl">
              <p className="font-mono text-brand-cyan text-sm mb-2">POWERED BY</p>
              <div className="flex flex-wrap justify-center gap-6 items-center">
                <span className="font-heading text-xl font-bold text-white">ZeroDB</span>
                <span className="text-brand-cyan/50">+</span>
                <span className="font-heading text-xl font-bold text-white">AIKit</span>
                <span className="text-brand-cyan/50">+</span>
                <span className="font-heading text-xl font-bold text-white">Your Game Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
