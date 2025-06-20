import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Payment Successful</h1>
            <p className="text-gray-600 mb-6">
                Thank you for your purchase! Your plan has been successfully activated.
            </p>
            <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow"
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default SuccessPage;
