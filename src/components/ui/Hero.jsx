"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import heroLeft from "../../assets/imgs/hero-left.png";
import heroRight from "../../assets/imgs/hero-right.png";
import QuickAdd from './QuickAdd';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from "../../../context/AppContext";

// fallback images
import fallbackDesktopImage from "../../assets/imgs/hero-bg.png";
import fallbackMobileImage from "../../assets/imgs/hero-bg.png";

export default function Hero({
    desktopImage = fallbackDesktopImage.src,
    mobileImage = fallbackMobileImage.src,
    exist
}) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // default fallback
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : en);
        document.title = state.LANG === 'AENR' ? en.alekha : en.alekha;
    }, [state.LANG]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const backgroundImage = isMobile ? mobileImage : desktopImage;

    return (
        <>
            <section
                className="hero-section max-w-screen-xl mx-auto"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="hero-content">
                    <h1 className="hero-title text-center">Discover the World of LEGO</h1>
                    <p className='hero-desc'>Explore our complete LEGO collections by theme, age, or interest, find what inspires you</p>
                    <QuickAdd openSidebar={() => setIsSidebarModalOpen(true)} />
                </div>
            </section>
        </>
    );
}
