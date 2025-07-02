import React, { useState } from 'react';
import { Check, ArrowLeft, CreditCard, Lock, ShieldCheck } from 'lucide-react';

// --- Data for the pricing plans ---
const plans = [
    {
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
        isCurrent: false, // You could set this dynamically
    },
    {
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
        isRecommended: true, // Highlights this plan
    },
    {
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


// --- Main Component ---
const CheckoutPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    if (selectedPlan) {
        return <SubscriptionForm plan={selectedPlan} onBack={() => setSelectedPlan(null)} />;
    }

    return <PricingTable onSelectPlan={setSelectedPlan} />;
};


// --- Step 1: Pricing Table View ---
const PricingTable = ({ onSelectPlan }) => {
    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Choose the Plan That Fits Your Needs</h1>
                <p className="text-gray-400 mt-2">From casual creators to serious strategists — we've got you covered.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
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
                                onClick={() => onSelectPlan(plan)}
                                disabled={plan.name === 'Free'}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {plan.name === 'Free' ? 'Included' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Step 2: Subscription Form View ---
const SubscriptionForm = ({ plan, onBack }) => {
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        country: 'MA',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Subscribing to:', plan.name, 'with data:', formData);
        alert(`Subscription to ${plan.name} successful!`);
    };

    return (
        <div className="bg-gray-900 flex flex-col items-center justify-center p-4 min-h-screen">
            <button onClick={onBack} className="flex items-center text-blue-400 hover:text-blue-300 mb-6 group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to plans
            </button>
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 p-8 rounded-lg shadow-lg">
                    <div className="text-center mb-8">
                        <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                        <h1 className="text-2xl font-bold text-white">Secure Checkout</h1>
                        <p className="text-gray-400 mt-2">
                            You are subscribing to the <span className="text-blue-400 font-semibold">{plan.name} Plan</span> for {plan.price}{plan.priceSuffix}.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Form fields are the same as the previous response */}
                        <div>
                            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                            <input type="text" id="cardholderName" name="cardholderName" onChange={handleInputChange} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" required />
                        </div>
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                            <div className="relative"><CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" id="cardNumber" name="cardNumber" onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0000 0000 0000 0000" required /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                                <input type="text" id="expiryDate" name="expiryDate" onChange={handleInputChange} className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="MM / YY" required />
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" id="cvc" name="cvc" onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123" required /></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-all px-5 py-3 rounded-md shadow-md text-sm font-semibold">
                            Subscribe for {plan.price}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;