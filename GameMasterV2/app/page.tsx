import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DemoScenarioSection } from "@/components/landing/demo-scenario-section";
import { FeatureDeepDiveSection } from "@/components/landing/feature-deep-dive-section";
import { DeveloperSection } from "@/components/landing/developer-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { WaitlistSection } from "@/components/landing/waitlist-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <DemoScenarioSection />
      <FeatureDeepDiveSection />
      <DeveloperSection />
      <SocialProofSection />
      <PricingSection />
      <WaitlistSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
