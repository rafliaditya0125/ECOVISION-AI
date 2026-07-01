"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [scanState, setScanState] = useState("idle"); // idle -> scanning -> identified
  const [progress, setProgress] = useState(0);

  // Simple scan demo cycle for interactivity and rich aesthetics
  useEffect(() => {
    const timer = setInterval(() => {
      setScanState("scanning");
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState("identified");
            return 100;
          }
          return prev + 5;
        });
      }, 80);

      return () => clearInterval(interval);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden py-20 lg:py-32 bg-white dark:bg-zinc-950">
      {/* Custom Styles for scanner line and grid animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(220px); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .scanner-line {
          animation: scan 3s ease-in-out infinite;
        }
        .float-panel {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-blob {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}} />

      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl opacity-70 pointer-events-none pulse-blob" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none pulse-blob" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Left Column: Heading and Text */}
          <div className="flex flex-col text-center lg:text-left lg:col-span-7">
            {/* Tagline */}
            <div className="mx-auto lg:mx-0 mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              LKS Nasional 2026 AI Exhibition Project
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] sm:leading-[1.08] lg:leading-[1.05]">
              Scan. Sort.{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                Save the Planet.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              AI-powered waste classification and environmental education platform that helps everyone recycle correctly.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/scan"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/35 active:scale-98"
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="ml-2 h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white/50 px-8 py-3.5 text-base font-semibold text-zinc-700 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-850 dark:hover:border-zinc-700"
              >
                Learn More
              </a>
            </div>

            {/* Stats / Badges */}
            <div className="mt-12 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">98.4%</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">AI Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">&lt; 1s</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Scan Speed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">100%</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Open Source</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive CSS Illustration */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-[400px] aspect-[4/5] float-panel">
              {/* Main Canvas card */}
              <div className="absolute inset-0 rounded-3xl border border-zinc-200/60 bg-white/70 shadow-2xl backdrop-blur-md p-6 flex flex-col justify-between dark:border-zinc-800/60 dark:bg-zinc-950/70">
                {/* Camera / Scan Feed Box */}
                <div className="relative flex-1 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-zinc-200/40 dark:border-zinc-800/40 flex flex-col items-center justify-center p-4">
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-15 dark:opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* Corner Targets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />

                  {/* Scan Laser */}
                  {scanState === "scanning" && (
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] scanner-line" />
                  )}

                  {/* Plastic Bottle (CSS Vector Drawing) */}
                  <div className="relative w-24 h-48 flex flex-col items-center justify-center">
                    {/* Bottle body */}
                    <div className="w-14 h-28 bg-emerald-500/10 dark:bg-blue-500/10 border-2 border-emerald-500/40 rounded-2xl relative flex flex-col items-center justify-center">
                      {/* Water lines */}
                      <div className="w-full h-8 bg-emerald-500/25 absolute bottom-0 rounded-b-[14px] border-t border-emerald-500/40" />
                      {/* Label */}
                      <div className="w-12 h-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-[8px] font-bold text-zinc-400 dark:text-zinc-500">
                        WATER
                      </div>
                    </div>
                    {/* Bottle neck & cap */}
                    <div className="w-6 h-4 bg-emerald-500/10 dark:bg-blue-500/10 border-x-2 border-t-2 border-emerald-500/40 rounded-t-sm" />
                    <div className="w-8 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-sm shadow-sm" />
                  </div>

                  {/* State text */}
                  <div className="absolute bottom-6 bg-zinc-950/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] tracking-wide font-medium flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${scanState === "scanning" ? "bg-amber-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
                    {scanState === "scanning" ? "CLASSIFYING WASTE..." : "READY TO SCAN"}
                  </div>
                </div>

                {/* Classification Output Overlay Widget */}
                <div className="mt-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                      Classification Results
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {scanState === "scanning" ? `${Math.round(progress)}%` : "98.4% Confidence"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-850">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                        {scanState === "scanning" ? "Scanning item..." : "PET Plastic Bottle"}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {scanState === "scanning" ? "Analyzing polymer profile..." : "Yellow Recycling Bin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating micro-widget 1 */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-3 shadow-lg flex items-center gap-2 max-w-[150px] backdrop-blur-md">
                <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v19.5m6.5-12.75l-6.5-6.5-6.5 6.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">CO2 Offset</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">-2.4kg</p>
                </div>
              </div>

              {/* Floating micro-widget 2 */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-3 shadow-lg flex items-center gap-2 max-w-[150px] backdrop-blur-md">
                <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Sorted Bin</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Recyclable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
