import { CircleAlert as AlertCircle, RefreshCcw, MessageSquare, Map } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: Map,
      title: "Static Quests",
      description: "Every player experiences the same scripted missions in the same order, regardless of their choices."
    },
    {
      icon: MessageSquare,
      title: "Scripted Dialogue",
      description: "NPCs recite the same lines over and over, with no memory of past interactions or player history."
    },
    {
      icon: RefreshCcw,
      title: "Predictable Stories",
      description: "Story arcs follow rigid paths, leaving no room for emergent narrative or player creativity."
    },
    {
      icon: AlertCircle,
      title: "No Real Consequences",
      description: "Actions feel meaningless when the world doesn't actually remember or respond to player decisions."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Modern Games Still Feel <span className="text-red-600">Static</span>
          </h2>
          <p className="text-xl text-slate-600">
            Despite advances in graphics and technology, most games are still built on decades-old narrative systems that limit player agency and immersion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-red-300 transition-colors"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
