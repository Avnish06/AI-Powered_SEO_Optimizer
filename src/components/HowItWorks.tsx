"use client";

import { MousePointer2, Cpu, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MousePointer2,
    step: "01",
    title: "Enter any URL",
    desc: "Paste any public website URL. We handle the rest — no setup, no configuration.",
    color: "#6366f1",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Deep Crawl",
    desc: "Our engine simulates a search engine crawler, scanning over 40 ranking signals simultaneously.",
    color: "#8b5cf6",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Your Scorecard",
    desc: "Receive a detailed, color-coded report with scores across 10 distinct SEO categories.",
    color: "#06b6d4",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Fix & Track",
    desc: "Apply the AI suggestions and re-analyze. Watch your score climb alongside your search rankings.",
    color: "#10b981",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-32 px-4 relative overflow-hidden">
      {/* Left decorative */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at left, rgba(99,102,241,0.07) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <h2
            className="text-4xl md:text-6xl font-black mb-5 tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}
          >
            Four steps to{" "}
            <span
              style={{
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              the top.
            </span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Optimizing your website shouldn&apos;t take days. Our four-step workflow
            delivers real, actionable insights in under three seconds.
          </p>
        </motion.div>

        {/* Steps — alternating layout */}
        <div className="space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col md:flex-row items-start md:items-center gap-8 p-8 rounded-2xl transition-all ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
              id={`how-step-${i}`}
            >
              {/* Number + Icon */}
              <div className="flex items-center gap-5 flex-shrink-0">
                <div
                  className="text-5xl font-black leading-none select-none"
                  style={{
                    color: `${step.color}22`,
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.step}
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${step.color}14`, border: `1.5px solid ${step.color}25` }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {step.desc}
                </p>
              </div>

              {/* Arrow connector (not on last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center flex-shrink-0" style={{ color: "var(--border-strong)" }}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: "var(--gradient)",
          }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)" }}
          />
          <div className="relative z-10">
            <h3
              className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Your rankings are waiting.
            </h3>
            <p className="text-white/75 mb-8 max-w-md mx-auto">
              Join thousands of websites already optimized with SEOAI. It&apos;s free to start.
            </p>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-bold px-8 py-3.5 rounded-xl bg-white transition-all"
              style={{ color: "#6366f1" }}
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
