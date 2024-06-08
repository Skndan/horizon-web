"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import toast from 'react-hot-toast';
import * as z from "zod";
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { useUserStore } from '@/store/use-user-store';
import { useAuth } from '@/context/auth-provider';
import { Eye, Loader } from 'lucide-react';
import apiClient from '@/lib/api/api-client';

const formSchema = z.object({ 
  password: z.string().min(6),
}); 

interface EmployeeFormProps {
  enabled: boolean;
  userId: String;
};

type LoginFormValues = z.infer<typeof formSchema>; 
 
  export const Password: React.FC<EmployeeFormProps> = ({
    enabled,
    userId
  }) => {

  const router = useRouter();

  // const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);

  const title = 'Reset Password';
  const description = 'Enter your updated password';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
  });
 

  const { signIn } = useAuth();

  const { set } = useUserStore();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true); 

      var dd = {
        "userID": userId,
        "refreshToken": data.password.trim()
      }; 
      await apiClient
        .post("/auth/reset-password", dd)
        .then((res) => res.data)
        .then(async (data) => { 
          router.push("../../");
        }).catch(error => {
          // Handle errors
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 400) {

              // Inform the user about the bad request
              toast.error('Your token is invalid');
            } else {
              // For other errors, log the error message

            }
          } else {
            // The request was made but no response was received

          }
        });
      setLoading(false);
    } catch (error: any) {
      toast.error("Something went wrong.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

   

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent> 
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4"> 
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password <span className='text-red-500'>*</span></FormLabel>
                        <FormControl className="relative">
                          <div className="relative">
                            <Button size={"icon"} variant={"ghost"} className='absolute right-0' onClick={(e) => {
                              e.preventDefault();
                              setEye(!eye);
                            }}>
                              {eye ? <EyeClosedIcon className="top-2.5 h-4 w-4 text-muted-foreground" /> : <Eye className="top-2.5 h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <Input
                              disabled={loading}
                              type={eye ? 'text' : 'password'}
                              placeholder="Password"
                              className="pr-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> 
              </div>
              <Button disabled={!enabled || loading} type="submit" className="w-full mt-4">
                {loading &&
                  <Loader className="animate-spin h-5 w-5 mr-3" />}
                Reset Password
              </Button>
            </form>
          </Form> 
      </CardContent>
    </Card>
  );
};

export default Password;