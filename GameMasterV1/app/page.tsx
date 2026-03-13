import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { DemoScenarioSection } from '@/components/landing/DemoScenarioSection';
import { FeatureDeepDiveSection } from '@/components/landing/FeatureDeepDiveSection';
import { DeveloperSection } from '@/components/landing/DeveloperSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
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
