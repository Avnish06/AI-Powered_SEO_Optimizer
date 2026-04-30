"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Code, Copy, Check, Send, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";

const EASE = [0.22, 1, 0.36, 1] as const;

const examples = [
  "A responsive navbar with mobile hamburger menu in React",
  "A REST API endpoint for user authentication with JWT",
  "A Python script to scrape product prices from an e-commerce page",
  "CSS animation for a smooth page-load skeleton shimmer",
];

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(`Error: ${data.error || "Failed to generate code"}`);
      } else {
        setResult(data.result || "No result returned.");
      }
    } catch (err) {
      setResult("Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen t-bg">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-36 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 accent-chip">
            <Terminal className="w-3.5 h-3.5" />
            <span>AI Code Generator</span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}
          >
            Code it.
            <br />
            <span
              style={{
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ship it.
            </span>
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Turn plain English into production-ready code. Describe what you need
            and our AI writes it — any language, any framework.
          </p>
        </motion.div>

        {/* Example prompts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mb-6"
        >
          <p className="text-xs font-bold uppercase tracking-[0.1em] mb-3" style={{ color: "var(--text-muted)" }}>
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="text-xs font-medium px-3.5 py-2 rounded-xl transition-all hover:bg-[var(--bg-muted)]"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                {ex.length > 48 ? ex.slice(0, 48) + "…" : ex}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-soft)" }}
            >
              <Wand2 className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              What do you want to build?
            </h2>
          </div>

          <textarea
            className="w-full p-4 rounded-xl text-sm resize-none"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              outline: "none",
              minHeight: "140px",
              lineHeight: "1.7",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            placeholder="e.g. Write a React hook for debounced search with TypeScript types..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border-color)";
              e.target.style.boxShadow = "none";
            }}
            id="ai-prompt-input"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={generateCode}
              disabled={loading || !prompt.trim()}
              className="premium-button px-6 py-3 text-sm"
              id="ai-generate-btn"
            >
              {loading ? (
                <Skeleton width={90} height={16} className="bg-white/25" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate Code
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Output */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 space-y-3"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton width={28} height={28} className="rounded-lg" />
                  <Skeleton width={120} height={16} />
                </div>
                <Skeleton width={72} height={28} className="rounded-xl" />
              </div>
              {[100, 92, 97, 45, 100, 88, 73, 100].map((w, i) => (
                <Skeleton key={i} width={`${w}%`} height={15} />
              ))}
              <div className="pt-3">
                <Skeleton width="100%" height={120} className="rounded-xl" />
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Header bar */}
              <div
                className="px-6 py-4 flex items-center justify-between"
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
                    <Code className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Generated Output
                  </span>
                </div>
                <motion.button
                  onClick={copyToClipboard}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all hover:bg-[var(--bg-muted)]"
                  style={{ color: copied ? "#10b981" : "var(--text-muted)" }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="check" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <Check className="w-3.5 h-3.5" />
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <Copy className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {copied ? "Copied!" : "Copy Code"}
                </motion.button>
              </div>

              {/* Code block */}
              <div
                className="p-6 overflow-x-auto"
                style={{ background: "#0d1117" }}
              >
                <pre
                  className="text-sm leading-[1.8] whitespace-pre-wrap"
                  style={{ color: "#a5b4fc", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                >
                  {result}
                </pre>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
