"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string; // Optional base64 data URL
}

export default function AssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the conversation
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

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg("Image size exceeds the maximum limit of 10MB.");
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

    // Use default text if only an image is sent
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
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
      // Check for bullet point
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      // Check for numbered list
      const isNumbered = /^\d+\.\s+/.test(line.trim());
      
      let cleanLine = line;
      if (isBullet) {
        cleanLine = line.trim().replace(/^[\*\-]\s+/, "");
      } else if (isNumbered) {
        cleanLine = line.trim().replace(/^\d+\.\s+/, "");
      }

      // Parse bold **text**
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

      // Render standard paragraph (handling empty line spacing)
      return (
        <p key={lineIdx} className={line.trim() === "" ? "h-3" : "my-0.5"}>
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow pt-8 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-emerald-400 dark:to-blue-400 sm:text-4xl">
              {t("assistant.title")}
            </h1>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              {t("assistant.subtitle")}
            </p>
          </div>

          {/* Responsible AI Disclaimer Banner */}
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200/50 bg-amber-50/50 p-4 text-xs text-amber-800 backdrop-blur-sm dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">{t("assistant.disclaimerTitle")}</p>
              <p className="mt-1 leading-relaxed text-amber-700/90 dark:text-amber-400/90">
                {t("assistant.disclaimerText")}
              </p>
            </div>
          </div>

          {/* Chat Container */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/50 bg-white/75 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
            
            {/* Clear Chat Button (Header) */}
            {messages.length > 0 && (
              <div className="flex justify-end border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
                <button
                  onClick={handleClearChat}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  {t("assistant.clearChat")}
                </button>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex h-[450px] flex-col overflow-y-auto p-4 sm:p-6">
              
              {messages.length === 0 ? (
                /* Empty Chat - Welcome View */
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-8 w-8 animate-pulse"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-zinc-800 dark:text-zinc-200">
                    {t("assistant.title")}
                  </h2>
                  <p className="mt-2 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                    {t("assistant.subtitle")}
                  </p>

                  {/* Suggestion Cards */}
                  <div className="mt-8 w-full max-w-2xl">
                    <p className="text-left text-xs font-bold text-zinc-400 tracking-wider uppercase mb-3 px-1">
                      💡 {t("assistant.suggested.title")}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="flex flex-col rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-4 text-left text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:bg-emerald-50/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:bg-emerald-950/10 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-95"
                        >
                          <span className="line-clamp-3">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Conversation Bubbles */
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={index}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm transition-all duration-300 ${
                            isUser
                              ? "bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-medium"
                              : "border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="Uploaded waste"
                              className="mb-2 max-h-48 rounded-xl object-cover border border-zinc-200/30 dark:border-zinc-800/30"
                            />
                          )}
                          <div className="space-y-1">{parseMarkdown(msg.content)}</div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Notification */}
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
              <div className="flex border-t border-zinc-100 bg-zinc-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/10">
                <div className="relative group">
                  <img
                    src={attachedImage}
                    alt="Attached waste preview"
                    className="h-16 w-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:bg-red-600 shadow transition-colors cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input, attachedImage);
                }}
                className="flex items-center gap-3"
              >
                {/* Photo Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  title={t("assistant.uploadPhoto")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-all cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
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
                  className="flex-grow rounded-full border border-zinc-200 bg-white px-5 py-3 text-xs text-zinc-800 placeholder-zinc-400 shadow-inner focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-emerald-400"
                />
                
                <button
                  type="submit"
                  disabled={(!input.trim() && !attachedImage) || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all duration-300 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
