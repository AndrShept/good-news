import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundery.tsx';
import { NotFound } from './components/NotFound.tsx';
import { AuthLayout } from './components/layout/AuthLayout.tsx';
import { AboutPage } from './components/pages/AboutPage.tsx';
import { NewsPage } from './components/pages/NewsPage.tsx';
import { SignIn } from './components/pages/SignIn.tsx';
import { SignUp } from './components/pages/SignUp.tsx';
import { ThemeProvider } from './components/providerts/theme-provider.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route errorElement={<ErrorBoundary />} path="about" element={<AboutPage />} />
            <Route path="news" element={<NewsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="sign-in" replace />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>,
  // </StrictMode>,
);
