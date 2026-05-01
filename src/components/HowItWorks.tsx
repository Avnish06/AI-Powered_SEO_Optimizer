"use client";

import { MousePointer2, Cpu, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MousePointer2,
    title: "Enter URL",
    desc: "Paste your website link. We handle the rest — no setup required.",
    color: "#6366f1",
  },
  {
    icon: Cpu,
    title: "AI Deep Crawl",
    desc: "Our engine scans over 40 signals to find every optimization gap.",
    color: "#8b5cf6",
  },
  {
    icon: BarChart3,
    title: "Get Scorecard",
    desc: "Receive a detailed, color-coded report across 10 SEO categories.",
    color: "#06b6d4",
  },
  {
    icon: CheckCircle2,
    title: "Fix & Track",
    desc: "Apply the AI suggestions and watch your search rankings climb.",
    color: "#10b981",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HowItWorks() {
  return (
    <section id="how" className="py-32 px-4 relative overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 pointer-events-none bg-[var(--bg-elevated)] opacity-30" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-24"
        >
          <h2
            className="text-4xl md:text-6xl font-black mb-5 tracking-tighter t-heading"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Four steps to{" "}
            <span className="gradient-text">the top.</span>
          </h2>
          <p
            className="text-lg t-body max-w-xl mx-auto leading-relaxed"
          >
            Optimizing your website shouldn&apos;t take days. Our four-step workflow
            delivers real, actionable insights in under three seconds.
          </p>
        </motion.div>

        {/* Steps — Horizontal layout */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-px border-t border-dashed t-border opacity-50 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="flex flex-col items-center text-center group"
              >
                <div 
                  className="w-24 h-24 rounded-3xl t-surface border t-border flex items-center justify-center mb-8 relative shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1"
                >
                  <div 
                    className="absolute -top-3 -right-3 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg"
                    style={{ background: "var(--gradient)" }}
                  >
                    {i + 1}
                  </div>
                  <step.icon className="w-10 h-10" style={{ color: step.color }} />
                </div>
                <h3
                  className="text-xl font-bold mb-3 t-heading tracking-tighter"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm t-body leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-24 rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: "var(--gradient)" }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }}
          />
          <div className="relative z-10">
            <h3
              className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tighter"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your rankings are waiting.
            </h3>
            <p className="text-white/85 mb-8 max-w-md mx-auto">
              Join thousands of websites already optimized with SEOAI. It&apos;s free to start.
            </p>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-bold px-8 py-4 rounded-xl bg-white transition-all shadow-lg"
              style={{ color: "var(--accent)" }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
