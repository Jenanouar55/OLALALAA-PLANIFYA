import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    LayoutDashboard, PartyPopper, Mail, Loader2,
    Bell, Gift
} from "lucide-react";
import {
    fetchAllUsers,
    addTokensToUser
} from "../../features/adminSlice";
import SideBar from "./SideBar";

// You can move Navbar and Sidebar to a shared Layout component later if you wish
const Navbar = () => (
    <header className="bg-[#1e1e2f] shadow-md p-4 flex justify-between items-center border-b border-gray-700">
        <img src="/Images/Planifya-v2.png" alt="Logo" className="h-10" />
        <button className="text-gray-300 hover:text-blue-400">
            <Bell className="w-6 h-6" />
        </button>
    </header>
);



const TokensPage = () => {
    const dispatch = useDispatch();
    const { users, isSubmitting, error } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        userId: '',
        tokens: 10
    });

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.userId || formData.tokens <= 0) {
            return toast.error("Please select a user and enter a valid number of tokens.");
        }
        dispatch(addTokensToUser({
            userId: formData.userId,
            tokens: Number(formData.tokens)
        })).unwrap()
            .then(() => {
                toast.success(`Tokens added successfully!`);
                setFormData({ userId: '', tokens: 10 }); // Reset form
            })
            .catch((err) => toast.error(err.message || "Failed to add tokens."));
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex bg-[#1e1e2f] text-white">
                <SideBar activePage="tokens" />

                <main className="flex-1 p-6 overflow-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Manage User Tokens</h1>
                            <p className="text-gray-400 mt-1">Manually add tokens to a specific user's account.</p>
                        </div>
                    </header>

                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#121826] border border-gray-700/50 rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3"><Gift className="w-5 h-5 text-purple-400" /> Add Tokens</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Select User *</label>
                                    <select name="userId" value={formData.userId} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required>
                                        <option value="" disabled>-- Select a user --</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.profile?.firstName || 'N/A'} {user.profile?.lastName || ''} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Number of Tokens to Add *</label>
                                    <input type="number" name="tokens" value={formData.tokens} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required min="1" />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="submit" disabled={isSubmitting || !formData.userId} className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold text-sm flex items-center gap-2 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                                        {isSubmitting ? 'Adding...' : 'Add Tokens'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default TokensPage;
