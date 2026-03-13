import { Quote } from 'lucide-react';

export function SocialProofSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#2d1a4d] to-brand-purple relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              The Future of Gaming
            </h2>
          </div>

          <div className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm border border-brand-gold/30 rounded-lg p-8 md:p-12 relative">
            <div className="absolute -top-6 left-8 w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center border border-brand-gold/30">
              <Quote className="w-6 h-6 text-brand-gold" />
            </div>

            <blockquote className="relative z-10">
              <p className="font-body text-2xl md:text-3xl text-white leading-relaxed mb-6 italic">
                "Emergent narrative systems are the future of gaming."
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-pink rounded-full" />
                <div>
                  <div className="font-heading font-semibold text-white">Industry Leader</div>
                  <div className="text-gray-400 text-sm">Game Development Visionary</div>
                </div>
              </footer>
            </blockquote>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-brand-cyan/20 rounded-lg p-6 text-center">
              <div className="font-heading text-3xl font-bold text-brand-cyan mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Developer Interest</div>
            </div>

            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-brand-emerald/20 rounded-lg p-6 text-center">
              <div className="font-heading text-3xl font-bold text-brand-emerald mb-2">1M+</div>
              <div className="text-gray-400 text-sm">AI Interactions</div>
            </div>

            <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-brand-gold/20 rounded-lg p-6 text-center">
              <div className="font-heading text-3xl font-bold text-brand-gold mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
