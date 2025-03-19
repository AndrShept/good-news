import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router';

import { ErrorLoadingData } from './components/ErrorLoadingData';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';

function App() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <section className="flex min-h-screen flex-col">
      <Header />
      <section className="flex">
        <aside className="sticky top-14 flex h-[calc(100vh-56px)] w-60 flex-col border-r p-3 pr-0">
          <NavBar />
        </aside>
        <main className="flex flex-1 flex-col p-3">
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary, error }) => <ErrorLoadingData refetchData={() => resetErrorBoundary()} error={error} />}
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </section>

      <Footer />
    </section>
  );
}

export default App;
