"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTASection() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Limited Early Access Spots</span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            Build the Next Generation of Game Worlds
          </h2>

          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the developers creating living, breathing game universes powered by AI. Early access starts soon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 py-7 bg-white text-blue-600 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all"
              onClick={scrollToWaitlist}
            >
              Join the Early Access Program
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200 text-sm">Developers Waiting</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10x</div>
              <div className="text-blue-200 text-sm">More Engaging</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">&infin;</div>
              <div className="text-blue-200 text-sm">Unique Stories</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">AI</div>
              <div className="text-blue-200 text-sm">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
