import React from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0 DH/mo",
    tokens: "15 tokens",
    speed: "Normal",
    calendar: true,
    tools: "Basic",
    tracking: "Basic",
    support: "Community only",
  },
  {
    name: "Starter",
    price: "49 DH/mo",
    tokens: "100 tokens",
    speed: "Fast",
    calendar: true,
    tools: "All tools",
    tracking: "Advanced",
    support: "Email support",
  },
  {
    name: "Pro",
    price: "132 DH/mo",
    tokens: "500 tokens",
    speed: "Priority",
    calendar: true,
    tools: "All tools + Priority AI",
    tracking: "Full stats",
    support: "Priority support",
  },
];

const PricingPage = () => {
  return (
    <div className="bg-[#0e162b] min-h-screen px-4 py-10 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-gray-400 mt-2">
          From casual creators to serious strategists — we've got you covered.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className="bg-[#111b30] rounded-2xl border border-gray-700 p-6 flex flex-col justify-between hover:shadow-xl transition duration-300"
          >
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {plan.name}
              </h2>
              <p className="text-xl text-blue-400 font-bold mb-6">
                {plan.price}
              </p>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Check className="inline text-green-400 mr-2" />
                  {plan.tokens} / month
                </li>
                <li>
                  <Check className="inline text-green-400 mr-2" />
                  AI Speed: {plan.speed}
                </li>
                <li>
                  <Check className="inline text-green-400 mr-2" />
                  {plan.calendar ? "Content Calendar" : "No Content Calendar"}
                </li>
                <li>
                  <Check className="inline text-green-400 mr-2" />
                  AI Tools Access: {plan.tools}
                </li>
                <li>
                  <Check className="inline text-green-400 mr-2" />
                  Token Tracking: {plan.tracking}
                </li>
                <li>
                  <Check className="inline text-green-400 mr-2" />
                  Support: {plan.support}
                </li>
              </ul>
            </div>
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition font-medium">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
