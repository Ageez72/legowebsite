"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function Menu({ scroll }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const pathname = usePathname();

  const isActive = (path) => pathname === path ? "active" : "";

  const [cookiesState, setCookiesState] = useState({
    newArrivals: false,
    clearance: false,
    commingSoon: false,
    giveaway: false,
  });

  const [translation, setTranslation] = useState(en); // default fallback

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    const checkCookies = () => {
      setCookiesState({
        newArrivals: Cookies.get("has_items_NEW_ARRIVAL") === "true",
        clearance: Cookies.get("has_items_CLEARANCE") === "true",
        commingSoon: Cookies.get("has_items_COMING_SOON") === "true",
        giveaway: Cookies.get("has_items_GIVEAWAY") === "true",
      });
    };

    checkCookies();

    const interval = setInterval(checkCookies, 1000); // Check every second
    const timeout = setTimeout(() => clearInterval(interval), 5000); // Stop after 5 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state.LANG]);


  return (
    <ul className="menu-list font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:border-gray-700">
      {scroll && isActive("/home") ? (
        <>
          {cookiesState.newArrivals && (
            <li className={isActive("/new-arrival")}>
              <Link href="#new-arrival" className="block py-2 px-3">{translation.newArrivals}</Link>
            </li>
          )}
          {cookiesState.giveaway && (
            <li className={isActive("/giveaway")}>
              <Link href="#giveaway" className="block py-2 px-3">{translation.offers}</Link>
            </li>
          )}
          {cookiesState.commingSoon && (
            <li className={isActive("/comming-soon")}>
              <Link href="#comming-soon" className="block py-2 px-3">{translation.commingSoon}</Link>
            </li>
          )}
          {cookiesState.clearance && (
            <li className={isActive("/clearance")}>
              <Link href="#clearance" className="block py-2 px-3">{translation.clearance}</Link>
            </li>
          )}
        </>
      ) : (
        <>
          <li className={isActive("/home")}>
            <Link href="/home" className="block py-2 px-3">Home</Link>
          </li>
          <li className={isActive("/products")}>
            <Link href="/products?brand=00072&itemStatus=AVAILABLE" className="block py-2 px-3">Showroom</Link>
          </li>
        </>
      )}
    </ul>
  );
}