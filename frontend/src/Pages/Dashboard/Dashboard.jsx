import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bell, User, Trash2, Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import { fetchAllUsers, deleteUser } from "../../features/adminSlice";
import SideBar from "./SideBar";


const Navbar = () => (
  <header className="bg-[#1e1e2f] shadow-md p-4 flex justify-between items-center border-b border-gray-700">
    <img src="/Images/Planifya-v2.png" alt="Logo" className="h-10" />
    <button className="text-gray-300 hover:text-blue-400">
      <Bell className="w-6 h-6" />
    </button>
  </header>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-[#2a2f45] shadow rounded-lg p-4 flex items-center gap-4 border border-gray-700/50">
    <Icon className="w-8 h-8 text-blue-400" />
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// New Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 rounded-md transition-colors ${currentPage === number
            ? 'bg-blue-600 text-white font-bold'
            : 'bg-gray-700 hover:bg-gray-600'
            }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};


const DashboardContent = ({ users, loading, onUserDelete, totalUsers, usersPerPage, currentPage, onPageChange }) => {
  const indexOfFirstUser = (currentPage - 1) * usersPerPage + 1;
  const indexOfLastUser = Math.min(currentPage * usersPerPage, totalUsers);

  return (
    <main className="flex-grow p-6 bg-[#1e1e2f]">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-white">Bienvenue Admin 👋</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={totalUsers} icon={User} />
        </div>
        <div className="bg-[#2a2f45] rounded-xl shadow-sm border border-gray-700">
          <div className="p-5 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Gestion des utilisateurs</h3>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-3">Loading Users...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-600 bg-gray-800/20">
                      <th className="py-3 px-4 font-semibold">Nom</th>
                      <th className="py-3 px-4 font-semibold">Email</th>
                      <th className="py-3 px-4 font-semibold">Rôle</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-700 hover:bg-[#2e3448]">
                        <td className="py-3 px-4">{user.name || `${user.profile?.firstName} ${user.profile?.lastName}` || 'N/A'}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4 capitalize">{user.role}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            className="p-1.5 rounded-md hover:bg-red-800/50 text-red-400 transition-colors"
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
              </div>
              <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
                <p>
                  Showing <span className="font-bold text-white">{indexOfFirstUser}</span> to <span className="font-bold text-white">{indexOfLastUser}</span> of <span className="font-bold text-white">{totalUsers}</span> results
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalUsers / usersPerPage)}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 5; // You can change this number

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

  // Pagination Logic
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e2f] text-white">
      <Navbar />
      <div className="flex flex-1">
        <SideBar activePage="dashboard" />
        <DashboardContent
          users={currentUsers}
          loading={loading && users.length === 0}
          onUserDelete={handleDeleteClick}
          totalUsers={users.length}
          usersPerPage={USERS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 max-w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setUserToDelete(null)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition-colors">
                Annuler
              </button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white" disabled={loading}>
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
