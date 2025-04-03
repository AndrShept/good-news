import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-screen flex-col">
      <div className="m-auto">
        <Outlet />
      </div>
    </section>
  );
}
