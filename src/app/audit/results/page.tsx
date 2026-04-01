"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Globe, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import LighthouseReport from "@/components/LighthouseReport";

function AuditResultsContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      const runAudit = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
          });
          
          if (res.status === 401) {
             setError("You must be logged in to run audits.");
             return;
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            
            if (res.status >= 500) {
              setError("The server encountered an error. Please check the logs or try again.");
              return;
            }
            setError("The server returned an unexpected format. This usually happens during a session timeout or server restart.");
            return;
          }

          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Audit failed");
            return;
          }
          setResults(data);
        } catch (err: any) {
          setError(err.message ? err.message : "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };
      runAudit();
    }
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <Globe className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-4 gradient-text">Analyzing Your Site...</h1>
        <p className="text-gray-400 max-w-md">
          Running Lighthouse audits and scanning for performance bottle-necks.
          This usually takes 15-30 seconds.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <ArrowLeft className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Audit Failed</h1>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link href="/" className="premium-button px-8 py-3">Try Again</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              New Audit
            </Link>
            <h1 className="text-4xl font-black flex items-center gap-3">
              Audit Report for 
              <span className="text-blue-400 truncate max-w-sm md:max-w-md lg:max-w-xl">
                {url}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 glass rounded-2xl border border-white/10 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <LighthouseReport results={results} />
      </main>
    </div>
  );
}

export default function AuditResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    }>
      <AuditResultsContent />
    </Suspense>
  );
}
