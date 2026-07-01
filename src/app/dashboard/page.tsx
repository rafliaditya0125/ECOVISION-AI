"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ScanHistoryItem, UserStats } from "@/lib/db";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t, language } = useLanguage();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Authenticate session redirection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch stats and history when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/history"),
      ]);

      const statsData = await statsRes.json();
      const historyData = await historyRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (historyData.success) setHistory(historyData.history);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Render loading state
  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900/40 justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading your ecological record...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback for redirecting state
  if (!isAuthenticated) {
    return null;
  }

  // Preset offset categories icons for dashboard
  const getCategoryIcon = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes("plastic") || catLower.includes("plastik")) {
      return (
        <span className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
          🥤
        </span>
      );
    }
    if (catLower.includes("paper") || catLower.includes("kertas") || catLower.includes("cardboard") || catLower.includes("karton")) {
      return (
        <span className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
          📦
        </span>
      );
    }
    if (catLower.includes("glass") || catLower.includes("kaca")) {
      return (
        <span className="p-3 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl">
          🥛
        </span>
      );
    }
    if (catLower.includes("metal") || catLower.includes("kaleng")) {
      return (
        <span className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl">
          🥫
        </span>
      );
    }
    if (catLower.includes("organic") || catLower.includes("organik")) {
      return (
        <span className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
          🍎
        </span>
      );
    }
    return (
      <span className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
        🗑️
      </span>
    );
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900/40 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-400/5 to-blue-500/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("dashboard.title")}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <Link
            href="/scan"
            className="self-start rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-all hover:scale-[1.02]"
          >
            {t("hero.cta")}
          </Link>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Scanned Items Card */}
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:border-zinc-800/50 dark:bg-zinc-950 hover:border-emerald-500/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t("dashboard.totalScanned")}
                </span>
                <span className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
                  📷
                </span>
              </div>
              <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {stats.totalScanned}
              </p>
              <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>↑ {stats.totalScanned} items logged</span>
              </div>
            </div>

            {/* Recycling Rate Card */}
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:border-zinc-800/50 dark:bg-zinc-950 hover:border-emerald-500/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t("dashboard.recyclingRate")}
                </span>
                <span className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                  ♻️
                </span>
              </div>
              <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {stats.recyclingRate}%
              </p>
              <div className="mt-2 w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.recyclingRate}%` }}
                />
              </div>
            </div>

            {/* CO2 Savings Card */}
            <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:border-zinc-800/50 dark:bg-zinc-950 hover:border-emerald-500/20 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t("dashboard.co2Savings")}
                </span>
                <span className="p-2.5 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl text-cyan-600 dark:text-cyan-400">
                  🍃
                </span>
              </div>
              <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {stats.totalCo2Offset} <span className="text-base font-semibold text-zinc-500">kg</span>
              </p>
              <div className="mt-2 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                <span>≈ {(stats.totalCo2Offset * 4).toFixed(1)} km driven saved</span>
              </div>
            </div>
          </div>
        )}

        {/* Categories Breakdown & Recent Scan list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Scans list */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t("dashboard.historyTitle")}
            </h2>

            {history.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/20 p-12 text-center">
                <div className="text-4xl mb-4">🌱</div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("dashboard.noHistory")}
                </p>
                <div className="mt-6">
                  <Link
                    href="/scan"
                    className="inline-flex items-center rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                  >
                    {t("hero.cta")}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white border border-zinc-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-md transition-shadow dark:bg-zinc-950 dark:border-zinc-800/50 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {getCategoryIcon(item.category)}
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-zinc-500">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{formatDate(item.scannedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-zinc-100 sm:border-0 pt-3 sm:pt-0">
                      <div className="text-right sm:text-right">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            item.recyclable
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          {item.recyclable
                            ? language === "id"
                              ? "Daur Ulang"
                              : "Recyclable"
                            : language === "id"
                            ? "Residu"
                            : "Residual"}
                        </span>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {t("common.confidenceScore")}: {item.confidence}%
                        </div>
                      </div>

                      <Link
                        href={`/result?id=${item.wasteId}&confidence=${item.confidence}`}
                        className="rounded-xl border border-zinc-200/60 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        {t("dashboard.viewDetails")}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Category Breakdown */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t("dashboard.breakdownTitle")}
            </h2>

            {stats && Object.keys(stats.categoryBreakdown).length === 0 ? (
              <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-950">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">No categories recorded yet.</p>
              </div>
            ) : (
              stats && (
                <div className="rounded-3xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-950 space-y-5">
                  {Object.entries(stats.categoryBreakdown).map(([catName, count]) => {
                    const percentage = Math.round((count / stats.totalScanned) * 100);
                    return (
                      <div key={catName} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {catName}
                          </span>
                          <span className="font-medium text-zinc-500">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
