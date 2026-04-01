"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Phone, Building } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 py-12">
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">Create Account</h1>
          <p className="text-gray-400">Join the next generation of SEO</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5 relative z-10">
          <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 rounded-2xl mb-6">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setAccountType("INDIVIDUAL")}
              className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                accountType === "INDIVIDUAL" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setAccountType("ORGANIZATION")}
              className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                accountType === "ORGANIZATION" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Organization
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">
                {accountType === "INDIVIDUAL" ? "Full Name" : "Organization Name"}
              </label>
              <div className="relative group">
                {accountType === "INDIVIDUAL" ? (
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                ) : (
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                )}
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  value={accountType === "INDIVIDUAL" ? fullName : organizationName}
                  onChange={(e) => accountType === "INDIVIDUAL" ? setFullName(e.target.value) : setOrganizationName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder={accountType === "INDIVIDUAL" ? "John Doe" : "Acme Corp"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  required
                  suppressHydrationWarning
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="tel"
                  required
                  suppressHydrationWarning
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="password"
                  required
                  suppressHydrationWarning
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="Create a strong password"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            suppressHydrationWarning
            className="premium-button w-full py-4 text-lg mt-4 flex items-center justify-center group disabled:opacity-50"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
