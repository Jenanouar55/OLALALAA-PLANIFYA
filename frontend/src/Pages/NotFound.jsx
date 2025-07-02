import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
            <div className="text-center p-8 bg-[#334155] rounded-2xl shadow-2xl max-w-md w-full">
                <h1 className="text-6xl font-bold mb-4 text-[#38bdf8]">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
                <p className="mb-6 text-gray-300">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-[#38bdf8] text-[#0f172a] font-semibold rounded-full hover:bg-[#0ea5e9] transition"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound