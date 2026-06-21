"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider, useLang } from "@/context/LanguageContext";
import BottomNav from "@/components/Layout/BottomNav";

function InnerProviders({ children }: { children: React.ReactNode }) {
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

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <InnerProviders>{children}</InnerProviders>
    </LanguageProvider>
  );
}