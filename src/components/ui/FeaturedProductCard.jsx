"use client";
import React, { useState, useEffect } from 'react';
import Badge from "./Badge";
import Link from 'next/link';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function FeaturedProductCard({ item }) {
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // fallback to Arabic

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(ar);
        }
    }, [state.LANG]);

    return (
        <div className={`card featuredProductCard product-card grid-card flex items-center gap-3`}>
            <div className="product-card-image">
                <Link href={`/products/${item.id}`}>
                    <img src={item?.images["800"]?.main} alt={item?.name} layout="responsive" title={item.name} />
                </Link>
            </div>
            <div className="product-card-content">
                {
                    <span className={`badge feature inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-inset me-2 ltr-badge flex items-center gap-1`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3.82665 10.6667C3.89999 10.34 3.76665 9.87337 3.53332 9.64004L1.91332 8.02004C1.40665 7.51337 1.20665 6.97337 1.35332 6.50671C1.50665 6.04004 1.97999 5.72004 2.68665 5.60004L4.76665 5.25337C5.06665 5.20004 5.43332 4.93337 5.57332 4.66004L6.71999 2.36004C7.05332 1.70004 7.50665 1.33337 7.99999 1.33337C8.49332 1.33337 8.94665 1.70004 9.27999 2.36004L10.4267 4.66004C10.5133 4.83337 10.6933 5.00004 10.8867 5.11337L3.70665 12.2934C3.61332 12.3867 3.45332 12.3 3.47999 12.1667L3.82665 10.6667Z" fill="#FFD502" />
                            <path d="M12.4667 9.64001C12.2267 9.88001 12.0934 10.34 12.1734 10.6667L12.6334 12.6733C12.8267 13.5067 12.7067 14.1333 12.2934 14.4333C12.1267 14.5533 11.9267 14.6133 11.6934 14.6133C11.3534 14.6133 10.9534 14.4867 10.5134 14.2267L8.56003 13.0667C8.25337 12.8867 7.7467 12.8867 7.44003 13.0667L5.4867 14.2267C4.7467 14.66 4.11337 14.7333 3.7067 14.4333C3.55337 14.32 3.44003 14.1667 3.3667 13.9667L11.4734 5.86001C11.78 5.55335 12.2134 5.41335 12.6334 5.48668L13.3067 5.60001C14.0134 5.72001 14.4867 6.04001 14.64 6.50668C14.7867 6.97335 14.5867 7.51335 14.08 8.02001L12.4667 9.64001Z" fill="#FFD502" />
                        </svg>
                        Featured
                    </span>
                }
                <h2 className="product-card-title cursor-pointer short-title" title={item.name}>
                    <Link href={`/products/${item.id}`}>
                        {item.name}
                    </Link>
                </h2>
                <p className='product-card-description'>
                    <Link href={`/products?brand=00072&category=${item?.category?.id}&itemStatus=AVAILABLE`}>
                        <span className="product-card-category">{item?.category?.description}</span>
                    </Link>
                </p>
                <div className="price flex items-center gap-3">
                    <span className="product-card-price">
                        <span className="price-number">{Number(item?.price).toFixed(2)}</span>
                        <span className="price-unit mx-1">{translation.jod}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
