'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LockIcon, UserIcon } from 'lucide-react';
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Page = () => {
    const { toast } = useToast();
    const router = useRouter();

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        });

        console.log('Next Auth Response: ', result);

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login Failed',
                    description: "Incorrect username or password",
                    variant: 'destructive'
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive'
                });
            }
        }

        if (result?.url) {
            router.replace('/dashboard');
        }
    };


    // return (
    //     <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //         <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    //             <div className="text-center">
    //                 <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
    //                     Join True Feedback
    //                 </h1>
    //                 <p className="mb-4">Sign in to start your anonymous adventure</p>
    //             </div>
    //             <Form {...form}>
    //                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //                     {/* email */}
    //                     <FormField
    //                         name="identifier"
    //                         control={form.control}
    //                         render={({ field }) => (
    //                             <FormItem>
    //                                 <FormLabel>Email/Username</FormLabel>
    //                                 <FormControl>
    //                                     <Input placeholder="email/username" {...field} />
    //                                 </FormControl>
    //                                 <FormMessage />
    //                             </FormItem>
    //                         )}
    //                     />
    //                     {/* password */}
    //                     <FormField
    //                         name="password"
    //                         control={form.control}
    //                         render={({ field }) => (
    //                             <FormItem>
    //                                 <FormLabel>Password</FormLabel>
    //                                 <FormControl>
    //                                     <Input placeholder="password" {...field} type="password" />
    //                                 </FormControl>
    //                                 <FormMessage />
    //                             </FormItem>
    //                         )}
    //                     />
    //                     <Button type="submit" className='w-full'>
    //                         Signin
    //                     </Button>
    //                 </form>
    //             </Form>
    //             <div className="text-center mt-4">
    //                 <p>
    //                     Already a member?{' '}
    //                     <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
    //                         Sign in
    //                     </Link>
    //                 </p>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="flex h-screen items-center justify-center bg-background px-2">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                        </form>

                        {/* email/username */}
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username" {...field} />
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
                            Sign In
                        </Button>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/sign-up" className="underline" prefetch={false}>
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Page;