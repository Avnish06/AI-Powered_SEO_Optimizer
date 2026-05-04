"use client";

import Navbar from "@/components/Navbar";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PrivacyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}
          >
            Privacy Policy
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
                <Eye className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                1. Information We Collect
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              To provide a fully integrated AI SEO Optimizer experience, we collect information that helps us personalize and improve our services:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <li>
                <strong>Personal Data:</strong> Name, email address, and profile photo when signing in via Google OAuth or creating an account.
              </li>
              <li>
                <strong>SEO Analysis Data:</strong> Website URLs submitted for optimization reports, SEO logs, and generated marketing copy.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, device type, browser settings, and telemetry data for service optimization.
              </li>
            </ul>
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
                <Lock className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                2. How We Use Your Data
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              We use your data strictly to enable features, maintain service integrity, and assist with your optimization workflows:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <li>To create and manage your personal user workspace account.</li>
              <li>To run AI analysis on your requested URLs and output suggestions.</li>
              <li>To store audit reports so you can revisit and compare previous runs.</li>
              <li>To analyze diagnostic parameters and resolve systemic technical errors.</li>
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
                <FileText className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                3. Third-Party Integrations
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              Our services interact securely with authorized third-party tools to perform analytics and authentication:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <li>
                <strong>Google OAuth:</strong> Allows you to authenticate seamlessly. We access basic profile fields with explicit authorization.
              </li>
              <li>
                <strong>Google Gemini API:</strong> Processes your submitted prompts to write targeted growth copy and SEO content.
              </li>
              <li>
                <strong>MongoDB Atlas:</strong> Securely persists your workspace dashboard information and report logs.
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
