import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/about')({
  component: About,
});

function About() {
  return <div>Hello "/about"!</div>;
}
