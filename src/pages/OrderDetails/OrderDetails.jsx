"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json"
import ar from "../../../locales/ar.json";
import { BASE_API, endpoints } from '../../../constant/endpoints';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Link from 'next/link';
import { brokenImage } from '@/actions/utils';
import Loader from '@/components/ui/Loaders/Loader';


export default function OrderDetails() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrdersDetails] = useState([]);

    const id = searchParams.get('id')

    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : en);
        document.title = state.LANG === 'EN' ? en.orderDetails : en.orderDetails;
    }, [state.LANG]);

    const fetchMyOrder = async () => {
        setLoading(true)
        const res = await axios.get(`${BASE_API}${endpoints.products.myorders}&lang=EN&token=${Cookies.get("legoToken")}`, {});
        if (res.data) {
            const obj = res.data.filter(el => el.orderID === id);
            // console.log(obj[0]);

            setOrdersDetails(obj[0]);
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchMyOrder()
    }, []);



    const breadcrumbItems = [
        { label: translation.home, href: '/' },
        { label: translation.orders, href: '/profile?orders' },
        { label: translation.orderDetails }
    ];

    let status;
    if (orderDetails.statusCode == 0) {
        status = "canceled"
    } else if (orderDetails.statusCode == 1) {
        status = "in-progress"
    } else if (orderDetails.statusCode == 2) {
        status = "closed"
    }

    return (
        <>
            {
                loading && (
                    <Loader />
                )
            }
            <div className='cart-page'>
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex gap-7 mt-5 pt-5 flex-col lg:flex-row">
                    <div className="order-side">
                        <div className="card mb-10">
                            <div className="flex items-center justify-between mb-1">
                                <div className="order-number sub-title">
                                    <span>{translation.orderNumber}:</span> <span>#{orderDetails.orderID}</span>
                                </div>
                                <span className={`order-status ${status}`}>
                                    <span>{orderDetails.status}</span>
                                </span>
                            </div>
                            <span className="order-date block">{orderDetails.date}</span>
                        </div>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="sub-title">{translation.addedProducts}</h3>
                            <div className="items-count flex justify-center items-center">{orderDetails?.details?.length}</div>
                        </div>

                        {orderDetails?.details?.length ? (
                            <>
                                {orderDetails?.details?.map((item) => (
                                    <div key={item.id} className="card space-y-4 mb-5">
                                        <div className="cart-item flex items-center justify-between">
                                            <div className='flex w-3/4 items-center gap-2'>
                                                <div className="image-container flex justify-center items-center w-16">
                                                    <Link href={`/products/${item.id}`} className="w-full h-full flex justify-center items-center">
                                                        <img src={item.images["800"].main || brokenImage()} width={52} height={52} alt={item.name || "Product"} />
                                                    </Link>
                                                </div>
                                                <div className="info flex-1 px-4">
                                                    <p className="name font-medium"><Link href={`/products/${item.id}`}>{item.name}</Link></p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="price flex items-center gap-1 mb-0 text-sm text-gray-700">
                                                            <span>{Number(item.subTotal).toFixed(2)}</span>
                                                            <span>{translation.jod}</span>
                                                        </p>
                                                        {/* <p className="flex gap-1 discount sm mb-0">
                                                            <span>{Number(item.net).toFixed(2)}</span>
                                                            <span>{translation.jod}</span>
                                                        </p> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="actions py-1 px-3 w-auto">
                                                {item.qty}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <h3 className="sub-title mb-4 mt-8">{translation.orderNotes}</h3>
                                <div className="card">
                                    <textarea
                                        disabled="disabled"
                                        className="w-full h-full notes-text"
                                        name="notes"
                                        // placeholder={translation.addNotes}
                                        defaultValue={orderDetails.notes}
                                    />
                                </div>
                                {
                                    orderDetails.address ? (
                                        <>
                                            <h3 className="sub-title mb-4 mt-8">{translation.shippingAddress}</h3>
                                            <div className="addresses">
                                                <div className="card mb-3">
                                                    <div className="address-item">
                                                        <label className="flex justify-between items-center">
                                                            <span className="flex items-center gap-2">
                                                                <i className="icon-location location"></i>
                                                                <span>{orderDetails.address}</span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        null
                                        // <label className="flex justify-center items-center">
                                        //     <span className='block'>{translation.noAddresses}</span>
                                        // </label>
                                    )
                                }

                            </>
                        ) : null}
                    </div>

                    <div className="order-summary">
                        <div className="card p-4">
                            <h3 className="sub-title mb-6">{translation.orderSummary}</h3>
                            <div className="order-item flex justify-between items-center mb-4">
                                <p className="mb-0">{translation.itemCount}</p>
                                <p className="mb-0">{orderDetails?.details?.length}</p>
                            </div>
                            <div className="order-item flex justify-between items-center mb-4">
                                <p className="mb-0">{translation.subtotal}</p>
                                <p className="mb-0 flex items-center gap-1">
                                    <span>{Number(orderDetails?.SUBTOTAL || orderDetails?.value || 0).toFixed(2)}</span>
                                    <span>{translation.jod}</span>
                                </p>
                            </div>
                            <div className="order-item flex justify-between items-center mb-4">
                                <p className="mb-0">{translation.tax}</p>
                                <p className="mb-0 flex items-center gap-1">
                                    <span>{Number(orderDetails?.TAX || 0).toFixed(2)}</span>
                                    <span>{translation.jod}</span>
                                </p>
                            </div>
                            <div className="order-item flex justify-between items-center mb-4">
                                <p className="mb-0">{translation.discount}</p>
                                <p className="mb-0 flex items-center gap-1">
                                    <span>{Number(orderDetails?.DISCOUNT || 0).toFixed(2)}</span>
                                    <span>{translation.jod}</span>
                                </p>
                            </div>
                            <hr />
                            <div className="order-item flex justify-between items-center mb-4">
                                <h3 className="sub-title">{translation.total}</h3>
                                <p className="mb-0 flex items-center gap-1 price">
                                    <span>{Number(orderDetails?.value || 0).toFixed(2)}</span>
                                    <span>{translation.jod}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}