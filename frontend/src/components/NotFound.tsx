import { HomeIcon } from 'lucide-react';

import { buttonVariants } from './ui/button';
import { Link } from '@tanstack/react-router';

export const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-primary scroll-m-20 border-b pb-2 text-7xl font-semibold tracking-tight">404</h1>
      <h3 className="mb-2 text-2xl font-semibold">Page not found</h3>
      <Link to={'/'} className={buttonVariants({ variant: 'outline' })}>
        <HomeIcon />
        Home
      </Link>
    </div>
  );
};
