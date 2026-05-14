"use client";

import { useState, useRef, useCallback } from "react";
import {
  Megaphone, Share2, Mail, BarChart2, Target, Zap, Copy, Check,
  Download, RefreshCw, ChevronDown, ChevronUp, Sparkles, ArrowRight,
  FileText, TrendingUp, Globe, Users, MessageSquare, Clock, Hash,
  Lightbulb, AlertCircle, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Tool definitions ─── */
interface Tool {
  icon: any;
  label: string;
  key: string;
  color: string;
  description: string;
  placeholder: string;
  badge?: string;
}

const TOOLS: Tool[] = [
  {
    icon: Megaphone, label: "Ad Campaign", key: "ad", color: "#6366f1",
    description: "Facebook, Instagram & Google ad copy",
    placeholder: "Describe your product or service...\n\nE.g. A premium noise-cancelling headphone for remote workers who need deep focus.",
    badge: "Popular"
  },
  {
    icon: Share2, label: "Social Copy", key: "social", color: "#8b5cf6",
    description: "Viral posts across all platforms",
    placeholder: "What do you want to promote on social?\n\nE.g. Launching a new coffee subscription box with rare single-origin beans.",
  },
  {
    icon: Mail, label: "Email Sequence", key: "email", color: "#ec4899",
    description: "High-converting drip campaigns",
    placeholder: "Describe your product and target customer...\n\nE.g. SaaS tool for freelancers to track time and invoice clients automatically.",
  },
  {
    icon: TrendingUp, label: "Growth Strategy", key: "growth", color: "#f59e0b",
    description: "90-day data-driven roadmap",
    placeholder: "What are your business goals?\n\nE.g. We want to grow our B2B SaaS from 50 to 500 paying customers in 90 days.",
    badge: "AI-Powered"
  },
  {
    icon: FileText, label: "Blog Outline", key: "blog", color: "#10b981",
    description: "SEO-optimized content structure",
    placeholder: "What topic should we write about?\n\nE.g. How AI is changing the way small businesses do marketing in 2025.",
  },
  {
    icon: MessageSquare, label: "Brand Voice", key: "brand", color: "#3b82f6",
    description: "Define your tone & messaging",
    placeholder: "Describe your brand and target audience...\n\nE.g. A sustainable fashion brand for eco-conscious millennials aged 25–35.",
  },
  {
    icon: ImageIcon, label: "Ad Visual Generator", key: "visual", color: "#f43f5e",
    description: "Generate stunning ad visuals (No Key)",
    placeholder: "Describe the visual scene for your ad image...\n\nE.g. A hyper-realistic close-up of premium noise-canceling headphones resting next to a glowing latte in a cozy modern cafe, warm moody lighting.",
    badge: "NEW"
  },
];

/* ─── History entry ─── */
interface HistoryItem {
  id: string;
  tool: string;
  toolLabel: string;
  input: string;
  output: string;
  timestamp: Date;
  wordCount: number;
}

/* ─── Parsed section ─── */
interface Section {
  heading: string;
  body: string;
}

function parseOutput(text: string): Section[] {
  const sections: Section[] = [];
  const lines = text.split("\n");
  let current: Section | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect headings: lines ending with ":" or wrapped in ** or starting with #
    const isHeading =
      /^\*\*.+\*\*:?$/.test(trimmed) ||
      /^#+\s/.test(trimmed) ||
      /^[A-Z][A-Za-z\s]+:$/.test(trimmed) ||
      /^\d+\.\s+\*\*.+\*\*/.test(trimmed);

    if (isHeading) {
      if (current) sections.push(current);
      const heading = trimmed
        .replace(/^\*\*|\*\*$/g, "")
        .replace(/^#+\s/, "")
        .replace(/\d+\.\s+/, "")
        .replace(/^(\*\*)?([^*]+)(\*\*)?:?$/, "$2")
        .trim();
      current = { heading, body: "" };
    } else {
      if (!current) {
        current = { heading: "", body: "" };
      }
      current.body += (current.body ? "\n" : "") + trimmed.replace(/^\*\*|\*\*$/g, "").replace(/\*\*/g, "");
    }
  }
  if (current && (current.heading || current.body)) sections.push(current);

  // Fallback: return raw
  if (sections.length === 0) {
    return [{ heading: "", body: text }];
  }
  return sections;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/* ─── Copy button ─── */
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${
        copied ? "text-green-500 bg-green-500/10" : "t-muted hover:t-heading hover:bg-[var(--bg-elevated)]"
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

/* ─── Main Page ─── */
export default function MarketingPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("ad");
  const [tone, setTone] = useState("professional");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentTool = TOOLS.find(t => t.key === activeTool)!;

  const generate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    setError("");

    try {
      if (activeTool === "visual") {
        // ─── Generate True AI Visuals without API Key ───
        const seed = Math.floor(Math.random() * 999999);
        const generatedUrl = `/api/image?prompt=${encodeURIComponent(input.trim())}&width=1024&height=1024&seed=${seed}`;

        // Trigger image loader for UI, let natural browser <img> handle fetching safely!
        setImageLoading(true);
        setResult(generatedUrl);

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          tool: activeTool,
          toolLabel: currentTool.label,
          input: input.slice(0, 120),
          output: generatedUrl,
          timestamp: new Date(),
          wordCount: 0,
        };
        setHistory(prev => [newItem, ...prev.slice(0, 19)]);

      } else {
        // ─── Standard Text APIs ───
        const res = await fetch("/api/marketing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: input, type: activeTool, tone }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");

        setResult(data.result);

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          tool: activeTool,
          toolLabel: currentTool.label,
          input: input.slice(0, 120),
          output: data.result,
          timestamp: new Date(),
          wordCount: wordCount(data.result),
        };
        setHistory(prev => [newItem, ...prev.slice(0, 19)]);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, activeTool, tone, currentTool.label]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      generate();
    }
  };

  const exportResult = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTool}-marketing-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = result ? parseOutput(result) : [];

  return (
    <div className="min-h-screen t-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            In-House AI Marketing Studio
          </div>
          <h1
            className="text-4xl md:text-6xl font-black mb-4 tracking-tighter t-heading"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Generate. Refine. <span className="gradient-text">Launch.</span>
          </h1>
          <p className="text-base t-body max-w-2xl mx-auto leading-relaxed">
            Your team&apos;s AI-powered content engine — create ads, emails, social copy,
            and full growth strategies in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

          {/* ── Left Panel: Tool Selector + Options ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="flex flex-col gap-4"
          >
            {/* Tool selector */}
            <div className="t-card rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest t-muted mb-3">Choose Tool</p>
              <div className="flex flex-col gap-1.5">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.key;
                  return (
                    <button
                      key={tool.key}
                      onClick={() => setActiveTool(tool.key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all relative ${
                        isActive
                          ? "shadow-sm"
                          : "hover:bg-[var(--bg-elevated)]"
                      }`}
                      style={isActive ? { background: tool.color + "15", border: `1px solid ${tool.color}30` } : {}}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: isActive ? tool.color : "var(--bg-elevated)" }}
                      >
                        <Icon className="w-4 h-4" style={{ color: isActive ? "white" : "var(--text-muted)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isActive ? "t-heading" : "t-body"}`}>
                            {tool.label}
                          </span>
                          {tool.badge && (
                            <span
                              className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{ background: tool.color + "15", color: tool.color }}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] t-muted truncate block">{tool.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone selector */}
            <div className="t-card rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest t-muted mb-3">Tone of Voice</p>
              <div className="grid grid-cols-2 gap-1.5">
                {["professional", "casual", "bold", "empathetic"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-2 px-3 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      tone === t
                        ? "bg-[var(--accent)] text-white"
                        : "t-body hover:bg-[var(--bg-elevated)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips card */}
            <div className="t-card rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest t-muted mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3" /> Pro Tips
              </p>
              <ul className="space-y-2">
                {[
                  "Be specific about your target audience",
                  "Include your unique value proposition",
                  "Press Ctrl+Enter to generate quickly",
                  "Use tone options to match your brand",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] t-body">
                    <span className="w-4 h-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black t-muted">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── Right Panel: Input + Output ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="flex flex-col gap-4"
          >
            {/* Input card */}
            <div className="t-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none"
                style={{ background: currentTool.color + "08" }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: currentTool.color }}
                    >
                      <currentTool.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-black t-heading">{currentTool.label}</span>
                      <span className="text-[11px] t-muted ml-2">· {currentTool.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] t-muted">{input.length}/2000</span>
                </div>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 2000))}
                  onKeyDown={handleKeyDown}
                  placeholder={currentTool.placeholder}
                  rows={7}
                  className="w-full p-4 rounded-xl t-elevated t-heading border t-border focus:border-[var(--accent)] transition-all resize-none text-sm outline-none placeholder:t-muted leading-relaxed"
                />

                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] t-muted">
                    {wordCount(input)} words · Ctrl+Enter to generate
                  </span>
                  <button
                    onClick={generate}
                    disabled={loading || !input.trim()}
                    className="premium-button px-6 py-2.5 rounded-xl text-sm font-black tracking-wide"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Generate
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error state */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 p-4 rounded-xl border"
                  style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="t-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="skeleton w-20 h-3 rounded" />
                    <div className="skeleton w-32 h-3 rounded" />
                  </div>
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="skeleton h-3 rounded" style={{ width: `${85 - i * 8}%` }} />
                    ))}
                  </div>
                  <div className="mt-6 space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="skeleton h-3 rounded" style={{ width: `${90 - i * 12}%` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence mode="wait">
              {result && !loading && (
                activeTool === "visual" ? (
                  <motion.div
                    key="result-visual"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="t-card rounded-2xl overflow-hidden p-6 flex flex-col items-center"
                  >
                    <div className="w-full flex items-center justify-between mb-4 pb-4 border-b t-border">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest t-muted">
                          AI Campaign Visual Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={generate}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg t-muted hover:t-heading hover:bg-[var(--bg-elevated)] transition-all"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const r = await fetch(result);
                              const blob = await r.blob();
                              const u = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = u;
                              a.download = `campaign-visual-${Date.now()}.jpg`;
                              a.click();
                              URL.revokeObjectURL(u);
                            } catch (e) {
                              window.open(result, "_blank");
                            }
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-all shadow-sm"
                        >
                          <Download className="w-3 h-3" />
                          Download Visual
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative group aspect-square max-w-[512px] w-full overflow-hidden rounded-2xl border t-border bg-black/20 shadow-xl flex items-center justify-center">
                      {imageLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                          <div className="w-10 h-10 border-4 border-[var(--accent-soft)] border-t-[var(--accent)] rounded-full animate-spin mb-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Rendering Pixels...</span>
                        </div>
                      )}
                      <img
                        src={result}
                        alt="AI Generated Visual"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                          setImageLoading(false);
                          setError("Failed to load the AI image. Please try again.");
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--accent)] mb-1">Prompt Prompted</p>
                        <p className="text-xs text-white/90 leading-relaxed italic">"{input}"</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="t-card rounded-2xl overflow-hidden"
                  >
                    {/* Result header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b t-border">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest t-muted">
                          Generated {currentTool.label}
                        </span>
                        <span className="text-[10px] t-muted">
                          · {wordCount(result)} words
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={generate}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg t-muted hover:t-heading hover:bg-[var(--bg-elevated)] transition-all"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </button>
                        <CopyButton text={result} label="Copy All" />
                        <button
                          onClick={exportResult}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg t-muted hover:t-heading hover:bg-[var(--bg-elevated)] transition-all"
                        >
                          <Download className="w-3 h-3" />
                          Export
                        </button>
                      </div>
                    </div>

                    {/* Parsed sections */}
                    <div className="p-6 space-y-5">
                      {sections.map((section, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.3 }}
                          className="group"
                        >
                          {section.heading && (
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xs font-black uppercase tracking-widest t-muted">
                                {section.heading}
                              </h3>
                              <CopyButton text={section.body} />
                            </div>
                          )}
                          <div
                            className="t-elevated rounded-xl p-4 text-sm t-body leading-relaxed whitespace-pre-wrap border t-border group-hover:border-[var(--border-strong)] transition-colors"
                          >
                            {section.body}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>

            {/* History */}
            {history.length > 0 && (
              <div className="t-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 t-muted" />
                    <span className="text-[11px] font-black uppercase tracking-widest t-muted">
                      Session History
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] t-muted font-bold">
                      {history.length}
                    </span>
                  </div>
                  {showHistory ? <ChevronUp className="w-4 h-4 t-muted" /> : <ChevronDown className="w-4 h-4 t-muted" />}
                </button>

                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2 border-t t-border pt-3">
                        {history.map(item => (
                          <div key={item.id} className="rounded-xl border t-border overflow-hidden">
                            <button
                              onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                              className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-elevated)] transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
                                  style={{
                                    background: (TOOLS.find(t => t.key === item.tool)?.color || "#6366f1") + "15",
                                    color: TOOLS.find(t => t.key === item.tool)?.color || "#6366f1"
                                  }}
                                >
                                  {item.toolLabel}
                                </span>
                                <span className="text-xs t-body truncate">{item.input}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <span className="text-[10px] t-muted">{item.wordCount}w</span>
                                {expandedHistory === item.id ? <ChevronUp className="w-3 h-3 t-muted" /> : <ChevronDown className="w-3 h-3 t-muted" />}
                              </div>
                            </button>

                            <AnimatePresence>
                              {expandedHistory === item.id && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 border-t t-border">
                                    {item.tool === "visual" ? (
                                      <div className="flex flex-col gap-2">
                                        <div className="relative aspect-square max-w-[180px] rounded-xl overflow-hidden border t-border bg-black/10">
                                          <img src={item.output} className="w-full h-full object-cover" alt="Visual history" />
                                        </div>
                                        <button
                                          onClick={async () => {
                                            try {
                                              const r = await fetch(item.output);
                                              const b = await r.blob();
                                              const u = URL.createObjectURL(b);
                                              const a = document.createElement("a");
                                              a.href = u;
                                              a.download = `visual-history-${item.id}.jpg`;
                                              a.click();
                                            } catch { window.open(item.output, "_blank"); }
                                          }}
                                          className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest t-muted hover:t-heading"
                                        >
                                          <Download className="w-3 h-3" /> Download Again
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex justify-end mb-2">
                                          <CopyButton text={item.output} />
                                        </div>
                                        <p className="text-xs t-body leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                          {item.output}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {[
            { icon: Zap, label: "AI Generation Speed", value: "~3s" },
            { icon: Hash, label: "Tools Available", value: "7" },
            { icon: Globe, label: "Tone Options", value: "4" },
            { icon: Users, label: "Content Types", value: "25+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="t-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div>
                <div className="text-lg font-black t-heading">{value}</div>
                <div className="text-[10px] t-muted leading-tight">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
