import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

import type { Metadata } from "next";

import { Urbanist } from "next/font/google";
import ProgressBarProvider from "@/providers/progress-bar-provider";
import { AuthProvider } from "@/context/auth-provider";
import { Suspense } from "react";
import { Loader } from "lucide-react";

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

  const Loading = () => (
    <div className="grid h-screen place-items-center">
      <Loader className="animate-spin h-5 w-5 mr-3" />
    </div>
  )

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={urbanist.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ProgressBarProvider>
              <ToastProvider />
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </ProgressBarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
