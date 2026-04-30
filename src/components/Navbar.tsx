"use client";

import Link from "next/link";
import { Search, LogOut, Sun, Moon, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how" },
  { label: "AI Tools", href: "/ai" },
  { label: "Designer", href: "/designer" },
  { label: "Marketing", href: "/marketing" },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch { /* silently fail */ }
    };
    fetchUser();

    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3" id="navbar">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`max-w-6xl mx-auto flex items-center justify-between px-5 py-3 transition-all duration-300 ${
          scrolled ? "rounded-2xl" : "rounded-2xl"
        }`}
        style={{
          background: scrolled ? "var(--navbar-bg)" : "var(--navbar-bg)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid var(--navbar-border)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" id="navbar-logo">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
            style={{ background: "var(--gradient)" }}
          >
            <Search className="text-white w-3.5 h-3.5" />
          </div>
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}
          >
            SEO<span
              style={{
                background: "var(--gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium px-3.5 py-2 rounded-lg transition-all hover:bg-[var(--bg-elevated)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="text-sm font-medium px-3.5 py-2 rounded-lg transition-all hover:bg-[var(--bg-elevated)]"
            style={{ color: "var(--text-secondary)" }}
          >
            Dashboard
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            id="theme-toggle"
            aria-label="Toggle theme"
            whileTap={{ scale: 0.88 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-elevated)]"
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.span
                  key="moon"
                  initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ rotate: 45, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -45, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Auth */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="text-xs font-semibold px-3 py-1.5 rounded-lg truncate max-w-[120px]"
                style={{ color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              >
                {user.fullName || user.name || user.email?.split("@")[0]}
              </div>
              <motion.button
                onClick={handleLogout}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-elevated)]"
                title="Log out"
              >
                <LogOut className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </motion.button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:bg-[var(--bg-elevated)]"
                style={{ color: "var(--text-secondary)" }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="premium-button text-sm px-4 py-2 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.88 }}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-elevated)]"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl overflow-hidden origin-top"
            style={{
              background: "var(--navbar-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--navbar-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="p-3 flex flex-col gap-0.5">
              {[...navLinks, { label: "Dashboard", href: "/dashboard" }].map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium py-2.5 px-4 rounded-xl transition-all hover:bg-[var(--bg-elevated)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              {!user && (
                <div className="pt-2 mt-1 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium py-2.5 px-4 rounded-xl transition-all hover:bg-[var(--bg-elevated)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block mt-1 text-sm font-bold py-2.5 px-4 rounded-xl text-center premium-button"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
