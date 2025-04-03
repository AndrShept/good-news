import { LogOut } from '@/api/auth-api';
import { useAuth } from '@/api/hooks/useAuth';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useQueryClient } from '@tanstack/react-query';
import { MenuIcon } from 'lucide-react';

import { NavBar } from './NavBar';
import { UserAvatar } from './UserAvatar';
import { Button } from './ui/button';
import { Link } from '@tanstack/react-router';

export const Header = () => {
  const user = useAuth();
  console.log(user)
  const queryClient = useQueryClient();
  return (
    <header className="bg-background/50 sticky top-0 z-50 flex h-14  border-b p-3 backdrop-blur-sm">
      <div className=' flex max-w-7xl w-full mx-auto items-center justify-between'>
        <Link to={'/'}>🎇</Link>

        <section className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2">
              <div>
                <UserAvatar url={user?.image} />
                <p className="text-muted-foreground text-sm">{user?.username}</p>
              </div>

              <Button
                variant={'ghost'}
                onClick={async () => {
                  await LogOut();
                  queryClient.removeQueries();
                }}
              >
                Log out
              </Button>
            </div>
          )}
          {!user && <Link to={'/auth/sign-in'}>login</Link>}
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
              <div className="flex flex-col gap-2 overflow-y-auto p-2 pr-0">
                <NavBar />
              </div>
            </SheetContent>
          </Sheet>
        </section>
      </div>
    </header>
  );
};
