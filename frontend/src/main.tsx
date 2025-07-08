import { User } from '@/shared/types.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter } from '@tanstack/react-router';
import { LazyMotion, domAnimation } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Socket } from 'socket.io-client';

import { App } from './components/App.tsx';
import { ErrorLoadingData } from './components/ErrorLoadingData.tsx';
import { NotFound } from './components/NotFound.tsx';
import { Spinner } from './components/Spinner.tsx';
import { AuthProvider } from './components/providerts/AuthProvider.tsx';
import { ThemeProvider } from './components/providerts/theme-provider.tsx';
import './index.css';
import { routeTree } from './routeTree.gen.ts';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
export interface MyRouterContext {
  auth: User | undefined;
  queryClient: QueryClient;
  socket: Socket | undefined;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: { queryClient, auth: undefined, socket: undefined },
  scrollRestoration: true,
  defaultNotFoundComponent: NotFound,
  defaultPendingComponent: () => {
    return (
      <div className="flex h-screen">
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
      <AuthProvider>
        <LazyMotion features={domAnimation}>
          {/* <SocketProvider> */}
            <App />
          {/* </SocketProvider> */}
        </LazyMotion>
      </AuthProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>,
  // </StrictMode>,
);
