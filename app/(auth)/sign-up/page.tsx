'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";


const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    // checks if username is available 
    const isUsernameAvailable = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMsg('');
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`);

          setUsernameMsg(response.data.msg);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMsg(axiosError.response?.data.msg || 'Error checking username');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    isUsernameAvailable();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast({
        title: 'Success',
        description: response.data.msg
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMsg = axiosError.response?.data.msg;
      toast({
        title: 'Signup failed',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex h-screen items-center justify-center bg-background px-2">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>Sign up to start your anonymous adventure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* username */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }} />
                    </FormControl>

                    {isCheckingUsername && <Loader2 className="animate-spin" size={16} />}
                    <p className={`text-sm font-semibold ${usernameMsg === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>{usernameMsg}</p>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin mr-2" strokeWidth={3} size={16} />}
                Sign Up
              </Button>

            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full">
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-in" className="underline" prefetch={false}>
                Sign In
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;