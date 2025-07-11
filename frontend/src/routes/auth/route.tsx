import { Background } from '@/components/Background';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-screen flex-col">
      {/* <Background imageUrl='/sprites/new/background.png'> */}
      <div className="bg-background/80 m-auto border p-9 backdrop-blur-sm">
        <Outlet />
      </div>
      {/* </Background> */}
    </section>
  );
}
