"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Offcanvas from "@/components/ui/Offcanvas";
import AppProvider from "../context/AppContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import Cookies from "js-cookie";
import "./globals.scss";
import Script from "next/script";
import ContactTools from "@/components/ui/ContactTools";
import { BASE_API, endpoints } from "../constant/endpoints";
import axios from "axios";

const silentLogin = async () => {
  try {
    const username = encodeURIComponent("legowebsite");
    const password = encodeURIComponent("Lego@2025");
    const res = await axios.get(`${BASE_API + endpoints.auth.login}&username=${username}&password=${password}`);
    Cookies.set("legoToken", res.data.token);
  } catch (err) {
    console.error("Silent login failed:", err);
  }
};

const getBrands = async () => {
    try {
      const res = await axios.get(`${BASE_API + endpoints.home.brandsSwiper}&token=${Cookies.get("legoToken")}`);
      // console.log(res.data[0].brandID);
      Cookies.set("brandID", res.data[0].brandID);
    } catch (err) {
      console.error("Fetching brands failed:", err);
    }
  };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/register";

  const [scroll, setScroll] = useState(0);
  const [isOffCanvas, setOffCanvas] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleOffCanvas = () => setOffCanvas(!isOffCanvas);
  const handleSearch = () => setSearch(!isSearch);

  useEffect(() => {
    const loginAndInit = async () => {
      const token = Cookies.get("legoToken");
      // if (token) {
        await silentLogin();
        await getBrands();
      // }

      const WOW = require("wowjs");
      window.wow = new WOW.WOW({ live: false });
      window.wow.init();

      const handleScroll = () => {
        const scrollCheck = window.scrollY > 100;
        setScroll(scrollCheck);
      };

      document.addEventListener("scroll", handleScroll);

      // const lang = Cookies.get("lang") || "EN";
      const lang = "EN";
      document.documentElement.setAttribute("dir", lang === "EN" ? "ltr" : "ltr");
      document.documentElement.setAttribute("lang", lang);

      setIsReady(true);
      return () => document.removeEventListener("scroll", handleScroll);
    };

    loginAndInit();
  }, []);

  if (!isReady) return (
    <html lang="EN" dir="ltr">
      <body className={`antialiased ${!isAuthPage ? "header-padding" : ""}`}></body>
    </html>
  );

  return (
    <html lang="EN" dir="ltr">
      <body className={`antialiased ${!isAuthPage ? "header-padding" : ""}`}>
        <ReactQueryProvider>
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
        </ReactQueryProvider>

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
  );
}
