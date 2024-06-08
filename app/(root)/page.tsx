"use client";

import Link from "next/link";
import Login from "@/components/login";
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Register from "@/components/login/register";

const AuthenticationPage = () => {
  return (
    <>
      <div className="relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative md: min-h-screen  hidden flex-col bg-muted p-10 dark:border-r lg:flex">
          <div className="absolute inset-0" />
          <div className="relative z-20 flex items-center ">
            <Image
              src="/horizon-light.svg"
              className="hidden dark:block"
              width="150"
              height="56"
              alt="Logo"
            />
            <Image
              src="/horizon-dark.svg"
              className="block dark:hidden"
              width="150"
              height="56"
              alt="Logo"
            />
          </div>
          <div className="relative z-20 mt-auto">
            <h1 className="text-4xl font-semibold tracking-tight">
              Give your business everything it need to grow.
            </h1>
            <p className="mt-4 text-lg">
              Manage your business at one place
            </p>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">Copyright &copy; skndan 2023</p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
            </div>
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Sign In</TabsTrigger>
                <TabsTrigger value="password">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Login />
              </TabsContent>
              <TabsContent value="password">
                <Register />
              </TabsContent>
            </Tabs>
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
