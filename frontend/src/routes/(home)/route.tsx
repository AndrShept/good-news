import { BreadCrumb } from '@/components/BreadCrumb';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)')({
  component: App,
});

function App() {
  const { pathname } = useLocation();
  return (
    <section className="flex  flex-col">
      <Header />
      <section className="mx-auto flex size-full max-w-7xl ">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 flex-col border-y-0 p-3 pr-0 md:flex">
          <NavBar />
        </aside>
        <main className="flex  min-h-screen flex-col size-full p-3">
          {pathname !== '/' && !pathname.includes('/game') && <BreadCrumb />}
          <Outlet />
        </main>
      </section>

      <Footer />
    </section>
  );
}
