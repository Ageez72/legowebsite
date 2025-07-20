'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import { logout } from '@/actions/utils';
import { useAppContext } from '../../../../context/AppContext';

export default function LogoutModal({ open, setOpen }) {
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(en); // default fallback

    useEffect(() => {
        setTranslation(state.LANG === "EN" ? en : ar);
    }, [state.LANG]);

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-start shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl px-4 py-5"
                    >
                        <svg className='m-auto my-2' xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none">
                            <rect width="150" height="150" rx="75" fill="#8D1A14" fillOpacity="0.12" />
                            <path d="M62.6407 75.21C62.6407 73.98 63.6607 72.96 64.8907 72.96H81.3307V47.58C81.3007 46.14 80.1607 45 78.7207 45C61.0507 45 48.7207 57.33 48.7207 75C48.7207 92.67 61.0507 105 78.7207 105C80.1307 105 81.3007 103.86 81.3007 102.42V77.43H64.8907C63.6307 77.46 62.6407 76.44 62.6407 75.21Z" fill="#8D1A14" />
                            <path d="M100.621 73.62L92.1008 65.07C91.2308 64.2 89.7908 64.2 88.9208 65.07C88.0508 65.94 88.0508 67.38 88.9208 68.25L93.6008 72.93H81.3008V77.43H93.5708L88.8908 82.11C88.0208 82.98 88.0208 84.42 88.8908 85.29C89.3408 85.74 89.9108 85.95 90.4808 85.95C91.0508 85.95 91.6208 85.74 92.0708 85.29L100.591 76.74C101.491 75.9 101.491 74.49 100.621 73.62Z" fill="#8D1A14" />
                        </svg>
                        <h3 className="sub-title text-center mt-5 mb-7">{translation.logoutConfirmation}</h3>
                        <div className="bg-gray-50">
                            <div>
                                <button
                                    type="button"
                                    href="/home"
                                    className="primary-btn flex-1 flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-white mb-4"
                                    onClick={logout}
                                >
                                    {translation.logout}
                                </button>
                            </div>
                            <div>

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="gray-btn flex-1 mt-3 flex w-full justify-center rounded-md px-3 py-2 shadow-xs sm:mt-0 "
                                >
                                    {translation.no}
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
