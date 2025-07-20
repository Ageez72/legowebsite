'use client'
import React, { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

export default function FilterSingleItem({
  selected,
  title,
  options,
  name,
  initiallyOpen = false,
  handleSingleItem
}) {
  const [selectedValue, setSelectedValue] = useState(selected || null);
  const [open, setOpen] = useState(!!selected);

  const handleCheck = (value) => {
    const newValue = selectedValue === value ? null : value; // toggle behavior
    setSelectedValue(newValue);
    handleSingleItem(name, newValue); // send null if unselected
  };

  return (
    <Disclosure defaultOpen={open}>
      {({ open: isOpen }) => (
        <div className="accordion-wrapper">
          <DisclosureButton
            onClick={() => setOpen((prev) => !prev)}
            className="accordion-item w-full flex items-center justify-between cursor-pointer"
          >
            <span className="title">{title}</span>
            <i className={`icon-arrow-down-01-round arrow-down ${isOpen ? 'rotate-180' : ''}`}></i>
          </DisclosureButton>

          <DisclosurePanel className="text-gray-500">
            <div className="options-list">
              {options.map((option) => (
                <div className="form-group flex items-center gap-3" key={option.id}>
                  <input
                    className="cursor-pointer"
                    id={option.value}
                    type="checkbox"
                    name={name}
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={() => handleCheck(option.value)}
                  />
                  <label className="mb-0 cursor-pointer" htmlFor={option.value}>
                    {option.title}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
}
