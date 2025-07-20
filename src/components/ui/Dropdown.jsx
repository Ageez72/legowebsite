"use client";
import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAppContext } from "../../../context/AppContext";

export default function Dropdown({ options = [], name, defaultValue = null, onChange }) {
    const { state = {}, dispatch = () => { } } = useAppContext() || {};
    const [selected, setSelected] = useState("");

    useEffect(() => {
        // Notify parent about initial selection
        setSelected(options.find(option => option.value === defaultValue)|| options[0])
    }, [selected]);

    const handleSelect = (option) => {
        setSelected(option);
        if (onChange) {
            onChange(name, option);
        }
    };    

    return (
        <Menu as="div" className="dropdown-wrapper relative inline-block dropdown-container text-start">
            <div className="dropdown-title">
                <MenuButton
                    className="inline-flex justify-between w-full text-start gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    aria-label={`Dropdown for ${name}`}
                >
                    <span>{selected?.title}</span>
                    <span className="icon-arrow-down-01-round"></span>
                </MenuButton>
            </div>

            <MenuItems
                transition
                className={`dropdown-item absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none
        ${state.LANG === "AR" ? "left-0 origin-top-left" : "right-0 origin-top-right"}`}
            >
                <div className="py-1 text-start">
                    {options.map((option) => (
                        <MenuItem key={option.id}>
                            {({ close }) => (
                                <button
                                    onClick={() => {
                                        handleSelect(option);
                                        close();
                                    }}
                                    className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-start cursor-pointer option-item ${selected?.id === option.id ? "font-medium" : ""
                                        }`}
                                    role="option"
                                    aria-selected={selected?.id === option.id}
                                >
                                    <span>{option.title}</span>
                                    {selected?.id === option.id && <i className="icon-tick-circle"></i>}
                                </button>
                            )}
                        </MenuItem>
                    ))}
                </div>
            </MenuItems>
        </Menu>
    );
}
