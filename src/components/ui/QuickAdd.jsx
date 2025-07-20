'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import SearchInput from './SearchInput';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";

export default function QuickAdd({ openSidebar }) {
    const [count, setCount] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);
    const [resetSearch, setResetSearch] = useState(false);
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const lang = state.LANG;

    const [translation, setTranslation] = useState(en);
    useEffect(() => {
        setTranslation(state.LANG === 'EN' ? en : ar);
    }, [state.LANG]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        setCount(isNaN(value) || value < 1 ? 1 : value);
    };

    const getSelectedProduct = (item) => {
        setSelectedItem(item);
    };

    return (
        <>
            <div className="quick-add-container flex">
                <div className="search-input form-group mb-0">
                    <div className="relative h-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <i className="icon-search-normal"></i>
                        </div>
                        <SearchInput
                            bulk={false}
                            onCollectQuickAdd={getSelectedProduct}
                            resetTrigger={resetSearch}
                            onResetDone={() => setResetSearch(false)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
