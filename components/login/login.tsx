"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next-nprogress-bar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import toast from 'react-hot-toast';
import * as z from "zod";
import { ChevronRightIcon } from '@radix-ui/react-icons';
import apiClient, { parseJwt } from '@/lib/api/api-client';
import { getSession, signIn } from 'next-auth/react';
import { useUserStore } from '@/store/use-user-store';

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof formSchema>;

const Login = () => {

  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const title = open ? 'Sign In' : 'Forgot Password';
  const description = open ? 'Enter your email and password' : 'Enter your email to get reset email';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
  });

  const { set } = useUserStore();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      // signIn("credentials", {
      //   ...data,
      //   redirect: false,
      // })
      //   .then(async (callback) => {
      //     if (callback?.error) {
      //       toast.error(callback.error);
      //     }

      //     if (callback?.ok) {
      //       // const session = await getSession();
      //       // var userId = tokenService.getUserId(session?.user.jwt);

      //       // await api
      //       //   .get(`/profile/get-by-user/${userId}`)
      //       //   .then((res) => res.data)
      //       //   .then((data) => {
      //       //     set(data);
      //       //   });
      //       // router.push("/overview");
      //       toast.success("Welcome");
      //     }
      //   })
      //   .finally(() => setLoading(false)); 
      localStorage.clear();
      await apiClient
        .post("/auth/authenticate", data)
        .then((res) => res.data)
        .then(async (data) => {
          const { token, refreshToken } = data;

          const { jti } = await parseJwt(token);

          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          await apiClient.get(`/profile/get-by-user/${jti}`)
            .then((res) => res.data)
            .then(async (data) => {

              var profile = {
                userId: jti,
                profileId: data.id,
                orgId: data.organisation.id,
                profilePicture: '',
                username: data.name,
                email: data.email,
                mobile: data.mobile,
              };

              localStorage.setItem('userId', jti);
              localStorage.setItem('profileId', data.id);
              localStorage.setItem('orgId', data.organisation.id);
              localStorage.setItem('username', data.name);
              localStorage.setItem('email', data.email);
              localStorage.setItem('mobile', data.mobile);

              set(profile);

              toast.success("Welcome");
              router.push("/dashboard");
            });


        });
    } catch (error: any) {
      toast.error("Something went wrong.");
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
        {open && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            type='password'
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col items-start">
                  {/* <Button variant="link" className="p-0 h-auto" onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}>
                  Forgot Password?
                </Button> */}
                </div>
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </Form>
        )}
        {!open && (
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-start">
                <Button variant="link" className="p-0 h-auto" onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}>
                  Forgot Password?
                </Button>
              </div>
            </div>
          </form>)}
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button type="submit" className="w-full">Sign In</Button>
      </CardFooter> */}
    </Card>
  );
};

export default Login;