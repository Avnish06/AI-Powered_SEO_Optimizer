"use client";

import { CheckCircle2, AlertCircle, Zap, Shield, Search, Globe, Clock, BarChart3, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface LighthouseReportProps {
  results: any;
}

export default function LighthouseReport({ results }: LighthouseReportProps) {
  const { performanceScore, accessibilityScore, bestPracticesScore, seoScore, metrics, audits } = results;

  const getGrade = (score: number) => {
    if (score >= 90) return { letter: "A", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (score >= 80) return { letter: "B", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    if (score >= 70) return { letter: "C", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    if (score >= 60) return { letter: "D", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
    return { letter: "F", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  };

  const performanceGrade = getGrade(performanceScore);

  const mainMetrics = [
    { label: "Performance", score: performanceScore, icon: Zap, color: "text-blue-400" },
    { label: "Accessibility", score: accessibilityScore, icon: Shield, color: "text-purple-400" },
    { label: "Best Practices", score: bestPracticesScore, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "SEO", score: seoScore, icon: Search, color: "text-amber-400" },
  ];

  const webVitals = [
    { label: "LCP", value: `${(metrics.lcp / 1000).toFixed(1)}s`, desc: "Largest Contentful Paint", status: metrics.lcp < 2500 ? "Good" : metrics.lcp < 4000 ? "Needs Improvement" : "Poor" },
    { label: "TBT", value: `${Math.round(metrics.tbt)}ms`, desc: "Total Blocking Time", status: metrics.tbt < 200 ? "Good" : metrics.tbt < 600 ? "Needs Improvement" : "Poor" },
    { label: "CLS", value: metrics.cls.toFixed(3), desc: "Cumulative Layout Shift", status: metrics.cls < 0.1 ? "Good" : metrics.cls < 0.25 ? "Needs Improvement" : "Poor" },
  ];

  const chartData = mainMetrics.map(m => ({ name: m.label, score: m.score }));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Section: Grade and Main Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`glass p-10 rounded-[2.5rem] border ${performanceGrade.border} ${performanceGrade.bg} flex flex-col items-center justify-center text-center`}>
          <div className={`text-9xl font-black mb-4 ${performanceGrade.color}`}>
            {performanceGrade.letter}
          </div>
          <h2 className="text-2xl font-bold text-white">GTmetrix Grade</h2>
          <p className="text-gray-400 mt-2">Overall performance summary</p>
        </div>

        <div className="lg:col-span-2 glass p-10 rounded-[2.5rem] border border-white/10 flex flex-col">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Performance Results
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
            {mainMetrics.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                    <circle 
                      cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - item.score / 100)}
                      className={`${item.color} transition-all duration-1000`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
                    {Math.round(item.score)}%
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Web Vitals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {webVitals.map((vital, i) => (
          <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{vital.label}</h4>
                <div className="text-3xl font-black text-white mt-1">{vital.value}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                vital.status === "Good" ? "bg-emerald-500/20 text-emerald-400" :
                vital.status === "Poor" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {vital.status}
              </div>
            </div>
            <p className="text-sm text-gray-500">{vital.desc}</p>
          </div>
        ))}
      </div>

      {/* Audit Opportunities */}
      <div className="glass p-10 rounded-[2.5rem] border border-white/10">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" />
          Top Opportunities
        </h3>
        <div className="space-y-4">
          {Object.entries(audits)
            .filter(([_, audit]: any) => audit.score !== null && audit.score < 0.9)
            .sort((a: any, b: any) => (a[1].score || 0) - (b[1].score || 0))
            .slice(0, 5)
            .map(([key, audit]: any) => (
              <div key={key} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{audit.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{audit.description.split('.')[0]}.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 whitespace-nowrap">
                  <span className="text-rose-400 font-mono text-sm">
                    {audit.displayValue || "Action Required"}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
