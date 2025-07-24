'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Offcanvas from '@/components/ui/Offcanvas';
import AppProvider from '../context/AppContext';

export default function MainLayout({ children }) {
  const [lang, setLang] = useState('EN');
  const [scroll, setScroll] = useState(false);
  const [isOffCanvas, setOffCanvas] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setLang(Cookies.get('lang') || 'EN');

    const WOW = require('wowjs');
    window.wow = new WOW.WOW({ live: false });
    window.wow.init();

    const handleScroll = () => {
      setScroll(window.scrollY > 100);
    };

    document.addEventListener('scroll', handleScroll);

    setIsMounted(true); // avoid hydration mismatch for pathname

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOffCanvas = () => setOffCanvas(!isOffCanvas);
  const handleSearch = () => setSearch(!isSearch);

  const isAuthPage = pathname === '/' || pathname === '/register';

  // Prevent mismatch by not rendering layout until mounted
  if (!isMounted) return null;

  return (
    <AppProvider>
        <>
          <Offcanvas
            isOffCanvas={isOffCanvas}
            handleOffCanvas={handleOffCanvas}
            scroll={scroll}
          />
          <Header
            scroll={scroll}
            isOffCanvas={isOffCanvas}
            handleOffCanvas={handleOffCanvas}
            isSearch={isSearch}
            handleSearch={handleSearch}
          />
        </>

      {children}

      <Footer />
    </AppProvider>
  );
}
