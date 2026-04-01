"use client";

import { MousePointer2, Cpu, BarChart3, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    title: "Enter URL",
    description: "Simply paste the link of the website you want to analyze."
  },
  {
    icon: Cpu,
    title: "Deep Crawl",
    description: "Our AI engine simulates a search engine crawler to scan your page."
  },
  {
    icon: BarChart3,
    title: "Get Results",
    description: "Receive a detailed scorecard with granular 10-factor analysis."
  },
  {
    icon: CheckCircle2,
    title: "Optimize",
    description: "Apply our AI suggestions and watch your rankings climb."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 px-6 bg-white/[0.02] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Optimizing your website shouldn&apos;t be complicated. Our three-step workflow 
            gets you the insights you need in seconds.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full glass border border-white/10 flex items-center justify-center mb-8 relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-lg">
                    {i + 1}
                  </div>
                  <step.icon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
