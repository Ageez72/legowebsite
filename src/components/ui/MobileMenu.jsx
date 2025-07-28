"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import Cookies from 'js-cookie';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function MobileMenu({ scroll, onGoTo }) {
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [lang, setLang] = useState("EN"); // fallback
  const [cookiesState, setCookiesState] = useState({
    newArrivals: false,
    clearance: false,
    commingSoon: false,
    giveaway: false,
  });
  const [translation, setTranslation] = useState(en);
  const pathname = usePathname();
  const isActive = (path) => pathname === path ? "active" : "";

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : en);
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



  const handleChangeLanguage = (e) => {
    dispatch({ type: "LANG", payload: e });
    window.location.reload(); // this is fine for now
  };

  return (
    <div className="mobile-menu fix mb-3 mean-container">
      <div className="mean-bar">
        <Link
          href="/#nav"
          className="meanmenu-reveal"
          style={{ right: 0, left: "auto", display: "inline" }}
        >
          <span><span><span /></span></span>
        </Link>
          <ul className="mobile-menu-links">
            <li className={isActive("/")} onClick={() => onGoTo()}>
              <Link href="/" className="block py-2">Home</Link>
            </li>
            <li className={isActive("/products")} onClick={() => onGoTo()}>
              <Link href={`/products?brand=${Cookies.get("brandID")}&itemStatus=AVAILABLE`} className="block py-2">Showroom</Link>
            </li>
          </ul>
        <hr />
        <button className="backToClub primary-btn">Back to Lego Club</button>
      </div>
    </div>
  );
}