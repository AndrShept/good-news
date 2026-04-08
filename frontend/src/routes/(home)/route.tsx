import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)')({
  component: AppRouteComponent,
});

function AppRouteComponent() {
  return (
    <section className="flex flex-col">
      <Header />
      <section className="mx-auto flex size-full max-w-7xl">
        {/* <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 flex-col border-y-0 p-3 pr-0 md:flex">
          <NavBar />
        </aside> */}
        <main className="flex size-full min-h-[calc(100vh-113px)] flex-1 flex-col p-3">
          <Outlet />
        </main>
      </section>

      <Footer />
    </section>
  );
}
