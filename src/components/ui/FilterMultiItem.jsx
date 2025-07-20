'use client';
import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

export default function FilterMultiItem({
    title,
    selected = [],
    options = [],
    name,
    onOptionsChange
}) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true);
        }, 300);

        return () => clearTimeout(timer); // Cleanup
    }, []);

    const toggleValue = (value) => {
        const newSelected = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];

        onOptionsChange(title, newSelected);
    };

    // Optional: Prevent rendering entirely if `open` is false
    if (!open) return null;

    return (
        <div className="accordion-wrapper">
            <Disclosure defaultOpen={selected.length > 0}>
                {({ open: isOpen }) => (
                    <div>
                        <DisclosureButton className="accordion-item w-full flex items-center justify-between cursor-pointer">
                            <span className="title small-title">{title}</span>
                            <i
                                className={`icon-arrow-down-01-round arrow-down ${isOpen ? 'rotate-180' : ''
                                    }`}
                            ></i>
                        </DisclosureButton>

                        <DisclosurePanel>
                            <div className="options-list">
                                {options.map((option) => (
                                    <div className="form-group flex items-center gap-3" key={option.brandID}>
                                        <input
                                            className="cursor-pointer"
                                            id={option.brandID}
                                            type="checkbox"
                                            name={name}
                                            value={option.brandID}
                                            checked={selected.includes(option.brandID)}
                                            onChange={() => toggleValue(option.brandID)}
                                        />
                                        <label htmlFor={option.brandID} className="mb-0 cursor-pointer">
                                            {option.description}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
        </div>
    );
}
