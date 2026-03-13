"use client";

import { Code as Code2, Layers, Boxes, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeveloperSection() {
  const techStack = [
    { icon: Layers, name: "ZeroDB", description: "Event-sourced data layer" },
    { icon: Zap, name: "AIKit", description: "AI narrative generation" },
    { icon: Code2, name: "Next.js", description: "Modern web framework" },
    { icon: Boxes, name: "Event Systems", description: "AI-native architecture" }
  ];

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium mb-6">
                For Developers
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Infrastructure for <span className="text-blue-400">AI-Native Games</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Built on a modern tech stack designed for scalability, real-time narrative generation, and seamless integration with your existing game engine.
              </p>

              <div className="space-y-4 mb-8">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <tech.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{tech.name}</div>
                      <div className="text-sm text-slate-400">{tech.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                onClick={scrollToWaitlist}
              >
                Get API Access
              </Button>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-slate-400 ml-2">game-engine.js</span>
              </div>
              <pre className="text-sm text-slate-300 font-mono overflow-x-auto"><code>{`import { AIGameMaster } from '@ainative/gm';

const gm = new AIGameMaster({
  apiKey: process.env.AI_GM_KEY,
  worldId: 'my-fantasy-world'
});

// Player action
const action = await gm.processAction({
  playerId: 'player-123',
  action: 'investigate ruins',
  context: currentGameState
});

// Dynamic response
console.log(action.narrative);
// "The ruins still whisper..."

// Generated quest
console.log(action.questGenerated);
// { id: 'quest-456', ... }`}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
