'use client';

import { useState } from 'react';
import { ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { zeroDBClient } from '@/lib/zerodb-client';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [interestedInPaid, setInterestedInPaid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Check if email already exists
      const emailExists = await zeroDBClient.emailExists(email);
      if (emailExists) {
        setError('This email is already on the waitlist!');
        setIsSubmitting(false);
        return;
      }

      // Submit to ZeroDB
      await zeroDBClient.submitWaitlist({
        email,
        role: role || undefined,
        company: company || undefined,
        interested_in_paid: interestedInPaid,
      });

      // Success!
      setIsSuccess(true);
      setEmail('');
      setRole('');
      setCompany('');
      setInterestedInPaid(false);
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="waitlist" className="py-24 bg-gradient-to-b from-brand-purple to-[#2d1a4d] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-brand-emerald" />
            </div>
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              You're on the list!
            </h2>
            <p className="font-body text-xl text-gray-300 mb-8">
              We'll send you early access updates and be in touch soon.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30"
            >
              Submit another signup
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-24 bg-gradient-to-b from-brand-purple to-[#2d1a4d] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 via-transparent to-brand-cyan/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              Join the <span className="text-brand-pink">AI Game Master</span> Waitlist
            </h2>
            <p className="font-body text-xl text-gray-300">
              Be among the first to build next-generation game worlds
            </p>
          </div>

          <div className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-sm border border-brand-pink/30 rounded-lg p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-white font-semibold mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="bg-black/30 border-brand-cyan/30 text-white placeholder:text-gray-500 focus:border-brand-cyan"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-white font-semibold mb-2 block">
                  Your Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Game Developer, Indie Dev, Studio Lead..."
                  className="bg-black/30 border-brand-cyan/30 text-white placeholder:text-gray-500 focus:border-brand-cyan"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-white font-semibold mb-2 block">
                  Company / Studio (Optional)
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your studio name"
                  className="bg-black/30 border-brand-cyan/30 text-white placeholder:text-gray-500 focus:border-brand-cyan"
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-brand-gold/5 border border-brand-gold/30 rounded-lg">
                <Checkbox
                  id="paid"
                  checked={interestedInPaid}
                  onCheckedChange={(checked) => setInterestedInPaid(checked as boolean)}
                  className="border-brand-gold/50 data-[state=checked]:bg-brand-gold data-[state=checked]:border-brand-gold mt-0.5"
                />
                <Label htmlFor="paid" className="text-white text-sm cursor-pointer leading-relaxed">
                  I'm interested in paid early access to get started immediately
                </Label>
              </div>

              {error && (
                <div className="p-4 bg-brand-pink/10 border border-brand-pink/30 rounded-lg">
                  <p className="text-brand-pink text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold py-6 text-lg rounded-lg shadow-lg shadow-brand-pink/25 hover:shadow-brand-pink/40 transition-all duration-300 group"
              >
                {isSubmitting ? 'Joining...' : 'Join the AI Game Master Waitlist'}
                {!isSubmitting && (
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>

              <p className="text-center text-gray-400 text-sm">
                No spam. Early access only. Be first to shape the future of AI-native game worlds.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
