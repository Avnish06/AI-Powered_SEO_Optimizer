"use client";

import { Mail, Phone, MapPin, ArrowUp, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const services   = ["UI/UX Designing", "Website Development", "Digital Marketing", "SEO & Content Marketing", "Graphics Designing", "Custom Software Development"];
  const quickLinks = ["About Us", "Life @ Hatbaliya", "Why Choose us?", "Careers", "Contact Us"];
  const socials    = ["Facebook", "Instagram", "LinkedIn", "YouTube"];

  const contactItems = [
    { Icon: Mail,   label: "Write To Us", value: "support@hatbaliya.in",  href: "mailto:support@hatbaliya.in" },
    { Icon: Phone,  label: "Call Us",     value: "+(91) 819 18 00858",    href: "tel:+918191800858" },
    { Icon: MapPin, label: "Our Office",  value: "Plot. 99, Rajendra Park, Sector 105, Gurugram - 122001.", href: "#" },
  ];

  return (
    <footer className="relative" style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-color)" }}>
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">

        {/* Contact bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {contactItems.map(({ Icon, label, value, href }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-color)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-soft)" }}>
                <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider t-muted mb-1">{label}</p>
                <a href={href} className="text-sm font-medium t-heading hover:text-[var(--accent)] transition-colors leading-snug">{value}</a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-full h-px mb-12" style={{ background: "var(--border-color)" }} />

        {/* Main columns */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient)" }}>
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black t-heading">SEO<span className="gradient-text">AI</span></span>
            </div>
            <p className="text-sm t-body leading-relaxed mb-6">
              Hatbaliya Technologies delivers cutting-edge digital services that help businesses thrive in the digital era.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <motion.a
                  key={s}
                  href="#"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors t-body hover:text-[var(--accent)]"
                  style={{ border: "1px solid var(--border-color)", background: "var(--bg-elevated)" }}
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider t-muted mb-5">Services</h4>
            <ul className="space-y-3">
              {services.map((s, i) => (
                <motion.li key={s} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Link href="#" className="text-sm t-body hover:text-[var(--accent)] transition-colors">{s}</Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider t-muted mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l, i) => (
                <motion.li key={l} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Link href="#" className="text-sm t-body hover:text-[var(--accent)] transition-colors">{l}</Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Map Card */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider t-muted mb-5">Location</h4>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #312e81, #1e3a5f, #065f46)" }} />
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 40% 40%, #4ade80, transparent 60%)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-3/4 h-3/4 rounded-xl flex flex-col items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="w-2/3 h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.3)" }} />
                  <div className="w-1/2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.3, 0.9] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-rose-400"
                style={{ boxShadow: "0 0 8px rgba(248,113,113,0.9)" }}
              />
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.3, 0.9] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-sky-400"
                style={{ boxShadow: "0 0 8px rgba(56,189,248,0.9)" }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="w-full h-px mb-6" style={{ background: "var(--border-color)" }} />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          <p className="text-xs t-muted">© 2025 Hatbaliya Technologies. All rights reserved.</p>
          <motion.button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md"
            style={{ background: "var(--gradient)" }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
