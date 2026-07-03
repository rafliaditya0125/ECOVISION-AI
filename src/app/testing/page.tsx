"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";
import { getClientApiKey } from "@/lib/apiKey";

interface TestItem {
  id: string;
  file: File;
  preview: string;
  target: string;
  status: "pending" | "running" | "success" | "error";
  prediction: string | null;
  confidence: number | null;
}

const VALID_LABELS = [
  "plastic-pet",
  "plastic-hdpe",
  "paper",
  "cardboard",
  "glass",
  "metal-can",
  "metal-non-can",
  "organic-waste",
  "battery",
  "electronic-waste",
  "b3-waste",
  "medical-waste",
];

export default function TestingPage() {
  const { t, language } = useLanguage();
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0); // Progress percentage
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-parse target label from filename prefix
  const parseTargetFromFilename = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/[-_]/g, "-");
    for (const label of VALID_LABELS) {
      if (cleanName.startsWith(label)) {
        return label;
      }
    }
    return "plastic-pet"; // Fallback default
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newItems: TestItem[] = Array.from(selectedFiles)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        const preview = URL.createObjectURL(file);
        const target = parseTargetFromFilename(file.name);
        return {
          id: `test_${Math.random().toString(36).substring(2, 11)}`,
          file,
          preview,
          target,
          status: "pending",
          prediction: null,
          confidence: null,
        };
      });

    setTestItems((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTargetChange = (id: string, newTarget: string) => {
    setTestItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, target: newTarget } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setTestItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearAll = () => {
    testItems.forEach((item) => URL.revokeObjectURL(item.preview));
    setTestItems([]);
    setProgress(0);
    setIsRunning(false);
  };

  const runEvaluation = async () => {
    if (testItems.length === 0 || isRunning) return;

    setIsRunning(true);
    setProgress(0);

    const itemsToProcess = [...testItems];

    for (let i = 0; i < itemsToProcess.length; i++) {
      const currentItem = itemsToProcess[i];

      // Mark running
      setTestItems((prev) =>
        prev.map((item) => (item.id === currentItem.id ? { ...item, status: "running" } : item))
      );

      try {
        const formData = new FormData();
        formData.append("image", currentItem.file);

        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
          headers: {
            "x-api-key": getClientApiKey(),
          },
        });

        const data = await res.json();

        if (data.success) {
          setTestItems((prev) =>
            prev.map((item) =>
              item.id === currentItem.id
                ? {
                    ...item,
                    status: "success",
                    prediction: data.id,
                    confidence: data.confidence,
                  }
                : item
            )
          );
        } else {
          setTestItems((prev) =>
            prev.map((item) => (item.id === currentItem.id ? { ...item, status: "error" } : item))
          );
        }
      } catch (error) {
        console.error("Evaluation request error:", error);
        setTestItems((prev) =>
          prev.map((item) => (item.id === currentItem.id ? { ...item, status: "error" } : item))
        );
      }

      // Update progress
      setProgress(Math.round(((i + 1) / itemsToProcess.length) * 100));

      // Beri jeda 4 detik (4000ms) antar pengujian untuk menghindari batas Rate Limit API gratis (umumnya 15 request per menit)
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }

    setIsRunning(false);
  };

  // Metrics calculations
  const totalProcessed = testItems.filter((item) => item.status === "success").length;
  const totalCorrect = testItems.filter(
    (item) => item.status === "success" && item.prediction === item.target
  ).length;
  const accuracy = totalProcessed > 0 ? Math.round((totalCorrect / totalProcessed) * 100) : 0;

  const validConfidences = testItems
    .filter((item) => item.status === "success" && item.confidence !== null)
    .map((item) => item.confidence as number);
  const avgConfidence =
    validConfidences.length > 0
      ? Math.round(validConfidences.reduce((a, b) => a + b, 0) / validConfidences.length)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-emerald-400 dark:to-blue-400 sm:text-4xl">
              {t("testing.title")}
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {t("testing.subtitle")}
            </p>
          </div>

          {/* Controls & Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area & Stats */}
            <div className="space-y-6">
              {/* Uploader Card */}
              <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:border-zinc-800/50 dark:bg-zinc-950">
                <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-4">
                  📁 {language === "id" ? "Dataset Masukan" : "Input Dataset"}
                </h2>

                <div
                  onClick={() => !isRunning && fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                    isRunning ? "opacity-50 cursor-not-allowed" : "hover:border-emerald-500 hover:bg-emerald-50/10"
                  }`}
                >
                  <span className="text-3xl mb-2">📸</span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {t("testing.selectFiles")}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    JPEG, PNG (Max 10MB per file)
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/jpeg,image/png"
                  className="hidden"
                />

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={runEvaluation}
                    disabled={testItems.length === 0 || isRunning}
                    className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 px-5 py-3 text-center text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 disabled:scale-100 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    🚀 {t("testing.runBtn")}
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={testItems.length === 0 || isRunning}
                    className="w-full rounded-full border border-zinc-200 hover:bg-zinc-100 px-5 py-3 text-center text-xs font-bold text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 active:scale-98 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    🗑️ {t("testing.clearBtn")}
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              {isRunning && (
                <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:border-zinc-800/50 dark:bg-zinc-950">
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-zinc-500">Processing...</span>
                    <span className="text-emerald-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Metrics Card */}
              {totalProcessed > 0 && (
                <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:border-zinc-800/50 dark:bg-zinc-950 space-y-4">
                  <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                    📊 {language === "id" ? "Hasil Pengujian" : "Evaluation Results"}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/30 rounded-2xl p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                        {t("testing.accuracy")}
                      </p>
                      <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">
                        {accuracy}%
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-950/30 rounded-2xl p-4 text-center">
                      <p className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">
                        {t("testing.avgConfidence")}
                      </p>
                      <p className="text-2xl font-extrabold text-blue-800 dark:text-blue-300 mt-1">
                        {avgConfidence}%
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex justify-between text-xs text-zinc-500">
                    <span>{t("testing.successCount")}:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {totalCorrect} / {totalProcessed}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Test Queue list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 px-1">
                📋 {language === "id" ? "Daftar Dataset Pindai" : "Dataset Scan Queue"} ({testItems.length})
              </h2>

              {testItems.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/20 p-12 text-center">
                  <div className="text-4xl mb-4">🧪</div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {language === "id" ? "Belum ada dataset terunggah." : "No dataset files uploaded yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                  {testItems.map((item) => {
                    const isSuccess = item.status === "success";
                    const isMatch = isSuccess && item.prediction === item.target;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/50 shadow-sm dark:bg-zinc-950 dark:border-zinc-800/50 gap-4"
                      >
                        {/* Image & Name Info */}
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.preview}
                            alt="Test preview"
                            className="h-14 w-14 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                              {item.file.name}
                            </h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {(item.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        {/* Controls & Statuses */}
                        <div className="flex items-center gap-4 shrink-0">
                          {/* Target Label Dropdown Selector */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">
                              {t("testing.targetLabel")}
                            </span>
                            <select
                              value={item.target}
                              disabled={isRunning || isSuccess}
                              onChange={(e) => handleTargetChange(item.id, e.target.value)}
                              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none"
                            >
                              {VALID_LABELS.map((label) => (
                                <option key={label} value={label}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Evaluation Status Badge / Details */}
                          {item.status === "pending" && (
                            <span className="rounded-full bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1 text-[10px] font-bold text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/50">
                              Pending
                            </span>
                          )}

                          {item.status === "running" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/20 px-2.5 py-1 text-[10px] font-bold text-yellow-600 border border-yellow-200/30">
                              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-yellow-500" />
                              Running
                            </span>
                          )}

                          {item.status === "error" && (
                            <span className="rounded-full bg-red-50 dark:bg-red-950/20 px-2.5 py-1 text-[10px] font-bold text-red-600 border border-red-200/30">
                              Error
                            </span>
                          )}

                          {isSuccess && (
                            <div className="flex items-center gap-3">
                              {/* Prediction info */}
                              <div className="text-right">
                                <span className="text-[9px] uppercase font-bold text-zinc-400 block">
                                  {t("testing.predLabel")}
                                </span>
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                  {item.prediction}
                                </span>
                                <span className="text-[10px] text-zinc-400 block">
                                  {item.confidence}%
                                </span>
                              </div>

                              {/* Match indicator */}
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                  isMatch
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/30"
                                    : "bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200/30"
                                }`}
                              >
                                {isMatch ? t("testing.match") : t("testing.mismatch")}
                              </span>
                            </div>
                          )}

                          {/* Delete Item button */}
                          {!isRunning && !isSuccess && (
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                              title="Remove item"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
