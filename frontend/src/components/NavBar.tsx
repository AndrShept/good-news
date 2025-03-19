import React from 'react';
import { NavLink } from 'react-router';

import { buttonVariants } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export const NavBar = () => {
  const navLinks = [
    { id: 1, name: 'news', url: '/news' },
    { id: 2, name: 'top', url: '/top' },
    { id: 3, name: 'submit', url: '/submit' },
  
  ];
  return (
    <ScrollArea className="h-full pr-2">
      <ul className="text-muted-foreground flex flex-col">
        {navLinks.map((item) => (
          <NavLink
            className={({ isActive }) =>
              buttonVariants({
                variant: isActive ? 'secondary' : 'ghost',
              })
            }
            to={item.url}
          >
            <p className="mr-auto">{item.name}</p>
          </NavLink>
        ))}
      </ul>
    </ScrollArea>
  );
};
