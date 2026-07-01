"use client";

import { useLanguage } from "@/hooks/useLanguage";

interface ImpactCardProps {
  decompositionTime: string;
  recyclable: boolean;
  recyclingBin: string;
}

export default function ImpactCard({ decompositionTime, recyclable, recyclingBin }: ImpactCardProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50 dark:bg-zinc-950 dark:ring-zinc-800/50">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t("card.impact.title")}
      </h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Recyclability */}
        <div className="flex items-center gap-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${recyclable ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("card.impact.recyclable")}</p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{recyclable ? t("card.impact.yes") : t("card.impact.no")}</p>
          </div>
        </div>

        {/* Recycling Bin */}
        <div className="flex items-center gap-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("card.impact.bin")}</p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{recyclingBin}</p>
          </div>
        </div>

        {/* Decomposition */}
        <div className="flex items-center gap-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50 sm:col-span-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t("card.impact.decomp")}</p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{decompositionTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

