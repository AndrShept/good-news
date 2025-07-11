import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LogOut } from '@/features/auth/api/logout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';
import { memo } from 'react';

import { LogOutButton } from './LogOutButton';
import { NavBar } from './NavBar';
import { UserAvatar } from './UserAvatar';
import { LogoIcon } from './game-icons/LogoIcon';
import { Button, buttonVariants } from './ui/button';

const navLinks = [
  {
    id: 2,
    name: 'test',
    url: '/test',
  },
  { id: 4, name: 'post', url: '/post' },
];
export const Header = memo(() => {
  const user = useAuth();

  return (
    <header className="bg-background/50 sticky top-0 z-50 flex h-14 border-b p-3 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div></div>
        <section className="flex items-center gap-2">
          <ul className="text-muted-foreground flex gap-0.5">
            {navLinks.map((item) => (
              <Link
                className={buttonVariants({
                  variant: 'ghost',
                })}
                key={item.id}
                to={item.url}
                activeProps={{
                  className: buttonVariants({
                    variant: 'secondary',
                  }),
                }}
              >
                <p className="mr-auto">{item.name}</p>
              </Link>
            ))}
          </ul>
          {user && (
            <div className="flex items-center gap-2">
              <LogOutButton />
              <div>
                <UserAvatar url={user?.image} />
                <p className="text-muted-foreground text-sm">{user?.username}</p>
              </div>
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
});
