"use client";

import { useLanguage } from "@/hooks/useLanguage";

interface ImagePreviewProps {
  imageUrl: string;
  onReplace: () => void;
  onRemove: () => void;
  onAnalyze: () => void;
}

export default function ImagePreview({
  imageUrl,
  onReplace,
  onRemove,
  onAnalyze,
}: ImagePreviewProps) {
  const { t } = useLanguage();

  return (
    <div className="flex w-full flex-col items-center space-y-8 rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50 dark:bg-zinc-950 dark:ring-zinc-800/50 sm:p-8">
      {/* Image Container */}
      <div className="relative flex aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900/50">
        <img
          src={imageUrl}
          alt="Waste preview"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onReplace}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
          >
            {t("scan.replaceImage")}
          </button>
          <button
            onClick={onRemove}
            className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {t("scan.remove")}
          </button>
        </div>

        <button
          onClick={onAnalyze}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95"
        >
          {t("scan.analyze")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="ml-2 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

