"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, AlertCircle, Search, Shield, Zap, Sparkles,
  ArrowLeft, Clock, ArrowRight, Globe
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@/components/Skeleton";

function DashboardContent() {
  const searchParams = useSearchParams();
  const checkId = searchParams.get("checkId");
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (checkId) {
          const res = await fetch(`/api/analyze?id=${checkId}`);
          if (res.ok) {
            const json = await res.json();
            setData(json);
          }
        } else {
          const res = await fetch(`/api/analyze`);
          if (res.ok) {
            const json = await res.json();
            setHistory(json);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [checkId]);

  if (loading) {
    return (
      <div className="min-h-screen t-bg transition-colors duration-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
            <div>
              <Skeleton width={200} height={48} className="mb-3" />
              <Skeleton width={400} height={24} />
            </div>
            <Skeleton width={160} height={48} className="rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 glass p-8 rounded-[2.5rem] flex flex-col justify-center border-[var(--accent)]/10 min-h-[200px]">
              <Skeleton width="60%" height={32} className="mb-4" />
              <Skeleton width="80%" height={20} className="mb-8" />
              <Skeleton width={200} height={44} className="rounded-full" />
            </div>
            <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[var(--accent)]/5 to-transparent border-[var(--accent)]/10 min-h-[200px]">
              <Skeleton width={64} height={64} className="rounded-2xl mb-4" />
              <Skeleton width={120} height={24} className="mb-2" />
              <Skeleton width={180} height={14} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass p-7 rounded-3xl border-[var(--accent)]/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full">
                    <Skeleton width={64} height={64} className="rounded-2xl flex-shrink-0" />
                    <div className="w-full max-w-md">
                      <Skeleton width="100%" height={28} className="mb-3" />
                      <div className="flex gap-4">
                        <Skeleton width={120} height={16} />
                        <Skeleton width={100} height={16} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="hidden sm:block text-right">
                       <Skeleton width={60} height={12} className="mb-2 ml-auto" />
                       <Skeleton width={100} height={20} />
                    </div>
                    <Skeleton width={40} height={40} className="rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --- LIST VIEW (No checkId) ---
  if (!checkId) {
    return (
      <div className="min-h-screen t-bg transition-colors duration-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6"
          >
            <div>
              <h1 className="text-4xl font-black mb-3 t-heading">
                Audit <span className="gradient-text">History</span>
              </h1>
              <p className="t-body max-w-lg">
                Your personal command center for SEO performance tracking. Manage and review your previous analyses.
              </p>
            </div>
            <Link href="/" className="premium-button">
              <Sparkles className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 glass p-8 rounded-[2.5rem] flex flex-col justify-center border-[var(--accent)]/10">
              <h2 className="text-2xl font-bold mb-3 t-heading">Ready to <span className="gradient-text">Create?</span></h2>
              <p className="t-body mb-6 max-w-md">Use our AI-powered Designer Studio to create professional SEO assets, social media posts, and website graphics.</p>
              <Link href="/designer" className="premium-button w-fit">
                <Sparkles className="w-4 h-4 mr-2" />
                Open Designer Studio
              </Link>
            </div>
            <div className="glass p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[var(--accent)]/5 to-transparent border-[var(--accent)]/10">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-bold t-heading mb-1">Elite Protection</h3>
              <p className="text-xs t-muted">Your data is secured with enterprise-grade encryption.</p>
            </div>
          </div>

          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-20 rounded-[2.5rem] text-center"
            >
              <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-[var(--accent)]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 t-heading">No analyses yet</h3>
              <p className="t-body mb-10 max-w-sm mx-auto">Start by analyzing your first website to see it appear in your history.</p>
              <Link href="/" className="premium-button">Get Started</Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {history.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={`/dashboard?checkId=${item.id}`}
                    className="glass p-7 rounded-3xl block hover:border-[var(--accent)]/40 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-black text-2xl shadow-sm">
                          {item.score}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl t-heading group-hover:text-[var(--accent)] transition-colors truncate max-w-[200px] sm:max-w-md">
                            {item.url}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm t-muted mt-2">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {new Date(item.checkedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Shield className="w-4 h-4" />
                              Audit #{item.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-xs font-bold uppercase tracking-wider t-muted mb-1">Status</div>
                          <div className="text-sm font-bold text-emerald-500 flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-4 h-4" /> Optimized
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-elevated)] t-muted group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // --- DETAIL VIEW (With checkId) ---
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center t-bg">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 t-heading">Results Not Found</h1>
        <p className="t-body mb-8">We couldn't find the analysis record you're looking for.</p>
        <Link href="/dashboard" className="premium-button">Back to History</Link>
      </div>
    );
  }

  const report = data;

  return (
    <div className="min-h-screen t-bg transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <Link href="/dashboard" className="inline-flex items-center t-body hover:text-[var(--accent)] mb-10 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to History
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Score Card */}
          <div className="lg:w-1/3">
            <div className="glass p-10 rounded-[2.5rem] sticky top-32 shadow-xl shadow-indigo-500/5">
              <div className="text-center mb-10">
                <div className="relative inline-block">
                  <svg className="w-52 h-52 -rotate-90">
                    <circle
                      cx="104" cy="104" r="92"
                      fill="none" stroke="currentColor" strokeWidth="14"
                      className="text-[var(--border-color)] opacity-40"
                    />
                    <circle
                      cx="104" cy="104" r="92"
                      fill="none" stroke="var(--accent)" strokeWidth="14"
                      strokeDasharray={2 * Math.PI * 92}
                      strokeDashoffset={2 * Math.PI * 92 * (1 - report.score / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black t-heading">{report.score}</span>
                    <span className="t-muted text-sm font-bold uppercase tracking-widest mt-1">SEO Score</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <ScoreBar label="On-Page" score={report.onPageScore} color="var(--accent)" />
                <ScoreBar label="Technical" score={report.technicalScore} color="var(--accent-2)" />
                <ScoreBar label="Performance" score={report.performanceScore} color="#f59e0b" />
                <ScoreBar label="Links" score={report.linksScore} color="#ec4899" />
              </div>

              <button className="premium-button w-full mt-10 py-4 group">
                <Sparkles className="w-5 h-5 mr-2" />
                Fix with AI
              </button>
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="lg:flex-1 space-y-10">
            <div className="glass p-10 rounded-[2.5rem]">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 t-heading">
                <Sparkles className="w-7 h-7 text-[var(--accent)]" />
                AI Strategy Suggestions
              </h2>
              <div className="space-y-5">
                {report.details?.aiSuggestions?.map((sug: string, i: number) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 p-6 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent)]/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <p className="t-body leading-relaxed">{sug}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AuditCard title="On-Page SEO" issues={report.details?.onPage?.issues || []} icon={Search} color="var(--accent)" />
              <AuditCard title="Technical Audit" issues={report.details?.technical?.issues || []} icon={Shield} color="var(--accent-2)" />
              <AuditCard title="Global Presence" issues={report.details?.content?.issues || []} icon={Globe} color="#10b981" />
              <AuditCard title="Speed Metrics" issues={report.details?.performance?.issues || []} icon={Zap} color="#f59e0b" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ScoreBar({ label, score, color }: any) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between text-sm">
        <span className="t-muted font-bold uppercase tracking-wider text-[10px]">{label}</span>
        <span className="font-bold t-heading">{score}%</span>
      </div>
      <div className="h-2.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className="h-full rounded-full"
          style={{ background: color }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function AuditCard({ title, issues, icon: Icon, color }: any) {
  return (
    <div className="glass p-8 rounded-[2rem] hover:shadow-lg transition-all border border-transparent hover:border-[var(--accent)]/10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="font-black text-lg t-heading">{title}</h3>
      </div>
      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue: string, i: number) => (
            <div key={i} className="flex items-start gap-3 text-sm t-body">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{issue}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 text-sm text-emerald-500 font-bold bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
            <CheckCircle2 className="w-5 h-5" />
            Everything looks perfect!
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen t-bg">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="flex flex-col items-center justify-center gap-8">
            <Skeleton width={300} height={40} className="mb-2" />
            <Skeleton width="100%" height={200} className="rounded-[2.5rem]" />
            <div className="grid grid-cols-1 w-full gap-4">
               <Skeleton width="100%" height={100} className="rounded-3xl" />
               <Skeleton width="100%" height={100} className="rounded-3xl" />
            </div>
          </div>
        </main>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
