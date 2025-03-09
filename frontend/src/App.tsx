import { useQuery } from '@tanstack/react-query';
import { Link, Outlet } from 'react-router';

import { getUserQueryOptions } from './api/api';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

function App() {
  const { data: user, isLoading } = useQuery(getUserQueryOptions() );
  console.log(user)
  if (isLoading) return 'Loading...';
  return (
    <section className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
}

export default App;
