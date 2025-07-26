"use client";
import React, { useEffect, useState } from "react";
import "../src/assets/js/main";
import BrandsSwiper from "@/components/ui/BrandsSwiper";
import GridSwiper from "@/components/ui/GridSwiper";
import Hero from "@/components/ui/Hero";
import { useAppContext } from "../context/AppContext";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_API, endpoints } from "../constant/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import kenzi from "../src/assets/imgs/places/kinzi.png";
import wonders from "../src/assets/imgs/places/wonders.png";
import toyBox from "../src/assets/imgs/places/toyBox.png";
import kiddix from "../src/assets/imgs/places/kiddix.png";
import union from "../src/assets/imgs/patterns/union.png";
import rectangle from "../src/assets/imgs/patterns/rectangle.png";
import frame from "../src/assets/imgs/patterns/frame2.png";
import join from "../src/assets/imgs/join.png";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";
import HorizontalLoader from "@/components/ui/Loaders/HorizontalLoader";


// fallback images
import fallbackDesktopImage from "@/assets/imgs/hero-bg.png";
import fallbackMobileImage from "@/assets/imgs/hero-bg.png";

export default function Home() {

  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en);
  const [imagePairs, setImagePairs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : en);
    document.title = "Lego Showroom - Arabian Al-EKha";
  }, [state.LANG]);


  const fetchFeaturedProducts = async () => {
    const res = await axios.get(
      `${BASE_API}${endpoints.products.list}&itemType=FEATURED&token=${Cookies.get("legoToken")}&pageSize=6&itemStatus=AVAILABLE&lang=EN&brand=${Cookies.get("brandID")}`
    );
    return res;
  };

  const {
    data: featuredProductsdata,
    isLoading: isLoadingFeaturedProducts,
    error: errorFeaturedProducts,
  } = useQuery({
    queryKey: [`home-featured-products`],
    queryFn: fetchFeaturedProducts,
  });
  // if (isLoadingFeaturedProducts) return <HorizontalLoader />;

  return (
    <main>
      <Hero />
      <BrandsSwiper />

      <section className="max-w-screen-xl mx-auto px-4 space-y-16 custom-py-40">
        <GridSwiper
          title={translation.newArrivals}
          badgeType={"blue"}
          type={"NEW ARRIVAL"}
          route={"/products?itemType=NEW ARRIVAL&itemStatus=AVAILABLE"}
          id={"new-arrival"}
        />
      </section>
      {
        featuredProductsdata?.data.items.length > 0 && !isLoadingFeaturedProducts && (
          <section className="featuredProducts-wrapper">
            <div className="featuredProducts-patterns">
              <img src={union.src} alt="Union Pattern" className="union-pattern" />
              <img src={rectangle.src} alt="Rectangle Pattern" className="rectangle-pattern" />
              <img src={frame.src} alt="Frame Pattern" className="frame-pattern" />
            </div>

            <div className="max-w-screen-xl mx-auto p-4 space-y-16 relative z-10">
              <h2 className="section-title mb-12">Featured Products</h2>
              <Swiper
                dir={state.LANG === "EN" ? "ltr" : "ltr"}
                modules={[Navigation, Grid]}
                navigation
                spaceBetween={10}
                slidesPerView={1}
                slidesPerGroup={1}
                className={`${featuredProductsdata?.data?.items?.length === 4 && "just-four-items"}`}
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
                    slidesPerView: 2,
                    grid: { rows: 2, fill: 'row' },
                    spaceBetween: 10,
                  },
                  1160: {   // screens >= 1160
                    slidesPerView: 3,
                    grid: { rows: 2, fill: 'row' },
                    spaceBetween: 20,
                  },
                  1320: {   // screens >= 1024px
                    slidesPerView: 3,
                    grid: { rows: 2, fill: 'row' },
                    spaceBetween: 20,
                  },
                }}
              >
                {
                  featuredProductsdata?.data?.items?.slice(0, 6).map((item, i) => (
                    <SwiperSlide key={item.id}>
                        <FeaturedProductCard key={item.id} item={item} />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
          </section>
        )
      }
      {
        isLoadingFeaturedProducts && (
          <section className="max-w-screen-xl mx-auto p-4 space-y-16 relative z-10">
            <HorizontalLoader />
          </section>
        )
      }
      <section className="max-w-screen-xl mx-auto px-4 space-y-16 custom-py-40">
        <GridSwiper
          title={translation.offers}
          badgeType={"blue"}
          type={"GIVEAWAY"}
          route={"/products?itemType=GIVEAWAY&itemStatus=AVAILABLE"}
          id={"giveaway"}
        />
      </section>
      <section className="max-w-screen-xl mx-auto px-4 space-y-16 custom-py-40">
        <div className="lego-places">
          <h2 className="section-title mb-8">Where to Find <span className="red-txt">LEGO</span> Products</h2>
          <div className="grid-card-container">
            <Swiper
              dir={state.LANG === "EN" ? "ltr" : "ltr"}
              modules={[Navigation, Grid]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              slidesPerGroup={1}
              className={`just-four-items`}
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
              <SwiperSlide>
                <div className="card flex items-center gap-3">
                  <div className="card-image">
                    <img src={kenzi.src} alt="Kenzi" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Kenzi</h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card flex items-center gap-3">
                  <div className="card-image">
                    <img src={wonders.src} alt="Wonders" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Wonders</h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card flex items-center gap-3">
                  <div className="card-image">
                    <img src={toyBox.src} alt="Toy Box" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Toy Box</h3>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="card flex items-center gap-3">
                  <div className="card-image">
                    <img src={kiddix.src} alt="Kiddix" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Kiddix</h3>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

        </div>
      </section>
      <section className="join-club max-w-screen-xl mx-auto p-4 space-y-16" style={{ backgroundImage: `url(${join.src})` }}>
        <div>
          <h2 className="section-title mb-8">Join the LEGO Club</h2>
          <p>New members receive a digital welcome pack and access to exclusive club activities!</p>
          <a href="https://bricksarabia.club/" className="primary-btn" target="_blank" rel="noopener noreferrer">Join Now</a>
        </div>
      </section>
    </main>
  );
}
