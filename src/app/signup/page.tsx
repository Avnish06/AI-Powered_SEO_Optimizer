"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, ArrowRight, Phone, Building, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "ORGANIZATION">("INDIVIDUAL");
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          phone, 
          accountType, 
          fullName, 
          organizationName 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      router.push("/login?signup=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen t-bg relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Decorative blobs for symmetry and depth */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at center, var(--accent-2) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
      />

      <div className="flex-1 flex items-center justify-center px-6 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-lg t-card p-8 md:p-10 rounded-[2rem] relative"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-12 h-12 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
              style={{ background: "var(--gradient)" }}
            >
              <Sparkles className="text-white w-6 h-6" />
            </motion.div>
            <h1 className="text-3xl font-black mb-3 tracking-tight t-heading">Create Account</h1>
            <p className="text-sm t-body font-medium">Join the next generation of SEO</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            <div className="flex p-1 bg-[var(--bg-elevated)] rounded-xl mb-4 border t-border">
              <button
                type="button"
                onClick={() => setAccountType("INDIVIDUAL")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  accountType === "INDIVIDUAL" 
                    ? "bg-[var(--bg-surface)] t-heading shadow-sm border t-border" 
                    : "t-muted hover:t-body"
                }`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setAccountType("ORGANIZATION")}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                  accountType === "ORGANIZATION" 
                    ? "bg-[var(--bg-surface)] t-heading shadow-sm border t-border" 
                    : "t-muted hover:t-body"
                }`}
              >
                Organization
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider t-muted ml-1">
                  {accountType === "INDIVIDUAL" ? "Full Name" : "Organization Name"}
                </label>
                <div className="relative group">
                  {accountType === "INDIVIDUAL" ? (
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 t-muted group-focus-within:text-[var(--accent)] transition-colors" />
                  ) : (
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 t-muted group-focus-within:text-[var(--accent)] transition-colors" />
                  )}
                  <input
                    type="text"
                    required
                    value={accountType === "INDIVIDUAL" ? fullName : organizationName}
                    onChange={(e) => accountType === "INDIVIDUAL" ? setFullName(e.target.value) : setOrganizationName(e.target.value)}
                    className="w-full t-elevated border t-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm t-heading"
                    placeholder={accountType === "INDIVIDUAL" ? "John Doe" : "Acme Corp"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider t-muted ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 t-muted group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full t-elevated border t-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm t-heading"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider t-muted ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 t-muted group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full t-elevated border t-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm t-heading"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider t-muted ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 t-muted group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full t-elevated border t-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm t-heading"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="premium-button w-full py-4 text-sm font-bold flex items-center justify-center group disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Skeleton width={80} height={18} className="bg-white/20" />
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t t-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="t-surface px-4 t-muted">Or join with</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "var(--bg-muted)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-3.5 px-6 t-elevated border t-border rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="t-heading font-bold text-sm">Continue with Google</span>
          </motion.button>

          <p className="text-center mt-10 text-sm font-medium t-body">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--accent)] font-bold hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
