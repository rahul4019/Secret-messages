'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
    // <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //   <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    //     <div className="text-center">
    //       <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
    //         Join True Feedback
    //       </h1>
    //       <p className="mb-4">Sign up to start your anonymous adventure</p>
    //     </div>
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //         {/* username */}
    //         <FormField
    //           name="username"
    //           control={form.control}
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Username</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="username" {...field} onChange={(e) => {
    //                   field.onChange(e);
    //                   debounced(e.target.value);
    //                 }} />
    //               </FormControl>
    //               {isCheckingUsername && <Loader2 className="animate-spin" />}
    //               <p className={`text-sm ${usernameMsg === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>{usernameMsg}</p>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         {/* email */}
    //         <FormField
    //           name="email"
    //           control={form.control}
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Email</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="email" {...field} />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         {/* password */}
    //         <FormField
    //           name="password"
    //           control={form.control}
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Password</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="password" {...field} type="password" />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         <Button type="submit" className='w-full' disabled={isSubmitting}>
    //           {isSubmitting ? (
    //             <>
    //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    //               Please wait
    //             </>
    //           ) : (
    //             'Sign Up'
    //           )}
    //         </Button>
    //       </form>
    //     </Form>
    //     <div className="text-center mt-4">
    //       <p>
    //         Already a member?{' '}
    //         <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
    //           Sign in
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </div>

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
            </form>

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
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMsg === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>{usernameMsg}</p>
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
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
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