import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='bg-red-400 h-screen'>
      <Outlet />
    </div>
  );
}
