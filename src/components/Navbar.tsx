"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/75 backdrop-blur-md transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-950/75">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-500 text-white shadow-md shadow-emerald-500/25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
                />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-blue-400">
              EcoVision AI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <a
              href="#home"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
            >
              About
            </a>
          </div>

          {/* Action & Theme Toggle Button */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/50 bg-white/50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
            >
              {!mounted ? (
                <span className="h-5 w-5 rounded-full" />
              ) : theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </button>

            <Link href="/scan" className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 p-0.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95">
              <span className="relative rounded-full bg-zinc-950 px-5 py-2 transition-all duration-300 ease-in group-hover:bg-opacity-0 hover:bg-transparent">
                Start Scanning
              </span>
            </Link>
          </div>

          {/* Mobile Actions (Theme Toggle & Hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/50 bg-white/50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 cursor-pointer"
            >
              {!mounted ? (
                <span className="h-5 w-5 rounded-full" />
              ) : theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 pb-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
          >
            About
          </a>
          <div className="pt-2">
            <Link
              href="/scan"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98"
            >
              Start Scanning
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
