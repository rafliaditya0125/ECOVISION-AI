"use client";

import { useCallback, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface UploadZoneProps {
  /** Called when the user selects or drops a valid image file */
  onImageSelect: (imageUrl: string, file: File) => void;
}

export default function UploadZone({ onImageSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        // Create a local object URL for preview, then forward the raw File
        const imageUrl = URL.createObjectURL(file);
        onImageSelect(imageUrl, file);
      }
    },
    [onImageSelect]
  );

  // Handle click upload
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(imageUrl, file);
    }
  };

  return (
    <div
      className={`relative flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
        isDragging
          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
          : "border-zinc-200 bg-zinc-50 hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-700/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Upload Icon */}
        <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-zinc-200/50 dark:bg-zinc-800 dark:ring-zinc-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t("scan.clickOrDrag")}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("scan.supportedFormats")}
          </p>
        </div>
      </div>
    </div>
  );
}

