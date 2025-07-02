import React from 'react';
import { CreditCard, Download, DollarSign } from 'lucide-react';

// Mock data for billing history
const billingHistory = [
  {
    invoiceId: 'INV-2025-0701',
    date: 'July 1, 2025',
    amount: '49.00 DH',
    status: 'Paid',
  },
  {
    invoiceId: 'INV-2025-0601',
    date: 'June 1, 2025',
    amount: '49.00 DH',
    status: 'Paid',
  },
  {
    invoiceId: 'INV-2025-0501',
    date: 'May 1, 2025',
    amount: '49.00 DH',
    status: 'Paid',
  },
];

// Mock data for the current user's plan
const currentPlan = {
  name: 'Starter',
  price: '49 DH/month',
  renewalDate: 'July 31, 2025',
  tokensUsed: 42,
  tokensTotal: 100,
};

const BillingPage = () => {
  const tokenUsagePercentage = (currentPlan.tokensUsed / currentPlan.tokensTotal) * 100;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg space-y-8">

      {/* --- Header --- */}
      <header>
        <h1 className="text-2xl font-bold">Billing & Subscriptions</h1>
        <p className="text-gray-400 mt-1">Manage your plan, payment methods, and view your invoice history.</p>
      </header>

      {/* --- Current Plan Section --- */}
      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-blue-400 font-bold text-xl">{currentPlan.name} Plan</p>
            <p className="text-gray-300">{currentPlan.price}</p>
            <p className="text-sm text-gray-400 mt-1">Renews on {currentPlan.renewalDate}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Token Usage</label>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${tokenUsagePercentage}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-400 mt-1">{currentPlan.tokensUsed} / {currentPlan.tokensTotal} Tokens</p>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium">
            Change Plan
          </button>
          <button className="bg-transparent hover:bg-gray-700 border border-gray-600 transition px-4 py-2 rounded-md text-sm font-medium">
            Cancel Subscription
          </button>
        </div>
      </section>

      {/* --- Payment Method Section --- */}
      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
            <div>
              <p className="font-medium">Visa ending in 1234</p>
              <p className="text-sm text-gray-400">Expires 12/2028</p>
            </div>
          </div>
          <button className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-md text-sm font-medium">
            Update
          </button>
        </div>
      </section>

      {/* --- Billing History Section --- */}
      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="py-2">Invoice ID</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((invoice) => (
                <tr key={invoice.invoiceId} className="border-b border-gray-700 text-sm">
                  <td className="py-3">{invoice.invoiceId}</td>
                  <td className="py-3">{invoice.date}</td>
                  <td className="py-3">{invoice.amount}</td>
                  <td className="py-3">
                    <span className="bg-green-800 text-green-300 px-2 py-1 rounded-full text-xs">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-blue-400 hover:text-blue-300 flex items-center justify-end ml-auto">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default BillingPage;