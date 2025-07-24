"use client";
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
    const res = await axios.get(`${BASE_API}${endpoints.products.categoriesList}&lang=EN&token=${Cookies.get('token')}&brand=${Cookies.get("brandID")}`, {});
    return res;
}

export default () => {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};

    const { data, isLoading, error } = useQuery({
        queryKey: ['homeBrands'],
        queryFn: fetchHomeBrands,
    });

    if (isLoading) return <CardLoader />;
    

    return (
        <section className='max-w-screen-xl mx-auto px-4 space-y-16 custom-py-40'>
            <h2 className="section-title mb-8">Explore <span className="red-txt">LEGO</span> by Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {
                    data?.data.map((slide, i) => (
                        <div key={slide.description + slide.brandID}>
                            <div className="relative brands card" style={{ height: "132px" }}>
                                <Image
                                    className='brand-logo'
                                    src={slide.image !== "" ? slide.image : brokenImage()}
                                    alt={slide.description !== "" ? slide.description : 'Brand'}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
};