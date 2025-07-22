'use client';
import React, {useState, useEffect} from 'react';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';

export default function Breadcrumb({ items = [], className }) {
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // default fallback
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (
        <nav className={`flex breadcrumb-wrapper ${className}`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="inline-flex items-center m-0">
                            {index !== 0 && (
                                <svg
                                    className="rtl:rotate-180 w-3 h-3 mx-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                            )}

                            {isLast ? (
                                <span className="last">
                                    {item.label}
                                </span>
                            ) : (
                                <a
                                    href={item.href}
                                    className="inline-flex items-center m-0"
                                >
                                    {item.label}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
