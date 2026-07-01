"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrorMsg(result.message || t("auth.invalidCredentials"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900/40 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/10 to-blue-500/10 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="rounded-3xl border border-zinc-200/60 bg-white/75 p-8 shadow-2xl backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/75">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("auth.loginTitle")}
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {t("auth.loginSubtitle")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2"
                >
                  {t("auth.emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm text-zinc-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2"
                >
                  {t("auth.passwordLabel")}
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm text-zinc-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-emerald-500"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-98 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  t("nav.login")
                )}
              </button>
            </form>

            {/* Redirect Footer */}
            <div className="mt-8 text-center border-t border-zinc-200/50 pt-6 dark:border-zinc-800/50">
              <Link
                href="/register"
                className="text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors dark:text-zinc-400 dark:hover:text-emerald-400"
              >
                {t("auth.noAccount")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
