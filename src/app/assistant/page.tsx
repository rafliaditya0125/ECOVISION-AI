"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";
import { getClientApiKey } from "@/lib/apiKey";
import {
  isLocalStorageMode,
  getChatMessages,
  saveChatMessage as localSaveChatMessage,
} from "@/lib/clientStorage";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export default function AssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history if a session is present in the URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get("session");
    if (sessionParam) {
      setCurrentSessionId(sessionParam);
      loadSessionHistory(sessionParam);
    }
  }, []);

  const loadSessionHistory = async (sessionId: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (isLocalStorageMode()) {
        const localMsgs = getChatMessages(sessionId);
        setMessages(
          localMsgs.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
          }))
        );
      } else {
        const res = await fetch(`/api/chat/sessions?id=${sessionId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(
            data.messages.map((m: { role: "user" | "assistant"; content: string; image?: string }) => ({
              role: m.role,
              content: m.content,
              image: m.image || undefined,
            }))
          );
        } else {
          setErrorMsg("Failed to load conversation history.");
        }
      }
    } catch (err) {
      console.error("Load session history error:", err);
      setErrorMsg("Failed to load conversation history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPEG/PNG).");
      return;
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg("Image size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend: string, imageToSend: string | null = null) => {
    const hasImage = !!imageToSend;
    if (!textToSend.trim() && !hasImage) return;
    if (isLoading) return;

    const finalContent = textToSend.trim() || (language === "id" 
      ? "Identifikasi sampah ini dan jelaskan cara pengelolaannya." 
      : "Identify this waste and explain how to manage it.");

    const userMessage: Message = {
      role: "user",
      content: finalContent,
      image: imageToSend || undefined,
    };

    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": getClientApiKey(),
        },
        body: JSON.stringify({
          messages: newMessages,
          sessionId: currentSessionId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: Message = { role: "assistant", content: data.response };
        setMessages([...newMessages, assistantMsg]);

        if (isLocalStorageMode()) {
          const { sessionId: sid } = localSaveChatMessage(
            currentSessionId,
            "user",
            finalContent,
            imageToSend || undefined
          );
          localSaveChatMessage(sid, "assistant", data.response);
          if (sid !== currentSessionId) {
            setCurrentSessionId(sid);
          }
        } else if (data.sessionId && data.sessionId !== currentSessionId) {
          setCurrentSessionId(data.sessionId);
        }
      } else {
        setErrorMsg(t("assistant.error"));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrorMsg(t("assistant.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorMsg(null);
    setAttachedImage(null);
    setCurrentSessionId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setCameraStream(stream);
      setShowCamera(true);
      setErrorMsg(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMsg(
        language === "id"
          ? "Gagal mengakses kamera. Pastikan izin kamera telah diberikan."
          : "Failed to access camera. Please make sure camera permission is granted."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setAttachedImage(dataUrl);
        setErrorMsg(null);
      }
      stopCamera();
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const suggestedQuestions = [
    t("assistant.suggested.q1"),
    t("assistant.suggested.q2"),
    t("assistant.suggested.q3"),
  ];

  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      const isNumbered = /^\d+\.\s+/.test(line.trim());
      
      let cleanLine = line;
      if (isBullet) cleanLine = line.trim().replace(/^[\*\-]\s+/, "");
      else if (isNumbered) cleanLine = line.trim().replace(/^\d+\.\s+/, "");

      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={partIdx} className="font-bold text-zinc-950 dark:text-zinc-50">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-5 list-disc my-1">
            {parsedLine}
          </li>
        );
      }
      if (isNumbered) {
        const match = line.trim().match(/^(\d+)\.\s+/);
        const num = match ? match[1] : "1";
        return (
          <div key={lineIdx} className="ml-5 my-1 flex gap-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{num}.</span>
            <span className="flex-grow">{parsedLine}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className={line.trim() === "" ? "h-3" : "my-0.5"}>
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900/40">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-stretch">
        <div className="w-full max-w-4xl flex flex-col rounded-3xl border border-zinc-200/50 bg-white shadow-xl dark:border-zinc-800/50 dark:bg-zinc-950 overflow-hidden" style={{ minHeight: "calc(100vh - 12rem)" }}>
          {/* Header Panel */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-blue-600 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <div>
                <h1 className="font-bold text-base sm:text-lg leading-tight">{t("assistant.title")}</h1>
                <p className="text-[10px] sm:text-xs text-white/80">{t("assistant.subtitle")}</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                {t("assistant.clearChat")}
              </button>
            )}
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/30 dark:bg-zinc-900/10 relative flex flex-col min-h-0">
            {showCamera ? (
              <div className="absolute inset-0 z-10 flex flex-col bg-black rounded-b-none">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 px-4">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded-full bg-zinc-900/80 px-6 py-2.5 text-xs font-semibold text-white hover:bg-zinc-850 transition-colors cursor-pointer"
                  >
                    {language === "id" ? "Batal" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all cursor-pointer text-xl"
                  >
                    📸
                  </button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto py-12">
                <div className="text-5xl mb-4">🌱</div>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                  EcoVision AI Assistant
                </h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                  {language === "id" 
                    ? "Tanyakan cara memilah sampah, tips daur ulang, atau kirim foto sampah untuk dianalisis langsung oleh kecerdasan buatan kami."
                    : "Ask about sorting waste, recycling methods, or upload a photo of a waste item for instant AI classification."}
                </p>
                
                <div className="w-full space-y-2.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left rounded-2xl border border-zinc-200/60 bg-white p-4 text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:bg-emerald-50/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:bg-emerald-950/20 transition-all cursor-pointer shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white"
                            : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                        }`}
                      >
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Uploaded waste"
                            className="mb-3 max-h-64 rounded-xl object-cover border border-zinc-200/30 dark:border-zinc-800/30"
                          />
                        )}
                        <div className="space-y-1">{parseMarkdown(msg.content)}</div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="flex justify-center">
                    <div className="rounded-xl border border-red-200/50 bg-red-50/50 px-4 py-2 text-xs font-semibold text-red-600 dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-400">
                      ⚠️ {errorMsg}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="flex border-t border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="relative">
                <img
                  src={attachedImage}
                  alt="Attached preview"
                  className="h-16 w-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAttachedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:bg-red-600 shadow cursor-pointer animate-scale"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input, attachedImage);
              }}
              className="flex items-center gap-3"
            >
              {/* Gallery Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                title={language === "id" ? "Unggah Foto" : "Upload Photo"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                </svg>
              </button>
              {/* Camera Take Photo Button */}
              <button
                type="button"
                onClick={startCamera}
                disabled={isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                title={language === "id" ? "Ambil Foto" : "Take Photo"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("assistant.placeholder")}
                disabled={isLoading}
                className="flex-grow rounded-full border border-zinc-200 bg-zinc-50 px-5 py-3 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={(!input.trim() && !attachedImage) || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
            {/* Disclaimer */}
            <div className="mt-2.5 text-center text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 leading-tight">
              {language === "id"
                ? "EcoVision AI dapat membuat kesalahan. Harap verifikasi informasi penting dengan panduan setempat."
                : "EcoVision AI can make mistakes. Please verify important information with local guidelines."}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
