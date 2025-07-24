"use client"
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import Link from 'next/link';
import { useAppContext } from '../../../context/AppContext';
import ProductCard from './ProductCard';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import HorizontalLoader from './Loaders/HorizontalLoader';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default ({ title, route, badgeType, type, id }) => {
    const { push } = useRouter();
    const lang = Cookies.get('lang') || 'EN';
    async function fetchHomeProducts() {
        const res = await axios.get(`${BASE_API}${endpoints.products.list}&itemType=${type}&pageSize=12&itemStatus=AVAILABLE&lang=${lang}&token=${Cookies.get('token')}&brand=${Cookies.get("brandID")}`, {});
        return res;
    }
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // default fallback
    const [soonDisplay, setSoonDisplay] = useState(false)
    const [clearanceDisplay, setClearanceDisplay] = useState(false)
    const [newArivalsDisplay, setNewArivals] = useState(false)
    const [giveawayDisplay, setGiveawayDisplay] = useState(false)

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    const { data, isLoading, error } = useQuery({
        queryKey: [type],
        queryFn: fetchHomeProducts,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 3;
        },
    });

    if (isLoading) return <HorizontalLoader />;
    

    if (data) {
        const cookieKey = `has_items_${type.replace(/\s+/g, '_')}`;
        const hasItems = data?.data?.items?.length > 0;

        Cookies.set(cookieKey, hasItems.toString());
    }    

    return (
        <>
            {
                data?.data?.items.length ? (
                    <div className="grid-card-container" id={id}>
                        <div className="grid-header w-full flex items-center justify-between">
                            <h2 className='grid-header-title'>{title}</h2>
                            <Link href={route} className="outline-btn flex items-center gap-2">
                                {state.LANG === "EN" ? (
                                    <>
                                        <i className="icon-arrow-right-01-round"></i>
                                        <span>{translation.viewMore}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{translation.viewMore}</span>
                                        <i className="icon-arrow-left-01-round"></i>
                                    </>
                                )}
                            </Link>
                        </div>
                        <Swiper
                            dir={state.LANG === "EN" ? "ltr" : "ltr"}
                            modules={[Navigation, Grid]}
                            navigation
                            spaceBetween={10}
                            slidesPerView={1}
                            slidesPerGroup={1}
                            className={`${data?.data?.items?.length === 4 && "just-four-items"}`}
                            breakpoints={{
                                550: {    // screens >= 320px
                                    slidesPerView: 2,
                                    grid: { rows: 1 },
                                    spaceBetween: 10,
                                },
                                760: {    // screens >= 760
                                    slidesPerView: 2,
                                    grid: { rows: 1 },
                                    spaceBetween: 10,
                                },
                                1024: {   // screens >= 1024px
                                    slidesPerView: 3,
                                    grid: { rows: 1 },
                                    spaceBetween: 10,
                                },
                                1160: {   // screens >= 1160
                                    slidesPerView: 3,
                                    grid: { rows: 1 },
                                    spaceBetween: 20,
                                },
                                1320: {   // screens >= 1024px
                                    slidesPerView: 4,
                                    // grid: { rows: 2, fill: 'row' },
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {
                                data?.data?.items?.map((item, i) => (
                                    <SwiperSlide key={item.id}><ProductCard item={item} type="h" badgeType={badgeType} /></SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                ) : ""
            }
        </>
    );
};