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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
import { Type } from '@/types/profile';

const formSchema = z.object({
  email: z.string().email(),
  mobile: z.string().min(10).max(10),
  type: z.object(
    { id: z.string().min(1) }
  ),
  name: z.string().min(1),
});

type LoginFormValues = z.infer<typeof formSchema>;

const Register = () => {

  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);

  const [data, setData] = useState<Type[]>([]);


  const title = 'Register';
  const description = 'New organisation registration';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    (async () => {

      await apiClient.get(`/company-category/all`).then((data) => {
        setData(data.data.content)
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

      setLoading(false);
    })()
  }, [])

  const { signIn } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      data.email.trim();
      await apiClient
        .post("/organisation", data)
        .then((res) => res.data)
        .then((data) => {
          toast.success("Sign in now, you will receive the login credentials in your inbox");
          router.refresh();
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name <span className='text-red-500'>*</span></FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Organisation Name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className='text-red-500'>*</span></FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Organisation Email"
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
                  name="type.id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder="Select a Organisation Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.map((category) => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile <span className='text-red-500'>*</span></FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type={'number'}
                          placeholder="Organisation Mobile"
                          {...field}
                          onInput={(e) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button disabled={loading} type="submit" className="w-full mt-4">
              {loading &&
                <Loader className="animate-spin h-5 w-5 mr-3" />}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Register;