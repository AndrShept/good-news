import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export const PremIcon = ({ classname }: { classname?: string }) => {
  return (
    <>
      <img
        className={cn(classname)}
        src={'/sprites/icons/prem.png'}
        alt="gold-image"
      />
    </>
  );
};
