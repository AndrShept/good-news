import { isRouteErrorResponse, useRouteError } from 'react-router';

export function ErrorBoundary() {
  const error = useRouteError();

  return <div>EROREROEEROOEOREOER</div>;
}
