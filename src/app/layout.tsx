import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/hooks/useAuth";
import GlobalChatWidget from "@/components/GlobalChatWidget";

export const metadata: Metadata = {
  title: "EcoVision AI - Scan. Sort. Save the Planet.",
  description: "AI-powered waste classification and environmental education platform that helps everyone recycle correctly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <LanguageProvider>
          <AuthProvider>
            {children}
            <GlobalChatWidget />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
