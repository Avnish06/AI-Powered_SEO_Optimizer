"use client";

import { useState } from "react";
import { ArrowRight, Globe, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const PROOF = [
  "No sign-up required",
  "Results in under 20s",
  "Real Google PageSpeed data",
];

export default function Hero() {
  const [url, setUrl]       = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    router.push(`/audit/results?url=${encodeURIComponent(url.trim())}`);
  };

  return (
    <section className="relative pt-36 pb-28 px-4 flex flex-col items-center text-center overflow-hidden t-bg">

      {/* Very subtle background — just a soft indigo glow, no neon blobs */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border t-border bg-[var(--bg-surface)] mb-8 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-wide t-muted">
            Free SEO Audit · No account needed
          </span>
        </motion.div>

        {/* Headline — editorial, human */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          className="text-[2.8rem] sm:text-5xl md:text-[3.6rem] font-bold leading-[1.1] tracking-[-0.03em] t-heading mb-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Find every SEO issue{" "}
          <span className="gradient-text">on your site</span>
          <br />
          in one scan.
        </motion.h1>

        {/* Subheadline — honest, specific, human */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          className="text-lg t-body mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Paste your URL and get a full report — on-page, technical,
          content quality, Open Graph, and real Core Web Vitals from Google.
        </motion.p>

        {/* URL Input — clean, not flashy */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          className="relative flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto"
        >
          <div
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border t-border bg-[var(--bg-surface)] shadow-sm focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] transition-all"
          >
            <Globe className="w-4 h-4 t-muted flex-shrink-0" />
            <input
              type="text"
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="flex-1 bg-transparent text-sm font-medium t-heading placeholder:t-muted outline-none min-w-0"
            />
          </div>
          <button
            disabled={loading}
            className="premium-button px-5 py-3 rounded-xl text-sm font-semibold flex-shrink-0"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><span>Analyze site</span><ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </motion.form>

        {/* Proof points — simple, honest */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5"
        >
          {PROOF.map(p => (
            <span key={p} className="flex items-center gap-1.5 text-xs t-muted">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              {p}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Dashboard preview — clean screenshot mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        className="relative mt-20 w-full max-w-5xl mx-auto px-4"
      >
        {/* Soft base shadow — NOT a glowing halo */}
        <div
          className="relative rounded-2xl overflow-hidden border t-border shadow-xl"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px var(--border-color)" }}
        >
          {/* Fake browser chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b t-border bg-[var(--bg-elevated)]">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-4 h-6 rounded-md bg-[var(--bg-muted)] flex items-center px-3">
              <span className="text-[10px] t-muted truncate">seoai.app/audit/results?url=...</span>
            </div>
          </div>

          {/* Mock report inside */}
          <div className="bg-[var(--bg-surface)] p-6 sm:p-8">
            {/* Score row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-4 p-5 rounded-xl border t-border flex-1 bg-[var(--bg-elevated)]">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-black text-emerald-600">87</span>
                </div>
                <div>
                  <p className="text-xs font-semibold t-muted uppercase tracking-wider">Overall Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-28 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                      <div className="h-full w-[87%] bg-emerald-500 rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Good</span>
                  </div>
                </div>
              </div>
              {[
                { label: "On-Page", v: 91, c: "#6366f1" },
                { label: "Technical", v: 75, c: "#8b5cf6" },
                { label: "Content", v: 83, c: "#10b981" },
              ].map(({ label, v, c }) => (
                <div key={label} className="p-4 rounded-xl border t-border flex flex-col justify-between bg-[var(--bg-elevated)]">
                  <p className="text-[10px] font-bold t-muted uppercase tracking-wider">{label}</p>
                  <p className="text-2xl font-black mt-1" style={{ color: c }}>{v}</p>
                </div>
              ))}
            </div>
            {/* Issue list skeleton */}
            {[
              { status: "pass", text: "HTTPS enabled — secure connection" },
              { status: "pass", text: "Viewport meta tag present" },
              { status: "warn", text: "Meta description too short (64 chars)" },
              { status: "err",  text: "2 images missing alt attributes" },
              { status: "pass", text: "Canonical URL set correctly" },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-t t-border first:border-t-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  row.status === "pass" ? "bg-emerald-500" :
                  row.status === "warn" ? "bg-amber-500" : "bg-rose-500"
                }`} />
                <span className="text-xs t-body">{row.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fade out the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, var(--bg-page), transparent)" }} />
      </motion.div>
    </section>
  );
}
