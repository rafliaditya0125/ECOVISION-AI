"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionary: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.home": {
    en: "Home",
    id: "Beranda",
  },
  "nav.features": {
    en: "Features",
    id: "Fitur",
  },
  "nav.about": {
    en: "About",
    id: "Tentang",
  },
  "nav.startScanning": {
    en: "Start Scanning",
    id: "Mulai Memindai",
  },

  // Hero
  "hero.tagline": {
    en: "LKS Nasional 2026 AI Exhibition Project",
    id: "Proyek Pameran AI LKS Nasional 2026",
  },
  "hero.title1": {
    en: "Scan. Sort. ",
    id: "Pindai. Pilih. ",
  },
  "hero.title2": {
    en: "Save the Planet.",
    id: "Selamatkan Bumi.",
  },
  "hero.subtitle": {
    en: "AI-powered waste classification and environmental education platform that helps everyone recycle correctly.",
    id: "Platform klasifikasi sampah dan edukasi lingkungan berbasis AI yang membantu semua orang mendaur ulang dengan benar.",
  },
  "hero.getStarted": {
    en: "Get Started",
    id: "Mulai Sekarang",
  },
  "hero.learnMore": {
    en: "Learn More",
    id: "Pelajari Lebih Lanjut",
  },
  "hero.aiAccuracy": {
    en: "AI Accuracy",
    id: "Akurasi AI",
  },
  "hero.scanSpeed": {
    en: "Scan Speed",
    id: "Kecepatan Pindai",
  },
  "hero.openSource": {
    en: "Open Source",
    id: "Sumber Terbuka",
  },
  "hero.readyToScan": {
    en: "READY TO SCAN",
    id: "SIAP MEMINDAI",
  },
  "hero.classifying": {
    en: "CLASSIFYING WASTE...",
    id: "MENGKLASIFIKASI SAMPAH...",
  },
  "hero.results": {
    en: "Classification Results",
    id: "Hasil Klasifikasi",
  },
  "hero.confidence": {
    en: "Confidence",
    id: "Keyakinan",
  },
  "hero.scanningItem": {
    en: "Scanning item...",
    id: "Memindai barang...",
  },
  "hero.analyzingPolymer": {
    en: "Analyzing polymer profile...",
    id: "Menganalisis profil polimer...",
  },
  "hero.petBottle": {
    en: "PET Plastic Bottle",
    id: "Botol Plastik PET",
  },
  "hero.yellowBin": {
    en: "Yellow Recycling Bin",
    id: "Tempat Sampah Kuning",
  },
  "hero.co2Offset": {
    en: "CO2 Offset",
    id: "Offset CO2",
  },
  "hero.sortedBin": {
    en: "Sorted Bin",
    id: "Wadah Terpilih",
  },
  "hero.recyclable": {
    en: "Recyclable",
    id: "Dapat Didaur Ulang",
  },

  // Features
  "features.tagline": {
    en: "Intelligent Features",
    id: "Fitur Cerdas",
  },
  "features.title": {
    en: "Everything you need to make eco-friendly decisions",
    id: "Semua yang Anda butuhkan untuk membuat keputusan ramah lingkungan",
  },
  "features.desc": {
    en: "Empowering schools, students, and communities with advanced AI vision tools and educational modules to tackle waste at the source.",
    id: "Memberdayakan sekolah, siswa, dan komunitas dengan alat deteksi AI tingkat lanjut dan modul edukasi untuk mengatasi sampah dari sumbernya.",
  },
  "features.ai.title": {
    en: "AI Waste Detection",
    id: "Deteksi Sampah AI",
  },
  "features.ai.desc": {
    en: "Point your camera or upload an image to identify any type of waste instantly. Our advanced vision models classify item composition and materials.",
    id: "Arahkan kamera Anda atau unggah gambar untuk mengidentifikasi semua jenis sampah secara instan. Model visi canggih kami mengklasifikasikan komposisi dan bahan barang.",
  },
  "features.guide.title": {
    en: "Smart Recycling Guide",
    id: "Panduan Daur Ulang Cerdas",
  },
  "features.guide.desc": {
    en: "Get detailed sorting instructions tailored to your regional regulations, including bin color coding and washing recommendations.",
    id: "Dapatkan petunjuk pemilahan mendetail yang disesuaikan dengan peraturan daerah Anda, termasuk pengodean warna tempat sampah dan rekomendasi pencucian.",
  },
  "features.impact.title": {
    en: "Environmental Impact",
    id: "Dampak Lingkungan",
  },
  "features.impact.desc": {
    en: "Visualize your ecological footprint savings, carbon reduction, and track landfill-bound waste offset in real-time.",
    id: "Visualisasikan penghematan jejak ekologis Anda, pengurangan karbon, dan lacak pengurangan sampah yang mengarah ke TPA secara real-time.",
  },
  "features.responsible.title": {
    en: "Responsible AI",
    id: "AI yang Bertanggung Jawab",
  },
  "features.responsible.desc": {
    en: "Built with transparency. Every prediction shows confidence scores, model explanation, and includes human-in-the-loop checks.",
    id: "Dibangun dengan transparansi. Setiap prediksi menunjukkan skor keyakinan, penjelasan model, dan menyertakan pemeriksaan verifikasi manusia.",
  },

  // Footer
  "footer.builtFor": {
    en: "Built for",
    id: "Dibuat untuk",
  },
  "footer.allRights": {
    en: "All rights reserved.",
    id: "Hak cipta dilindungi undang-undang.",
  },

  // Scan
  "scan.title": {
    en: "Waste Scanner",
    id: "Pemindai Sampah",
  },
  "scan.subtitle": {
    en: "Upload an image of waste and let AI analyze it.",
    id: "Unggah gambar sampah dan biarkan AI menganalisisnya.",
  },
  "scan.clickOrDrag": {
    en: "Click or drag image to upload",
    id: "Klik atau seret gambar ke sini untuk mengunggah",
  },
  "scan.supportedFormats": {
    en: "Supported formats: JPEG, JPG, PNG",
    id: "Format yang didukung: JPEG, JPG, PNG",
  },
  "scan.replaceImage": {
    en: "Replace Image",
    id: "Ganti Gambar",
  },
  "scan.remove": {
    en: "Remove",
    id: "Hapus",
  },
  "scan.analyze": {
    en: "Analyze Waste",
    id: "Analisis Sampah",
  },
  "scan.errorTitle": {
    en: "Analysis failed.",
    id: "Analisis gagal.",
  },
  "scan.errorDefault": {
    en: "An unexpected error occurred.",
    id: "Terjadi kesalahan yang tidak terduga.",
  },

  // Loading
  "loading.analyzing": {
    en: "Analyzing image...",
    id: "Menganalisis gambar...",
  },
  "loading.detecting": {
    en: "Detecting object...",
    id: "Mendeteksi objek...",
  },
  "loading.calculating": {
    en: "Calculating environmental impact...",
    id: "Menghitung dampak lingkungan...",
  },
  "loading.preparing": {
    en: "Preparing recommendation...",
    id: "Menyiapkan rekomendasi...",
  },

  // Result
  "result.title": {
    en: "Analysis Result",
    id: "Hasil Analisis",
  },
  "result.subtitle": {
    en: "Here is what our AI detected.",
    id: "Berikut adalah hasil deteksi AI kami.",
  },
  "result.scanAnother": {
    en: "Scan Another Item",
    id: "Pindai Item Lain",
  },
  "result.notRecognizedTitle": {
    en: "Waste Type Not Recognized",
    id: "Jenis Sampah Tidak Dikenal",
  },
  "result.notRecognizedDesc": {
    en: "The AI could not confidently identify this item. Try scanning again with a clearer image.",
    id: "AI tidak dapat mengidentifikasi item ini dengan yakin. Coba pindai lagi dengan gambar yang lebih jelas.",
  },
  "result.tryAgain": {
    en: "Try Again",
    id: "Coba Lagi",
  },
  "result.photoNotSaved": {
    en: "Photo is not saved in history to conserve storage limits.",
    id: "Foto tidak disimpan dalam riwayat untuk menghemat kapasitas penyimpanan.",
  },

  // Recommendation Card
  "card.rec.title": {
    en: "Actionable Recommendations",
    id: "Rekomendasi Tindakan",
  },

  // Impact Card
  "card.impact.title": {
    en: "Waste Properties",
    id: "Properti Sampah",
  },
  "card.impact.recyclable": {
    en: "Recyclable",
    id: "Dapat Didaur Ulang",
  },
  "card.impact.yes": {
    en: "Yes",
    id: "Ya",
  },
  "card.impact.no": {
    en: "No",
    id: "Tidak",
  },
  "card.impact.bin": {
    en: "Designated Bin",
    id: "Tempat Sampah",
  },
  "card.impact.decomp": {
    en: "Estimated Decomposition Time",
    id: "Estimasi Waktu Terurai",
  },

  // Responsible AI Card
  "card.responsible.title": {
    en: "Responsible AI Notice",
    id: "Pemberitahuan AI yang Bertanggung Jawab",
  },
  "card.responsible.warning": {
    en: "Warning: The AI confidence is below 80%. Please verify this classification manually before sorting.",
    id: "Peringatan: Tingkat keyakinan AI di bawah 80%. Harap verifikasi klasifikasi ini secara manual sebelum memilah.",
  },
  "card.responsible.aiNote": {
    en: "AI Note: ",
    id: "Catatan AI: ",
  },
  "card.responsible.disclaimer": {
    en: "EcoVision AI uses advanced vision models for educational purposes. AI classifications may occasionally be incorrect due to lighting, angles, or obscured materials.",
    id: "EcoVision AI menggunakan model visi canggih untuk tujuan edukasi. Klasifikasi AI terkadang bisa salah karena pencahayaan, sudut pengambilan gambar, atau bahan yang tertutup.",
  },

  // Learn More Card
  "card.learn.title": {
    en: "Learn More",
    id: "Pelajari Lebih Lanjut",
  },
  "card.learn.about": {
    en: "About this material",
    id: "Tentang bahan ini",
  },
  "card.learn.why": {
    en: "Why recycle it?",
    id: "Mengapa mendaur ulangnya?",
  },

  // Common
  "common.confidenceScore": {
    en: "Confidence Score",
    id: "Skor Keyakinan",
  },

  // Auth & Dashboard Sprint 3 Keys
  "nav.dashboard": {
    en: "Dashboard",
    id: "Dasbor",
  },
  "nav.login": {
    en: "Sign In",
    id: "Masuk",
  },
  "nav.logout": {
    en: "Log Out",
    id: "Keluar",
  },
  "auth.loginTitle": {
    en: "Sign in to EcoVision AI",
    id: "Masuk ke EcoVision AI",
  },
  "auth.loginSubtitle": {
    en: "Track your environmental impact and scan history",
    id: "Lacak dampak lingkungan dan riwayat pemindaian Anda",
  },
  "auth.emailLabel": {
    en: "Email Address",
    id: "Alamat Email",
  },
  "auth.passwordLabel": {
    en: "Password",
    id: "Kata Sandi",
  },
  "auth.nameLabel": {
    en: "Full Name",
    id: "Nama Lengkap",
  },
  "auth.noAccount": {
    en: "Don't have an account? Sign Up",
    id: "Belum punya akun? Daftar",
  },
  "auth.haveAccount": {
    en: "Already have an account? Sign In",
    id: "Sudah punya akun? Masuk",
  },
  "auth.registerTitle": {
    en: "Create an Account",
    id: "Daftar Akun Baru",
  },
  "auth.invalidCredentials": {
    en: "Invalid email or password.",
    id: "Email atau kata sandi salah.",
  },
  "auth.emailExists": {
    en: "Email is already registered.",
    id: "Email sudah terdaftar.",
  },
  "dashboard.title": {
    en: "Environmental Dashboard",
    id: "Dasbor Lingkungan",
  },
  "dashboard.subtitle": {
    en: "Welcome back! Here is your custom ecological footprint savings.",
    id: "Selamat datang kembali! Berikut data jejak penyelamatan lingkungan Anda.",
  },
  "dashboard.totalScanned": {
    en: "Total Scanned",
    id: "Total Pemindaian",
  },
  "dashboard.recyclingRate": {
    en: "Recycling Rate",
    id: "Tingkat Daur Ulang",
  },
  "dashboard.co2Savings": {
    en: "CO2 Footprint Saved",
    id: "Footprint CO2 Diselamatkan",
  },
  "dashboard.historyTitle": {
    en: "Recent Scan History",
    id: "Riwayat Pemindaian Terbaru",
  },
  "dashboard.noHistory": {
    en: "No scan history recorded. Start scanning to track your impact!",
    id: "Belum ada riwayat pemindaian. Mulai memindai untuk melacak dampak Anda!",
  },
  "dashboard.viewDetails": {
    en: "View Details",
    id: "Lihat Detail",
  },
  "dashboard.breakdownTitle": {
    en: "Material Categories Breakdown",
    id: "Rincian Kategori Material",
  },
  "hero.cta": {
    en: "Start Scanning",
    id: "Mulai Memindai",
  },
  "dashboard.scanHistory": {
    en: "Scan History",
    id: "Riwayat Pindai",
  },
  "dashboard.chatHistory": {
    en: "Chat History",
    id: "Riwayat Obrolan",
  },
  "dashboard.noChatHistory": {
    en: "No chat history recorded. Start talking to our AI Assistant!",
    id: "Belum ada riwayat obrolan. Mulai mengobrol dengan Asisten AI!",
  },
  "dashboard.continueChat": {
    en: "Continue Conversation",
    id: "Lanjutkan Percakapan",
  },
  // Sprint 4 AI Assistant Keys
  "nav.assistant": {
    en: "AI Assistant",
    id: "Asisten AI",
  },
  "nav.testing": {
    en: "Model Testing",
    id: "Pengujian Model",
  },
  "testing.title": {
    en: "AI Model Dataset Testing",
    id: "Pengujian Dataset Model AI",
  },
  "testing.subtitle": {
    en: "Upload a batch of images with target labels to run accuracy validation checks on the model.",
    id: "Unggah sekumpulan gambar dengan label target untuk menjalankan validasi akurasi model.",
  },
  "testing.selectFiles": {
    en: "Select Image Dataset",
    id: "Pilih Dataset Gambar",
  },
  "testing.runBtn": {
    en: "Run Model Validation",
    id: "Jalankan Validasi Model",
  },
  "testing.clearBtn": {
    en: "Clear All",
    id: "Hapus Semua",
  },
  "testing.accuracy": {
    en: "Validation Accuracy",
    id: "Akurasi Validasi",
  },
  "testing.avgConfidence": {
    en: "Average Confidence",
    id: "Rata-rata Keyakinan",
  },
  "testing.successCount": {
    en: "Success Count",
    id: "Jumlah Sesuai",
  },
  "testing.filename": {
    en: "Filename",
    id: "Nama File",
  },
  "testing.targetLabel": {
    en: "Target Label",
    id: "Label Target",
  },
  "testing.predLabel": {
    en: "Predicted",
    id: "Hasil Prediksi",
  },
  "testing.match": {
    en: "Match",
    id: "Sesuai",
  },
  "testing.mismatch": {
    en: "Mismatch",
    id: "Tidak Sesuai",
  },
  "assistant.title": {
    en: "AI Eco-Assistant",
    id: "Asisten Eco-AI",
  },
  "assistant.subtitle": {
    en: "Learn how to sort waste, reduce CO2, and adopt sustainable habits.",
    id: "Pelajari cara memilah sampah, mengurangi CO2, dan menerapkan kebiasaan ramah lingkungan.",
  },
  "assistant.placeholder": {
    en: "Ask me how to recycle something...",
    id: "Tanyakan cara mendaur ulang sesuatu...",
  },
  "assistant.uploadPhoto": {
    en: "Attach Photo of Waste",
    id: "Lampirkan Foto Sampah",
  },
  "assistant.removePhoto": {
    en: "Remove photo",
    id: "Hapus foto",
  },
  "assistant.disclaimerTitle": {
    en: "Responsible AI Boundary",
    id: "Batasan AI yang Bertanggung Jawab",
  },
  "assistant.disclaimerText": {
    en: "This assistant is trained exclusively on waste management, recycling, and sustainability. Answers are for educational use. Please verify with local municipal rules.",
    id: "Asisten ini dilatih khusus untuk topik pengelolaan sampah, daur ulang, dan keberlanjutan. Jawaban bersifat edukatif. Harap verifikasi dengan peraturan daerah setempat.",
  },
  "assistant.suggested.title": {
    en: "Suggested Questions",
    id: "Pertanyaan yang Disarankan",
  },
  "assistant.suggested.q1": {
    en: "How do I recycle PET bottles?",
    id: "Bagaimana cara daur ulang botol PET?",
  },
  "assistant.suggested.q2": {
    en: "How long does paper decompose?",
    id: "Berapa lama kertas terurai?",
  },
  "assistant.suggested.q3": {
    en: "What is carbon footprint?",
    id: "Apa itu jejak karbon?",
  },
  "assistant.clearChat": {
    en: "Clear Conversation",
    id: "Bersihkan Percakapan",
  },
  "assistant.error": {
    en: "Unable to reach assistant. Please try again.",
    id: "Gagal terhubung dengan asisten. Silakan coba lagi.",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang === "en" || savedLang === "id") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const entry = dictionary[key];
    if (!entry) return key;
    return entry[language] || entry["en"] || key;
  };

  // Prevent flash of untranslated content
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
