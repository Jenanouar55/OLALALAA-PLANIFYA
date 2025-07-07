import React, { useState } from 'react';
import { Check, ShieldCheck } from 'lucide-react';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: '0 DH',
        priceSuffix: '/mo',
        tokens: '15 tokens',
        features: [
            'Normal AI Speed',
            'Basic AI Tools Access',
            'Basic Token Tracking',
            'Community Support',
        ],
        isCurrent: false,
    },
    {
        id: 'starter',
        name: 'Starter',
        price: '49 DH',
        priceSuffix: '/mo',
        tokens: '100 tokens',
        features: [
            'Fast AI Speed',
            'All AI Tools Access',
            'Advanced Token Tracking',
            'Email Support',
        ],
        isCurrent: false,
        isRecommended: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '132 DH',
        priceSuffix: '/mo',
        tokens: '500 tokens',
        features: [
            'Priority AI Speed',
            'All Tools + Priority AI',
            'Full Analytics',
            'Priority Support',
        ],
        isCurrent: false,
    }
];

const CheckoutPage = () => {
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [error, setError] = useState('');

    const handleSubscribe = async (planId) => {
        if (!planId || planId === 'free') return;

        setLoadingPlan(planId);
        setError('');

        try {
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                throw new Error('Authentication token not found. Please log in.');
            }

            const response = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ planId: planId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred during checkout.');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('Could not retrieve the checkout URL.');
            }

        } catch (err) {
            setError(err.message);
            setLoadingPlan(null);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Choose the Plan That Fits Your Needs</h1>
                <p className="text-gray-400 mt-2">From casual creators to serious strategists — we've got you covered.</p>
            </div>

            {error && (
                <div className="max-w-md mx-auto bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-8 text-center">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col border-2 ${plan.isRecommended ? 'border-blue-500' : 'border-gray-700'}`}
                    >
                        {plan.isRecommended && (
                            <div className="text-center mb-4">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</span>
                            </div>
                        )}
                        <h2 className="text-2xl font-semibold mb-2 text-center">{plan.name}</h2>
                        <p className="text-center mb-6">
                            <span className="text-4xl font-bold text-blue-400">{plan.price}</span>
                            <span className="text-lg text-gray-400">{plan.priceSuffix}</span>
                        </p>
                        <p className="text-center font-semibold text-lg mb-6">{plan.tokens} / month</p>

                        <ul className="space-y-3 text-gray-300 mb-8">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={plan.id === 'free' || loadingPlan === plan.id}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loadingPlan === plan.id ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    plan.id === 'free' ? 'Included' : 'Subscribe'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8 text-gray-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span>Secure payments powered by Stripe</span>
            </div>
        </div>
    );
};

export default CheckoutPage;
