"use client";

import ThemeModeToggle from "@/components/common/theme-mode-toggle";
import "../globals.css";
import Image from "next/image";
import { UserNav } from "@/components/dashboard/user-nav";
import { MainNav } from "@/components/navigation/top-menu";
import MobileNav from "@/components/navigation/top-menu-mobile";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (

    <div className="h-full relative">
      <main>
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <MobileNav />
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
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ThemeModeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
