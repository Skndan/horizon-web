import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

import type { Metadata } from "next";

import { Urbanist } from "next/font/google";
import ProgressBarProvider from "@/providers/progress-bar-provider";
import { AuthProvider } from "@/context/auth-provider";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horizon",
  description: "HRMS",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={urbanist.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProgressBarProvider>
            <AuthProvider>
              <ToastProvider />
              {children}
            </AuthProvider>
          </ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
