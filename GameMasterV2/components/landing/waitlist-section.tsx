"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { CircleCheck as CheckCircle2, Loader as Loader2 } from "lucide-react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [interestedInPaid, setInterestedInPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("waitlist").insert({
        email,
        role,
        company: company || null,
        interested_in_paid: interestedInPaid,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("This email is already on the waitlist!");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="waitlist" className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              You're on the list!
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Thank you for joining the AI Game Master waitlist. We'll keep you updated on our progress and notify you when early access is available.
            </p>
            <p className="text-slate-500">
              Check your email for a confirmation and next steps.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Join the Waitlist
            </h2>
            <p className="text-xl text-slate-600">
              Be among the first to build living game worlds with AI Game Master. Early access spots are limited.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-base font-medium text-slate-900">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 h-12 text-base"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-base font-medium text-slate-900">
                  What best describes you? *
                </Label>
                <Select value={role} onValueChange={setRole} disabled={loading} required>
                  <SelectTrigger className="mt-2 h-12 text-base">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indie-developer">Indie Game Developer</SelectItem>
                    <SelectItem value="game-studio">Game Studio</SelectItem>
                    <SelectItem value="ai-developer">AI Developer</SelectItem>
                    <SelectItem value="narrative-designer">Narrative Designer</SelectItem>
                    <SelectItem value="technical-founder">Technical Founder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="company" className="text-base font-medium text-slate-900">
                  Company or Project (Optional)
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company or game project"
                  className="mt-2 h-12 text-base"
                  disabled={loading}
                />
              </div>

              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <Checkbox
                  id="paid-interest"
                  checked={interestedInPaid}
                  onCheckedChange={(checked) => setInterestedInPaid(checked as boolean)}
                  disabled={loading}
                  className="mt-0.5"
                />
                <Label htmlFor="paid-interest" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                  I'm interested in paid early access and want to lock in early adopter pricing ($19-$99/mo)
                </Label>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                disabled={loading || !role}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join the AI Game Master Waitlist"
                )}
              </Button>

              <p className="text-sm text-slate-500 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
