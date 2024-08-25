'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string; }>();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast({
                title: 'Success',
                description: response.data.msg
            });

            router.replace('sign-in');
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
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-background px-2">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold">Vefiry Your Account</CardTitle>
                    <CardDescription>Enter the verification code sent to your email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>

                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                                {isLoading && <Loader2 className="animate-spin mr-2" strokeWidth={3} size={16} />}
                                Verify
                            </Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyAccount;