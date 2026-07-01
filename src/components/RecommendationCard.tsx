"use client";

import { useLanguage } from "@/hooks/useLanguage";

interface RecommendationCardProps {
  recommendations: string[];
}

export default function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const { t } = useLanguage();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50 dark:bg-zinc-950 dark:ring-zinc-800/50">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t("card.rec.title")}
      </h3>
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3 w-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {rec}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

