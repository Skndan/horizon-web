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
import apiClient from '@/lib/api/api-client';

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


  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true); 

      await apiClient
          .post("/auth/authenticate", data)
          .then((res) => res.data)
          .then((data) => {
            console.log(data);
            toast.success("Yay"); 
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