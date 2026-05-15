import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)')({
  component: AppRouteComponent,
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(getUserQueryOptions());

    return {
      auth,
    };
  },
});

function AppRouteComponent() {
  return (
    <section className="flex flex-col">
      {/* <Header /> */}
      <section className="mx-auto flex size-full max-w-7xl">
        <main className="flex size-full min-h-[calc(100vh-113px)] flex-1 flex-col p-3">
          <Outlet />
        </main>
      </section>

      {/* <Footer /> */}
    </section>
  );
}
