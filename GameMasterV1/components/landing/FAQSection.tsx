import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQSection() {
  const faqs = [
    {
      question: 'What is AI Game Master?',
      answer: 'AI Game Master is an AI-native narrative game engine that helps developers build living game worlds. It generates dynamic quests, maintains persistent NPC memory, creates emergent narratives, adapts difficulty in real-time, and simulates complex world systems. It\'s powered by ZeroDB for context retrieval and AIKit for AI generation.',
    },
    {
      question: 'How is this different from ChatGPT?',
      answer: 'While ChatGPT is a general-purpose conversational AI, AI Game Master is specifically designed for game development. It includes game-specific features like quest generation, world state management, NPC memory systems, faction politics, and seamless integration with game engines. It understands game mechanics, maintains consistent world lore, and provides deterministic outputs when needed.',
    },
    {
      question: 'Can I integrate it into my game engine?',
      answer: 'Yes! AI Game Master provides SDKs for Unity, Unreal Engine, and custom game engines. We offer both REST APIs and WebSocket connections for real-time interactions. Our developer documentation includes comprehensive integration guides, code examples, and best practices for different engine types.',
    },
    {
      question: 'Is this for indie developers?',
      answer: 'Absolutely! We designed AI Game Master with indie developers in mind. Our Builder tier at $19/month gives you full access to all core features. Whether you\'re a solo developer or a small team, you can build AAA-quality narrative experiences without the infrastructure complexity of managing your own AI systems.',
    },
    {
      question: 'What platforms are supported?',
      answer: 'AI Game Master is platform-agnostic and works with any game platform that can make HTTP requests or WebSocket connections. This includes PC, console, mobile, and web games. Our SDKs support Unity, Unreal Engine, Godot, and custom engines built with JavaScript, C#, C++, and other languages.',
    },
  ];

  return (
    <section className="py-24 bg-[#2d1a4d] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="font-body text-xl text-gray-300">
              Everything you need to know about AI Game Master
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-brand-cyan/20 rounded-lg px-6 data-[state=open]:border-brand-cyan/50"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-white hover:text-brand-cyan transition-colors py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-gray-300 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
