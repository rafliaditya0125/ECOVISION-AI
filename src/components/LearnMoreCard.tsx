"use client";

import { useLanguage } from "@/hooks/useLanguage";

interface LearnMoreCardProps {
  description: string;
  environmentalImpact: string;
}

export default function LearnMoreCard({ description, environmentalImpact }: LearnMoreCardProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50 dark:bg-zinc-950 dark:ring-zinc-800/50">
      <div className="mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-emerald-600 dark:text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.25v14.25" />
        </svg>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("card.learn.title")}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t("card.learn.about")}</h4>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
        
        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800/50">
          <h4 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t("card.learn.why")}</h4>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {environmentalImpact}
          </p>
        </div>
      </div>
    </div>
  );
}

