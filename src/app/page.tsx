import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { Info, ShieldCheck, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen t-bg">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />

      {/* About the Application Section for Google Verification */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl p-8 md:p-12 t-surface border t-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-4 accent-chip">
              <Info className="w-3.5 h-3.5" />
              <span>About Colvo WebOptimizer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 t-heading tracking-tight leading-tight">
              A Complete, AI-Driven SEO Optimization Tool
            </h2>
            <p className="text-sm md:text-base leading-relaxed t-body mb-4">
              Our platform uses state-of-the-art Google Gemini AI to analyze your website, optimize on-page signals, generate winning marketing copy, and evaluate your Lighthouse performance score. Whether you are an indie maker or an established business, we take the guesswork out of search engines.
            </p>
            <p className="text-xs t-muted flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> Your data stays private. Read our full policy below.
            </p>
          </div>
          <div className="flex flex-col gap-4 flex-shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HelpCircle className="w-4 h-4 text-[var(--accent)]" /> Have any questions?
            </div>
            <p className="text-xs t-muted max-w-[240px] leading-relaxed">
              We take security seriously. Read about how we safeguard your data in our terms and legal pages.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
