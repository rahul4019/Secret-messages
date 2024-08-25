import type { Metadata } from "next";
import './globals.css';
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Secret Messages",
    description: "Secretly yours.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={inter.className}>
                    <ThemeProvider attribute="class" defaultTheme="system">
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </AuthProvider>
        </html>
    );
}
