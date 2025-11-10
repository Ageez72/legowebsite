"use client";
import React, { useEffect, useState } from "react";
import "../src/assets/js/main";
import BrandsSwiper from "@/components/ui/BrandsSwiper";
import GridSwiper from "@/components/ui/GridSwiper";
import Hero from "@/components/ui/Hero";
import { useAppContext } from "../context/AppContext";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_API, endpoints } from "../constant/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import kenzi from "../src/assets/imgs/places/kinzi.jpg";
import wonders from "../src/assets/imgs/places/wonders.jpg";
import toyBox from "../src/assets/imgs/places/toyBox.jpg";
import kiddix from "../src/assets/imgs/places/kiddix.jpg";
import dumyah from "../src/assets/imgs/places/dumyah.jpg";
import kidsToys from "../src/assets/imgs/places/51KidsToys.jpg";
import bambiniJO from "../src/assets/imgs/places/bambiniJO.jpg";
import tales from "../src/assets/imgs/places/tales.jpg";
import tabooshToys from "../src/assets/imgs/places/tabooshToys.png";
import theOutfit from "../src/assets/imgs/places/theOutfit.png";
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
  const [isMobile, setIsMobile] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en);
  const [imagePairs, setImagePairs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : en);
    document.title = "Lego Showroom - Arabian Al-EKha";
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [state.LANG]);

  const fetchFeaturedProducts = async () => {
    const res = await axios.get(
      `${BASE_API}${endpoints.products.list
      }&itemType=FEATURED&token=${Cookies.get(
        "legoToken"
      )}&pageSize=6&itemStatus=ALL&lang=EN&brand=${Cookies.get("brandID")}`
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

  const toggleTooltip = (key) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  console.log(isMobile);

  return (
    <main>
      <Hero />
      <BrandsSwiper />
      <GridSwiper
        title={translation.newArrivals}
        badgeType={"blue"}
        type={"NEW ARRIVAL"}
        route={"/products?itemType=NEW ARRIVAL&itemStatus=ALL"}
        id={"new-arrival"}
      />
      {featuredProductsdata?.data.items.length > 0 &&
        !isLoadingFeaturedProducts && (
          <section className="featuredProducts-wrapper">
            <div className="featuredProducts-patterns">
              <img
                src={union.src}
                alt="Union Pattern"
                className="union-pattern"
              />
              <img
                src={rectangle.src}
                alt="Rectangle Pattern"
                className="rectangle-pattern"
              />
              <img
                src={frame.src}
                alt="Frame Pattern"
                className="frame-pattern"
              />
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
                className={`${featuredProductsdata?.data?.items?.length <= 6 &&
                  "just-four-items"
                  }`}
                breakpoints={{
                  550: {
                    // screens >= 320px
                    slidesPerView: 2,
                    grid: { rows: 1 },
                    spaceBetween: 10,
                  },
                  760: {
                    // screens >= 760
                    slidesPerView: 2,
                    grid: { rows: 1 },
                    spaceBetween: 10,
                  },
                  1024: {
                    // screens >= 1024px
                    slidesPerView: 2,
                    grid: { rows: 2, fill: "row" },
                    spaceBetween: 10,
                  },
                  1160: {
                    // screens >= 1160
                    slidesPerView: 3,
                    grid: { rows: 2, fill: "row" },
                    spaceBetween: 20,
                  },
                  1320: {
                    // screens >= 1024px
                    slidesPerView: 3,
                    grid: { rows: 2, fill: "row" },
                    spaceBetween: 20,
                  },
                }}
              >
                {featuredProductsdata?.data?.items
                  ?.slice(0, 6)
                  .map((item, i) => (
                    <SwiperSlide key={item.id}>
                      <FeaturedProductCard key={item.id} item={item} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </section>
        )}
      {isLoadingFeaturedProducts && (
        <section className="max-w-screen-xl mx-auto p-4 space-y-16 relative z-10">
          <HorizontalLoader />
        </section>
      )}
      <GridSwiper
        title={translation.offers}
        badgeType={"blue"}
        type={"GIVEAWAY"}
        route={"/products?itemType=GIVEAWAY&itemStatus=ALL"}
        id={"giveaway"}
      />
      <section className="max-w-screen-xl mx-auto px-4 space-y-16 custom-py-40">
        <div className="lego-places">
          <h2 className="section-title mb-0">
            Where to Find <span className="red-txt">LEGO</span> Products
          </h2>
          <div className="grid-card-container">
            <Swiper
              dir={state.LANG === "EN" ? "ltr" : "ltr"}
              modules={[Navigation, Grid]}
              navigation
              spaceBetween={10}
              slidesPerView={2}
              slidesPerGroup={1}
              className="swiper-overflow-visible"
              // className={`just-four-items`}
              breakpoints={{
                550: {
                  // screens >= 320px
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                760: {
                  // screens >= 760
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                1024: {
                  // screens >= 1024px
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
                1160: {
                  // screens >= 1160
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
                1320: {
                  // screens >= 1024px
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              }}
            >
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("kenzi") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "kenzi" ? "opacity-100" : "opacity-0"} 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Kenzi
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img src={kenzi.src} alt="Kenzi" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Kenzi</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("Wonders") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "Wonders" ? "opacity-100" : "opacity-0"
                      } 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Wonders
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img
                        className="tall-image"
                        src={wonders.src}
                        alt="Wonders"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Wonders</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("toyBox") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "toyBox" ? "opacity-100" : "opacity-0"} 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Toy Box
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img
                        className="tall-image"
                        src={toyBox.src}
                        alt="Toy Box"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Toy Box</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("Kiddix") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "Kiddix" ? "opacity-100" : "opacity-0"} 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Kiddix
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img src={kiddix.src} alt="Kiddix" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Kiddix</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("Dumyah") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "Dumyah" ? "opacity-100" : "opacity-0"} 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Dumyah
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img src={dumyah.src} alt="Dumyah" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Dumyah</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("Bambini") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "Bambini" ? "opacity-100" : "opacity-0"
                      } 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Bambini JO
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img src={bambiniJO.src} alt="Bambini JO" />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Bambini JO</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("kidsToys") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "kidsToys" ? "opacity-100" : "opacity-0"
                      } 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      51 Kids & Toys
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img
                        className="tall-image"
                        src={kidsToys.src}
                        alt="51 Kids Toys"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">51 Kids & Toys</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("talesStore") : null)}
                >
                  {/* Tooltip above the card */}
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "talesStore" ? "opacity-100" : "opacity-0"
                      } 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Tales Store
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img
                        // className="tall-image"
                        src={tales.src}
                        alt="Tales Store"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Tales Store</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("tabooshToys") : null)}
                >
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "tabooshToys" ? "opacity-100" : "opacity-0"
                      } 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      Taboosh Toys
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img
                        // className="tall-image"
                        src={tabooshToys.src}
                        alt="Taboosh Toys"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">Taboosh Toys</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div
                  className="relative card group flex items-center justify-center"
                  onClick={() => (isMobile ? toggleTooltip("theOutfit") : null)}
                >
                  <div
                    className={`
                    absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 
                    transition-opacity duration-300
                    ${activeTooltip === "theOutfit" ? "opacity-100" : "opacity-0"
                      } 
                    group-hover:opacity-100 pointer-events-none
                  `}
                  >
                    <div className="relative w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow">
                      The Outfit
                      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex items-center justify-center">
                    <div className="card-image">
                      <img
                        // className="tall-image"
                        src={theOutfit.src}
                        alt="The Outfit"
                      />
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">The Outfit</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>
      <section
        className="join-club max-w-screen-xl mx-auto p-4 space-y-16"
        style={{ backgroundImage: `url(${join.src})` }}
      >
        <div>
          <h2 className="section-title mb-8">Join the Bricks Arabia Club</h2>
          <p>
            New members receive a digital welcome pack and access to exclusive
            club activities!
          </p>
          <a
            href="https://bricksarabia.club/"
            className="primary-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Now
          </a>
        </div>
      </section>
    </main>
  );
}
