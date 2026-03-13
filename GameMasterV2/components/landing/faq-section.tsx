import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "What is AI Game Master?",
      answer: "AI Game Master is an AI-native narrative engine that helps game developers create dynamic, living game worlds. It generates contextual quests, manages persistent NPC memory, creates emergent narratives, and adapts difficulty based on player actions and world state. Think of it as infrastructure for building games where every playthrough is unique and meaningful."
    },
    {
      question: "How is this different from ChatGPT or other LLMs?",
      answer: "While AI Game Master uses advanced language models, it's specifically designed for game development. Unlike generic LLMs, it maintains persistent world state, understands game mechanics, generates structured quest systems, manages faction relationships, and integrates deeply with game engines. It's built on ZeroDB for event sourcing and AIKit for game-specific AI generation."
    },
    {
      question: "Can I integrate it into my game engine?",
      answer: "Yes! AI Game Master is designed to integrate with any game engine through our developer SDK and API. We provide examples for Unity, Unreal, Godot, and custom engines. The system works with both text-based games and traditional 3D/2D games that need dynamic narrative systems."
    },
    {
      question: "Is this for indie developers or only studios?",
      answer: "AI Game Master is built for everyone—from solo indie developers to large game studios. Our Builder tier is specifically designed for indie developers at $19/month, while our Studio tier serves larger teams with advanced needs. We believe the future of gaming shouldn't be limited to AAA budgets."
    },
    {
      question: "What platforms and game types are supported?",
      answer: "AI Game Master is platform-agnostic and works with PC, console, mobile, and web games. It's particularly powerful for RPGs, narrative-driven games, roguelikes, simulation games, and any game where dynamic storytelling and emergent gameplay are important. The system scales from text-based adventures to fully-featured 3D open-world games."
    },
    {
      question: "When will AI Game Master be available?",
      answer: "We're currently in development and accepting waitlist signups for early access. Early adopters who join now will get priority access, locked-in pricing, and the opportunity to help shape the product. We'll be rolling out invites to the waitlist in phases starting in the coming months."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about AI Game Master
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-slate-200 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 hover:text-blue-600 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6">
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
