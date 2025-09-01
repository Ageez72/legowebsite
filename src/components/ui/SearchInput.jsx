"use client";
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API, endpoints } from '../../../constant/endpoints';
import { useDebounce } from '../../../lib/useDebounce';
import Link from 'next/link';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';

export default function SearchInput({ bulk, onCollectBulkItems, pageSize, onCollectQuickAdd, resetTrigger, onResetDone }) {
    const { push } = useRouter();
    const [searchText, setSearchText] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [hasSelected, setHasSelected] = useState(false);
    const debouncedSearchText = useDebounce(searchText, 500);
    const lang = Cookies.get('lang') || 'EN';
    const { state = {}, dispatch = () => {} } = useAppContext() || {};

    // ✅ Setup translation state
    const [translation, setTranslation] = useState(en); // fallback default
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : en);
    }, [state.LANG]);

    useEffect(() => {
        Cookies.remove('store_filters');
    }, []);

    useEffect(() => {
        if (resetTrigger) {
            setSearchText('');
            setSelectedProduct(null);
            setHasSelected(false);
            onResetDone?.();
        }
    }, [resetTrigger, onResetDone]);

    const fetchProducts = async ({ queryKey }) => {
        const [_key, searchText] = queryKey;
        const filterItems = Cookies.get('store_filters') || '';
        const token = Cookies.get("legoToken");
        const url = `${BASE_API}${endpoints.products.list}&search=${encodeURIComponent(searchText)}&pageSize=${pageSize || 3}&${filterItems}&itemStatus=ALL&lang=EN&token=${token}&brand=${Cookies.get("brandID")}&`;
        const res = await axios.get(url, {});

        return res.data;
    };

    const { data, isFetching, error } = useQuery({
        queryKey: [`products-search-list`, debouncedSearchText],
        queryFn: fetchProducts,
        enabled: debouncedSearchText.length >= 3 && !hasSelected,
        cacheTime: 0,
    });

    useEffect(() => {
        if (error instanceof Error) {
            push('/');
        }
    }, [error, push]);

    const handleSelectProduct = (item) => {
        setSelectedProduct(item);
        setSearchText(item.name);
        setHasSelected(true);
        onCollectBulkItems?.(item);
        onCollectQuickAdd?.(item);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (hasSelected) setHasSelected(false);
    };

    const showResults = data?.items?.length > 0 && !hasSelected;
    const filterItems = Cookies.get('store_filters') || '';

    return (
        <>
            <input
                className={`w-full h-full ${!bulk ? 'ps-10 p-2.5' : ''}`}
                type='text'
                placeholder={translation.searchProduct}
                value={searchText}
                onChange={handleInputChange}
            />

            {showResults && !isFetching && (
                <div className={`search-results-listing ${bulk ? 'bulk-listing' : ''}`}>
                    {data.items.map((item) => (
                            <Link href={`products/${item.id}`} className='view-details flex items-center w-full' key={item.id}>
                        <div className='search-item flex items-center justify-between w-full'>
                            <div className='flex items-center gap-2'>
                            <span className='image'>
                                <img width={40} height={40} src={item.images["50"].main} alt={item.name} />
                            </span>
                            <span className='title'>{item.name}</span>
                            </div>
                            {/* <span className='price'>{Number(item.priceAfterDisc).toFixed(2)} {translation.jod}</span> */}
                            <span className="icon-arrow-left-01-round"></span>
                        </div>
                            </Link>
                    ))}

                    {!bulk && (
                        <>
                            <hr />
                            <Link
                                href={`/products?brand=${Cookies.get("brandID")}&search=${searchText}&${filterItems ? filterItems : 'itemStatus=ALL'}`}
                                className='flex items-center gap-2 all-products'
                            >
                                <span>{translation.viewAllProducts}</span>
                                <span className="icon-arrow-left-01-round"></span>
                            </Link>
                        </>
                    )}
                </div>
            )}

            {data?.items?.length === 0 && !hasSelected && (
                <div className={`search-results-listing no-results`}>
                    {translation.noResults}
                </div>
            )}
            {isFetching && (
                <div className={`search-results-listing no-results`}>
                    {translation.loading}
                </div>
            )}
        </>
    );
}
