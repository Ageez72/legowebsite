"use client"
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import { BASE_API, endpoints } from '../../../../../constant/endpoints';
import axios from 'axios';
import OrderCard from './OrderCard';
import Cookies from 'js-cookie';
import OrdersLoader from '../../Loaders/OrdersLoader';

export default function MyOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.orders : en.orders;
  }, [state.LANG]);

  const fetchMyOrder = async () => {
    setLoading(true)
    const res = await axios.get(`${BASE_API}${endpoints.products.myorders}&lang=${state.LANG}&token=${Cookies.get('token')}`, {});
    if (res.data) {
      setOrders(res.data);
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchMyOrder()
  }, []);

  return (
    <div className='py-3'>
      <h2 className='sub-title mb-6'>{translation.theOrders}</h2>
      {
        loading && (
          <OrdersLoader />
        )
      }
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {
          orders.length ? (
            orders.map((order, i) => (
              order.details.length ? <OrderCard key={order.orderID} order={order} /> : null
            ))
          ) : null
        }
      </div>
      {
        !orders.length && !loading && (
          <div className='card empty-state flex justify-center items-center'>
            <div className="text-center">
              <svg className='m-auto my-2' xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260" fill="none">
                <rect width="260" height="260" rx="130" fill="url(#paint0_linear_246_2345)" />
                <path opacity="0.4" d="M184 96.2665C184 99.8665 182.067 103.133 179 104.8L167.4 111.066L157.533 116.333L137.067 127.4C134.867 128.6 132.467 129.2 130 129.2C127.533 129.2 125.133 128.6 122.933 127.4L81 104.8C77.9333 103.133 76 99.8665 76 96.2665C76 92.6665 77.9333 89.3996 81 87.7329L94.1333 80.6663L104.6 74.9998L122.933 65.1333C127.333 62.7333 132.667 62.7333 137.067 65.1333L179 87.7329C182.067 89.3996 184 92.6665 184 96.2665Z" fill="#7E818E" />
                <path opacity="0.4" d="M115.999 135.267L76.9994 115.733C73.9994 114.2 70.5328 114.4 67.6661 116.133C64.7994 117.867 63.1328 120.934 63.1328 124.267V161.133C63.1328 167.533 66.666 173.267 72.3994 176.133L111.399 195.6C112.733 196.267 114.2 196.6 115.666 196.6C117.4 196.6 119.133 196.134 120.666 195.134C123.533 193.4 125.199 190.333 125.199 187V150.134C125.266 143.867 121.733 138.133 115.999 135.267Z" fill="#7E818E" />
                <path opacity="0.4" d="M196.866 124.333V161.2C196.866 167.533 193.333 173.267 187.599 176.133L148.599 195.666C147.266 196.333 145.799 196.667 144.332 196.667C142.599 196.667 140.866 196.2 139.266 195.2C136.466 193.467 134.732 190.4 134.732 187.067V150.267C134.732 143.867 138.266 138.133 143.999 135.267L158.332 128.133L168.332 123.133L182.999 115.8C185.999 114.267 189.466 114.4 192.333 116.2C195.133 117.933 196.866 121 196.866 124.333Z" fill="#7E818E" />
                <path d="M167.399 111.066L157.533 116.333L94.1328 80.6665L104.6 75L165.799 109.533C166.466 109.933 166.999 110.466 167.399 111.066Z" fill="#7E818E" />
                <path d="M168.334 123.133V138.267C168.334 141 166.067 143.267 163.334 143.267C160.601 143.267 158.334 141 158.334 138.267V128.133L168.334 123.133Z" fill="#7E818E" />
                <defs>
                  <linearGradient id="paint0_linear_246_2345" x1="130" y1="0" x2="130" y2="260" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E9EBED" />
                    <stop offset="1" stopColor="white" />
                  </linearGradient>
                </defs>
              </svg>
              <h2 className='sub-title my-4 text-center'>{translation.noOrders}</h2>
            </div>
          </div>
        )
      }
    </div>
  )
}