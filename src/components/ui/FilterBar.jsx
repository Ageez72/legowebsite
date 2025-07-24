"use client"
import React, { useState, useEffect } from 'react';
import FilterSingleItem from './FilterSingleItem';
import Select2Form from './Select2Form';
import MultiRangeSlider from './MultiRangeSlider';
import MultiAgesRangeSlider from './MultiAgesRangeSlider';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_API } from '../../../constant/endpoints';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';



export default function FilterBar({ isProductsPage, close, catalogEndpoint, categoriesEndpoint, sortItem, pageSizeItem, searchTerm, onClose }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // default fallback
    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);
    const [showClearButton, setShowClearButton] = useState(false);

    const itemTypeOptions = [
        {
            id: 1,
            title: translation.newArrivals,
            value: "NEW ARRIVAL"
        },
        {
            id: 2,
            title: translation.commingSoon,
            value: "COMMING SOON"
        },
        {
            id: 3,
            title: translation.offers,
            value: "GIVEAWAY"
        },
        {
            id: 4,
            title: translation.clearance,
            value: "CLEARANCE"
        },
    ]
    const router = useRouter();
    const useParams = useSearchParams();
    const lang = Cookies.get('lang') || 'AR';

    const [fromPrice, setFromPrice] = useState(useParams.get('fromPrice') || 0); // نطاق السعر
    const [toPrice, setToPrice] = useState(useParams.get('toPrice') || 1600); // نطاق السعر
    const [fromAge, setFromAge] = useState(useParams.get('fromAge') || 0); // نطاق العمر
    const [toAge, setToAge] = useState(useParams.get('toAge') || 17); // نطاق العمر
    const [itemType, setItemType] = useState(useParams.get('itemType') || ""); // الاقسام
    const [brand, setBrand] = useState(`${Cookies.get("brandID")}`); // العلامات التجارية
    const [category, setCategory] = useState(useParams.get('category') ? useParams.get('category').split(',') : ""); // التصنيفات
    const [catalog, setCatalog] = useState(useParams.get('catalog') ? useParams.get('catalog').split(',') : ""); // الاستخدامات
    const [itemStatus, setItemStatus] = useState(useParams.get('itemStatus') || "AVAILABLE"); // حالة التوفر
    const [categoriesAllOptions, setCategoriesAllOptions] = useState([])
    const [catalogsAllOptions, setCatalogsAllOptions] = useState([])
    const [selectedCategoriesOptions, setSelectedCategoriesOptions] = useState([])
    const [selectedCatalogsOptions, setSelectedCatalogsOptions] = useState([])
    const [categoryOpen, setCategoryOpen] = useState(false)
    const [catalogOpen, setCatalogOpen] = useState(false)

    const handleApplyFilters = () => {

        if (isProductsPage) {
            const query = new URLSearchParams();

            if (fromPrice) query.set('fromPrice', fromPrice);
            if (toPrice) query.set('toPrice', toPrice);
            if (fromAge) query.set('fromAge', fromAge);
            if (toAge) query.set('toAge', toAge);
            if (itemType) query.set('itemType', itemType);
            if (itemStatus) query.set('itemStatus', itemStatus);
            if (sortItem) query.set('sort', sortItem);
            if (pageSizeItem) query.set('pageSize', pageSizeItem);
            if (searchTerm) query.set('search', searchTerm);
            if (brand && brand.length > 0) query.set('brand', `${Cookies.get("brandID")}`);
            if (category && category.length > 0) query.set('category', category.join(','));
            if (catalog && catalog.length > 0) query.set('catalog', catalog.join(','));
            // Clear pagination token when filters change
            Cookies.remove('pagesToken');
            // Push new query to URL
            router.push(`/products?${query.toString()}`);
        } else {
            const searchParams = new URLSearchParams(); // This will be used for building query
            let searchItems = '';

            if (fromPrice) searchParams.append('fromPrice', fromPrice);
            if (toPrice) searchParams.append('toPrice', toPrice);
            if (fromAge) searchParams.append('fromAge', fromAge);
            if (toAge) searchParams.append('toAge', toAge);
            if (itemType) searchParams.append('itemType', itemType);
            if (itemStatus) searchParams.append('itemStatus', itemStatus);
            if (sortItem) searchParams.append('sort', sortItem);
            if (pageSizeItem) searchParams.append('pageSize', pageSizeItem);
            if (searchTerm) searchParams.append('search', searchTerm);
            if (brand && brand.length > 0) searchParams.append('brand', brand.join(','));
            if (category && category.length > 0) searchParams.append('category', category.join(','));
            if (catalog && catalog.length > 0) searchParams.append('catalog', catalog.join(','));

            searchItems = `${searchParams.toString()}`;
            Cookies.set('store_filters', searchItems);
            onClose && onClose()
        }
    };

    const handleClearFilter = () => {
        if (isProductsPage) {
            const query = new URLSearchParams();
            Cookies.remove('pagesToken');
            query.set('page', '1');
            // Reset all filters
            setFromPrice(0);
            setToPrice(1600);
            setFromAge(0);
            setToAge(17);
            setItemType("");
            setItemStatus("");
            setBrand([`${Cookies.get("brandID")}`]);
            setCategory([]);
            setCatalog([]);

            setSelectedCategoriesOptions([]);
            setSelectedCatalogsOptions([]);

            // Push clean URL
            router.push(`/products?itemStatus=AVAILABLE&brand=${Cookies.get("brandID")}`);
        } else {
            Cookies.remove('store_filters');
            onClose && onClose()
        }
    }

    const changePriceFrom = (from) => {
        setFromPrice(from);
    }

    const changePriceTo = (to) => {
        setToPrice(to)
    }

    const changeAgeFrom = (from) => {
        setFromAge(from);
    }

    const changeAgeTo = (to) => {
        setToAge(to)
    }

    const changeSingleItem = (name, value) => {
        if (name === "itemType") {
            setItemType(value)
        } else if (name === "itemStatus") {
            setItemStatus(value)
        }
    }

    const changeMultiItem = (name, value) => {
        if (name === "categories") {
            setCategory(value.map(item => item.value))
        } else if (name === "catalog") {
            setCatalog(value.map(item => item.value))
        }
    }

    const parentOptions = (st, options) => {
        // console.log(options);

        setBrand(options)
        fetchCategoriesOptions(st, options)
    }

    // get all options
    const fetchCategoriesOptions = async (ch, brands = []) => {

        const res = await axios.get(`${BASE_API}${categoriesEndpoint}&brand=${Cookies.get("brandID")}&lang=${lang}&token=${Cookies.get('token')}`, {});

        setCategoriesAllOptions(res.data);
        const arr = res.data.filter(item => category.includes(item.categoryId));
        let selected = [];
        arr?.map(item => (
            selected.push({
                label: item.description,
                value: item.categoryId
            })
        ))
        if (!ch) {
            setCategoryOpen(true)
        }
        setSelectedCategoriesOptions(selected)
    }

    const fetchCatalogsOptions = async () => {
        const lang = Cookies.get('lang') || 'AR';
        const res = await axios.get(`${BASE_API}${catalogEndpoint}&lang=${lang}&token=${Cookies.get('token')}`, {});
        setCatalogsAllOptions(res.data);
        const arr = res?.data?.catalogs?.filter(item => catalog.includes(item.code));
        let selected = [];
        arr?.map(item => (
            selected.push({
                label: item.name,
                value: item.categoryId
            })
        ))
        setCatalogOpen(true)
        setSelectedCatalogsOptions(selected)
    }

    useEffect(() => {
        fetchCatalogsOptions()
        parentOptions(false, brand)
        // if(brand.length){
        // }else {
        //     fetchCategoriesOptions(true, brand)
        // }
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const entries = Array.from(params.entries());

        // Exclude default filter like itemStatus=AVAILABLE
        const meaningfulParams = entries.filter(([key, value]) => {
            return !(key === 'itemStatus' && value === 'AVAILABLE');
        });

        if (meaningfulParams.length > 1) {
            setShowClearButton(true);
        } else {
            setShowClearButton(false);
        }
    }, [useParams.toString()]);

    return (
        <>
            <div className={`filter-bar card ${isProductsPage ? "filter-products-page" : "hero-filter"}`}>
                <div className="filter-header flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <i className="icon-filter-search"></i>
                        <span className='filter-title'>{translation.filterResults}</span>
                    </div>
                    {
                        <div className="close-filter">
                            <i className="icon-multiplication-sign cursor-pointer" onClick={() => {
                                if (onClose) {
                                    onClose();
                                }
                                const filterElement = document.querySelector(".filter-products-page");
                                if (filterElement) {
                                    filterElement.classList.remove("active");
                                    document.documentElement.classList.remove("html-overflow");
                                }
                            }}></i>
                        </div>

                    }
                </div>
                <div className="filter-body">
                    <FilterSingleItem title={translation.sectors} selected={itemType} options={itemTypeOptions} name="itemType" handleSingleItem={changeSingleItem} />
                    <MultiRangeSlider title={translation.priceRange} min={0} max={1600} selectedFrom={fromPrice} selectedTo={toPrice} handlePriceFrom={changePriceFrom} handlePriceTo={changePriceTo} />
                    <MultiAgesRangeSlider title={"Age Range"} min={0} max={17} selectedFrom={fromAge} selectedTo={toAge} handleAgeFrom={changeAgeFrom} handleAgeTo={changeAgeTo} />
                    {
                        categoryOpen && (
                            <Select2Form title={"Themes"} options={categoriesAllOptions} name="categories" handleMultiItem={changeMultiItem} initSelected={selectedCategoriesOptions} initiallyOpen={selectedCategoriesOptions.length > 0} />
                        )
                    }
                    {
                        catalogOpen && (
                            <Select2Form title={translation.catalogs} options={catalogsAllOptions} name="catalog" handleMultiItem={changeMultiItem} initSelected={selectedCatalogsOptions} initiallyOpen={selectedCatalogsOptions.length > 0} />
                        )
                    }
                    {/* <FilterSingleItem title={translation.availablity} selected={itemStatus} options={StatusOptions} name="itemStatus" handleSingleItem={changeSingleItem} /> */}

                    <div className="action-btns flex gap-3 mt-4">
                        <button className="primary-btn flex-1" onClick={handleApplyFilters}>{translation.apply}</button>
                        {showClearButton && (
                            <button className="gray-btn flex-1" onClick={handleClearFilter}>
                                {translation.clear}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
