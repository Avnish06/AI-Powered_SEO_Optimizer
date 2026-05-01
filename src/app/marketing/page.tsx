"use client";

import { useState } from "react";
import { Sparkles, Target, Megaphone, BarChart2, Share2, Mail, ArrowRight } from "lucide-react";
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
  ad:     "Describe your product for an ad campaign...",
  social: "What should we promote on social media?",
  email:  "Enter product details for an email sequence...",
  growth: "What are your 90-day growth goals?",
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
    <div className="min-h-screen t-bg pb-32">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-44 flex flex-col items-center text-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI Growth Department
          </div>
          <h1
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter t-heading"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Smarter <span className="gradient-text">Copy.</span><br />
            Faster <span className="gradient-text">Growth.</span>
          </h1>
          <p className="text-lg t-body max-w-xl mx-auto leading-relaxed">
            Generate high-converting marketing assets in seconds. Pick your weapon 
            below and let the AI build your next campaign.
          </p>
        </motion.div>

        {/* Tool Selector - Pill Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="flex flex-wrap justify-center gap-2 mb-12 p-2 rounded-3xl glass border t-border shadow-sm"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.key;
            return (
              <button
                key={tool.key}
                onClick={() => setActiveTool(tool.key)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  isActive 
                  ? "bg-[var(--accent)] text-white shadow-lg" 
                  : "t-body hover:t-heading hover:bg-[var(--bg-elevated)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tool.label}
              </button>
            );
          })}
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="w-full t-card rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-[80px] rounded-full" />
           
           <div className="relative z-10 flex flex-col gap-8">
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder={placeholders[activeTool]}
              className="w-full h-44 p-8 rounded-3xl t-elevated t-heading border t-border focus:border-[var(--accent)] transition-all resize-none text-lg outline-none placeholder:t-muted shadow-inner"
            />

            <button
              onClick={generate}
              disabled={loading || !product.trim()}
              className="premium-button w-full py-5 rounded-[1.5rem] text-lg font-black tracking-widest shadow-xl"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ANALYZING MARKET...
                </div>
              ) : (
                <>
                  GENERATE ASSETS
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
           </div>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full mt-12 t-card rounded-[2.5rem] p-12 text-left shadow-xl"
            >
              <div className="flex items-center justify-between mb-10 border-b t-border pb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] t-muted">Generated Strategy</p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="text-base leading-[1.8] t-body whitespace-pre-wrap">
                {result}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
