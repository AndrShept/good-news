import { Link, Outlet } from 'react-router';

import { Footer } from './components/Footer';
import { Header } from './components/Header';

function App() {
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
