"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function LoadingOverlay() {
  const { t } = useLanguage();
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    t("loading.analyzing"),
    t("loading.detecting"),
    t("loading.calculating"),
    t("loading.preparing"),
  ];

  useEffect(() => {
    // Rotate messages every 2 seconds
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl dark:bg-zinc-950/80">
      <div className="flex flex-col items-center space-y-8 p-8 text-center">
        {/* Beautiful animated spinner */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute h-full w-full animate-[spin_3s_linear_infinite] rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500" />
          <div className="absolute h-16 w-16 animate-[spin_2s_linear_infinite_reverse] rounded-full border-[3px] border-blue-500/20 border-b-blue-500" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Animated text transition */}
        <div className="h-8 overflow-hidden">
          <p
            key={messageIndex}
            className="animate-[slideUp_0.3s_ease-out] text-lg font-medium text-zinc-900 dark:text-zinc-100"
          >
            {messages[messageIndex]}
          </p>
        </div>
      </div>
      
      {/* Required keyframes for slideUp */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}

