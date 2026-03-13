"use client";

import { Check, Sparkles, Rocket, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tiers = [
    {
      name: "Explorer",
      price: "Free",
      icon: Sparkles,
      description: "Stay updated on our launch",
      features: [
        "Early access newsletter",
        "Product updates and roadmap",
        "Launch day priority access",
        "Community Discord invite"
      ],
      cta: "Join Waitlist",
      highlighted: false
    },
    {
      name: "Builder",
      price: "$19",
      period: "/month",
      icon: Rocket,
      badge: "Early Adopter",
      description: "Perfect for indie developers",
      features: [
        "Full AI Game Master access",
        "Developer SDK and API",
        "Up to 10,000 AI requests/month",
        "Early feature access",
        "Email support",
        "Integration examples"
      ],
      cta: "Get Early Access",
      highlighted: true
    },
    {
      name: "Studio",
      price: "$99",
      period: "/month",
      icon: Building2,
      description: "For game studios and teams",
      features: [
        "Everything in Builder",
        "Unlimited AI requests",
        "Multiplayer world support",
        "Custom model fine-tuning",
        "Priority support",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      cta: "Get Early Access",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-600/30 text-blue-300 rounded-full text-sm font-medium mb-6">
            Pre-Launch Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Lock In Early Adopter Pricing
          </h2>
          <p className="text-xl text-slate-300">
            Join now and get exclusive pricing that won't be available after launch. Limited spots available.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border ${
                tier.highlighted
                  ? 'bg-white text-slate-900 border-blue-500 shadow-2xl scale-105 relative'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {tier.badge}
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                tier.highlighted ? 'bg-blue-600' : 'bg-slate-700'
              }`}>
                <tier.icon className={`w-6 h-6 ${tier.highlighted ? 'text-white' : 'text-slate-300'}`} />
              </div>

              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className={`text-sm mb-6 ${tier.highlighted ? 'text-slate-600' : 'text-slate-400'}`}>
                {tier.description}
              </p>

              <div className="mb-6">
                <span className="text-5xl font-bold">{tier.price}</span>
                {tier.period && <span className={tier.highlighted ? 'text-slate-600' : 'text-slate-400'}>{tier.period}</span>}
              </div>

              <Button
                className={`w-full mb-8 ${
                  tier.highlighted
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
                size="lg"
                onClick={scrollToWaitlist}
              >
                {tier.cta}
              </Button>

              <div className="space-y-3">
                {tier.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      tier.highlighted ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                    <span className={`text-sm ${tier.highlighted ? 'text-slate-700' : 'text-slate-300'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 mt-12 text-sm">
          All pricing is in USD. Early adopter pricing locked in for life. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
