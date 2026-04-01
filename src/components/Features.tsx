"use client";

import { 
  Search, Shield, Zap, Globe, Sparkles, 
  BarChart3, Layout, FileText, Link as LinkIcon, 
  Smartphone 
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "On-Page Analysis",
    description: "Deep crawl of titles, meta descriptions, and header hierarchies for maximum relevance.",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    icon: Shield,
    title: "Technical Audit",
    description: "Check for HTTPS, viewport settings, and HTML standards to ensure site health.",
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    icon: Zap,
    title: "Performance Metrics",
    description: "Simulated load times and optimization suggestions to keep your users engaged.",
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    icon: FileText,
    title: "Content Quality",
    description: "Word count analysis and paragraph structure checks to avoid thin content penalties.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    icon: LinkIcon,
    title: "Link Profiling",
    description: "Evaluate internal vs external link density and identify broken or empty links.",
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Receive tailored optimization advice powered by our advanced SEO intelligence.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Complete <span className="gradient-text">10-Factor</span> Analysis
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our engine evaluates every aspect of your site to provide a comprehensive 
            score that search engines actually care about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="glass p-8 rounded-[2rem] border border-white/10 hover:border-blue-500/30 transition-all hover:scale-[1.02] group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
