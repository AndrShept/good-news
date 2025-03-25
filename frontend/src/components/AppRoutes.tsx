import App from '@/App';
import { getUserQueryOptions } from '@/api/auth-api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { NotFound } from './NotFound';
import { Spinner } from './Spinner';
import { AuthLayout } from './layout/AuthLayout';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { PostPage } from './pages/PostPage';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { TopPage } from './pages/TopPage';

export const AppRoutes = () => {
  const { data: user, isLoading } = useQuery(getUserQueryOptions());
  console.log(user);
  if (isLoading)
    return (
      <div className="flex h-screen">
        <Spinner />
      </div>
    );
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="top" element={<TopPage />} />
        <Route path="/:postId" element={<PostPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="sign-in" replace />} />
        <Route path="sign-in" element={user ? <Navigate to="/" replace /> : <SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
