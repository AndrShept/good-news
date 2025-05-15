import { Background } from '@/components/Background';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="flex h-screen flex-col">
      <Background imageUrl='/sprites/new/background.png'>
        <div className="m-auto bg-background/80 backdrop-blur-sm  p-9 border">
          <Outlet />
        </div>
      </Background>
    </section>
  );
}
