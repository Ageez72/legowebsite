"use client"
import { useState, useEffect } from "react";
import Link from 'next/link'
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import { useAppContext } from '../context/AppContext';

export default function NotFound() {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en);
  
    useEffect(() => {
      setTranslation(state.LANG === "EN" ? en : ar);
      document.title = state.LANG === 'AR' ? ar.notFound : en.notFound;
    }, [state.LANG]);
  return (
    <div className='not-found text-center'>
      <div className='img-text'>
        <svg className='w-100' xmlns="http://www.w3.org/2000/svg" width="686" height="267" viewBox="0 0 686 267" fill="none">
          <path d="M475.344 219.949V170.595L588.359 8.93945H656.669V167.018H685.996V219.949H656.669V266.443H595.512V219.949H475.344ZM599.804 76.1765L539.72 167.018H599.804V76.1765Z" fill="#E4E5E8" />
          <path d="M240.609 132.328C240.609 91.3184 248.478 59.0112 264.214 35.4068C280.189 11.8022 305.82 0 341.107 0C376.395 0 401.907 11.8022 417.643 35.4068C433.618 59.0112 441.605 91.3184 441.605 132.328C441.605 173.815 433.618 206.361 417.643 229.965C401.907 253.57 376.395 265.372 341.107 265.372C305.82 265.372 280.189 253.57 264.214 229.965C248.478 206.361 240.609 173.815 240.609 132.328ZM381.521 132.328C381.521 108.247 378.898 89.7686 373.653 76.8935C368.408 63.7798 357.559 57.223 341.107 57.223C324.656 57.223 313.807 63.7798 308.562 76.8935C303.316 89.7686 300.694 108.247 300.694 132.328C300.694 148.541 301.647 162.013 303.555 172.742C305.462 183.233 309.277 191.816 314.999 198.492C320.96 204.93 329.663 208.149 341.107 208.149C352.552 208.149 361.135 204.93 366.858 198.492C372.818 191.816 376.753 183.233 378.66 172.742C380.567 162.013 381.521 148.541 381.521 132.328Z" fill="#E4E5E8" />
          <path d="M0 219.949V170.595L113.015 8.93945H181.326V167.018H210.652V219.949H181.326V266.443H120.168V219.949H0ZM124.46 76.1765L64.3759 167.018H124.46V76.1765Z" fill="#E4E5E8" />
        </svg>
        <h2 className='title'>{translation.notFound}</h2>
      </div>
      <p>{translation.notFoundText}</p>
      <Link className='primary-btn mt-3 inline-block' href="/home">{translation.backToHome}</Link>
    </div>
  )
}