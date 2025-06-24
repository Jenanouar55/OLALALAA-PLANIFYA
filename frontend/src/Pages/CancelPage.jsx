import React from 'react';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <XCircle className="text-red-500 w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Payment Canceled</h1>
            <p className="text-gray-600 mb-6">
                It looks like you canceled the payment. No worries — you can try again anytime.
            </p>
            <div className="space-x-4">
                <button
                    onClick={() => navigate('/pricing')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow"
                >
                    Try Again
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-xl shadow"
                >
                    Continue with Free Plan
                </button>
            </div>
        </div>
    );
};

export default CancelPage;
