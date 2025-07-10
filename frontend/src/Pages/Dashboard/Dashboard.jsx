import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell, LayoutDashboard, User, Settings, Mail,
  Users, FileText, Trash2, PartyPopper, Loader2
} from "lucide-react";
import { fetchAllUsers, deleteUser } from "../../features/adminSlice"; // Adjust path to your slice

// --- Child Components (can be in the same file or separate) ---

const Navbar = () => (
  <header className="bg-[#1e1e2f] shadow-md p-4 flex justify-between items-center border-b border-gray-700">
    <img src="/Images/Planifya-v2.png" alt="Logo" className="h-10" />
    <button className="text-gray-300 hover:text-blue-400">
      <Bell className="w-6 h-6" />
    </button>
  </header>
);

// const Sidebar = () => (
//   <aside className="bg-[#121826] w-64 p-6 h-screen flex flex-col justify-between shadow-lg border-r border-gray-700/50">
//     <nav className="space-y-4 text-gray-400 font-medium">
//       <h2 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
//       <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300">
//         <LayoutDashboard className="w-5 h-5" /> Dashboard
//       </Link>
//       <Link to="/users" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
//         <Users className="w-5 h-5" /> Utilisateurs
//       </Link>
//       <Link to="/events" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
//         <PartyPopper className="w-5 h-5" /> Events
//       </Link>
//       <h2 className="px-4 pt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Support</h2>
//       <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
//         <Settings className="w-5 h-5" /> Paramètres
//       </Link>
//       <Link to="/contact" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
//         <Mail className="w-5 h-5" /> Contact
//       </Link>
//     </nav>
//     <div className="border-t border-gray-700/50 pt-4">
//       <Link to="/login" className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors">
//         <Mail className="w-5 h-5" /> Logout
//       </Link>
//     </div>
//     {isLogoutConfirmOpen && (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
//           <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
//           <p className="mb-6">Are you sure you want to log out?</p>
//           <div className="flex justify-center space-x-4">
//             <button onClick={handleLogoutCancel} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors">Cancel</button>
//             <button onClick={handleLogoutConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white">Logout</button>
//           </div>
//         </div>
//       </div>
//     )}
//   </aside>
// );

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-[#2a2f45] shadow rounded-lg p-4 flex items-center gap-4">
    <Icon className="w-8 h-8 text-blue-400" />
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  </div>
);

const DashboardContent = ({ users, loading, onUserDelete }) => (
  <main className="flex-grow p-6 bg-[#1e1e2f]">
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-white">Bienvenue Admin 👋</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Utilisateurs" value={users.length} icon={User} />
        <StatCard title="Candidatures" value="48" icon={FileText} />
        <StatCard title="Nouveaux messages" value="5" icon={Mail} />
      </div>
      <div className="bg-[#2a2f45] rounded-xl shadow-sm p-5 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Gestion des utilisateurs</h3>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-3">Loading Users...</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2 px-2">Nom</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Rôle</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700 hover:bg-[#2e3448]">
                  <td className="py-3 px-2">{user.name}</td>
                  <td className="py-3 px-2">{user.email}</td>
                  <td className="py-3 px-2 capitalize">{user.role}</td>
                  <td className="py-3 px-2">
                    <button
                      className="p-1 rounded hover:bg-red-800 text-red-400"
                      title="Supprimer"
                      onClick={() => onUserDelete(user._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </main>
);

export default function AdminPanel() {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    dispatch(deleteUser(userToDelete))
      .unwrap()
      .then(() => {
        toast.success('Utilisateur supprimé avec succès');
        setUserToDelete(null);
      })
      .catch((err) => {
        toast.error(err.message || 'Erreur lors de la suppression.');
        setUserToDelete(null);
      });
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
    <div className="min-h-screen flex flex-col bg-[#1e1e2f] text-white">
      <Navbar />
      <div className="flex flex-1">
        <aside className="bg-[#121826] w-64 p-6 h-screen flex flex-col justify-between shadow-lg border-r border-gray-700/50">
          <nav className="space-y-4 text-gray-400 font-medium">
            <h2 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Menu</h2>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
            {/* <Link to="/users" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
              <Users className="w-5 h-5" /> Utilisateurs
            </Link> */}
            <Link to="/events" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
              <PartyPopper className="w-5 h-5" /> Events
            </Link>
            {/* <h2 className="px-4 pt-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Support</h2>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
              <Settings className="w-5 h-5" /> Paramètres
            </Link>
            <Link to="/contact" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/20 hover:text-blue-300 transition-colors">
              <Mail className="w-5 h-5" /> Contact
            </Link> */}
          </nav>
          <div className="border-t border-gray-700/50 pt-4">
            <Link onClick={() => setIsLogoutConfirmOpen(true)} className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors">
              <Mail className="w-5 h-5" /> Logout
            </Link>
          </div>
          {isLogoutConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
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
        </aside>
        <DashboardContent
          users={users}
          loading={loading}
          onUserDelete={handleDeleteClick}
        />
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white"
                disabled={loading}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}