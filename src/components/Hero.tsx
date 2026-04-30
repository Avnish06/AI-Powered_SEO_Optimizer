"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Shield, BarChart3, Zap, Globe, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "./Skeleton";

const EASE = [0.22, 1, 0.36, 1] as const;

const fade = (delay = 0, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

const stats = [
  { value: "98%", label: "Accuracy Rate" },
  { value: "2.4s", label: "Avg. Analysis Time" },
  { value: "50K+", label: "Sites Analyzed" },
];

export default function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    router.push(`/audit/results?url=${encodeURIComponent(url)}`);
  };

  return (
    <section className="relative pt-40 pb-28 px-4 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/2 -right-64 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
        />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" style={{ color: "var(--text-primary)" }}>
          <defs>
            <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          {/* Eyebrow */}
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 mb-8 accent-chip">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen AI SEO Platform · Free to Start</span>
          </motion.div>

          {/* Headline — editorial, mixed weight */}
          <motion.h1
            {...fade(0.1)}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[0.96] t-heading"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Rank{" "}
            <em
              className="not-italic"
              style={{
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              higher.
            </em>
            <br />
            <span className="font-light tracking-normal text-5xl md:text-6xl" style={{ color: "var(--text-secondary)" }}>
              grow faster.
            </span>
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Our AI engine crawls, scores, and suggests — giving you the exact playbook
            to climb search results. No guesswork, no fluff.
          </motion.p>

          {/* CTA area */}
          <motion.div {...fade(0.3)}>
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="buttons"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm(true)}
                    className="premium-button text-sm px-7 py-3.5"
                    id="hero-cta-analyze"
                  >
                    Start Free Analysis
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <motion.a
                    href="#features"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-sm font-semibold px-7 py-3.5 rounded-xl transition-all"
                    style={{
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-surface)",
                    }}
                  >
                    See How It Works
                  </motion.a>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onSubmit={handleStartAnalysis}
                  className="max-w-lg mx-auto"
                  id="hero-analyze-form"
                >
                  <div
                    className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1.5px solid var(--border-color)",
                      boxShadow: "0 8px 40px rgba(99,102,241,0.12)",
                    }}
                  >
                    <div className="flex-1 relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                      <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                        style={{
                          background: "transparent",
                          color: "var(--text-primary)",
                          border: "none",
                          outline: "none",
                        }}
                        id="hero-url-input"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={loading}
                      className="premium-button py-3 px-6 rounded-xl text-sm flex-shrink-0"
                      id="hero-analyze-submit"
                    >
                      {loading ? (
                        <Skeleton width={60} height={16} className="bg-white/25" />
                      ) : (
                        <><Search className="w-4 h-4" /> Analyze</>
                      )}
                    </motion.button>
                  </div>
                  <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                    Free forever · No credit card · Results in seconds
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: EASE }}
                className="flex flex-col items-center"
              >
                <span
                  className="text-3xl font-black tracking-tight"
                  style={{
                    background: "var(--gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Shield,   title: "Bank-Grade Security",  desc: "All analysis is sandboxed. We never store your data without consent.", color: "#6366f1" },
              { icon: TrendingUp, title: "Real-Time Metrics",  desc: "Live performance data updated every request with zero caching lag.", color: "#8b5cf6" },
              { icon: Zap,      title: "AI-Powered Insights",  desc: "GPT-backed recommendations ranked by impact, not just list length.",  color: "#06b6d4" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: EASE }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="t-card rounded-2xl p-6 text-left"
                id={`hero-feature-${i}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${item.color}14` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
