'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-32 bg-gradient-to-br from-brand-purple via-brand-pink/20 to-brand-purple relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0YyNzdCMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-emerald/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Build the Next Generation of{' '}
            <span className="bg-gradient-to-r from-brand-pink via-brand-cyan to-brand-emerald bg-clip-text text-transparent">
              Game Worlds
            </span>
          </h2>

          <p className="font-body text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the early access program and be part of the AI-native gaming revolution
          </p>

          <Button
            size="lg"
            onClick={scrollToWaitlist}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold px-12 py-8 text-xl rounded-lg shadow-2xl shadow-brand-pink/30 hover:shadow-brand-pink/50 transition-all duration-300 group"
          >
            Join the Early Access Program
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="mt-8 text-gray-400 text-sm">
            Limited spots available • Early adopter pricing • Shape the future
          </p>
        </div>
      </div>
    </section>
  );
}
