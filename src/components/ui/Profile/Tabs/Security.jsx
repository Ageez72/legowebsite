import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../context/AppContext';
import en from "../../../../../locales/en.json";
import ar from "../../../../../locales/ar.json";
import { useForm } from 'react-hook-form';
import SuccessUpdateModal from '../SuccessUpdateModal';
import axios from 'axios';
import { endpoints, BASE_API } from '../../../../../constant/endpoints';
import Cookies from 'js-cookie';

export default function Security() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isSuccessUpdatModalOpen, setIsSuccessUpdatModalOpen] = useState(false);
  const [inputsStatus, setInputsStatus] = useState(false);
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en);
  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : ar);
    document.title = state.LANG === 'AR' ? ar.security : en.security;
  }, [state.LANG]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setInputsStatus(true);
    const userData = {
      password: data.password,
      email: "",
      mobile: "",
      contactName: "",
      contactEmail: "",
      business: "",
      contactPhone: "",
      username: "",
    };
    console.log(userData);

    try {
      const res = await axios.post(`${BASE_API + endpoints.auth.updateProfile}&token=${Cookies.get('token')}`, userData, {});
      if (res.data.MESSAGE) {
        setInputsStatus(false);
        setIsSuccessUpdatModalOpen(true)
      } else {
        // error modal
      }
    } catch (err) {
      console.error('Error update Profile:', err);
    }
  };

  return (
    <>
      <SuccessUpdateModal title={translation.passwordChanged} open={isSuccessUpdatModalOpen} setOpen={() => {
        setIsSuccessUpdatModalOpen(false)
        location.reload()
      }} />
      <div className='py-3'>
        <h2 className="sub-title mb-6">{translation.security}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Password Field */}
          <div className='form-group'>
            <label className='block mb-2'>
              {translation.newPassword} <span className='required'>*</span>
            </label>
            <div className='relative'>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <i className="icon-shield-security"></i>
              </div>
              <input
                placeholder={translation.newPassword}
                type={showPassword ? 'text' : 'password'}
                className={`w-full ps-10 pe-10 p-2.5 ${inputsStatus ? 'disabled': ''}`}
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
            {errors.password && (
              <span className="error-msg text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className='form-group'>
            <label className='block mb-2'>
              {translation.confirmPassword} <span className='required'>*</span>
            </label>
            <div className='relative'>
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <i className="icon-shield-security"></i>
              </div>
              <input
                placeholder={translation.confirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full ps-10 pe-10 p-2.5 ${inputsStatus ? 'disabled': ''}`}
                {...register('confirmPassword', {
                  required: translation.register.errors.password.required,
                  validate: value =>
                    value === passwordValue || translation.register.errors.password.confirm_not_match,
                })}
              />
              <div
                className='absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer'
                onClick={() => setConfirmShowPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <i className="icon-view-on"></i>
                ) : (
                  <i className="icon-view-off"></i>
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <span className="error-msg text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>
          <div className="text-end">
            <button type='submit' className='primary-btn w-auto'>
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
    </>
  );
}
