import React, { useEffect, useState } from "react";

const BillingModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-[#1e293b] text-white rounded-2xl p-6 w-full max-w-md shadow-lg relative animate-fadeIn">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#38bdf8] mb-4">Manage Your Plan</h2>
        <p className="text-gray-300 mb-6">
          Here you can cancel your subscription or change your plan. Choose an option below:
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              alert("Redirect to change plan flow");
              onClose();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 transition font-semibold py-2 px-4 rounded-lg"
          >
            Change Plan
          </button>

          <button
            onClick={() => {
              alert("Redirect to cancel subscription or call API");
              onClose();
            }}
            className="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-semibold py-2 px-4 rounded-lg"
          >
            Cancel Plan
          </button>
        </div>
      </div>
    </div>
  );
};
const BillingPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((res) => setTimeout(res, 500));
      const data = {
        name: "Pro Plan",
        price: "132 DH/mo",
        tokensUsed: 420,
        tokensTotal: 2000,
        speed: "Priority",
        tools: "All tools + Priority AI",
        tracking: "Full stats",
        support: "Priority support",
        calendar: true,
      };
      setSubscription(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const percentageUsed = subscription
    ? Math.min((subscription.tokensUsed / subscription.tokensTotal) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Billing Overview</h1>
          <p className="text-gray-400 mt-2">Manage your subscription and token usage</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <>
            <div className="bg-[#1e293b] rounded-2xl p-6 md:p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#38bdf8]">{subscription.name}</h2>
                  <p className="text-2xl font-bold mt-1">{subscription.price}</p>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>📅 Calendar Access: <span className="text-white">{subscription.calendar ? "Yes" : "No"}</span></p>
                  <p>⚡ AI Speed: <span className="text-white">{subscription.speed}</span></p>
                  <p>🧰 Tools: <span className="text-white">{subscription.tools}</span></p>
                  <p>📊 Tracking: <span className="text-white">{subscription.tracking}</span></p>
                  <p>🎧 Support: <span className="text-white">{subscription.support}</span></p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-6 bg-[#3b82f6] hover:bg-blue-700 transition text-white font-semibold py-2 px-6 rounded-lg"
              >
                Manage / Cancel Plan
              </button>
            </div>

            <div className="bg-[#1e293b] rounded-2xl p-6 md:p-8 shadow-md">
              <h3 className="text-xl font-semibold text-[#38bdf8] mb-4">Token Usage</h3>
              <div className="mb-2 text-sm text-gray-400 flex justify-between">
                <span>{subscription.tokensUsed} used</span>
                <span>{subscription.tokensTotal - subscription.tokensUsed} remaining</span>
              </div>
              <div className="w-full h-4 bg-[#334155] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38bdf8] transition-all duration-500"
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
              <p className="text-center mt-4 text-gray-400 text-sm">
                Total tokens: <span className="text-white font-medium">{subscription.tokensTotal}</span>
              </p>
            </div>
          </>
        )}
        <BillingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
};

export default BillingPage;
