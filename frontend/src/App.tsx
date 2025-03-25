import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Link, Outlet, useLocation } from 'react-router';

import { BreadCrumb } from './components/BreadCrumb';
import { ErrorLoadingData } from './components/ErrorLoadingData';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';

function App() {
  const { reset } = useQueryErrorResetBoundary();
  const { pathname } = useLocation();
  return (
    <section className="flex min-h-screen flex-col">
      <Header />
      <section className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 flex-col border border-y-0 p-3 pr-0 md:flex">
          <NavBar />
        </aside>
        <main className="flex  flex-col w-full p-3 ">
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary, error }) => <ErrorLoadingData refetchData={() => resetErrorBoundary()} error={error} />}
          >
            {pathname !== '/' && <BreadCrumb />}
            <Outlet />
          </ErrorBoundary>
        </main>
      </section>

      <Footer />
    </section>
  );
}

export default App;
