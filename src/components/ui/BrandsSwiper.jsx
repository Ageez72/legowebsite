"use client";
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '../../../context/AppContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from './Loaders/Loader';
import Placeholder from "../../../src/assets/imgs/200x100.svg"
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import CardLoader from './Loaders/CardLoader';
import { brokenImage } from '@/actions/utils';


async function fetchHomeBrands() {
    const lang = Cookies.get('lang') || 'EN';
    const res = await axios.get(`${BASE_API}${endpoints.products.categoriesList}&lang=EN&token=${Cookies.get("legoToken")}&brand=${Cookies.get("brandID")}`, {});
    return res;
}

export default () => {
    const [activeTooltip, setActiveTooltip] = useState(null);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};

    const { data, isLoading, error } = useQuery({
        queryKey: ['homeBrands'],
        queryFn: fetchHomeBrands,
    });

    if (isLoading) return <CardLoader />;


    const toggleTooltip = (key) => {
        setActiveTooltip(activeTooltip === key ? null : key);
    };

    return (
        data?.data?.length > 0 ? (
            <section className='max-w-screen-xl mx-auto px-4 space-y-16 custom-py-40'>
                <h2 className="section-title mb-8">Explore <span className="red-txt">LEGO</span> by Theme</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                    {
                        data?.data.map((slide, i) => (

                            <Link key={slide.description + slide.brandID}
                                href={`/products?brand=${Cookies.get("brandID")}&category=${slide.categoryId}&itemStatus=ALL`}
                                className="block w-full h-full relative"
                            >
                                <div className="relative brands card group" style={{ height: "132px" }} onClick={() => toggleTooltip(slide.description.replace(/lego/gi, '').trim())}>

                                    <Image
                                        className="brand-logo"
                                        src={slide.image !== "" ? slide.image : brokenImage()}
                                        alt={slide.description !== "" ? slide.description : 'Brand'}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                    />
                                    <div className={`
                                        absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                                        transition-opacity duration-300 
                                        ${activeTooltip === slide.description.replace(/lego/gi, '').trim() ? "opacity-100" : "opacity-0"} 
                                        group-hover:opacity-100 pointer-events-none
                                    `}>
                                        <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                                            {slide.description.replace(/lego/gi, '').trim()}
                                            <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </section>
        ) : null
    );
};