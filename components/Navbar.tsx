'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="#" className="flex items-center gap-2" prefetch={false}>
                    <span className="text-lg font-bold">Secret messages</span>
                </Link>
                {session ?
                    <nav className="gap-4 md:flex">
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto' onClick={() => signOut()}>
                                <LogOut size={12} className='mr-2' strokeWidth={3} /> Log Out
                            </Button>
                        </Link>
                    </nav> :
                    <nav className="gap-4 flex">
                        <Link href='/sign-in' className='flex'>
                            <Button className='w-full md:w-auto'>
                                <LogIn size={12} className='mr-2' strokeWidth={3} /> Log In
                            </Button>
                        </Link>
                    </nav>
                }

            </div>
        </header>
    );
};

export default Navbar;