'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import Loader from '@/components/ui/Loaders/Loader';
import SuccessModal from '@/components/ui/SuccessModal';
import ErrorModal from '@/components/ui/ErrorModal';
import { endpoints, BASE_API } from '../../../../../constant/endpoints';
import axios from 'axios';
import { getProfile } from '@/actions/utils';
import Cookies from 'js-cookie';
import SuccessUpdateModal from '../SuccessUpdateModal';

export default function MyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessUpdatModalOpen, setIsSuccessUpdatModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [modalSuccessMessage, setModalSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inputsStatus, setInputsStatus] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en);

  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.profile : en.profile;
  }, [state.LANG]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      storeName: ''
    }
  });

  useEffect(() => {
    setTimeout(() => {
      loadAddresses();
    }, 100);
  }, []);

  const loadAddresses = async () => {
    const items = await getProfile();
    if (items) {
      reset({
        fullName: items?.name || '',
        username: items?.username || '',
        phone: items?.mobile || '',
        email: items?.email || '',
        storeName: items?.business || ''
      });
    }
    setIsLoading(false);
  };

  const onSubmit = async (data) => {
    setInputsStatus(true)
    const userData = {
      username: data.username,
      email: data.email,
      mobile: data.phone,
      name: data.fullName,
      businessname: data.storeName
    };
    // console.log(userData);

    try {
      const res = await axios.post(`${BASE_API + endpoints.auth.updateProfile}&token=${Cookies.get('token')}`, userData, {});
      // console.log(res.data.MESSAGE);

      if (res.data.MESSAGE) {
        const res = await axios(`${BASE_API + endpoints.user.profile}&token=${Cookies.get('token')}`, {});
        const profile = {
          name: res?.data?.name,
          email: res?.data?.email,
          mobile: res?.data?.mobile,
          contactName: res?.data?.contactName,
          contactEmail: res?.data?.contactEmail,
          business: res?.data?.business,
          contactPhone: res?.data?.contactPhone,
          username: res?.data?.username,
        }
        // console.log(profile);

        Cookies.set('profile', JSON.stringify(profile));
        setIsSuccessUpdatModalOpen(true)
      } else {
        // error modal
      }
    } catch (err) {
      console.error('Error update Profile:', err);
    }
  };

  return (
    <div className="">
      <SuccessUpdateModal title={translation.profileUpdated} open={isSuccessUpdatModalOpen} setOpen={() => {
        setIsSuccessUpdatModalOpen(false)
        location.reload()
      }} />
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
      {!isLoading && (
        <div className='py-3'>
          <div className='form-side md:flex-1 flex-12'>
            <h2 className='sub-title mb-6'>{translation.profile}</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className='form-group'>
                <label className='block mb-2'>{translation.register.full_name} <span className='required'>*</span></label>
                <div className='relative'>
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <i className="icon-user"></i>
                  </div>
                  <input className={`w-full ps-10 p-2.5 ${inputsStatus ? 'disabled' : ''}`} placeholder={translation.register.enter_full_name} {...register('fullName', { required: 'Full name is required' })} />
                </div>
                {errors.fullName && <span className="error-msg text-red-500">{translation.register.errors.full_name.required}</span>}
              </div>

              {/* Username */}
              <div className='form-group'>
                <label className='block mb-2'>{translation.register.username} <span className='required'>*</span></label>
                <div className='relative'>
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    {/* Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#4A4A49" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 8V13C16 13.7957 16.3161 14.5587 16.8787 15.1213C17.4413 15.6839 18.2044 16 19 16C19.7957 16 20.5587 15.6839 21.1213 15.1213C21.6839 14.5587 22 13.7957 22 13V12C22 9.74731 21.2394 7.56061 19.8414 5.79418C18.4434 4.02775 16.49 2.78508 14.2975 2.26752C12.1051 1.74996 9.80215 1.98782 7.76178 2.94256C5.72141 3.89731 4.06318 5.513 3.05574 7.52787C2.0483 9.54274 1.75069 11.8387 2.21111 14.0439C2.67154 16.249 3.86303 18.2341 5.59254 19.6775C7.32205 21.1209 9.48825 21.9381 11.7402 21.9966C13.9921 22.0552 16.1979 21.3516 18 20" stroke="#4A4A49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    placeholder="username"
                    className='w-full ps-10 p-2.5 disabled'
                    {...register('username', {
                      required: translation.register.errors.username.required,
                      pattern: {
                        value: /^[a-zA-Z0-9]+$/,
                        message: translation.register.errors.username.invalid,
                      },
                    })}
                  />
                  {
                    isUsernameValid && (
                      <div className='absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                          <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="#009941" />
                        </svg>
                      </div>
                    )
                  }
                </div>
                {errors.username && <span className="error-msg text-red-500">{errors.username.message}</span>}
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
                    className={`w-full pe-10 p-2.5 phone-input ${inputsStatus ? 'disabled' : ''}`}
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
                    className={`w-full ps-10 p-2.5 ${inputsStatus ? 'disabled' : ''}`}
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
                  <input
                    placeholder={translation.register.enter_store_name}
                    className={`w-full ps-10 p-2.5 ${inputsStatus ? 'disabled' : ''}`}
                    {...register('storeName', { required: translation.register.errors.store_name.required })}
                  />
                </div>
                {errors.storeName && <span className="error-msg text-red-500">{errors.storeName.message}</span>}
              </div>

              <div className="text-end">
                <button type='submit' className='primary-btn w-auto' style={{ minWidth: "140px" }}>
                  {
                    !inputsStatus ? (
                      translation.saveChanges
                    ) : (
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                    )
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
