'use client';

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const Page = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        });


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

        setIsLoading(false);

        if (result?.url) {
            router.replace('/dashboard');
        }
    };

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
                                            <div className="flex gap-1">
                                                <Input placeholder="password" {...field} type={showPassword ? 'text' : 'password'} />
                                                <Button variant="outline" size="icon" type="button" onClick={() => setShowPassword(!showPassword)}>

                                                    {
                                                        showPassword ?
                                                            <Eye className="h-4 w-4" /> :
                                                            <EyeOff className="h-4 w-4" />
                                                    }

                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin mr-2" strokeWidth={3} size={16} />}
                                Sign In
                            </Button>

                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col w-full">
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