'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

export default function MainLayout({ children }) {
  const pathname = usePathname();

  // Hide header/footer for dashboard or any admin-style page
  const hideLayout = pathname?.toLowerCase().startsWith('/dashboard') || pathname?.toLowerCase().startsWith('/print');

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Header />}

      <main className="flex-grow-1">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}
