"use client"
import React, { useState, useEffect } from 'react';
import { getProfile } from '@/actions/utils';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import { BASE_API, endpoints } from '../../../../../constant/endpoints';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddressesLoader from '../../Loaders/AddressesLoader';

export default function Adressess() {
  const [loading, setLoading] = useState(false);
  const [addressesItems, setAddressesItems] = useState([]);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en);
  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.addresses : en.addresses;
  }, [state.LANG]);

  const loadAddresses = () => {
    const items = getProfile();
    setAddressesItems(items.locations);
  };

  const fetchProfile = async () => {
    setLoading(true)
    const res = await axios.get(`${BASE_API}${endpoints.user.profile}&lang=${state.LANG}&token=${Cookies.get('token')}`, {});
    if (res.data.locations) {
      setAddressesItems(res.data.locations);
    }
    setLoading(false)
  };

  useEffect(() => {
    loadAddresses();
    fetchProfile()
  }, []);

  return (
    <div className='py-3'>
      <h2 className='sub-title mb-6'>{translation.addresses}</h2>
      {
        loading && (
          <AddressesLoader />
        )
      }
      {
        !loading && (
          addressesItems?.length ? (
            <>
              {
                addressesItems?.map((add, index) => (
                  <div key={index} className="flex justify-between items-center adress-item mb-5">
                    <span className="flex items-center gap-2">
                      <i className="icon-location location"></i>
                      <span>{add.address}</span>
                    </span>
                  </div>
                ))
              }
            </>
          ) : (
            <div className='card empty-state flex justify-center items-center'>
              <div className="text-center">
                <svg className='m-auto my-2' xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
                  <rect width="260" height="260" rx="130" fill="url(#paint0_linear_198_7306)" />
                  <path opacity="0.4" d="M182.534 189.6C176.201 194.267 167.867 196.667 157.934 196.667H102.067C100.467 196.667 98.8673 196.6 97.334 196.4L143.334 150.4L182.534 189.6Z" fill="#7E818E" />
                  <path opacity="0.4" d="M196.667 102.067V157.933C196.667 167.867 194.267 176.2 189.6 182.533L150.4 143.333L196.4 97.3333C196.6 98.8666 196.667 100.467 196.667 102.067Z" fill="#7E818E" />
                  <path opacity="0.4" d="M150.401 143.333L189.601 182.533C187.667 185.333 185.334 187.667 182.534 189.6L143.334 150.4L97.334 196.4C93.0674 196.133 89.2007 195.267 85.6674 193.933C71.4007 188.733 63.334 176.067 63.334 157.933V102.067C63.334 77.8 77.8006 63.3333 102.067 63.3333H157.934C176.067 63.3333 188.734 71.4 193.934 85.6667C195.267 89.2 196.134 93.0667 196.401 97.3333L150.401 143.333Z" fill="#7E818E" />
                  <path d="M150.399 143.333L189.599 182.533C187.666 185.333 185.333 187.667 182.533 189.6L143.333 150.4L97.3327 196.4C93.066 196.133 89.1993 195.267 85.666 193.933L88.2659 191.333L193.933 85.6667C195.266 89.2 196.133 93.0667 196.399 97.3333L150.399 143.333Z" fill="#7E818E" />
                  <path d="M131.601 102.867C129.067 91.8667 119.334 86.9333 110.801 86.8667C102.267 86.8667 92.534 91.8 90.0007 102.8C87.2007 115 94.6673 125.2 101.401 131.6C104.067 134.133 107.401 135.333 110.801 135.333C114.201 135.333 117.534 134.067 120.201 131.6C126.934 125.2 134.401 115 131.601 102.867ZM111.001 113.267C107.334 113.267 104.334 110.267 104.334 106.6C104.334 102.933 107.267 99.9333 111.001 99.9333H111.067C114.734 99.9333 117.734 102.933 117.734 106.6C117.734 110.267 114.667 113.267 111.001 113.267Z" fill="#7E818E" />
                  <defs>
                    <linearGradient id="paint0_linear_198_7306" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#E9EBED" />
                      <stop offset="1" stopColor="white" />
                    </linearGradient>
                  </defs>
                </svg>
                <h2 className='sub-title my-4 text-center'>{translation.noAddresses}</h2>
              </div>
            </div>
          )
        )
      }
    </div>
  )
}
