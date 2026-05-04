"use client";

import { motion } from "framer-motion";
import { Search, Zap, FileText, Globe, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "On-Page Analysis",
    description: "Title tags, meta descriptions, H1 structure, image alt text, canonical URLs — checked and graded instantly.",
    tag: "On-Page",
  },
  {
    icon: ShieldCheck,
    title: "Technical Audit",
    description: "HTTPS, viewport, language tags, charset, structured data, and HTML size — every technical signal covered.",
    tag: "Technical",
  },
  {
    icon: FileText,
    title: "Content Quality",
    description: "Word count, readability score, paragraph density, and thin-content detection to keep pages Google-ready.",
    tag: "Content",
  },
  {
    icon: Globe,
    title: "Open Graph & Social",
    description: "Validates og:title, og:image, og:description, and Twitter card tags so your links look great everywhere.",
    tag: "Social",
  },
  {
    icon: Zap,
    title: "Core Web Vitals",
    description: "Real LCP, FCP, TBT, CLS, and TTI from the Google PageSpeed Insights API — not simulated numbers.",
    tag: "Performance",
  },
  {
    icon: BarChart3,
    title: "Link Structure",
    description: "Internal link count, external links, nofollow ratios, and empty href detection for clean link architecture.",
    tag: "Links",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Features() {
  return (
    <section id="features" className="py-28 px-4 t-bg border-t t-border">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="max-w-xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-xs font-semibold uppercase tracking-widest t-muted mb-4"
          >
            What we check
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
            className="text-3xl sm:text-4xl font-bold tracking-tight t-heading leading-[1.15]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Everything that affects<br />
            your search ranking.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-4 t-body text-base leading-relaxed"
          >
            One scan covers six SEO dimensions — so you never miss the issue
            that's holding your site back.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-color)] border t-border rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
              className="bg-[var(--bg-surface)] p-7 group hover:bg-[var(--bg-elevated)] transition-colors duration-200"
            >
              {/* Tag */}
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider t-muted mb-4">
                {f.tag}
              </span>

              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center mb-4">
                <f.icon className="w-4.5 h-4.5" style={{ color: "var(--accent)" }} />
              </div>

              <h3 className="text-base font-semibold t-heading mb-2 leading-snug">
                {f.title}
              </h3>
              <p className="text-sm t-body leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
