"use client";
import React, { useState, useEffect } from 'react';
import Badge from "./Badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function ProductCard({ type, badgeType, related, item }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // fallback to Arabic

    useEffect(() => {
        if (state.LANG === "EN") {
            setTranslation(en);
        } else {
            setTranslation(ar);
        }
    }, [state.LANG]);
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${item.id}`);
    };

    const rate = item?.reviews.rating || 0;
    return (
        <div className={`card product-card ${type === 'grid' ? 'grid-card flex items-center gap-3' : 'list-card'}`}>
            {
                item.isNew && (
                    <Badge type={item.isNew && 'blue'} text={`${translation.new}`} />
                )
            }
            <div className="product-card-image">
                <Link href={`/products/${item.id}`}>
                    <img src={item?.images["800"]?.main} alt={item?.name} layout="responsive" title={item.name} />
                </Link>
            </div>
            <div className="product-card-content">
                {/* {
                    item.commingSoon && (
                        <Badge type={item.commingSoon && 'yellow'} text={`${translation.soon}`} />
                    )
                }
                {
                    item.itemdisc > 0 && item.hideDiscount != "false" && (
                        <Badge type={item.itemdisc > 0 && 'green'} text={`${translation.discount2} ${item.itemdisc} ${translation.percentage}`} />
                    )
                }
                {
                    item.discountType === 'CLEARANCE' && item.avlqty > 0 && (
                        <Badge type={item.discountType === 'CLEARANCE' && 'red'} text={`${translation.only} ${item.avlqty} ${item.avlqty === 1 ? translation.pieceOne : item.avlqty > 10 ? translation.pieceOnly : translation.piecesOnly}`} />
                    )
                }
                {
                    item.discountType !== 'CLEARANCE' && item.avlqty < 10 && (
                        <Badge type={item.discountType !== 'CLEARANCE' && 'red'} text={`${translation.only} ${item.avlqty} ${item.avlqty === 1 ? translation.pieceOne : translation.piecesOnly}`} />
                    )
                } */}
                <h2 className="product-card-title cursor-pointer short-title" title={item.name}>
                    <Link href={`/products/${item.id}`}>
                        {item.name}
                    </Link>
                </h2>
                <p className='product-card-description'>
                    <Link href={`/products?brand=${item?.brand?.id}&itemStatus=AVAILABLE`}>
                        <span className="product-card-brand">{item?.brand?.description}</span>
                    </Link>
                    <span className='mx-1'>-</span>
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
