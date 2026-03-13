'use client';

import { Code as Code2, Database, Cpu, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeveloperSection() {
  const stack = [
    { icon: Database, name: 'ZeroDB', description: 'Vector database for context retrieval' },
    { icon: Cpu, name: 'AIKit', description: 'AI orchestration and generation' },
    { icon: Code2, name: 'Next.js', description: 'Modern web infrastructure' },
    { icon: Zap, name: 'Event Systems', description: 'Real-time game state sync' },
  ];

  return (
    <section className="py-24 bg-[#2d1a4d] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwN0Q5RDkiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-semibold mb-6">
                For Developers
              </div>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
                Built for <span className="text-brand-cyan">AI-Native</span> Game Development
              </h2>
              <p className="font-body text-xl text-gray-300 mb-8 leading-relaxed">
                AI Game Master provides the infrastructure layer for building intelligent game worlds.
                Skip the complexity of managing AI systems and focus on creating amazing games.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-emerald/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-brand-emerald rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white mb-1">Simple Integration</h4>
                    <p className="text-gray-400 text-sm">Drop-in SDK for Unity, Unreal, and custom engines</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-emerald/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-brand-emerald rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white mb-1">Developer-Friendly APIs</h4>
                    <p className="text-gray-400 text-sm">RESTful and WebSocket APIs with comprehensive documentation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-emerald/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-brand-emerald rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white mb-1">Full Control</h4>
                    <p className="text-gray-400 text-sm">Fine-tune AI behavior, customize narratives, and own your data</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-brand-emerald hover:bg-brand-emerald/90 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-brand-emerald/25 hover:shadow-brand-emerald/40 transition-all duration-300 group"
              >
                Get API Access
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div>
              <div className="bg-black/40 backdrop-blur-sm border border-brand-cyan/30 rounded-lg p-8">
                <h3 className="font-heading text-xl font-bold text-white mb-6">Built With</h3>
                <div className="space-y-4">
                  {stack.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-cyan/5 to-transparent border border-brand-cyan/20 rounded-lg hover:border-brand-cyan/40 transition-colors"
                    >
                      <div className="w-10 h-10 bg-brand-cyan/10 rounded flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-brand-cyan" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-white mb-1">{item.name}</h4>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-brand-purple/30 to-brand-cyan/10 border border-brand-cyan/30 rounded-lg">
                  <p className="font-mono text-xs text-brand-cyan mb-2">EXAMPLE INTEGRATION</p>
                  <pre className="font-mono text-xs text-gray-300 overflow-x-auto">
                    <code>{`import { AIGameMaster } from '@ai-gm/sdk'

const gm = new AIGameMaster({
  apiKey: process.env.AIGM_KEY
})

await gm.generateQuest({
  player: playerState,
  context: worldState
})`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
