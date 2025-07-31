"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from './Badge';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function DetailsProductCard({ item }) {
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // fallback to Arabic

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(en);
        }
        document.title = state.LANG === 'EN' ? item.name + " - Lego Showroom" : item.name + " - Lego Showroom";
    }, [state.LANG]);

    const rate = item?.reviews.rating || 0;
    return (
        <div className="card product-card">
            <div className="product-card-content">
                {
                    item.isNew && (
                        <Badge className="ltr-badge" type={item.isNew && 'blue'} text={`${translation.new}`} />
                    )
                }
                <h1 className="product-card-title details-product-card-title" title={item.name}>{item.name}</h1>
                <p className="product-card-description">
                    <Link href={`/products?category=${item?.category?.id}&itemStatus=ALL`}>
                        <span className="product-card-category">{item?.category?.description}</span>
                    </Link>
                </p>

                {/* <div className="price flex items-center gap-3">
                    <span className="product-card-price details-product-card-price">
                        <span className="price-number">{Number(item?.price).toFixed(2)}</span>
                        <span className="price-unit mx-1">{translation.jod}</span>
                    </span>
                </div> */}
                <p className="product-description mt-4" dangerouslySetInnerHTML={{ __html: item?.description }} />
            </div>
        </div>
    )
}
