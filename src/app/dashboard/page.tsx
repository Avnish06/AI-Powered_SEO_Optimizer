"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, AlertCircle, BarChart3, Globe, 
  Search, Shield, Zap, Link as LinkIcon, Sparkles,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function DashboardContent() {
  const searchParams = useSearchParams();
  const checkId = searchParams.get("checkId");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkId) {
      const fetchResult = async () => {
        try {
          const res = await fetch(`/api/analyze?id=${checkId}`);
          if (!res.ok) throw new Error("Failed to load results");
          const json = await res.json();
          setData(json);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchResult();
    }
  }, [checkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Results Not Found</h1>
        <p className="text-gray-400 mb-8">We couldn't find the analysis record you're looking for.</p>
        <Link href="/" className="premium-button px-8 py-3">Try New Analysis</Link>
      </div>
    );
  }

  const report = data;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Analysis
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Score Card */}
          <div className="lg:w-1/3">
            <div className="glass p-10 rounded-[2.5rem] border border-white/10 sticky top-32">
              <div className="text-center mb-10">
                <div className="relative inline-block">
                  <svg className="w-48 h-48 -rotate-90">
                    <circle
                      cx="96" cy="96" r="88"
                      fill="none" stroke="currentColor" strokeWidth="12"
                      className="text-white/5"
                    />
                    <circle
                      cx="96" cy="96" r="88"
                      fill="none" stroke="currentColor" strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 88}
                      strokeDashoffset={2 * Math.PI * 88 * (1 - report.score / 100)}
                      className="text-blue-500 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{report.score}</span>
                    <span className="text-gray-400 text-sm font-medium">Overall Score</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ScoreBar label="On-Page SEO" score={report.onPageScore} weight="30%" color="bg-blue-500" />
                <ScoreBar label="Technical SEO" score={report.technicalScore} weight="25%" color="bg-purple-500" />
                <ScoreBar label="Content Quality" score={report.contentScore} weight="20%" color="bg-emerald-500" />
                <ScoreBar label="Performance" score={report.performanceScore} weight="15%" color="bg-amber-500" />
                <ScoreBar label="Links" score={report.linksScore} weight="10%" color="bg-rose-500" />
              </div>

              <button className="premium-button w-full mt-10 py-4 flex items-center justify-center gap-2 group">
                <Sparkles className="w-5 h-5" />
                Generate AI Fixes
              </button>
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="lg:flex-1 space-y-8">
            <div className="glass p-8 rounded-[2.5rem] border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                AI-Powered Suggestions
              </h2>
              <div className="space-y-4">
                {report.details.aiSuggestions.map((sug: string, i: number) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-gray-300">{sug}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuditCard title="On-Page Factors" issues={report.details.onPage.issues} icon={Search} color="text-blue-400" />
              <AuditCard title="Technical Audit" issues={report.details.technical.issues} icon={Shield} color="text-purple-400" />
              <AuditCard title="Content Analysis" issues={report.details.content.issues} icon={Globe} color="text-emerald-400" />
              <AuditCard title="Speed & Performance" issues={report.details.performance.issues} icon={Zap} color="text-amber-400" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ScoreBar({ label, score, weight, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label} <span className="text-xs opacity-50">({weight})</span></span>
        <span className="font-bold">{score}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function AuditCard({ title, issues, icon: Icon, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="space-y-3">
        {issues.length > 0 ? (
          issues.map((issue: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              {issue}
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            All factors optimized
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
