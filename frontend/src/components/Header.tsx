import { LogOut, getUserQueryOptions } from '@/api/api';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MenuIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

import { NavBar } from './NavBar';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const user = useAuth()
  console.log(user);
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b p-4">
      <Link to={'/'}>🎇</Link>

      <section>
        <h1>{user?.username}</h1>
        {user && (
          <Button
            onClick={async () => {
              await LogOut();
            }}
          >
            Log out
          </Button>
        )}
        {!user && <Link to={'/auth/sign-in'}>login</Link>}
        <nav className="hidden gap-2 md:flex">
          <NavBar />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="hover:text-primary md:hidden" size={'icon'} variant={'outline'}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-70">
            <SheetHeader>
              <SheetTitle>GoodNews ✨</SheetTitle>
              <SheetDescription className="sr-only">Navigation</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-2 p-4">
              <NavBar />
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </header>
  );
};
