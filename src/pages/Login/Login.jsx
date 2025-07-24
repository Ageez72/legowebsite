'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img1 from "../../assets/imgs/auth-bg.svg";
import pattern from "../../assets/imgs/pattern.svg";
import logo from "../../assets/imgs/logo.svg";
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../../context/AppContext';
import en from "../../../locales/en.json"
import ar from "../../../locales/ar.json";
import Loader from '@/components/ui/Loaders/Loader';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { endpoints } from '../../../constant/endpoints';
import { BASE_API } from '../../../constant/endpoints';
import axios from 'axios';

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const translation = state.LANG === "EN" ? en : ar;
  const router = useRouter()

  useEffect(() => {
    setIsLoading(false);
    document.title = state.LANG === 'AR' ? ar.register.login : en.register.login;
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const username = encodeURIComponent(data.identifier);
      const password = encodeURIComponent(data.password);
      const res = await axios.get(`${BASE_API + endpoints.auth.login}&username=${username}&password=${password}`)

      if (res.data.error) {
        setIsModalOpen(true);
        setModalMessage(state.LANG === "EN" ? res.data.messageEN : res.data.messageAR)
      } else {
        Cookies.set('token', res.data.token);
        router.push('/')
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container auth-wrapper">
      {isLoading && <Loader />}
      <div className="auth-container flex flex-col lg:flex-row gap-4">
        <div className='form-side md:flex-1 flex-12'>
          <div className='image-logo flex-12 block lg:hidden'>
            <Image
              className='pattern-img'
              src={pattern}
              alt="My Image"
            />
            <Image
              className='logo-img'
              src={logo}
              width={252}
              alt="My Image"
            />
          </div>
          <h2 className='section-title'>{translation.login.title}</h2>
          <p>{translation.login.desc}</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='form-group'>
              <label className='block mb-2'>{translation.login.username}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-sms"></i>
                </div>
                <input
                  className='w-full ps-10 p-2.5'
                  {...register('identifier', {
                    required: translation.login.errors.username.required,
                    pattern: {
                      value: /^(?!.*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF])[\w@.\- ]+$/,
                      message: translation.login.errors.username.invalid,
                    },
                  })}
                  onInput={e => {
                    // Remove Arabic letters as user types
                    e.target.value = e.target.value.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g, '');
                  }}
                />
              </div>
              {errors.identifier && <span className="error-msg text-red-500">{errors.identifier.message}</span>}
            </div>

            <div className='form-group'>
              <label className='block mb-2'>{translation.login.password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <i className="icon-shield-security"></i>
                </div>
                <div className="absolute inset-y-0 start-0 flex items-center pe-3.5 password-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <i className="icon-view-on"></i>
                  ) : (
                    <i className="icon-view-off"></i>
                  )}
                </div>
                <input
                  className='w-full ps-10 pe-10 p-2.5'
                  type={`${showPassword ? 'text' : 'password'}`}
                  {...register('password', {
                    required: translation.login.errors.password.required,
                    minLength: {
                      value: 3,
                      message: translation.login.errors.password.min_length,
                    },
                  })}
                />
              </div>
              {errors.password && <span className="error-msg text-red-500">{errors.password.message}</span>}
            </div>

            <button className='primary-btn w-full' type="submit">{translation.login.login_btn}</button>
          </form>

          <div className='form-blow'>
            <span className=''>{translation.login.have_account}</span>
            <Link className='ms-1' href="/register">{translation.login.register}</Link>
          </div>
        </div>
        <div className='image-side md:flex-1 flex-12 hidden lg:block'>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={img1}
              alt="My Image"
              fill
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
