"use client";

import Link from "next/link";
import { Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl flex items-center justify-between px-8 py-3 translate-y-2">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            SEO<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Tools</Link>
        </div>

        <div className="flex items-center space-x-5">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-blue-400 transition-colors">Login</Link>
              <Link href="/signup" className="premium-button text-sm">Join Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
