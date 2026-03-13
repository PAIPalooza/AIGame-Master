"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Image
              src="/tRANSPARENTLOGO.png"
              alt="AI Game Master Logo"
              width={180}
              height={50}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex border-slate-300 hover:border-slate-400"
              onClick={scrollToWaitlist}
            >
              Sign In
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={scrollToWaitlist}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
