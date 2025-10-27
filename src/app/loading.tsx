import React from 'react'

export default function Loading()  {
    return (
        <div className="fixed inset-0 bg-opacity-80 backdrop-blur-sm z-50 flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#465fff] mx-auto mb-4"></div>
            </div>
        </div>
    )
}
