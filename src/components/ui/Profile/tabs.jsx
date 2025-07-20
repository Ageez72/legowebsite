'use client';
import Cookies from "js-cookie";
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";

const lang = Cookies.get("lang");
let translation = lang === "AR" ? ar : en; 
export const profileTabs = [
  { id: 'personal', label: translation.profile , icon: "icon-user" },
  { id: 'security', label: translation.security, icon: "icon-shield-security" },
  { id: 'orders', label: translation.orders, icon: "icon-bag-happy" },
  { id: 'addresses', label: translation.addresses, icon: "icon-location" },
];
