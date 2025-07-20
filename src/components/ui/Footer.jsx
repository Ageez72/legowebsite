'use client';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
export default function Footer() {
  const { state = {}, dispatch = () => {} } = useAppContext() || {};
  const [translation, setTranslation] = useState(en); // fallback to Arabic

  useEffect(() => {
    if (state.LANG === "EN") {
      setTranslation(en);
    } else {
      setTranslation(ar);
    }
  }, [state.LANG]);

  const d = new Date();
  return (
    <>
      <footer>
        <section className="footer-section flex items-center justify-center max-w-screen-xl mx-auto p-4 text-center">
          <p className="mb-0">{translation.copyrights} {d.getFullYear()}</p>
        </section>
      </footer>
    </>
  );
}
