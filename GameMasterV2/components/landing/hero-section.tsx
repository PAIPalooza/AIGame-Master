"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";
import { SonarAnimation } from "./sonar-animation";

export function HeroSection() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <SonarAnimation />
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Building the Future of Game Narratives</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            Your Game Deserves a <span className="text-blue-600">Real Game Master</span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create living game worlds where quests evolve, NPCs remember players, and stories emerge naturally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={scrollToWaitlist}
            >
              Join the Early Access Waitlist
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-slate-300 hover:border-slate-400"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 relative">
            <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-slate-500 mb-1">Player Action</p>
                    <p className="text-slate-800 font-medium">"I want to explore the abandoned castle on the hill"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm text-slate-500 mb-1">AI Game Master</p>
                    <p className="text-slate-800">The castle looms before you. Local rumors speak of a cursed artifact hidden within. Your previous defeat of the Shadow Thief has caught the attention of forces dwelling here...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
