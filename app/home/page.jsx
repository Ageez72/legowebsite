"use client";
import React, { useEffect, useState } from "react";
import "../../src/assets/js/main";
import BrandsSwiper from "@/components/ui/BrandsSwiper";
import GridSwiper from "@/components/ui/GridSwiper";
import Hero from "@/components/ui/Hero";
import { useAppContext } from "../../context/AppContext";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_API, endpoints } from "../../constant/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import kenzi from "../../src/assets/imgs/places/kinzi.png";
import wonders from "../../src/assets/imgs/places/wonders.png";
import toyBox from "../../src/assets/imgs/places/toyBox.png";
import kiddix from "../../src/assets/imgs/places/kiddix.png";
import union from "../../src/assets/imgs/patterns/union.png";
import rectangle from "../../src/assets/imgs/patterns/rectangle.png";
import frame from "../../src/assets/imgs/patterns/frame2.png";
import join from "../../src/assets/imgs/join.png";
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
    setTranslation(state.LANG === "EN" ? en : ar);
  }, [state.LANG]);


  const fetchFeaturedProducts = async () => {
    const res = await axios.get(
      `${BASE_API}${endpoints.products.list}&itemType=FEATURED&token=${Cookies.get("token")}&pageSize=6&itemStatus=AVAILABLE&lang=${state.LANG}&brand=00072`
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

  const fetchHomeImages = async () => {
    const res = await axios.get(
      `${BASE_API}${endpoints.products.homeImages}&token=${Cookies.get("token")}`
    );
    return res;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`home-images`],
    queryFn: fetchHomeImages,
  });

  useEffect(() => {
    if (data?.data?.length > 0) {
      const validPairs = data.data
        .filter(item => item["image desktop"] && item["image mobile"])
        .map(item => ({
          desktop: item["image desktop"],
          mobile: item["image mobile"],
        }));
      setImagePairs(validPairs);
    }
  }, [data]);

  // Slider effect: every 5 seconds, change image
  useEffect(() => {
    if (imagePairs.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePairs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagePairs]);

  const currentImagePair = imagePairs[currentIndex] || {
    desktop: fallbackDesktopImage.src,
    mobile: fallbackMobileImage.src,
  };

  return (
    <>
      {
        !isLoading && (
          <Hero
            desktopImage={currentImagePair.desktop}
            mobileImage={currentImagePair.mobile}
            exist={imagePairs.length > 0}
          />
        )
      }

      <div className="py-4">
        <BrandsSwiper />
      </div>

      <div className="max-w-screen-xl mx-auto p-4 space-y-16">
        <GridSwiper
          title={translation.newArrivals}
          badgeType={"blue"}
          type={"NEW ARRIVAL"}
          route={"/products?itemType=NEW ARRIVAL&itemStatus=AVAILABLE"}
          id={"new-arrival"}
        />
      </div>
      {
        featuredProductsdata?.data.items.length > 0 && !isLoadingFeaturedProducts && (
          <div className="featuredProducts-wrapper">
            <div className="featuredProducts-patterns">
              <img src={union.src} alt="Union Pattern" className="union-pattern" />
              <img src={rectangle.src} alt="Rectangle Pattern" className="rectangle-pattern" />
              <img src={frame.src} alt="Frame Pattern" className="frame-pattern" />
            </div>

            <div className="max-w-screen-xl mx-auto p-4 space-y-16 relative z-10">
              <h2 className="section-title mb-12">Featured Products</h2>

              <div className="grid cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {featuredProductsdata?.data?.items?.map(item => (
                  <FeaturedProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        )
      }
      {
        isLoadingFeaturedProducts && (
          <div className="max-w-screen-xl mx-auto p-4 space-y-16 relative z-10">
            <HorizontalLoader />
          </div>
        )
      }
      <div className="max-w-screen-xl mx-auto p-4 space-y-16">
        <GridSwiper
          title={translation.offers}
          badgeType={"blue"}
          type={"GIVEAWAY"}
          route={"/products?itemType=GIVEAWAY&itemStatus=AVAILABLE"}
          id={"giveaway"}
        />
      </div>
      <div className="max-w-screen-xl mx-auto p-4 space-y-16">
        <div className="lego-places">
          <h2 className="section-title mb-8">Where to Find <span className="red-txt">LEGO</span> Products</h2>
          <div className="grid-card-container">
            <Swiper
              dir={state.LANG === "AR" ? "rtl" : "ltr"}
              modules={[Navigation, Grid]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              slidesPerGroup={1}
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
      </div>
      <div className="join-club max-w-screen-xl mx-auto p-4 space-y-16" style={{ backgroundImage: `url(${join.src})` }}>
        <div>
          <h2 className="section-title mb-8">Join the LEGO Club</h2>
          <p>New members receive a digital welcome pack and access to exclusive club activities!</p>
          <a href="https://bricksarabia.club/" className="primary-btn" target="_blank" rel="noopener noreferrer">Join Now</a>
        </div>
      </div>
    </>
  );
}
