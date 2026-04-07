"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Navbar";
import { useTranslation } from "@/context/LanguageContext";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#04342C] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#1D9E75]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EF9F27]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 justify-center mb-12 group">
          <Logo className="w-10 h-10 text-[#04342C]" />
          <span className="text-white font-bold text-2xl tracking-tighter">
            NeuroAlert <span className="font-light opacity-60">Africa</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
          <div className="mb-8">
            <span className="text-[10px] font-black text-[#1AEEAF] tracking-[0.4em] uppercase">
              {t.login.badge}
            </span>
            <h1 className="text-3xl font-serif font-bold text-white mt-2">
              {t.login.title}
            </h1>
            <p className="text-white/40 text-sm mt-2 font-light">
              {t.login.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-white/50 tracking-widest uppercase mb-2">
                {t.login.email_label}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={t.login.email_placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-white/50 tracking-widest uppercase mb-2">
                {t.login.password_label}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] transition-all"
              />
            </div>

            {error && (
              <div className="bg-[#E24B4A]/10 border border-[#E24B4A]/30 rounded-xl px-5 py-3 text-[#E24B4A] text-sm flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E24B4A] mt-1.5 shrink-0 animate-pulse" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1D9E75] hover:bg-[#11B281] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-[0_15px_30px_rgba(29,158,117,0.3)] transform hover:-translate-y-0.5 mt-2"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.login.loading}
                </span>
              ) : (
                t.login.submit
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs">
              {t.login.no_access}{" "}
              <Link href="/contact" className="text-[#1AEEAF] hover:underline">
                {t.login.contact_team}
              </Link>
            </p>
          </div>
        </div>


      </div>
    </main>
  );
}
