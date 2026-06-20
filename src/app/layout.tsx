import type { Metadata, Viewport } from "next";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider, useLang } from "@/context/LanguageContext";

import BottomNav from "@/components/Layout/BottomNav";

export const metadata: Metadata = {
  title: "Nutri AI",
  description: "AI Nutrition Tracker",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <ThemeProvider>
        <div className="mx-auto max-w-2xl pb-24">{children}</div>
        <BottomNav />
      </ThemeProvider>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white">
        <LanguageProvider>
          <AppLayout>{children}</AppLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}