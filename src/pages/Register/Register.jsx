'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img1 from "../../assets/imgs/auth-bg.svg";
import pattern from "../../assets/imgs/pattern.svg";
import logo from "../../assets/imgs/logo.svg";
import LangSwitcher from '@/components/ui/LangSwitcher';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import Loader from '@/components/ui/Loaders/Loader';
import SuccessModal from '@/components/ui/SuccessModal';
import ErrorModal from '@/components/ui/ErrorModal';
import { endpoints } from '../../../constant/endpoints';
import { BASE_API } from '../../../constant/endpoints';
import axios from 'axios';

export default function Register() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const translation = state.LANG === "EN" ? en : ar;

  useEffect(() => {
    setIsLoading(false);
    document.title = state.LANG === 'AR' ? ar.login.register : en.login.register;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userData = {
      username: data.username,
      password: data.password,
      email: data.email,
      mobile: data.phone,
      name: data.fullName,
      businessname: data.storeName
    }

    try {
      const res = await axios.post(`${BASE_API + endpoints.auth.register}`, userData)

      if (!res.data.error) {
        setIsModalOpen(true);
        setIsErrorModalOpen(false);
        setModalSuccessMessage(state.LANG === "EN" ? res.data.messageEN : res.data.messageAR);
        reset(); // ✅ clear the form
      } else {
        setModalErrorMessage(state.LANG === "EN" ? res.data.messageEN : res.data.messageAR);
        setIsErrorModalOpen(true);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setModalErrorMessage(state.LANG === "EN" ? err.response.data.messageEN : err.response.data.messageAR);
      setIsErrorModalOpen(true);
    }
  };


  return (
    <div className="container auth-wrapper">
      <ErrorModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title={translation.error}
        message={modalErrorMessage}
      />
      <SuccessModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={translation.success2}
        message={modalSuccessMessage}
      />
      {isLoading && <Loader />}
      <div className="auth-container register-auth-container flex flex-col lg:flex-row gap-4">
        <div className='form-side md:flex-1 flex-12'>
          <div className='image-logo flex-12 block lg:hidden'>
            <Image className='pattern-img' src={pattern} alt="Pattern" />
            <Image className='logo-img' src={logo} width={252} alt="Logo" />
          </div>

          <h2 className='section-title'>{translation.register.title}</h2>
          <p>{translation.register.desc}</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className='form-group'>
              <label className='block mb-2'>{translation.register.full_name} <span className='required'>*</span></label>
              <div className='relative'>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-user"></i>
                </div>
                <input className='w-full ps-10 p-2.5' placeholder={translation.register.enter_full_name} {...register('fullName', { required: 'Full name is required' })} />
              </div>
              {errors.fullName && <span className="error-msg text-red-500">{translation.register.errors.full_name.required}</span>}
            </div>

            {/* Username */}
            <div className='form-group'>
              <label className='block mb-2'>{translation.register.username} <span className='required'>*</span></label>
              <div className='relative'>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#4A4A49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8.00001V13C16 13.7957 16.3161 14.5587 16.8787 15.1213C17.4413 15.6839 18.2044 16 19 16C19.7957 16 20.5587 15.6839 21.1213 15.1213C21.6839 14.5587 22 13.7957 22 13V12C22 9.74731 21.2394 7.56061 19.8414 5.79418C18.4434 4.02775 16.49 2.78508 14.2975 2.26752C12.1051 1.74996 9.80215 1.98782 7.76178 2.94256C5.72141 3.89731 4.06318 5.513 3.05574 7.52787C2.0483 9.54274 1.75069 11.8387 2.21111 14.0439C2.67154 16.249 3.86303 18.2341 5.59254 19.6775C7.32205 21.1209 9.48825 21.9381 11.7402 21.9966C13.9921 22.0552 16.1979 21.3516 18 20" stroke="#4A4A49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  placeholder="username"
                  className='w-full ps-10 p-2.5'
                  {...register('username', {
                    required: translation.register.errors.username.required,
                    pattern: {
                      value: /^(?!.*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF])[\w@.\- ]+$/,
                      message: translation.register.errors.username.invalid,
                    },
                  })}
                  onInput={e => {
                    // Remove Arabic letters as user types
                    e.target.value = e.target.value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, '');
                  }}
                />
                {
                  isUsernameValid && (
                    <div
                      className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#009941" />
                      </svg>
                    </div>
                  )
                }
              </div>
              {errors.username && <span className="error-msg text-red-500">{errors.username.message}</span>}
              { }
            </div>

            {/* Phone Number */}
            <div className='form-group'>
              <label className='block mb-2'>{translation.register.phone_no} <span className='required'>*</span></label>
              <div className='relative'>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-mobile"></i>
                </div>
                <input
                  placeholder={"00962791234567"}
                  className='w-full pe-10 p-2.5 phone-input'
                  {...register('phone', {
                    required: translation.register.errors.phone_no.required,
                    pattern: {
                      value: /^\+?\d{9,15}$/,
                      message: translation.register.errors.phone_no.invalid,
                    },
                  })}
                  type='tel'
                />
              </div>
              {errors.phone && <span className="error-msg text-red-500">{errors.phone.message}</span>}
            </div>

            {/* Email */}
            <div className='form-group'>
              <label className='block mb-2'>{translation.register.email} <span className='required'>*</span></label>
              <div className='relative'>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-sms"></i>
                </div>
                <input
                  placeholder={"email@example.com"}
                  type="email"
                  className='w-full ps-10 p-2.5'
                  {...register('email', {
                    required: translation.register.errors.email.required,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: translation.register.errors.email.invalid,
                    },
                  })}
                />
              </div>
              {errors.email && <span className="error-msg text-red-500">{errors.email.message}</span>}
            </div>

            {/* Store Name */}
            <div className='form-group'>
              <label className='block mb-2'>{translation.register.store_name} <span className='required'>*</span></label>
              <div className='relative'>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-shop"></i>
                </div>
                <input placeholder={translation.register.enter_store_name} className='w-full ps-10 p-2.5' {...register('storeName', { required: translation.register.errors.store_name.required })} />
              </div>
              {errors.storeName && <span className="error-msg text-red-500">{errors.storeName.message}</span>}
            </div>

            {/* Password */}
            <div className='form-group'>
              <label className='block mb-2'>{translation.register.password} <span className='required'>*</span></label>
              <div className='relative'>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-shield-security"></i>
                </div>
                <input
                  placeholder={translation.register.password}
                  type={showPassword ? 'text' : 'password'}
                  className='w-full ps-10 pe-10 p-2.5'
                  {...register('password', {
                    required: translation.register.errors.password.required,
                    minLength: {
                      value: 3,
                      message: translation.register.errors.password.min_length,
                    },
                  })}
                />
                <div
                  className='absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="icon-view-on"></i>
                  ) : (
                    <i className="icon-view-off"></i>
                  )}
                </div>
              </div>
              {errors.password && <span className="error-msg text-red-500">{errors.password.message}</span>}
            </div>

            <button type='submit' className='primary-btn w-full'>{translation.register.register_btn}</button>
          </form>

          <div className='form-blow'>
            <span>{translation.register.have_account}</span>
            <Link className='ms-1' href="/">{translation.register.login}</Link>
          </div>
        </div>

        <div className='image-side md:flex-1 flex-12 hidden lg:block'>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src={img1} alt="Register Background" fill priority style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

