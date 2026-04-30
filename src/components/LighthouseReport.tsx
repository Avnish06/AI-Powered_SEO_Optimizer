"use client";

import { CheckCircle2, AlertCircle, Zap, Shield, Search, BarChart3 } from "lucide-react";

interface LighthouseReportProps {
  results: any;
}

export default function LighthouseReport({ results }: LighthouseReportProps) {
  const { performanceScore, accessibilityScore, bestPracticesScore, seoScore, metrics, audits } = results;

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: "A", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" };
    if (score >= 80) return { letter: "B", color: "#4f46e5", bg: "rgba(79,70,229,0.1)",  border: "rgba(79,70,229,0.2)" };
    if (score >= 70) return { letter: "C", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" };
    if (score >= 60) return { letter: "D", color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)" };
    return             { letter: "F", color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)" };
  };

  const performanceGrade = getGrade(performanceScore);

  const mainMetrics = [
    { label: "Performance",    score: performanceScore,    icon: Zap,          color: "#4f46e5" },
    { label: "Accessibility",  score: accessibilityScore,  icon: Shield,       color: "#7c3aed" },
    { label: "Best Practices", score: bestPracticesScore,  icon: CheckCircle2, color: "#10b981" },
    { label: "SEO",            score: seoScore,            icon: Search,       color: "#f59e0b" },
  ];

  const webVitals = [
    { label: "LCP", value: `${(metrics.lcp / 1000).toFixed(1)}s`,  desc: "Largest Contentful Paint", status: metrics.lcp < 2500 ? "Good" : metrics.lcp < 4000 ? "Needs Improvement" : "Poor" },
    { label: "TBT", value: `${Math.round(metrics.tbt)}ms`,          desc: "Total Blocking Time",      status: metrics.tbt < 200  ? "Good" : metrics.tbt < 600  ? "Needs Improvement" : "Poor" },
    { label: "CLS", value: metrics.cls.toFixed(3),                  desc: "Cumulative Layout Shift",  status: metrics.cls < 0.1  ? "Good" : metrics.cls < 0.25 ? "Needs Improvement" : "Poor" },
  ];

  const statusColors: Record<string, { bg: string; color: string }> = {
    Good:               { bg: "rgba(16,185,129,0.12)",  color: "#10b981" },
    "Needs Improvement":{ bg: "rgba(245,158,11,0.12)",  color: "#f59e0b" },
    Poor:               { bg: "rgba(239,68,68,0.12)",   color: "#ef4444" },
  };

  return (
    <div className="space-y-6">
      {/* Grade + Scores row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade card */}
        <div
          className="t-card rounded-3xl p-10 flex flex-col items-center justify-center text-center"
          style={{ borderColor: performanceGrade.border, background: performanceGrade.bg }}
        >
          <div className="text-8xl font-black mb-3" style={{ color: performanceGrade.color }}>
            {performanceGrade.letter}
          </div>
          <h2 className="text-xl font-bold t-heading">GTmetrix Grade</h2>
          <p className="text-sm t-muted mt-1">Overall performance summary</p>
        </div>

        {/* Score rings */}
        <div className="lg:col-span-2 t-card rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-7 flex items-center gap-2 t-heading">
            <BarChart3 className="w-5 h-5" style={{ color: "var(--accent)" }} />
            Performance Results
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mainMetrics.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="5" className="t-muted opacity-20" />
                    <circle
                      cx="40" cy="40" r="34" fill="none" strokeWidth="5"
                      stroke={item.color}
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - item.score / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-base font-black t-heading">
                    {Math.round(item.score)}%
                  </div>
                </div>
                <span className="text-xs font-semibold t-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {webVitals.map((vital, i) => (
          <div key={i} className="t-card rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider t-muted">{vital.label}</p>
                <div className="text-3xl font-black t-heading mt-1">{vital.value}</div>
              </div>
              <span
                className="text-xs font-bold uppercase px-3 py-1 rounded-full"
                style={{ background: statusColors[vital.status]?.bg, color: statusColors[vital.status]?.color }}
              >
                {vital.status}
              </span>
            </div>
            <p className="text-xs t-muted">{vital.desc}</p>
          </div>
        ))}
      </div>

      {/* Audit Opportunities */}
      <div className="t-card rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 t-heading">
          <Zap className="w-5 h-5 text-amber-500" />
          Top Opportunities
        </h3>
        <div className="space-y-3">
          {Object.entries(audits)
            .filter(([_, audit]: any) => audit.score !== null && audit.score < 0.9)
            .sort((a: any, b: any) => (a[1].score || 0) - (b[1].score || 0))
            .slice(0, 5)
            .map(([key, audit]: any) => (
              <div
                key={key}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl gap-3 transition-colors"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold t-heading text-sm">{audit.title}</h4>
                    <p className="t-muted text-xs mt-0.5">{audit.description.split(".")[0]}.</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-rose-500 whitespace-nowrap">
                  {audit.displayValue || "Action Required"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
