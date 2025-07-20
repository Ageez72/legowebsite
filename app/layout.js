"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Offcanvas from "@/components/ui/Offcanvas";
import AppProvider from "../context/AppContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import Cookies from 'js-cookie';
import "./globals.scss";

export default function RootLayout({ children }) {
  // const { state = {}, dispatch = () => {} } = useAppContext() || {};
  const [lang, setLang] = useState(Cookies?.get("lang"))
  const [scroll, setScroll] = useState(0);
  const [isOffCanvas, setOffCanvas] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/" || pathname === "/register";

  const handleOffCanvas = () => setOffCanvas(!isOffCanvas);
  const handleSearch = () => setSearch(!isSearch);

  useEffect(() => {
    const WOW = require("wowjs");
    window.wow = new WOW.WOW({
      live: false,
    });
    window.wow.init();

    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
    if (Cookies?.get("lang")) {
      document.documentElement.setAttribute("dir", Cookies?.get("lang") === "EN" ? "ltr" : "ltr");
      document.documentElement.setAttribute("lang", Cookies?.get("lang") || "EN");
    }
  }, []);

  return (
    <ReactQueryProvider>
      <html lang="EN" dir="ltr">
        <body
          className={`antialiased ${!isAuthPage ? "header-padding" : ""}`}
        >
          <AppProvider>
            {!isAuthPage && (
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
            )}


            {children}
            {!isAuthPage && <Footer />}
          </AppProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
