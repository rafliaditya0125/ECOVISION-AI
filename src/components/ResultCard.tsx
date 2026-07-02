"use client";

import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";

interface ResultCardProps {
  name: string;
  category: string;
  confidence: number;
  /** Optional preview URL from sessionStorage */
  imageUrl?: string | null;
}

export default function ResultCard({ name, category, confidence, imageUrl }: ResultCardProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center overflow-hidden rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50 dark:bg-zinc-950 dark:ring-zinc-800/50">
      {/* Uploaded image — shows real preview if available, otherwise a placeholder */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Scanned waste item"
            fill
            className="object-cover rounded-xl"
            unoptimized // object URL is ephemeral — skip Next.js image optimization
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 max-w-[200px] leading-relaxed">
              {t("result.photoNotSaved")}
            </span>
          </div>
        )}
      </div>

      {/* Analysis Output */}
      <div className="mt-8 flex w-full flex-col items-center text-center">
        <span className="mb-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          {category}
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {name}
        </h2>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {t("common.confidenceScore")}: <span className="font-bold text-zinc-900 dark:text-zinc-100">{confidence}%</span>
          </span>
        </div>
      </div>
    </div>
  );
}


