"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import Image from 'next/image'
import { brokenImage } from '@/actions/utils';
import Link from 'next/link';

export default function OrderCard({ order }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en);

    let status;
    if (order.statusCode == 0) {
        status = "canceled"
    } else if (order.statusCode == 1) {
        status = "in-progress"
    } else if (order.statusCode == 2) {
        status = "closed"
    }


    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (
        <div className="order-card w-full rounded-xl card">
            <div className="flex items-center justify-between mb-1">
                <Link href={`/order-details?id=${order.orderID}`}>
                    <div className="order-number text-sm font-semibold">
                        <span>{translation.orderNumber}:</span> <span>#{order.orderID}</span>
                    </div>
                </Link>
                <span className={`order-status ${status}`}>
                    <span>{order.status}</span>
                </span>
            </div>

            <span className="order-date block mb-1">{order.date}</span>

            {/* Items */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
                {order.details.slice(0, 1).map((el, i) => (
                    <div key={i} className="flex justify-between gap-2" title={el.name}>
                        <div className="flex items-center gap-2">
                            <Image
                                src={el.images["800"].main || brokenImage()}
                                alt="Product"
                                width={50}
                                height={50}
                                className="prod-img rounded-md"
                                title={el.name}
                            />
                            <div>
                                <h4 className="prod-title" title={el.name}>
                                    {el.name}
                                </h4>
                                <p className="prod-qty text-xs text-red-500 mt-1">
                                    {el.qty || 0}
                                    <span className='ms-1'>{translation.piece}</span>
                                </p>
                            </div>
                        </div>
                        <div className="prod-price text-red-600 font-semibold text-sm">
                            {el.net}
                            <span className='ms-1'>{translation.jod}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Extra Products */}
            {
                order.details.length - 1 >= 0 && (
                    <div className={`extra-products text-center ${order.details.length - 1 > 0 ? '' : 'opacity-0'}`}>
                        <span>{order.details.length - 1}</span>
                        <span className='ms-1'>{translation.additionalProducts}</span>
                    </div>
                )
            }

            {/* Total */}
            <div className="flex justify-between items-center mt-4 font-bold text-sm">
                <span className='order-total-title'>{translation.orderTotal}</span>
                <span className='order-total-price'>
                    {order.value}
                    <span className='ms-1'>{translation.jod}</span>
                </span>
            </div>
            <Link className='primary-btn block text-center mt-3' href={`/order-details?id=${order.orderID}`}>
                {translation.orderDetails}
            </Link>
        </div>
    )
}
