"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadZone from "@/components/UploadZone";
import ImagePreview from "@/components/ImagePreview";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useLanguage } from "@/hooks/useLanguage";
import { getClientApiKey } from "@/lib/apiKey";

export default function ScanPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Store both the object URL (for preview) and the raw File (for API submission)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Receive both preview URL and raw File from UploadZone
  const handleImageSelect = (imageUrl: string, file: File) => {
    setSelectedImage(imageUrl);
    setSelectedFile(file);
    setErrorMessage(null);
    // Persist the preview URL so result page can display it after navigation
    sessionStorage.setItem("uploadedImage", imageUrl);
  };

  const handleReplace = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    sessionStorage.removeItem("uploadedImage");
    setSelectedImage(null);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleRemove = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    sessionStorage.removeItem("uploadedImage");
    setSelectedImage(null);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // Build multipart/form-data and POST to the API route
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": getClientApiKey(),
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || t("scan.errorTitle"));
      }

      // Navigate to result page, passing the waste ID and confidence as query params
      router.push(`/result?id=${encodeURIComponent(data.id)}&confidence=${data.confidence}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("scan.errorDefault");
      setErrorMessage(message);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900/40">
      <Navbar />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {t("scan.title")}
            </h1>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
              {t("scan.subtitle")}
            </p>
          </div>

          {/* Main Content Area */}
          <div className="mx-auto mt-8 max-w-2xl">
            {!selectedImage ? (
              <UploadZone onImageSelect={handleImageSelect} />
            ) : (
              <ImagePreview
                imageUrl={selectedImage}
                onReplace={handleReplace}
                onRemove={handleRemove}
                onAnalyze={handleAnalyze}
              />
            )}

            {/* Inline error banner */}
            {errorMessage && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Full-screen Loading Overlay shown during API call */}
      {isAnalyzing && <LoadingOverlay />}
    </div>
  );
}


