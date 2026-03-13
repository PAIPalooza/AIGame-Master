import { Quote } from "lucide-react";

export function SocialProofSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              The Future of Gaming
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12 border border-slate-200 shadow-lg">
            <Quote className="w-12 h-12 text-blue-600 mb-6" />
            <blockquote className="text-2xl sm:text-3xl font-medium text-slate-900 mb-6 leading-relaxed">
              "Emergent narrative systems are the future of gaming. Players don't want scripted experiences—they want worlds that respond, remember, and evolve."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-600">AI</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Industry Vision</div>
                <div className="text-slate-600">Game Development Leaders</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10x</div>
              <div className="text-slate-600">More Engaging Narratives</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">&infin;</div>
              <div className="text-slate-600">Unique Player Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-slate-600">Context-Aware NPCs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
