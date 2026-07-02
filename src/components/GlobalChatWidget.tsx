"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { getClientApiKey } from "@/lib/apiKey";
import {
  isLocalStorageMode,
  getChatMessages,
  saveChatMessage as localSaveChatMessage,
} from "@/lib/clientStorage";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export default function GlobalChatWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen to custom event to open chat from anywhere
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      setIsOpen(true);
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.sessionId) {
        setCurrentSessionId(customEvent.detail.sessionId);
        loadSessionHistory(customEvent.detail.sessionId);
      }
    };

    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  // Also check URL on mount in case user came from a direct link like /?session=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionParam = params.get("session");
    if (sessionParam) {
      setIsOpen(true);
      setCurrentSessionId(sessionParam);
      loadSessionHistory(sessionParam);
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("session");
      window.history.replaceState({}, "", url.toString());
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

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
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isOpen ? "rotate-90 opacity-0 pointer-events-none scale-0" : "rotate-0 opacity-100 scale-100"
        }`}
        aria-label="Open AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </button>

      {/* Chat Window Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-zinc-200/50 bg-white shadow-2xl transition-all duration-500 origin-bottom-right dark:border-zinc-800/50 dark:bg-zinc-950 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ height: "min(600px, calc(100vh - 8rem))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            <span className="font-bold">{t("assistant.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={handleClearChat} className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer" title={t("assistant.clearChat")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-2">
              <h2 className="mt-2 text-lg font-bold text-zinc-800 dark:text-zinc-200">
                EcoVision AI
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                {t("assistant.subtitle")}
              </p>
              
              <div className="w-full space-y-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left rounded-xl border border-zinc-200/60 bg-white p-3 text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:bg-emerald-50/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:bg-emerald-950/20 transition-all cursor-pointer shadow-sm"
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
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white"
                          : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded waste"
                          className="mb-2 max-h-32 rounded-xl object-cover border border-zinc-200/30 dark:border-zinc-800/30"
                        />
                      )}
                      <div className="space-y-1">{parseMarkdown(msg.content)}</div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
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
                  <div className="rounded-xl border border-red-200/50 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-400">
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
          <div className="flex border-t border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="relative">
              <img
                src={attachedImage}
                alt="Attached preview"
                className="h-12 w-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <button
                type="button"
                onClick={() => {
                  setAttachedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white hover:bg-red-600 shadow cursor-pointer"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input, attachedImage);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
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
              className="flex-grow rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={(!input.trim() && !attachedImage) || isLoading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
