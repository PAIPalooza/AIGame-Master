import { Circle as XCircle } from 'lucide-react';

export function ProblemSection() {
  const problems = [
    {
      title: 'Static Quests',
      description: 'Every playthrough feels the same with pre-scripted content',
    },
    {
      title: 'Scripted Dialogue',
      description: 'NPCs forget conversations and repeat the same lines',
    },
    {
      title: 'Predictable Stories',
      description: 'Players can see through the limited branching paths',
    },
    {
      title: 'No Player Agency',
      description: 'Creative solutions are punished by rigid quest design',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-brand-purple to-[#2d1a4d] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzA3RDlEOSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">
              Modern Games Are Still{' '}
              <span className="text-brand-pink">Stuck in the Past</span>
            </h2>
            <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
              Players want worlds that remember them, stories that react, and NPCs that evolve.
              They don't want experiences that are pre-scripted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm border border-brand-cyan/20 rounded-lg p-6 hover:border-brand-cyan/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <XCircle className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-white mb-2">
                      {problem.title}
                    </h3>
                    <p className="font-body text-gray-400">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-brand-pink/10 to-brand-cyan/10 border border-brand-cyan/30 rounded-lg p-8 backdrop-blur-sm">
              <p className="font-body text-lg text-white mb-2">
                The result?
              </p>
              <p className="font-heading text-2xl font-bold text-brand-cyan">
                Players lose immersion. Developers lose creative potential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
