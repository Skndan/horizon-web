"use client";

import ThemeModeToggle from "@/components/common/theme-mode-toggle";
import Login from "@/components/login";
import Password from "@/components/login/password";
import { useAuth } from "@/context/auth-provider";
import apiClient from "@/lib/api/api-client";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



const PasswordResetPage = ({ params }: { params: { token: string } }) => {

  const [data, setData] = useState<String>('');
  const [enabled, setEnabled] = useState(false);

  const [isLoading, setLoading] = useState(true)
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      
      if (params.token != '') {
        await apiClient.get(`/auth/validate-token/${params.token}`).then((data) => {
          setData(data.data.userID)
          setEnabled(true);
          setLoading(false)
        }).catch(error => {
          // Handle errors
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 400) {

              // Inform the user about the bad request
              toast.error('Your token is invalid');
              router.push("../../");
            } else {
              // For other errors, log the error message

            }
          } else {
            // The request was made but no response was received

          }
        })

      } else {
        toast.error("Invalid token")
      }
      setLoading(false);
    })()
  }, [params.token])

  return (
    <>
      <div className="h-full relative">
        <main>
          <header className="sticky top-0 z-40 border-b bg-background">
            <div className="flex h-16 items-center px-4">
              <Image
                src="/horizon-light.svg"
                className="hidden dark:block pl-3"
                width="136"
                height="56"
                alt="Logo"
              />
              <Image
                src="/horizon-dark.svg"
                className="block dark:hidden pl-3"
                width="136"
                height="56"
                alt="Logo"
              />
              <div className="ml-auto flex items-center space-x-4">
                <ThemeModeToggle />
              </div>
            </div>
          </header>
          <div className="flex flex-row justify-center p-16"> 
            {isLoading ?
              <Loader className="animate-spin h-5 w-5 mr-3" /> :
              <Password enabled={enabled} userId={data}/>
            }
          </div>
        </main>
      </div>

    </>)
}

export default PasswordResetPage;