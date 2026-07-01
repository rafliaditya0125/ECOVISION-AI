"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="about" className="border-t border-zinc-200/50 bg-white py-12 dark:border-zinc-800/50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Logo and Tagline */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-tr from-emerald-500 to-blue-500 text-white shadow-sm shadow-emerald-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
                />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              EcoVision AI
            </span>
          </div>

          {/* Center Info / Metadata */}
          <div className="text-center md:text-left">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("footer.builtFor")} <span className="font-semibold text-emerald-600 dark:text-emerald-400">LKS AI Exhibition 2026</span>.
            </p>
          </div>

          {/* Copyright & Date */}
          <div className="flex items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
            <span>&copy; {new Date().getFullYear()} EcoVision AI.</span>
            <span>{t("footer.allRights")}</span>
          </div>

        </div>
      </div>
    </footer>
  );
}

