import { BreadCrumb } from '@/components/BreadCrumb';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)')({
  component: AppRouteComponent,
});

function AppRouteComponent() {
  const { pathname } = useLocation();

  return (
    <section className="flex flex-col">
      <Header />
      <section className="mx-auto flex size-full max-w-7xl">
        {/* <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 flex-col border-y-0 p-3 pr-0 md:flex">
          <NavBar />
        </aside> */}
        <main className="flex size-full min-h-[calc(100vh-113px)] flex-1 flex-col p-3">
          {pathname !== '/' && !pathname.includes('/game') && <BreadCrumb />}

          <Outlet />
        </main>
      </section>

      <Footer />
    </section>
  );
}
