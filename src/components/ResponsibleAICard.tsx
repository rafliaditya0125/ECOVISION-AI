"use client";

import { useLanguage } from "@/hooks/useLanguage";

interface ResponsibleAICardProps {
  confidence: number;
  confidenceNote: string;
}

export default function ResponsibleAICard({ confidence, confidenceNote }: ResponsibleAICardProps) {
  const isLowConfidence = confidence < 80;
  const { t } = useLanguage();

  return (
    <div className={`rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ${isLowConfidence ? "bg-amber-50 ring-amber-200/50 dark:bg-amber-500/10 dark:ring-amber-500/20" : "bg-zinc-50 ring-zinc-200/50 dark:bg-zinc-900/50 dark:ring-zinc-800/50"}`}>
      <div className="mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`h-5 w-5 ${isLowConfidence ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className={`text-lg font-semibold ${isLowConfidence ? "text-amber-900 dark:text-amber-100" : "text-zinc-900 dark:text-zinc-50"}`}>
          {t("card.responsible.title")}
        </h3>
      </div>
      
      <div className="space-y-3">
        {isLowConfidence && (
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {t("card.responsible.warning")}
          </p>
        )}
        
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-700 dark:text-zinc-300">{t("card.responsible.aiNote")}</strong>
          {confidenceNote}
        </p>

        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
          {t("card.responsible.disclaimer")}
        </p>
      </div>
    </div>
  );
}

