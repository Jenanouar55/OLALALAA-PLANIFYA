import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    LayoutDashboard, PartyPopper, Mail, Loader2,
    Bell, Send, Users, Gift
} from "lucide-react";
import {
    fetchAllUsers,
    sendNotification
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

// const Sidebar = ({ activePage }) => {
//     const navigate = useNavigate();
//     return (
//         <aside className="bg-[#121826] w-64 p-6 h-screen flex flex-col justify-between shadow-lg border-r border-gray-700/50">
//             <nav className="space-y-4 text-gray-400 font-medium">
//                 <h2 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
//                 <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'dashboard' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
//                     <LayoutDashboard className="w-5 h-5" /> Dashboard
//                 </Link>
//                 <Link to="/events" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'events' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
//                     <PartyPopper className="w-5 h-5" /> Events
//                 </Link>
//                 <Link to="/notifications" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'notifications' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
//                     <Bell className="w-5 h-5" /> Notifications
//                 </Link>
//                 <Link to="/tokens" className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors ${activePage === 'tokens' ? 'bg-blue-600/20 text-blue-300' : ''}`}>
//                     <Gift className="w-5 h-5" /> Tokens
//                 </Link>
//             </nav>
//             <div className="border-t border-gray-700/50 pt-4">
//                 <button onClick={() => {
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("role");
//                     navigate("/login");
//                 }} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors">
//                     <Mail className="w-5 h-5" /> Logout
//                 </button>
//             </div>
//         </aside>
//     );
// }


const NotificationsPage = () => {
    const dispatch = useDispatch();
    const { users, isSubmitting, error } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        userId: 'all',
        title: '',
        message: '',
        type: 'info'
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
        if (!formData.title || !formData.message) {
            return toast.error("Title and message are required.");
        }
        dispatch(sendNotification(formData)).unwrap()
            .then(() => {
                toast.success("Notification sent successfully!");
                setFormData({ userId: 'all', title: '', message: '', type: 'info' }); // Reset form
            })
            .catch((err) => toast.error(err.message || "Failed to send notification."));
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex bg-[#1e1e2f] text-white">
                <SideBar activePage="notifications" />

                <main className="flex-1 p-6 overflow-auto">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Send Notifications</h1>
                            <p className="text-gray-400 mt-1">Broadcast messages to all users or target specific individuals.</p>
                        </div>
                    </header>

                    <div className="max-w-2xl mx-auto">
                        <div className="bg-[#121826] border border-gray-700/50 rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3"><Send className="w-5 h-5 text-blue-400" /> New Notification</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Recipient</label>
                                    <select name="userId" value={formData.userId} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none">
                                        <option value="all">All Users</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.profile?.firstName || 'N/A'} {user.profile?.lastName || ''} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Notification Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Message *</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Notification Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 focus:outline-none">
                                        <option value="info">Info (Blue)</option>
                                        <option value="success">Success (Green)</option>
                                        <option value="warning">Warning (Yellow)</option>
                                        {/* <option value="error">Error (Red)</option> */}
                                    </select>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-sm flex items-center gap-2 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors">
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        {isSubmitting ? 'Sending...' : 'Send Notification'}
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

export default NotificationsPage;
