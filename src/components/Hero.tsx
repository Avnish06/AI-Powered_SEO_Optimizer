"use client";

import { ArrowRight, Play, TrendingUp, Clock, MessageSquare, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-12 flex flex-col items-center justify-center min-h-screen overflow-hidden t-bg">
      {/* Background gradients */}
      <div
        className="absolute top-1/4 left-0 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Copy & CTA */}
        <div className="flex flex-col items-start text-left max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-pink-500 mb-6"
          >
            All-In-One Digital Business Platform
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight t-heading mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            We make your<br />
            <span className="gradient-text">digital business</span><br />
            very easy!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="text-lg text-slate-300 mb-10 leading-relaxed max-w-md"
          >
            Colvo is an ecosystem of powerful tools that help you
            automate marketing, engage customers, and grow faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="flex flex-col sm:flex-row items-center gap-6 mb-12 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="premium-button w-full sm:w-auto"
            >
              Get Started Now <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            
            <button className="flex items-center gap-3 text-sm font-semibold t-heading hover:text-pink-400 transition-colors w-full sm:w-auto justify-center sm:justify-start group">
              <span className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Play className="w-4 h-4 text-white fill-current translate-x-[1px]" />
              </span>
              Explore Features
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-xs text-slate-500 font-medium"
          >
            Colvo: A highly trusted brand for your digital business
          </motion.p>
        </div>

        {/* RIGHT COLUMN: Glass Cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-2xl mx-auto hidden sm:block"
        >
          {/* Main Chart Card */}
          <div className="absolute top-[10%] left-[0%] w-[60%] h-[40%] rounded-2xl bg-[rgba(15,12,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-5 shadow-2xl flex flex-col transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] text-slate-400 ml-2 font-medium">Campaign Performance</span>
            </div>
            {/* Fake glowing line chart */}
            <div className="flex-1 relative mt-2 flex items-end">
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(236,72,153,0.15)] to-transparent" />
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <path d="M0 35 Q 20 30, 40 25 T 70 15 T 100 5" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" />
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Point */}
              <div className="absolute top-[5%] right-[0%] w-2.5 h-2.5 bg-pink-500 rounded-full shadow-[0_0_12px_#ec4899]" />
            </div>
          </div>

          {/* Circular Progress Card */}
          <div className="absolute top-[10%] right-[0%] w-[36%] h-[50%] rounded-2xl bg-[rgba(15,12,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-5 shadow-2xl flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
            <span className="text-[10px] text-slate-400 absolute top-5 text-center w-full font-medium">Client Satisfaction</span>
            <div className="relative w-32 h-32 mt-6 rounded-full flex items-center justify-center"
                 style={{ background: "conic-gradient(from 180deg, #ec4899 0%, #3b82f6 70%, #1e1b4b 70%, #1e1b4b 100%)" }}
            >
              <div className="w-28 h-28 bg-[#0f0c1e] rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-extrabold text-white leading-none">98%</span>
                <span className="text-[9px] text-slate-400 mt-1">Satisfied</span>
              </div>
            </div>
          </div>

          {/* Floating Pink Cursor */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[0%] right-[-8%] z-20 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          >
            <MousePointer2 className="w-12 h-12 fill-pink-500 rotate-[-15deg] stroke-white stroke-[1.5px]" />
          </motion.div>

          {/* Metric 1 */}
          <div className="absolute bottom-[20%] left-[0%] w-[31%] h-[24%] rounded-2xl bg-[rgba(15,12,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl flex flex-col justify-end group hover:border-[rgba(139,92,246,0.4)] transition-all hover:-translate-y-1 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-[rgba(139,92,246,0.2)] mb-auto flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[9px] text-slate-400 font-medium">Total Reach</span>
            <span className="text-2xl font-bold text-white leading-tight">80K+</span>
            <span className="text-[8px] text-slate-500 mt-0.5">People Reached</span>
          </div>

          {/* Metric 2 */}
          <div className="absolute bottom-[20%] left-[34.5%] w-[31%] h-[24%] rounded-2xl bg-[rgba(15,12,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl flex flex-col justify-end group hover:border-[rgba(249,115,22,0.4)] transition-all hover:-translate-y-1 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-[rgba(249,115,22,0.2)] mb-auto flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-[9px] text-slate-400 font-medium">Response Time</span>
            <span className="text-2xl font-bold text-white leading-tight">0.3s</span>
            <span className="text-[8px] text-slate-500 mt-0.5">Average Time</span>
          </div>

          {/* Metric 3 */}
          <div className="absolute bottom-[20%] right-[0%] w-[31%] h-[24%] rounded-2xl bg-[rgba(15,12,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] p-4 shadow-2xl flex flex-col justify-end group hover:border-[rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.2)] mb-auto flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[9px] text-slate-400 font-medium">Messages Sent</span>
            <span className="text-2xl font-bold text-white leading-tight">45K</span>
            <span className="text-[8px] text-slate-500 mt-0.5">Sent This Month</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
