"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, ExternalLink, RefreshCw,
  CheckCircle2, AlertTriangle, XCircle, Info, Shield,
  Search, Link2, LayoutTemplate, Globe, Clock,
  ChevronDown, ChevronUp, Gauge, FileDown,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── Helpers ──────────────────────────────────────────────
function scoreColor(n: number) {
  if (n >= 90) return "#10b981";
  if (n >= 70) return "#f59e0b";
  if (n >= 50) return "#f97316";
  return "#ef4444";
}
function scoreLabel(n: number) {
  if (n >= 90) return "Excellent";
  if (n >= 70) return "Good";
  if (n >= 50) return "Needs Work";
  return "Poor";
}
function IssueIcon({ type }: { type: string }) {
  if (type === "pass")    return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />;
  if (type === "error")   return <XCircle      className="w-4 h-4 text-rose-500    flex-shrink-0 mt-0.5" />;
  if (type === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500  flex-shrink-0 mt-0.5" />;
  return <Info className="w-4 h-4 t-muted flex-shrink-0 mt-0.5" />;
}
function vitalsStatus(metric: string, val: number) {
  const thresholds: Record<string, [number, number]> = {
    lcp: [2500, 4000], fcp: [1800, 3000], tbt: [200, 600],
    cls: [0.1, 0.25],  si:  [3400, 5800], tti: [3800, 7300],
  };
  const t = thresholds[metric];
  if (!t) return { label: "N/A", color: "#64748b" };
  if (val <= t[0]) return { label: "Good", color: "#10b981" };
  if (val <= t[1]) return { label: "Fair", color: "#f59e0b" };
  return              { label: "Poor", color: "#ef4444" };
}
function fmtMs(ms: number) { return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`; }
function fmtCls(v: number)  { return v.toFixed(3); }

// ─── Score Ring ───────────────────────────────────────────
function Ring({ score, size = 96 }: { score: number; size?: number }) {
  const r = size * 0.38, c = size / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--border-color)" strokeWidth={size * 0.075} />
      <circle
        cx={c} cy={c} r={r} fill="none"
        stroke={scoreColor(score)} strokeWidth={size * 0.075}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

// ─── Collapsible Category Card ─────────────────────────────
function CategoryCard({ title, icon: Icon, color, category }: {
  title: string; icon: any; color: string; category: any;
}) {
  const [open, setOpen] = useState(true);
  if (!category) return null;
  const errors   = category.issues?.filter((i: any) => i.type === "error").length   || 0;
  const warnings = category.issues?.filter((i: any) => i.type === "warning").length || 0;

  return (
    <div className="t-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-elevated)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-bold t-heading">{title}</p>
            <p className="text-[11px] t-muted mt-0.5">
              {errors > 0 && <span className="text-rose-500">{errors} error{errors > 1 ? "s" : ""}</span>}
              {errors > 0 && warnings > 0 && " · "}
              {warnings > 0 && <span className="text-amber-500">{warnings} warning{warnings > 1 ? "s" : ""}</span>}
              {errors === 0 && warnings === 0 && <span className="text-emerald-500">All checks passed</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[22px] font-black" style={{ color: scoreColor(category.score) }}>
              {category.score}
            </span>
            <span className="text-[10px] t-muted">/100</span>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 t-muted" />
            : <ChevronDown className="w-4 h-4 t-muted" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-1.5 border-t t-border pt-3">
          {category.issues?.map((issue: any, i: number) => (
            <div key={i} className="flex items-start gap-2.5 py-1.5">
              <IssueIcon type={issue.type} />
              <div>
                <p className="text-[12px] font-medium t-heading">{issue.message}</p>
                {issue.detail && <p className="text-[11px] t-muted mt-0.5">{issue.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
function AuditContent() {
  const params = useSearchParams();
  const urlParam = params.get("url") || "";
  const [report, setReport]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!urlParam) { setError("No URL provided."); setLoading(false); return; }
    run(urlParam);
  }, [urlParam]);

  async function run(u: string) {
    setLoading(true); setError(""); setReport(null); setElapsed(0);
    const t0 = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 100) / 10), 100);
    try {
      const res  = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: u }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      setReport(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  function downloadPdf() {
    const prev = document.title;
    document.title = `SEO-Report_${urlParam.replace(/^https?:\/\//, "").replace(/[^a-z0-9]/gi, "-").slice(0, 50)}`;
    window.print();
    document.title = prev;
  }

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen t-bg flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center">
          <Gauge className="w-7 h-7 animate-pulse" style={{ color: "var(--accent)" }} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold t-heading mb-1">Analysing website…</h2>
        <p className="t-body text-sm">Scanning on-page, technical, content, social &amp; links</p>
        <p className="text-xs mt-2 font-mono" style={{ color: "var(--accent)" }}>{elapsed.toFixed(1)}s elapsed</p>
      </div>
      <p className="t-muted text-xs max-w-xs">Results in 10–25 seconds — fetching real data from your site and Google PageSpeed.</p>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-screen t-bg flex flex-col items-center justify-center gap-5 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <XCircle className="w-7 h-7 text-rose-500" />
      </div>
      <h2 className="text-2xl font-bold t-heading">Analysis Failed</h2>
      <p className="t-body max-w-md text-sm leading-relaxed">{error}</p>
      <div className="flex gap-3">
        <button onClick={() => run(urlParam)}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all"
          style={{ background: "var(--accent)" }}>
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
        <Link href="/"
          className="flex items-center gap-2 px-5 py-2.5 t-body text-sm font-semibold rounded-xl transition-all t-card">
          <ArrowLeft className="w-4 h-4" /> New URL
        </Link>
      </div>
    </div>
  );

  if (!report) return null;

  const { score, grade, categories, pagespeed, url, scannedAt } = report;
  const ps = pagespeed;

  const CATEGORIES = [
    { key: "onPage",    title: "On-Page SEO",     icon: Search,        color: "#6366f1" },
    { key: "technical", title: "Technical",        icon: Shield,        color: "#8b5cf6" },
    { key: "content",   title: "Content Quality",  icon: LayoutTemplate,color: "#10b981" },
    { key: "social",    title: "Social & OG Tags", icon: Globe,         color: "#f59e0b" },
    { key: "links",     title: "Links",            icon: Link2,         color: "#3b82f6" },
  ];

  const vitals = ps ? [
    { key: "lcp", label: "LCP", name: "Largest Contentful Paint", value: fmtMs(ps.lcp),  raw: ps.lcp },
    { key: "fcp", label: "FCP", name: "First Contentful Paint",   value: fmtMs(ps.fcp),  raw: ps.fcp },
    { key: "tbt", label: "TBT", name: "Total Blocking Time",      value: fmtMs(ps.tbt),  raw: ps.tbt },
    { key: "cls", label: "CLS", name: "Cumulative Layout Shift",  value: fmtCls(ps.cls), raw: ps.cls },
    { key: "si",  label: "SI",  name: "Speed Index",              value: fmtMs(ps.si),   raw: ps.si  },
    { key: "tti", label: "TTI", name: "Time to Interactive",      value: fmtMs(ps.tti),  raw: ps.tti },
  ] : [];

  const psCats = ps ? [
    { label: "Performance",    score: ps.performance,   color: "#6366f1" },
    { label: "Accessibility",  score: ps.accessibility, color: "#10b981" },
    { label: "Best Practices", score: ps.bestPractices, color: "#f59e0b" },
    { label: "SEO",            score: ps.seo,           color: "#3b82f6" },
  ] : [];

  return (
    <div className="min-h-screen t-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-semibold t-muted hover:t-body transition-colors mb-3">
              <ArrowLeft className="w-3.5 h-3.5" /> New Analysis
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold t-heading leading-tight">SEO Report</h1>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm mt-1 transition-colors"
              style={{ color: "var(--accent)" }}>
              {url.replace(/^https?:\/\//, "").slice(0, 60)}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button onClick={() => run(urlParam)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl t-card t-body hover:t-heading text-[12px] font-semibold transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Re-run
            </button>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl t-card text-[11px] t-muted">
              <Clock className="w-3 h-3" />
              {new Date(scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <button
              onClick={downloadPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-[12px] font-bold transition-all"
              style={{ background: "var(--accent)", boxShadow: "var(--shadow-colored)" }}
            >
              <FileDown className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Score + Category bars ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

          {/* Big score ring */}
          <div className="t-card rounded-2xl flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="relative mb-4">
              <Ring score={score} size={128} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black" style={{ color: scoreColor(score) }}>{score}</span>
                <span className="text-[10px] font-bold t-muted uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            <div className="text-5xl font-black mb-1" style={{ color: scoreColor(score) }}>{grade}</div>
            <p className="text-sm font-semibold t-body">{scoreLabel(score)}</p>
            <p className="text-[11px] t-muted mt-1">Overall SEO Score</p>
          </div>

          {/* Category bars */}
          <div className="lg:col-span-2 t-card rounded-2xl p-6">
            <h2 className="text-[11px] font-bold t-muted uppercase tracking-widest mb-5">Category Breakdown</h2>
            <div className="space-y-4">
              {CATEGORIES.map(({ key, title, icon: Icon, color }) => {
                const cat = categories?.[key];
                const s   = cat?.score ?? 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                        <span className="text-[12px] font-semibold t-body">{title}</span>
                      </div>
                      <span className="text-[12px] font-black" style={{ color: scoreColor(s) }}>{s}</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s}%`, background: scoreColor(s) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── PageSpeed Insights ── */}
        {ps && (
          <div className="mb-8">
            <h2 className="text-[11px] font-bold t-muted uppercase tracking-widest mb-4">
              Google PageSpeed Insights (Mobile)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {psCats.map(({ label, score: s, color }) => (
                <div key={label} className="t-card rounded-2xl flex flex-col items-center py-5 px-3">
                  <div className="relative mb-2">
                    <Ring score={s} size={64} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[16px] font-black" style={{ color: scoreColor(s) }}>{s}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold t-body text-center">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {vitals.map(({ key, label, name, value, raw }) => {
                const { label: statusLabel, color } = vitalsStatus(key, raw);
                return (
                  <div key={key} className="t-card rounded-xl p-3 text-center">
                    <p className="text-[9px] font-bold t-muted uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-[18px] font-black t-heading">{value}</p>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1"
                      style={{ background: `${color}15`, color }}>
                      {statusLabel}
                    </span>
                    <p className="text-[9px] t-muted mt-1 leading-tight">{name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!ps && (
          <div className="mb-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-[12px] text-amber-600 dark:text-amber-400">
              PageSpeed Insights unavailable for this URL. HTML analysis is still complete.
            </p>
          </div>
        )}

        {/* ── Category Details ── */}
        <h2 className="text-[11px] font-bold t-muted uppercase tracking-widest mb-4">Detailed Findings</h2>
        <div className="space-y-3 mb-8">
          {CATEGORIES.map(({ key, title, icon, color }) => (
            <CategoryCard key={key} title={title} icon={icon} color={color} category={categories?.[key]} />
          ))}
        </div>

        {/* ── Page Metadata ── */}
        <div className="t-card rounded-2xl p-5">
          <h2 className="text-[11px] font-bold t-muted uppercase tracking-widest mb-4">Page Metadata</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Title",            value: categories?.onPage?.data?.title       || "—" },
              { label: "Meta Description", value: categories?.onPage?.data?.metaDesc    || "—" },
              { label: "H1 Tag",           value: categories?.onPage?.data?.h1Tags?.[0] || "—" },
              { label: "Canonical",        value: categories?.onPage?.data?.canonical   || "—" },
              { label: "Language",         value: categories?.technical?.data?.lang     || "—" },
              { label: "HTTPS",            value: categories?.technical?.data?.isHttps ? "Yes ✓" : "No ✗" },
              { label: "Structured Data",  value: categories?.technical?.data?.hasStructuredData ? "Yes ✓" : "No" },
              { label: "Word Count",       value: `${categories?.content?.data?.wordCount || 0} words` },
              { label: "Internal Links",   value: `${categories?.links?.data?.internal  || 0}` },
              { label: "External Links",   value: `${categories?.links?.data?.external  || 0}` },
              { label: "Images",           value: `${categories?.onPage?.data?.imagesTotal || 0} total, ${categories?.onPage?.data?.imagesNoAlt || 0} missing alt` },
              { label: "OG Image",         value: categories?.social?.data?.ogImage ? "Present ✓" : "Missing" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 p-3 rounded-xl bg-[var(--bg-elevated)] border t-border">
                <span className="text-[10px] font-bold t-muted uppercase tracking-wider">{label}</span>
                <span className="text-[12px] t-heading truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

export default function AuditResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen t-bg flex items-center justify-center">
        <p className="t-muted animate-pulse text-sm">Loading…</p>
      </div>
    }>
      <AuditContent />
    </Suspense>
  );
}
