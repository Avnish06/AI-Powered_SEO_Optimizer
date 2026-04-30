"use client";

import { useState } from "react";
import { Sparkles, Target, Megaphone, BarChart2, Share2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";

const EASE = [0.22, 1, 0.36, 1] as const;

const tools = [
  { icon: Megaphone, label: "Ad Campaigns",       key: "ad" },
  { icon: Share2,    label: "Social Copy",         key: "social" },
  { icon: Mail,      label: "Email Sequences",     key: "email" },
  { icon: BarChart2, label: "Growth Strategy",     key: "growth" },
];

const placeholders: Record<string, string> = {
  ad:     "e.g. A premium leather-bound notebook for creative professionals...",
  social: "e.g. SaaS tool for startup founders that automates hiring pipelines...",
  email:  "e.g. AI-powered writing assistant with grammar correction and tone detection...",
  growth: "e.g. B2B expense management app targeting SMBs with 10–200 employees...",
};

export default function MarketingPage() {
  const [product, setProduct] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("ad");

  const generate = async () => {
    if (!product.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, type: activeTool }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: any) {
      setResult(`Error: ${err.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen t-bg">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-36 pb-24">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 accent-chip">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Marketing Suite</span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}
          >
            AI Marketing
            <br />
            <span
              style={{
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Assistant.
            </span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Generate high-converting ad campaigns, social copy, email sequences, and growth strategies
            in seconds. Built for founders, marketers, and creators.
          </p>
        </motion.div>

        {/* Tool selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {tools.map((tool) => (
            <button
              key={tool.key}
              onClick={() => setActiveTool(tool.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeTool === tool.key ? "var(--gradient)" : "var(--bg-surface)",
                color: activeTool === tool.key ? "white" : "var(--text-secondary)",
                border: activeTool === tool.key ? "none" : "1px solid var(--border-color)",
                boxShadow: activeTool === tool.key ? "var(--shadow-colored)" : "var(--shadow-xs)",
              }}
              id={`tool-${tool.key}`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </button>
          ))}
        </motion.div>

        {/* Input card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="rounded-2xl p-8 mb-6"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-soft)" }}
            >
              <Target className="w-4.5 h-4.5" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                Describe your product or service
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                More detail = better output. Be specific about audience and USP.
              </p>
            </div>
          </div>

          <textarea
            className="w-full p-4 rounded-xl text-sm resize-none transition-all"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              outline: "none",
              minHeight: "140px",
              lineHeight: "1.7",
            }}
            placeholder={placeholders[activeTool]}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border-color)";
              e.target.style.boxShadow = "none";
            }}
            id="marketing-input"
          />

          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {product.length > 0 ? `${product.length} characters` : ""}
            </span>
            <button
              onClick={generate}
              disabled={loading || !product.trim()}
              className="premium-button px-6 py-3 text-sm"
              id="marketing-generate-btn"
            >
              {loading ? (
                <Skeleton width={100} height={16} className="bg-white/25" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Strategy
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Result area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-8 space-y-4"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Skeleton width={32} height={32} className="rounded-xl" />
                <Skeleton width={160} height={18} />
              </div>
              <Skeleton width="45%" height={22} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="92%" height={16} />
              <Skeleton width="97%" height={16} />
              <Skeleton width="78%" height={16} />
              <div className="pt-4 space-y-3">
                <Skeleton width="35%" height={22} />
                <Skeleton width="100%" height={16} />
                <Skeleton width="88%" height={16} />
                <Skeleton width="94%" height={16} />
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Result header */}
              <div
                className="px-8 py-5 flex items-center justify-between"
                style={{
                  background: "var(--bg-elevated)",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--gradient)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    AI Generated Strategy
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                  >
                    {tools.find(t => t.key === activeTool)?.label}
                  </span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-[var(--bg-muted)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Copy
                </button>
              </div>

              {/* Result body */}
              <div className="p-8">
                <div
                  className="text-sm leading-[1.9] whitespace-pre-wrap"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {result}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
