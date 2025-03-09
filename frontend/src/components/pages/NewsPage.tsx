import { useAuth } from '@/hooks/useAuth';
import React from 'react';

export const NewsPage = () => {
  const user = useAuth();
  console.log(user);
  return <div>NewsPage</div>;
};
