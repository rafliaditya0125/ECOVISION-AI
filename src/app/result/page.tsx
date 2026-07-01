"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResultCard from "@/components/ResultCard";
import ImpactCard from "@/components/ImpactCard";
import RecommendationCard from "@/components/RecommendationCard";
import ResponsibleAICard from "@/components/ResponsibleAICard";
import LearnMoreCard from "@/components/LearnMoreCard";
import { getWasteKnowledge } from "@/lib/knowledge";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { isLocalStorageMode, saveScan } from "@/lib/clientStorage";
import Link from "next/link";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // Read waste ID and confidence from URL query params (e.g. /result?id=plastic-pet&confidence=96)
  const id = searchParams.get("id") ?? "unknown";
  const confidence = Number(searchParams.get("confidence") ?? 0);

  // Retrieve the uploaded image preview URL from sessionStorage (client-side only)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  useEffect(() => {
    const stored = sessionStorage.getItem("uploadedImage");
    setPreviewImage(stored);
  }, []);

  // Clear sessionStorage and navigate back to /scan
  const handleScanAnother = () => {
    sessionStorage.removeItem("uploadedImage");
    router.push("/scan");
  };

  // Look up the Knowledge Engine — null means unrecognized ID (passing current language preference)
  const wasteData = getWasteKnowledge(id, language);

  // Log scan event — localStorage mode saves directly in browser; MySQL mode POSTs to API
  const [hasLogged, setHasLogged] = useState(false);
  useEffect(() => {
    if (hasLogged || !wasteData) return;

    if (isLocalStorageMode()) {
      // Guest mode: save directly to browser localStorage
      setHasLogged(true);
      saveScan({
        wasteId: id,
        name: wasteData.name,
        category: wasteData.category,
        confidence,
        recyclable: wasteData.recyclable,
      });
    } else if (isAuthenticated && user) {
      // MySQL mode: POST to API route
      setHasLogged(true);
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteId: id,
          name: wasteData.name,
          category: wasteData.category,
          confidence: confidence,
          recyclable: wasteData.recyclable,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Logged scan to history:", data.scanItem);
          }
        })
        .catch((err) => console.error("Error logging scan to history:", err));
    }
  }, [isAuthenticated, user, wasteData, hasLogged, id, confidence]);

  if (!wasteData) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-zinc-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{t("result.notRecognizedTitle")}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {t("result.notRecognizedDesc")}
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {t("result.tryAgain")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {t("result.title")}
            </h1>
            <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
              {t("result.subtitle")}
            </p>
          </div>

          <div className="mt-6 sm:mt-0">
            <button
              onClick={handleScanAnother}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-700 dark:hover:bg-zinc-800"
            >
              {t("result.scanAnother")}
            </button>
          </div>
        </div>

        {/* Main Result Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Visual Result + Responsible AI */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-8">
              <ResultCard
                name={wasteData.name}
                category={wasteData.category}
                confidence={confidence}
                imageUrl={previewImage}
              />
              <ResponsibleAICard
                confidence={confidence}
                confidenceNote={wasteData.confidenceNote}
              />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-8 lg:col-span-7">
            <RecommendationCard recommendations={wasteData.recommendations} />
            <ImpactCard
              decompositionTime={wasteData.estimatedDecomposition}
              recyclable={wasteData.recyclable}
              recyclingBin={wasteData.recyclingBin}
            />
            <LearnMoreCard
              description={wasteData.description}
              environmentalImpact={wasteData.environmentalImpact}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900/40">
      <Navbar />
      {/* Suspense required because useSearchParams() is a client-side hook */}
      <Suspense fallback={
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
        </main>
      }>
        <ResultContent />
      </Suspense>
      <Footer />
    </div>
  );
}
