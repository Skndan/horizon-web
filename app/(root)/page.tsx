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
import { useAuth } from "@/context/auth-provider";

const AuthenticationPage = () => {
  const { loading } = useAuth();

  return (
    <>
      {/* {loading ? (
        <div className="grid h-screen place-items-center">
          <Loader className="animate-spin h-5 w-5 mr-3" />
        </div>
      ) : 
      <p></p>
      } */}
      <div className="relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative min-h-screen hidden flex-col bg-muted p-10 dark:border-r lg:flex">
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
        <div>
          <div className="container sm:mx-auto grid w-full grid-col-1 justify-center space-y-6 sm:w-[350px] ">
            <div className="flex justify-center align-middle p-8 lg:hidden">
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
            <Tabs defaultValue="account">
              <TabsList className="grid grid-cols-2 w-[350px]" >
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
