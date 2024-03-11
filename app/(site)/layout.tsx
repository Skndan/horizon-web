"use client";

import ThemeModeToggle from "@/components/common/theme-mode-toggle";
import "../globals.css";
import Image from "next/image";
import { UserNav } from "@/components/dashboard/user-nav";
import { MainNav } from "@/components/navigation/top-menu";
 
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <main>
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <Image
              src="/logo-white.svg"
              className="hidden dark:block"
              width="100"
              height="56"
              alt="Logo"
            />
            <Image
              src="/logo-black.svg"
              className="block dark:hidden"
              width="100"
              height="56"
              alt="Logo"
            />
            {/* <TeamSwitcher /> */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
              <span className="ml-[20px]">
                <ThemeModeToggle />
              </span>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
