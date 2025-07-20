'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useAppContext } from '../../../context/AppContext';

export default function Select2Form({ title, name, initiallyOpen = false, options, handleMultiItem, initSelected }) {
  const { state = {}, dispatch = () => {} } = useAppContext() || {};

  // Ensure component is hydrated before rendering dynamic UI
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Ensure selectedOptions is initialized correctly
  const [selectedOptions, setSelectedOptions] = useState(initSelected || []);
  useEffect(() => {
    setSelectedOptions(initSelected || []);
  }, [initSelected]);

  // Memoize newOptions to prevent regeneration on every render
  const newOptions = useMemo(() => {
    if (name === 'catalog') {
      return options?.catalogs?.map(item => ({
        label: item.name,
        value: item.code,
      })) || [];
    } else if (name === 'categories') {
      return options?.map(item => ({
        label: item.description,
        value: item.categoryId,
      })) || [];
    }
    return [];
  }, [options, name]);

  const handleSelectChange = selected => {
    setSelectedOptions(selected);
    handleMultiItem(name, selected);
  };

  // Avoid rendering until hydrated and state is ready
  if (!hydrated || !state.LANG) return null;

  return (
    <Disclosure defaultOpen={initiallyOpen || !!initSelected?.length}>
      {({ open: isOpen }) => (
        <div className="accordion-wrapper pp">
          <DisclosureButton
            className="accordion-item w-full flex items-center justify-between cursor-pointer"
          >
            <span className="title">{title}</span>
            <i className={`icon-arrow-down-01-round arrow-down ${isOpen ? 'rotate-180' : ''}`}></i>
          </DisclosureButton>

          <DisclosurePanel className="text-gray-500 pp">
            <Select
              className="multi-select"
              placeholder={state.LANG === 'AR' ? 'اختر' : 'Select'}
              isRtl={state.LANG === 'AR'}
              isMulti
              options={newOptions}
              value={selectedOptions}
              onChange={handleSelectChange}
              noOptionsMessage={() => state.LANG === 'AR' ? 'لا يوجد خيارات' : 'No Options'}
            />
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
