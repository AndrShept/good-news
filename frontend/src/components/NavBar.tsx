import { Link } from '@tanstack/react-router';
import React from 'react';

import { buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export const NavBar = () => {
  const navLinks = [{ id: 1, name: 'about', url: '/about' }, {
     id: 1, name: 'test', url: '/test' 
  }];
  return (
    <ScrollArea className="h-full pr-2">
      <ul className="text-muted-foreground flex flex-col gap-0.5">
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
    </ScrollArea>
  );
};
