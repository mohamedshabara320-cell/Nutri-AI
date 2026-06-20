import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import BottomNav from "@/components/Layout/BottomNav";

export const metadata: Metadata = {
  title: "Nutri AI — Smart Nutrition Tracker",
  description: "AI-powered nutrition tracking, lean bulk calculator, and macro coaching.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="mx-auto max-w-2xl pb-24">{children}</div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
