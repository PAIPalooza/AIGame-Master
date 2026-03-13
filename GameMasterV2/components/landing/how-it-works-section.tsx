import { User, Database, Cpu, Sparkles, RefreshCw } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: User,
      number: "01",
      title: "Player Interacts",
      description: "Players make choices, perform actions, and shape the narrative through natural interaction with the game world."
    },
    {
      icon: Database,
      number: "02",
      title: "Events Stored",
      description: "Every action, dialogue, and decision is captured in ZeroDB, building a comprehensive history of the world state."
    },
    {
      icon: Cpu,
      number: "03",
      title: "Context Retrieved",
      description: "AI Game Master retrieves relevant context from the entire game history to inform narrative generation."
    },
    {
      icon: Sparkles,
      number: "04",
      title: "Narrative Generated",
      description: "AIKit processes context and generates dynamic responses, quests, and outcomes that feel natural and coherent."
    },
    {
      icon: RefreshCw,
      number: "05",
      title: "World Updates",
      description: "The world state dynamically updates, creating ripple effects that influence future interactions and storylines."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-slate-600">
            A seamless system that transforms player actions into living narrative experiences.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row gap-6 items-start md:items-center group"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="hidden md:block text-6xl font-bold text-slate-100 group-hover:text-slate-200 transition-colors">
                    {step.number}
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-200 group-hover:border-blue-300 transition-colors">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-20 w-0.5 h-12 bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
