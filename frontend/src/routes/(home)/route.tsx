import { BreadCrumb } from '@/components/BreadCrumb';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)')({
  component: AppRouteComponent,
});

function AppRouteComponent() {
  const { pathname } = useLocation();
  useRegeneration();
  return (
    <section className="flex flex-col">
      <Header />
      <section className="mx-auto flex size-full max-w-7xl">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 flex-col border-y-0 p-3 pr-0 md:flex">
          <NavBar />
        </aside>
        <main className="flex size-full min-h-screen flex-col p-3">
          {pathname !== '/' && !pathname.includes('/game') && <BreadCrumb />}
          <Outlet />
        </main>
      </section>

      <Footer />
    </section>
  );
}
