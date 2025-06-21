import React from "react";

const BillingPage = () => {
  // Sample data
  const subscriptionName = "Pro Plan";
  const tokensUsed = 420;
  const tokensRemaining = 1580;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto bg-[#1e293b] p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Billing Overview</h2>

        <div className="space-y-6">
          {/* Subscription Info */}
          <div className="bg-[#334155] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#38bdf8]">Subscription Plan</h3>
            <p className="text-white mt-1">{subscriptionName}</p>
          </div>

          {/* Token Info */}
          <div className="bg-[#334155] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#38bdf8]">Token Usage</h3>
            <div className="mt-2 text-white">
              <p>Used: <span className="font-medium">{tokensUsed}</span></p>
              <p>Remaining: <span className="font-medium">{tokensRemaining}</span></p>
            </div>
          </div>

          {/* Manage Plan Button */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = "https://billing.stripe.com"}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2 px-6 rounded-md transition"
            >
              Manage / Cancel Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
