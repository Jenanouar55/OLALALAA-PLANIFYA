import React, { useState, useEffect } from 'react';
import { CreditCard, Download, DollarSign, Loader2, AlertTriangle } from 'lucide-react';
const getUserBillingData = async (authToken) => {
  console.log("Fetching billing data with token:", authToken);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        currentPlan: {
          name: 'Starter',
          price: '49 DH/month',
          renewalDate: 'August 5, 2025',
          tokensUsed: 42,
          tokensTotal: 100,
        },
        paymentMethod: {
          brand: 'Visa',
          last4: '1234',
          expiry: '12/2028',
        },
        billingHistory: [
          { invoiceId: 'INV-2025-0706', date: 'July 6, 2025', amount: '49.00 DH', status: 'Paid', pdfUrl: '#' },
          { invoiceId: 'INV-2025-0606', date: 'June 6, 2025', amount: '49.00 DH', status: 'Paid', pdfUrl: '#' },
          { invoiceId: 'INV-2025-0506', date: 'May 6, 2025', amount: '49.00 DH', status: 'Paid', pdfUrl: '#' },
        ],
      });
    }, 1500);
  });
};

const getStripeCustomerPortalUrl = async (authToken) => {
  console.log("Fetching Stripe portal URL with token:", authToken);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('https://billing.stripe.com/p/session/test_12345');
    }, 500);
  });
};


const BillingPage = () => {
  const [billingData, setBillingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      const authToken = localStorage.getItem('token');

      if (!authToken) {
        setError('You must be logged in to view this page.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserBillingData(authToken);
        setBillingData(data);
      } catch (err) {
        setError('Failed to fetch billing information. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    const authToken = localStorage.getItem('authToken');
    try {
      const portalUrl = await getStripeCustomerPortalUrl(authToken);
      window.location.href = portalUrl;
    } catch (err) {
      setError('Could not open the customer portal. Please try again.');
      console.error(err);
      setIsPortalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-4 text-lg">Loading Billing Information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg flex flex-col items-center justify-center h-96 bg-red-900/20 border border-red-500/50">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">An Error Occurred</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!billingData) {
    return null;
  }

  const { currentPlan, paymentMethod, billingHistory } = billingData;
  const tokenUsagePercentage = (currentPlan.tokensUsed / currentPlan.tokensTotal) * 100;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Billing & Subscriptions</h1>
        <p className="text-gray-400 mt-1">Manage your plan, payment methods, and view your invoice history.</p>
      </header>

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
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${tokenUsagePercentage}%` }}></div>
            </div>
            <p className="text-right text-sm text-gray-400 mt-1">{currentPlan.tokensUsed} / {currentPlan.tokensTotal} Tokens</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Payment & Invoices</h2>
            <p className="text-gray-400 text-sm mt-1">
              Your payment method is <span className="font-medium text-gray-200">{paymentMethod.brand} ending in {paymentMethod.last4}</span>.
            </p>
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={isPortalLoading}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-md text-sm font-medium flex items-center justify-center disabled:bg-blue-800 disabled:cursor-wait"
          >
            {isPortalLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Manage Subscription & Invoices
          </button>
        </div>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-sm text-gray-400">
                <th className="py-2 px-2">Invoice ID</th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2 text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((invoice) => (
                <tr key={invoice.invoiceId} className="border-b border-gray-700 text-sm">
                  <td className="py-3 px-2">{invoice.invoiceId}</td>
                  <td className="py-3 px-2">{invoice.date}</td>
                  <td className="py-3 px-2">{invoice.amount}</td>
                  <td className="py-3 px-2">
                    <span className="bg-green-800 text-green-300 px-2 py-1 rounded-full text-xs font-medium">{invoice.status}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </a>
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
