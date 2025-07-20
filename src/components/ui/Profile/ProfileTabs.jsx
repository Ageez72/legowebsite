'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { profileTabs } from './tabs';
import TabPanel from './TabPanel';
import MyProfile from './Tabs/MyProfile';
import MyOrders from './Tabs/MyOrders';
import Adressess from './Tabs/Adressess';
import Security from './Tabs/Security';
import { getProfile } from '@/actions/utils';
import { useAppContext } from '../../../../context/AppContext';
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import LogoutModal from './LogoutModal';

export default function ProfileTabs() {
    const [hasMounted, setHasMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [profileData, setProfileData] = useState(null);
    const [translation, setTranslation] = useState(en);
    const [firstLetter, setFirstLetter] = useState('');
    const [lastLetter, setLastLetter] = useState('');
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { state = {}, dispatch = () => { } } = useAppContext() || {};

    const getInitials = (str) => {
        if (!str) return ['', ''];
        const words = str.trim().split(/\s+/);
        const first = words[0]?.[0] || '';
        const last = words[words.length - 1]?.[0] || '';
        return [first.toUpperCase(), last.toUpperCase()];
    };


    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    useEffect(() => {
        const queryTab = searchParams?.keys().next().value;
        if (queryTab && profileTabs.some(t => t.id === queryTab)) {
            setActiveTab(queryTab);
        }
        setTimeout(() => {
            const profile = getProfile();
            setProfileData(profile ? profile : []);
            
            const [firstInitial, lastInitial] = getInitials(profile?.name);
            setFirstLetter(firstInitial)
            setLastLetter(lastInitial)
        }, 500);
    }, [searchParams]);

    if (!hasMounted) return null;

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        router.replace(`/profile?${tabId}`);
    };

    return (
        <>
            <LogoutModal setOpen={() => setOpenLogoutModal(false)} open={openLogoutModal} />
            <div className="flex flex-col lg:flex-row gap-4 mt-5 lg:mt-10">
                <aside className="w-full lg:w-1/4 profile-side-bar">
                    <div className="bg-white p-4 rounded-lg mb-4">
                        <div className="flex profile-dropdown-header py-2">
                            <div className="me-3 shrink-0">
                                <span className="profile-img block p-2 bg-gray-100 rounded-full">
                                    <span>{firstLetter}</span>
                                    <span>.</span>
                                    <span>{lastLetter}</span>
                                </span>
                            </div>
                            <div>
                                <p className="mb-0 username text-base leading-none text-gray-900 dark:text-white">
                                    {profileData?.name}
                                </p>
                                <p className="user-email mb-0 mt-2 text-sm font-normal">
                                    {profileData?.email}
                                </p>
                            </div>
                        </div>
                        <ul className="pt-3">
                            {profileTabs.map((tab) => (
                                <li key={tab.id}>
                                    <button
                                        onClick={() => handleTabClick(tab.id)}
                                        className={`flex items-center justify-between w-full text-right cursor-pointer px-2 py-2 rounded-md ${activeTab === tab.id ? 'active' : 'hover:bg-gray-100'}`}
                                    >
                                        <span className="flex items-center">
                                            <i className={`${tab.icon} type`}></i>
                                            <span className="flex items-center justify-between block px-2 py-2">
                                                {tab.label}
                                            </span>
                                        </span>
                                        <i className={`icon-arrow-${state.LANG === 'AR' ? 'left' : 'right'}-01-round text-sm`}></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="logout-wrapper bg-white rounded-lg py-2 px-4">
                        <button className="w-full logout flex items-center cursor-pointer" onClick={() => setOpenLogoutModal(true)}>
                            <i className="icon-logout-03 type"></i>
                            <span className="flex items-center justify-between block px-2 py-2">
                                {translation.logout}
                            </span>
                        </button>
                    </div>
                </aside>

                <div className="w-full lg:w-3/4">
                    <TabPanel id="personal" activeTab={activeTab}>
                        <MyProfile />
                    </TabPanel>
                    <TabPanel id="security" activeTab={activeTab}>
                        <Security />
                    </TabPanel>
                    <TabPanel id="orders" activeTab={activeTab}>
                        <MyOrders />
                    </TabPanel>
                    <TabPanel id="addresses" activeTab={activeTab}>
                        <Adressess />
                    </TabPanel>
                </div>
            </div>
        </>
    );
}
