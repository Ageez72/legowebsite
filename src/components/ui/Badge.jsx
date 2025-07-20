import React from 'react'

export default function Badge({ type, text }) {
    return (
        <span className={`badge ${type} inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-inset me-2`}>
            {text}
        </span>
    )
}
