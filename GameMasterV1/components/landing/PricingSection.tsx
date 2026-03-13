'use client';

import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  const plans = [
    {
      name: 'Explorer',
      price: 'Free',
      description: 'Get early access updates',
      features: [
        'Waitlist access',
        'Newsletter updates',
        'Early feature previews',
        'Community Discord access',
      ],
      cta: 'Join Waitlist',
      highlighted: false,
    },
    {
      name: 'Builder',
      price: '$19',
      period: '/month',
      description: 'For indie developers',
      features: [
        'Full AI Game Master access',
        'Developer SDK',
        'Early feature access',
        '10K AI requests/month',
        'Discord support',
        'Commercial license',
      ],
      cta: 'Get Early Access',
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Studio',
      price: '$99',
      period: '/month',
      description: 'For game studios',
      features: [
        'Everything in Builder',
        '100K AI requests/month',
        'Multiplayer world support',
        'Priority support',
        'Custom AI training',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-brand-purple relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple via-[#3d2159] to-brand-purple opacity-90" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-semibold mb-6">
              Early Access Pricing
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              Choose Your <span className="text-brand-gold">Adventure</span>
            </h2>
            <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
              Limited early access slots available. Lock in special pricing before public launch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${
                  plan.highlighted
                    ? 'from-black/60 to-black/40 border-brand-gold shadow-lg shadow-brand-gold/20'
                    : 'from-black/40 to-black/20 border-brand-cyan/20'
                } backdrop-blur-sm border-2 rounded-lg p-8 hover:scale-105 transition-all duration-300`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-4 py-1 bg-brand-gold text-black text-sm font-bold rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heading text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 text-lg">{plan.period}</span>
                    )}
                  </div>
                  {plan.highlighted && (
                    <p className="text-brand-gold text-sm mt-2 font-semibold">
                      Early adopter pricing
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-brand-gold' : 'text-brand-emerald'
                      }`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={scrollToWaitlist}
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-brand-gold hover:bg-brand-gold/90 text-black'
                      : 'bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30'
                  } font-semibold py-6 rounded-lg transition-all duration-300`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              All plans include full access during early access period.{' '}
              <span className="text-brand-gold">Limited spots available.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
