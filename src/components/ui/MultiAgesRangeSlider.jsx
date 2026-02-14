"use client";
import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import Cookies from 'js-cookie';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import { useAppContext } from '../../../context/AppContext';
import { useSearchParams } from "next/navigation";

const MultiRangeSliderAge = ({ min, max, isProductsPage, onSubmitRange, onClearRange, selectedFrom, selectedTo, title, initiallyOpen = false, handleAgeFrom, handleAgeTo }) => {
  const searchParams = useSearchParams();
  const fromAge = Number(searchParams?.get("fromAge"));
  const toAge = Number(searchParams?.get("toAge"));
  const siteLocation = Cookies.get("siteLocation")
  const [error, setError] = useState("");
  const [userChanged, setUserChanged] = useState(0);

  const STORAGE_KEY = "age_range";
  const { state = {}, dispatch = () => { } } = useAppContext() || {};
  const [translation, setTranslation] = useState(en); // default fallback
  useEffect(() => {
    setTranslation(state.LANG === "EN" ? en : en);
  }, [state.LANG]);

  const [open, setOpen] = useState(fromAge || toAge ? true : initiallyOpen);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const [minVal, setMinVal] = useState(() => {
    if (fromAge) {
      return fromAge ?? min;
    }
    return min;
  });

  const [maxVal, setMaxVal] = useState(() => {
    if (toAge) {
      return toAge ?? max;
    }
    return max;
  });

  const isError = minVal >= maxVal || minVal < -1 || maxVal < 0;

  useEffect(() => {
    Cookies?.set(STORAGE_KEY, JSON.stringify({ minVal, maxVal }));
    minValRef.current = minVal;
    maxValRef.current = maxVal;
  }, [minVal, maxVal]);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const updateRangeBar = useCallback(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxValRef.current);


    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [getPercent]);

  // Update range visually when min or max changes
  useLayoutEffect(() => {
    setTimeout(() => updateRangeBar(), 0);
  }, [minVal, maxVal, updateRangeBar]);;

  // Update again when accordion opens
  useEffect(() => {
    if (open) {
      // slight delay to ensure DOM is ready
      setTimeout(() => updateRangeBar(), 50);
    }
  }, [open, updateRangeBar]);

  const getYearText = (num) => {
    if (num === 1) return <span> {translation.year}</span>;
    if (num === 2) return <span> {translation.year}</span>;
    if (num >= 3 && num <= 10) return <span> {translation.yearss}</span>;
    return <span> {translation.year}</span>;
  };

  const handleApplyRange = () => {
    if (isError) return;
    handleAgeFrom(minVal);
    handleAgeTo(maxVal);
    setUserChanged(prev => prev + 1);
    Cookies.set('filterstatus', "filter");
  };

  useEffect(() => {
    if (!Cookies.get("filterstatus")) {
      Cookies.set("filterstatus", "filter");
    }

    if (userChanged > 0) {
      onSubmitRange && onSubmitRange()
    }
  }, [userChanged])

  return (
    <Disclosure defaultOpen={open}>
      {({ open: isOpen }) => (
        <div className="accordion-wrapper">
          <DisclosureButton
            onClick={() => setOpen((prev) => !prev)}
            className="accordion-item w-full flex items-center justify-between cursor-pointer"
          >
            <span className="title">{title}</span>
            <i
              className={`icon-arrow-down-01-round arrow-down ${isOpen ? "rotate-180" : ""
                }`}
            ></i>
          </DisclosureButton>

          <DisclosurePanel className="text-gray-500">
            <div className="slider-container isDesktop">
              <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                  const value = Math.min(
                    Number(event.target.value),
                    maxVal - 1
                  );
                  setMinVal(value);
                  handleAgeFrom(Number(event.target.value))
                }}
                className="thumb thumb--left"
                style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
              />
              <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                  const value = Math.max(
                    Number(event.target.value),
                    minVal + 1
                  );
                  setMaxVal(value);
                  handleAgeTo(Number(event.target.value))
                }}
                className="thumb thumb--right"
              />

              <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__right-value">
                  <span>{maxVal}</span>
                  <span> {getYearText(maxVal)}</span>
                </div>
                <div className="slider__left-value">
                  <span>{minVal}</span>
                  <span> {getYearText(minVal)}</span>
                </div>
              </div>
            </div>
            <div className="isMobile">
              <div className="mobile-range grid grid-cols-2 gap-3 mb-6 mt-6">
                <div className="price from">
                  <label className="font-bold block mb-2" htmlFor="priceFrom">{translation.from}</label>
                  <input className="w-full p-2.5" type="number" name="priceFrom" id="priceFrom" defaultValue={minVal}
                    placeholder={min}
                    onChange={(event) => {
                      const value = Number(event.target.value);

                      if (value < 0) {
                        setError(translation.mobile.minAgeCannotBeNegative);
                        return;
                      }

                      setMinVal(value);
                      handleAgeFrom(value);

                      if (value >= maxVal) {
                        setError(translation.mobile.minAge);
                      } else {
                        setError("");
                      }
                    }}
                  />
                  <div className="unit">
                    {translation.year}
                  </div>
                </div>
                <div className="price to">
                  <label className="font-bold block mb-2" htmlFor="priceTo">{translation.to}</label>
                  <input className="w-full p-2.5" type="number" name="priceTo" id="priceTo" defaultValue={maxVal}
                    placeholder={max}
                    onChange={(event) => {
                      const value = Number(event.target.value);

                      if (value < 0) {
                        setError(translation.mobile.maxAgeCannotBeNegative);
                        return;
                      }

                      setMaxVal(value);
                      handleAgeTo(value);

                      if (value <= minVal) {
                        setError(translation.mobile.maxAge);
                      } else {
                        setError("");
                      }
                    }}
                  />
                  <div className="unit">
                    {translation.year}
                  </div>
                </div>
              </div>
              {error && (
                <span className="range-error block text-red-600 text-sm mb-5">{error}</span>
              )}
            </div>
            {
              isProductsPage && (
                <div className="flex justify-start gap-2">
                  <button className={`primary-btn sm-primary-btn isDesktop`} onClick={handleApplyRange}>{translation.apply}</button>
                  <button className={`primary-btn sm-primary-btn isMobile ${error ? 'disabled' : ''}`} disabled={isError} onClick={handleApplyRange}>{translation.apply}</button>
                  {
                    isProductsPage && (
                      (fromAge || toAge) ? (
                        <button className="gray-btn sm-primary-btn" onClick={() => onClearRange("age")}>
                          <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            width="16"
                            height="16">
                            <path d="M88 256L232 256C241.7 256 250.5 250.2 254.2 241.2C257.9 232.2 255.9 221.9 249 215L202.3 168.3C277.6 109.7 386.6 115 455.8 184.2C530.8 259.2 530.8 380.7 455.8 455.7C380.8 530.7 259.3 530.7 184.3 455.7C174.1 445.5 165.3 434.4 157.9 422.7C148.4 407.8 128.6 403.4 113.7 412.9C98.8 422.4 94.4 442.2 103.9 457.1C113.7 472.7 125.4 487.5 139 501C239 601 401 601 501 501C601 401 601 239 501 139C406.8 44.7 257.3 39.3 156.7 122.8L105 71C98.1 64.2 87.8 62.1 78.8 65.8C69.8 69.5 64 78.3 64 88L64 232C64 245.3 74.7 256 88 256z" fill="#4a4a49" />
                          </svg>
                        </button>
                      ) : null
                    )
                  }
                </div>
              )
            }
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};

MultiRangeSliderAge.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  title: PropTypes.string,
  initiallyOpen: PropTypes.bool,
};

export default MultiRangeSliderAge;