"use client";

import { Metadata } from "next";
import React, { useEffect } from "react";
import Link from "next/link";
import Login from "@/components/login";
import Image from "next/image";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthenticationPage = () => {
  // const session = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (session?.status === "authenticated") {
  //     // router.push("/overview");
  //   }
  // }, [session?.status, router]);

  return (
    <>
      <div className="relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative md: min-h-screen  hidden flex-col bg-muted p-10 dark:border-r lg:flex">
          <div className="absolute inset-0" />
          <div className="relative z-20 flex items-center ">
            <Image
              src="/logo-white.svg"
              className="hidden dark:hidden"
              width="100"
              height="56"
              alt="Logo"
            />
            <Image
              src="/logo-black.svg"
              className="block dark:block"
              width="100"
              height="56"
              alt="Logo"
            />
          </div>
          <div className="relative z-20 mt-auto">
            <h1 className="text-4xl font-semibold tracking-tight">
              Give your business everything it need to grow
            </h1>
            <p className="mt-4 text-lg">
              Give it an extra sales channel with ZERO listing costs.
            </p>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">Copyright &copy; Acme Inc 2023</p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
            </div>
            <Login />
            <p className="px-8 text-center text-sm text-muted-foreground pb-6">
              By logging in, you agree to our <br />
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthenticationPage;
