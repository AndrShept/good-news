import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export const GoldIcon = ({ classname }: { classname?: string }) => {
  return (
    <>
      <img
        className={cn(classname)}
        src={'/sprites/icons/gold.png'}
        alt="gold-image"
      />
    </>
  );
};
