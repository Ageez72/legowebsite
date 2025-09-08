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

const MultiRangeSlider = ({ min, max, selectedFrom, selectedTo, title, initiallyOpen = false, handleAgeFrom, handleAgeTo }) => {
  const searchParams = useSearchParams();
  const fromAge = Number(searchParams?.get("fromAge"));
  const toAge = Number(searchParams?.get("toAge"));

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
    if (toAge) {
      return fromAge ?? min;
    }
    return min;
  });

  const [maxVal, setMaxVal] = useState(() => {
    if ( toAge) {
      return toAge ?? max;
    }
    return max;
  });

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
  }, [minVal, maxVal, updateRangeBar]);

  // Update again when accordion opens
  useEffect(() => {
    if (open) {
      // slight delay to ensure DOM is ready
      setTimeout(() => updateRangeBar(), 50);
    }
  }, [open, updateRangeBar]);


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
            <div className="slider-container">
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
                  <span> {translation.jod}</span>
                </div>
                <div className="slider__left-value">
                  <span>{minVal}</span>
                  <span> {translation.jod}</span>
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  title: PropTypes.string,
  initiallyOpen: PropTypes.bool,
};

export default MultiRangeSlider;