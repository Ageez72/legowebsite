import React from 'react'

export default function AddressesLoader() {
    return (
        <div className="grid grid-cols-1 gap-3 w-full">
            <div role="status" className="pb-4 rounded-sm animate-pulse dark:border-gray-700">
                <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <span className="sr-only">Loading...</span>
            </div>
            <div role="status" className="pb-4 rounded-sm animate-pulse dark:border-gray-700">
                <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <span className="sr-only">Loading...</span>
            </div>
            <div role="status" className="pb-4 rounded-sm animate-pulse dark:border-gray-700">
                <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <span className="sr-only">Loading...</span>
            </div>
            <div role="status" className="pb-4 rounded-sm animate-pulse dark:border-gray-700">
                <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}
