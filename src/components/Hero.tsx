"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Shield, BarChart3, Globe, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    // Navigate directly to audit results — the results page handles the API call
    router.push(`/audit/results?url=${encodeURIComponent(url)}`);
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 glass rounded-full mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium tracking-wide text-blue-100">Next-Gen SEO Optimization</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
          Supercharge Your Website with{" "}
          <span className="gradient-text">Integrated AI</span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Analyze, optimize, and dominate search results with our state-of-the-art
          AI engine. Built for developers who demand perfection.
        </p>

        {!showForm ? (
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button 
              onClick={() => setShowForm(true)}
              className="premium-button text-lg px-10 py-4 flex items-center group"
            >
              Start Free Analysis
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="glass px-10 py-4 rounded-full font-semibold border border-white/10 hover:bg-white/5 transition-all text-white">
              See the Demo
            </button>
          </div>
        ) : (
          <form 
            onSubmit={handleStartAnalysis}
            className="max-w-2xl mx-auto glass p-2 rounded-[2rem] border border-white/10 animate-in zoom-in-95 fade-in duration-500 shadow-2xl shadow-blue-500/10"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full relative group">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg placeholder:text-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto premium-button py-5 px-10 rounded-2xl text-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Feature Grid Mini */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and safe." },
            { icon: BarChart3, title: "Real-time Metrics", desc: "Track performance as it happens." },
            { icon: Sparkles, title: "AI-Powered", desc: "Smarter insights, better results." }
          ].map((item, i) => (
            <div key={i} className="glass p-8 rounded-3xl text-left hover:scale-[1.02] transition-transform group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
