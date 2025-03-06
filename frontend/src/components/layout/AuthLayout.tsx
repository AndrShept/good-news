import React from 'react';
import { Outlet } from 'react-router';

export const AuthLayout = () => {
  return (
    <section className="flex h-screen w-full items-center justify-center">
      <Outlet />
    </section>
  );
};
