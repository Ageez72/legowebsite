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
import Script from "next/script";
import ContactTools from "@/components/ui/ContactTools";
import { BASE_API, endpoints } from "../constant/endpoints";
import axios from "axios";

const silentLogin = async (data) => {
  try {
    const username = encodeURIComponent("legowebsite");
    const password = encodeURIComponent("Lego@2025");
    const res = await axios.get(`${BASE_API + endpoints.auth.login}&username=${username}&password=${password}`)

    Cookies.set('token', res.data.token);
  } catch (err) {
    console.error('Error registering user:', err);
    setIsModalOpen(true);
  }
};

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
    const loginAndInit = async () => {
      const token = Cookies.get('token');
      // if (!token) {
        await silentLogin();
      // }
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
    };
    loginAndInit();
  }, []);

  return (
    <ReactQueryProvider>
      <html lang="EN" dir="ltr">
        <body
          className={`antialiased ${!isAuthPage ? "header-padding" : ""}`}
        >
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
            <ContactTools />
          </AppProvider>

          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-KC3WYXJ1F1"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-KC3WYXJ1F1');
            `}
          </Script>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
