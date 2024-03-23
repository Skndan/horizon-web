import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import ProgressBarProvider from "@/providers/progress-bar-provider";
import SessionProvider from "@/providers/session-provider";
import DesignerContextProvider from "@/context/DesignerContext";

export const metadata: Metadata = {
  title: "Horizon",
  description: "HRMS",
};

const urbanist = Urbanist({ subsets: ["latin"] });

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
        <SessionProvider>
          <ProgressBarProvider>
            <DesignerContextProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ToastProvider />
                {children}
              </ThemeProvider>
            </DesignerContextProvider>
          </ProgressBarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
