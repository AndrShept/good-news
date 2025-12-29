import { Hero, User } from '@/shared/types.ts';
import { QueryClient, QueryClientProvider, keepPreviousData } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { LazyMotion, domAnimation } from 'motion/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import type { Socket } from 'socket.io-client';

import { ErrorLoadingData } from './components/ErrorLoadingData.tsx';
import { NotFound } from './components/NotFound.tsx';
import { Spinner } from './components/Spinner.tsx';
import { ThemeProvider } from './components/providers/theme-provider.tsx';
import './index.css';
import { toastError } from './lib/utils.ts';
import { routeTree } from './routeTree.gen.ts';
import { useGameMessages } from './store/useGameMessages.ts';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
export interface MyRouterContext {
  auth: User | undefined;
  queryClient: QueryClient;
  socket: Socket | undefined;
  hero: Hero | undefined;
}

interface ApiError {
  message: string;
  cause?: {
    canShow?: boolean;
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      
    },
    mutations: {
      onError: (err) => {
        const error = err as ApiError;
        const setGameMessage = useGameMessages.getState().setGameMessage;
        if (error?.cause?.canShow) {
          setGameMessage({
            text: error.message,
            type: 'ERROR',
          });
        } else {
          toastError();
        }
      },
    },
  },
});

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: { queryClient, auth: undefined, socket: undefined, hero: undefined },
  scrollRestoration: true,
  defaultNotFoundComponent: NotFound,
  defaultPendingComponent: () => {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={'sm'} />
      </div>
    );
  },
  defaultErrorComponent: ({ error, reset }) => <ErrorLoadingData error={error} reset={reset} />,
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={domAnimation}>
        <RouterProvider router={router} />
        {/* <TanStackRouterDevtools /> */}
      </LazyMotion>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>,
  // </StrictMode>,
);
