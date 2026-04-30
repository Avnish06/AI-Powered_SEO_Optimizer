"use client";

import {
  Search, Shield, Zap, Sparkles, FileText, Link as LinkIcon, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "On-Page Analysis",
    desc: "Deep crawl of titles, meta descriptions, header hierarchies, and canonical tags for maximal relevance scoring.",
    accent: "#6366f1",
    tag: "Core",
  },
  {
    icon: Shield,
    title: "Technical Audit",
    desc: "HTTPS enforcement, viewport meta, structured data, and HTML validation — the infrastructure layer search engines demand.",
    accent: "#8b5cf6",
    tag: "Technical",
  },
  {
    icon: Zap,
    title: "Performance Metrics",
    desc: "Simulated load time, LCP estimations, and optimization hints to keep bounce rates low and conversions high.",
    accent: "#f59e0b",
    tag: "Speed",
  },
  {
    icon: FileText,
    title: "Content Quality",
    desc: "Word count analysis, keyword density, readability score, and thin-content detection to avoid ranking penalties.",
    accent: "#10b981",
    tag: "Content",
  },
  {
    icon: LinkIcon,
    title: "Link Intelligence",
    desc: "Internal vs external link balance, broken link discovery, and anchor text diversity across your entire page.",
    accent: "#ef4444",
    tag: "Links",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    desc: "GPT-4 powered, impact-ranked suggestions that tell you exactly what to fix and why it matters to your rankings.",
    accent: "#06b6d4",
    tag: "AI",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function Features() {
  return (
    <section id="features" className="py-32 px-4 relative">
      {/* Subtle section separator */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--bg-elevated)", opacity: 0.45 }}
      />

      {/* Ambient blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5 accent-chip">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10-Factor Analysis Engine</span>
          </div>
          <h2
            className="text-4xl md:text-6xl font-black mb-5 leading-tight tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}
          >
            Everything your site
            <br />
            <span
              style={{
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              actually needs.
            </span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            We evaluate every ranking signal that matters — not just the obvious ones.
            Our engine surfaces the issues others miss.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          style={{ background: "var(--border-color)", borderRadius: "20px", overflow: "hidden" }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative p-8"
              style={{ background: "var(--bg-surface)" }}
            >
              {/* Hover highlight */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `${feature.accent}06` }}
              />

              {/* Tag */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${feature.accent}14` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
                  style={{
                    color: feature.accent,
                    background: `${feature.accent}14`,
                  }}
                >
                  {feature.tag}
                </span>
              </div>

              <h3
                className="text-base font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {feature.desc}
              </p>

              {/* Bottom accent line */}
              <div
                className="mt-6 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#how"
            className="inline-flex items-center gap-2 text-sm font-semibold group"
            style={{ color: "var(--accent)" }}
          >
            See how the analysis works
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
