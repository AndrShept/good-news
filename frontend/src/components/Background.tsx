import React, { ReactNode } from 'react';

interface BackgroundProps {
  children?: ReactNode;
  imageUrl: string;
}

export const Background = ({ children, imageUrl }: BackgroundProps) => {
  return (
    <section
      style={{ backgroundImage: `url(${imageUrl})` }}
      className={'h-screen bg-center bg-cover '}
    >
      <div className="size-full flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900/30 to-black">
        {children}
      </div>
    </section>
  );
};
