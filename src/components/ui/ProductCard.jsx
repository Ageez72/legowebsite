"use client";
import React, { useState, useEffect } from 'react';
import Badge from "./Badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import Cookies from 'js-cookie';

export default function ProductCard({ type, customClass, item }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // fallback to Arabic

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(en);
        }
    }, [state.LANG]);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${item.id}`);
    };

    const rate = item?.reviews.rating || 0;
    return (
        <div className={`card product-card ${type === 'grid' ? 'grid-card flex items-center gap-3' : 'list-card'} ${customClass}`}>
            <div className='flex items-center w-full'>
                {
                    item.isNew && (
                        <Badge type={item.isNew && 'blue'} text={`${translation.new}`} />
                    )
                }
                {
                    item.itemdisc > 0 && item.hideDiscount != "false" && (
                        <Badge type={item.itemdisc > 0 && 'orange'} text={`${item.itemdisc} ${translation.percentage}`} />
                    )
                }
            </div>
            <div className="product-card-image">
                <Link href={`/products/${encodeURIComponent(item.id)}`}>
                    <img src={item?.images["800"]?.main} alt={item?.name} layout="responsive" title={item.name} />
                </Link>
            </div>
            <div className="product-card-content">
                <h2 className="product-card-title cursor-pointer short-title" title={item.name}>
                    <Link href={`/products/${encodeURIComponent(item.id)}`}>
                        {item.name}
                    </Link>
                </h2>
                <p className='product-card-description'>
                    <Link href={`/products?brand=${Cookies.get("brandID")}&category=${item?.category?.id}&itemStatus=ALL`}>
                        <span className="product-card-category">{item?.category?.description}</span>
                    </Link>
                </p>
                {/* <div className="price flex items-center gap-3">
                    {
                        item?.itemdisc > 0 && item.hideDiscount != "false" ? (
                            <>
                                <span className="product-card-price">
                                    <span className="price-number">{Number(item?.priceAfterDisc).toFixed(2)}</span>
                                    <span className="price-unit mx-1">{translation.jod}</span>
                                </span>
                                <span className='flex gap-1 discount'>
                                    <span>{Number(item?.price).toFixed(2)}</span>
                                    <span>{translation.jod}</span>
                                </span>
                            </>
                        ) : (
                            <span className="product-card-price">
                                <span className="price-number">{Number(item?.price).toFixed(2)}</span>
                                <span className="price-unit mx-1">{translation.jod}</span>
                            </span>
                        )
                    }
                </div> */}
            </div>
        </div>
    )
}
