"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import Cookies from 'js-cookie';

let initialLang = Cookies?.get("lang") || "EN";

const initialState = {
  BASEURL: "https://pick.alekha.com:8443/pick/faces/redirect/b2b?",
  LANG: initialLang,
  STOREDITEMS: [],
  DIRECTION: initialLang === "EN" ? "ltr" : "ltr",
};
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // Update Cookies when language state changes
  useEffect(() => {
    Cookies.set("lang", state.LANG);
  }, [state.LANG]);

  useEffect(() => {
    const storedCart = Cookies.get("cart");
    if (storedCart) {
      dispatch({ type: "STORED-ITEMS", payload: JSON.parse(storedCart) });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "LANG":
      return { ...state, LANG: action.payload };
    case "STORED-ITEMS":
      return { ...state, STOREDITEMS: action.payload };
    default:
      return state;
  }
};
export default AppProvider;
