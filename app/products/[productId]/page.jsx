'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGallery from '@/components/ui/ProductGallery';
import DetailsProductCard from '@/components/ui/DetailsProductCard';
import Badge from '@/components/ui/Badge';
import RelatedProducts from '@/components/ui/RelatedProducts';
import { useAppContext } from "../../../context/AppContext";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import Link from 'next/link';
import Loader from '@/components/ui/Loaders/Loader';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import NotFound from '../../not-found';

let breadcrumbItems = [];
export default function Page() {
  const [refresh, setRefresh] = useState(false);
  const { productId } = useParams();
  const lang = Cookies.get('lang') || 'EN';
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en); // default fallback
  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : en);
  }, [state.LANG]);

  const { push } = useRouter();
  async function fetchProductDetails() {
    const res = await axios.get(`${BASE_API}${endpoints.products.list}&lang=EN&id=${productId}&token=${Cookies.get("legoToken")}`, {});
    return res;
  }
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`product-details-${productId}`],
    queryFn: fetchProductDetails,
  });

  // Effect to re-call the API whenever refresh is changed
  useEffect(() => {
    if (refresh) {
      refetch();
      setRefresh(false); // reset after fetching
    }
  }, [refresh, refetch]);

  let details = data?.data?.items[0];
  if (isLoading) return <Loader />;


  if (Array.isArray(data?.data?.items) && data?.data?.items?.length === 0) {
    return (
      <NotFound />
    );
  }

  breadcrumbItems = [
    { label: translation.home, href: '/' },
    { label: `Showroom`, href: `/products?brand=${details?.brand?.id}&itemStatus=ALL` },
    { label: `${details?.name}` }
  ]
  const getAge = (str) => {
    const match = str[0].match(/\d+/);
    return match ? match[0] : null;
  }

  return details ? (
    <div className="max-w-screen-xl mx-auto p-4 product-details">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5 pt-5 pb-5 details-card">
        <ProductGallery images={details?.images["800"].list} main={details?.images["800"].main} />
        <DetailsProductCard item={details} />
      </div>
      <div className="card mt-5">
        {
          details?.brand.description || details?.category.description || details?.dimentions || details?.dimentions || details?.netWeightKg || details?.barcode || details?.constants.AGES || details?.constants.GENDER.length || details?.constants.MATERIAL.length ? (
            <h3 className="sub-title mb-5">{translation.productSpecifications}</h3>
          ) : null
        }
        <div className="specifications-table lg:w-1/2 mb-10">
            {
              details?.brand.description && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.brand}</strong></div>
                  <div className="info w-1/2">{details?.brand.description}</div>
                </div>
              )
            }
            {
              details?.category.description && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.type}</strong></div>
                  <div className="info w-1/2">{details?.category.description}</div>
                </div>
              )
            }
            {
              details?.id && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.productNumber}</strong></div>
                  <div className="info w-1/2">{details?.id}</div>
                </div>
              )
            }
            {
              details?.barcode && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.barcode}</strong></div>
                  <div className="info w-1/2">{details?.barcode}</div>
                </div>
              )
            }
            {
              Array.isArray(details?.constants.AGES) &&
              details.constants.AGES.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.age}</strong></div>
                  <div className="info w-1/2">{details?.constants.AGES}</div>
                </div>
              )
            }
            {
              Array.isArray(details?.constants["GROUP-PLAY"]) ?
              details.constants["GROUP-PLAY"].some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.groupPlay}</strong></div>
                  <div className="info w-1/2">{details?.constants["GROUP-PLAY"]}</div>
                  {/* <div className="info w-1/2">+{getAge(details?.constants.AGES)} {translation.years}</div> */}
                </div>
              ) : null
            }
            {
              Array.isArray(details?.constants.CHARACTERS) ?
              details.constants.CHARACTERS.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.characters}</strong></div>
                  <div className="info w-1/2">{
                    details?.constants.CHARACTERS.map((el, index) => (
                      <span key={index}>{el} {index !== details?.constants.CHARACTERS.length - 1 && `${state.LANG === "AR" ? '، ' : ', '}`}</span>
                    ))
                  }</div>
                </div>
              ) : null
            }
            {
              Array.isArray(details?.constants.GENDER) ?
              details.constants.GENDER.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.gender}</strong></div>
                  <div className="info w-1/2">
                    {details.constants.GENDER.map((el, index) => (
                      el.trim() !== "" ? (
                        <span key={index}>
                          {el}
                          {index !== details.constants.GENDER.length - 1 &&
                            `${state.LANG === "AR" ? '،' : ','}`}
                        </span>
                      ) : null
                    ))}
                  </div>
                </div>
              ) : null
            }
            {
              Array.isArray(details?.constants.MATERIAL) ?
              details.constants.MATERIAL.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.material}</strong></div>
                  <div className="info w-1/2">{
                    details?.constants.MATERIAL.map((el, index) => (
                      <span key={index}>{el} {index !== details?.constants.MATERIAL.length - 1 && `${state.LANG === "AR" ? '، ' : ', '}`}</span>
                    ))
                  }</div>
                </div>
              )
              :
              null
            }
            {
              details?.grossWeightKg ? (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.weight}</strong></div>
                  <div className="info w-1/2">{details?.grossWeightKg}</div>
                </div>
              ): null
            }
            {
              details?.netWeightKg && details?.netWeightKg > 0 ? (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.netWeight}</strong></div>
                  <div className="info w-1/2">{details?.netWeightKg}</div>
                </div>
              ) : null
            }
            {
              Array.isArray(details?.constants?.COUNTRY_OF_ORIGIN) ?
              details.constants.COUNTRY_OF_ORIGIN.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.countryOfOrigin}</strong></div>
                  <div className="info w-1/2">{details?.constants.COUNTRY_OF_ORIGIN}</div>
                  {/* <div className="info w-1/2">+{getAge(details?.constants.AGES)} {translation.years}</div> */}
                </div>
              ) : null
            }
            {/* {
              Array.isArray(details?.constants.COLOR) &&
              details.constants.COLOR.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.colors}</strong></div>
                  <div className="info w-1/2">{details?.constants.COLOR}</div>
                </div>
              )
            } */}
            {
              Array.isArray(details?.constants.B_TYPES) ?
              details.constants.B_TYPES.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.batteryType}</strong></div>
                  <div className="info w-1/2">{details?.constants.B_TYPES}</div>
                  {/* <div className="info w-1/2">+{getAge(details?.constants.AGES)} {translation.years}</div> */}
                </div>
              ): null
            }
            {
              Array.isArray(details?.constants.BATTERY_CHARGER_INCLUDED) ?
              details.constants.BATTERY_CHARGER_INCLUDED.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.batteryChargerIncluded}</strong></div>
                  <div className="info w-1/2">{details?.constants.BATTERY_CHARGER_INCLUDED}</div>
                </div>
              ) : null
            }
            {
              Array.isArray(details?.constants.BATTERY_DURATION) ?
              details.constants.BATTERY_DURATION.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.batteryDuration}</strong></div>
                  <div className="info w-1/2">{details?.constants.BATTERY_DURATION}</div>
                </div>
              ) : null
            }
            {
              Array.isArray(details?.constants.MAX_WEIGHT) ?
              details.constants.MAX_WEIGHT.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.maxWeight}</strong></div>
                  <div className="info w-1/2">{details?.constants.MAX_WEIGHT}</div>
                </div>
              ) : null
            }

            {
              Array.isArray(details?.constants.MAX_SPEED) ?
              details.constants.MAX_SPEED.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.maxSpeed}</strong></div>
                  <div className="info w-1/2">{details?.constants.MAX_SPEED}</div>
                </div>
              ) : null
            }
            {/* {
              Array.isArray(details?.constants.LANGUAGE) &&
              details.constants.LANGUAGE.some(el => el.trim() !== "") && (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.language}</strong></div>
                  <div className="info w-1/2">{details?.constants.LANGUAGE}</div>
                </div>
              )
            } */}
            {
              details?.dimentions ? (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.dimentions}</strong></div>
                  <div className="info w-1/2">{details?.dimentions}</div>
                </div>
              ) : null
            }
            {
              details?.assembledDimensionsCentimeters ? (
                <div className="item flex w-full">
                  <div className="title w-1/2"><strong>{translation.assembledDimensions}</strong></div>
                  <div className="info w-1/2">{details?.assembledDimensionsCentimeters}</div>
                </div>
              ) : null
            }

          </div>
        {
          details?.warning && (
            <>
              <h3 className="sub-title mb-5">{translation.warnings}</h3>
              <p className="product-warning" dangerouslySetInnerHTML={{ __html: details?.warning }} />
            </>
          )
        }
        {
          details?.catalogs.length && (
            <>
              <h3 className="sub-title mb-5">{translation.catalogs}</h3>
              <div className="badges flex flex-wrap gap-2">
                {
                  details?.catalogs?.map(b => (
                    <Link href={`/products?brand=${Cookies.get("brandID")}&catalog=${encodeURIComponent(b?.id)}&itemStatus=ALL`} key={b.id}>
                      <Badge className="ltr-badge" type={"catalog-details"} text={b?.description} />
                    </Link>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
      {
        Array.isArray(details?.relatedItems) &&
        details?.relatedItems.some(item => item && item.trim() !== "") && (
          <>
            <h3 className="sub-title mb-7 mt-12">{translation.relatedProducts}</h3>
            <RelatedProducts items={details.relatedItems} />
          </>
        )
      }
    </div>
  ) : null;
}