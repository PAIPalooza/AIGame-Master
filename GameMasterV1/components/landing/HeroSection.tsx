'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBackground3D } from './HeroBackground3D';

export function HeroSection() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-purple">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-brand-purple to-[#2d1a4d] opacity-90" />

      <Suspense fallback={null}>
        <HeroBackground3D />
      </Suspense>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-brand-pink/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
        <Image
          src="/tRANSPARENTLOGO.png"
          alt="AI Game Master Logo"
          width={200}
          height={60}
          className="w-32 sm:w-40 md:w-48 h-auto drop-shadow-lg"
          priority
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
                </span>
                Now accepting early access signups
              </div>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Your Game Deserves a{' '}
              <span className="bg-gradient-to-r from-brand-pink via-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Real Game Master
              </span>
            </h1>

            <p className="font-body text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Create living game worlds where quests evolve, NPCs remember players, and stories emerge naturally.
            </p>

            <p className="font-mono text-sm text-brand-cyan/80 max-w-2xl mx-auto">
              AI-native narrative infrastructure powered by ZeroDB + AIKit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={scrollToWaitlist}
                className="bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-brand-pink/25 hover:shadow-brand-pink/40 transition-all duration-300 group"
              >
                Join the Early Access Waitlist
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald border-brand-emerald/30 font-semibold px-8 py-6 text-lg rounded-lg backdrop-blur-sm transition-all duration-300 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-cyan font-heading">∞</div>
                <div className="text-sm text-gray-400 mt-1">Dynamic Quests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-emerald font-heading">100%</div>
                <div className="text-sm text-gray-400 mt-1">Emergent Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-gold font-heading">AI</div>
                <div className="text-sm text-gray-400 mt-1">Powered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-cyan/30 rounded-full p-1">
          <div className="w-1.5 h-3 bg-brand-cyan/50 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
}
