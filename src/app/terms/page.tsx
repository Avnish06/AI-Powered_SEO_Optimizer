"use client";

import Navbar from "@/components/Navbar";
import { Scale, BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen t-bg">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 pb-24">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 accent-chip">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Last updated: May 4, 2026
          </p>
        </motion.div>

        {/* Policy Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-soft)" }}
              >
                <BookOpen className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              By accessing, browsing, or registering on our platform, you agree to be bound by these Terms of Service. If you do not agree with any of the provisions stated below, you must cease use of the services immediately.
            </p>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-soft)" }}
              >
                <Scale className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                2. Acceptable Use
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              We grant you a personal, non-transferable right to access the platform. You agree that:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <li>You will not use the service for illegal or unauthorized activities.</li>
              <li>You will not upload or transmit viruses, malicious code, or spam.</li>
              <li>You are entirely responsible for the security of your own account login information.</li>
            </ul>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-soft)" }}
              >
                <AlertCircle className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                3. Disclaimer & Limitation of Liability
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              The platform and all generated suggestions are provided on an "as is" and "as available" basis. While we strive to ensure high performance and premium design accuracy:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <li>We make no guarantees regarding continuous uptime, completeness, or exact precision of the analysis results.</li>
              <li>Under no circumstances will the platform be held liable for direct, incidental, or consequential damages resulting from any technical errors or loss of user workspace data.</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
