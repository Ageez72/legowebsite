'use client'
import React, { useState, useEffect } from 'react';

const ContactTools = () => {
  const [showButton, setShowButton] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);

    // Setup scroll listener
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return null; // prevent rendering until mounted

  return (
    <div className='contact-tools'>
      <button onClick={scrollToTop} className={`back-to-top circle-icon-container ${showButton ? "show" : "not-allowed"}`}>
        <i className="icon-arrow-up"></i>
      </button>
      <a href="https://wa.link/k82yre" target='_blank' className="contact-link circle-icon-container contact-btn">
        <i className="icon-whatsapp-brands"></i>
      </a>
    </div>
  );
};

export default ContactTools;
