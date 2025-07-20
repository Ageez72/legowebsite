'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import en from "../../../../locales/en.json";
import ar from "../../../../locales/ar.json";
import { logout } from '@/actions/utils';
import { useAppContext } from '../../../../context/AppContext';

export default function SuccessUpdateModal({ title, open, setOpen }) {
    const { state = {} } = useAppContext() || {};
    const [translation, setTranslation] = useState(en);

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
                            <rect width="150" height="150" rx="75" fill="#009941" fillOpacity="0.12" />
                            <path d="M75 45C58.47 45 45 58.47 45 75C45 91.53 58.47 105 75 105C91.53 105 105 91.53 105 75C105 58.47 91.53 45 75 45ZM89.34 68.1L72.33 85.11C71.91 85.53 71.34 85.77 70.74 85.77C70.14 85.77 69.57 85.53 69.15 85.11L60.66 76.62C59.79 75.75 59.79 74.31 60.66 73.44C61.53 72.57 62.97 72.57 63.84 73.44L70.74 80.34L86.16 64.92C87.03 64.05 88.47 64.05 89.34 64.92C90.21 65.79 90.21 67.2 89.34 68.1Z" fill="#009941" />
                        </svg>
                        <h3 className="sub-title text-center mt-5 mb-7">{title}</h3>
                        <div className="bg-gray-50">
                            <div>
                                <button
                                    type="button"
                                    href="/home"
                                    className="primary-btn flex-1 flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-white mb-4"
                                    onClick={() => setOpen(false)}
                                >
                                    {translation.ok}
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
