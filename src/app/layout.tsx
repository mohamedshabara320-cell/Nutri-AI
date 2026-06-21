import type { Metadata, Viewport } from "next";
import "./globals.css";

import AppProviders from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Nutri AI — Smart Nutrition Tracker",
  description: "AI-powered nutrition tracking and coaching app.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}