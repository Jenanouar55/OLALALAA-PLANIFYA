import React, { useState } from 'react';
import { Bell, Gift, LayoutDashboard, Mail, PartyPopper } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const handleLogoutRequest = () => {
        setIsLogoutConfirmOpen(true);
    };

    const handleLogoutCancel = () => {
        setIsLogoutConfirmOpen(false);
    };

    const handleLogoutConfirm = () => {
        setIsLogoutConfirmOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <>
            <aside className="bg-[#121826] w-64 p-6 h-screen flex flex-col justify-between shadow-lg border-r border-gray-700/50">
                <nav className="space-y-4 text-gray-400 font-medium">
                    <h2 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'dashboard' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/events" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'events' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
                        <PartyPopper className="w-5 h-5" /> Events
                    </Link>
                    <Link to="/notifications" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'notifications' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
                        <Bell className="w-5 h-5" /> Notifications
                    </Link>
                    <Link to="/tokens" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'tokens' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
                        <Gift className="w-5 h-5" /> Tokens
                    </Link>
                </nav>
                <div className="border-t border-gray-700/50 pt-4">
                    <button
                        onClick={handleLogoutRequest}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors"
                    >
                        <Mail className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* --- Logout Confirmation Modal --- */}
            {isLogoutConfirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
                        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={handleLogoutCancel} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleLogoutConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
