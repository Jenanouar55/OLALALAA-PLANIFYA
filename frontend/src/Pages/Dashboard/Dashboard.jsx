import React, { useEffect, useState } from "react";
import {
  Bell,
  LayoutDashboard,
  User,
  Settings,
  Mail,
  Users,
  FileText,
  Trash2,
  PartyPopper,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => (
  <header className="bg-[#1e1e2f] shadow-md p-4 flex justify-between items-center border-b border-gray-700">
    <img src="/Images/Planifya-v2.png" alt="Logo" className="h-15" />
    <button className="text-gray-300 hover:text-blue-400">
      <Bell className="w-6 h-6" />
    </button>
  </header>
);

const Sidebar = () => (
  <aside className="bg-[#121826] md:w-64 p-6 h-screen flex flex-col justify-between shadow-md border-r border-gray-700">
    <nav className="space-y-5 text-gray-300 font-medium">
      <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-400">
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </Link>
      <Link to="/users" className="flex items-center gap-3 hover:text-blue-400">
        <Users className="w-5 h-5" />
        Utilisateurs
      </Link>
      <Link to="/settings" className="flex items-center gap-3 hover:text-blue-400">
        <Settings className="w-5 h-5" />
        Paramètres
      </Link>
      <Link to="/contact" className="flex items-center gap-3 hover:text-blue-400">
        <Mail className="w-5 h-5" />
        Contact
      </Link>
      <Link to="/events" className="flex items-center gap-3 hover:text-blue-400">
        <PartyPopper className="w-5 h-5" />
        Events
      </Link>
    </nav>
  </aside>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-[#2a2f45] shadow rounded-lg p-4 flex items-center gap-4">
    <Icon className="w-8 h-8 text-blue-400" />
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  </div>
);

const DashboardContent = ({ users, count, setToggle, setSelected }) => (
  <main className="flex justify-center items-start py-10 px-4 bg-[#1e1e2f] min-h-screen">
    <div className="w-full max-w-6xl flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-white">Bienvenue Admin 👋</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Utilisateurs" value={count} icon={User} />
        <StatCard title="Candidatures" value="48" icon={FileText} />
        <StatCard title="Nouveaux messages" value="5" icon={Mail} />
      </div>

      <div className="bg-[#2a2f45] rounded-xl shadow-sm p-5 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Gestion des utilisateurs</h3>
        <table className="w-full text-left text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2">Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-[#2e3448]">
                <td className="py-2">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`font-medium ${user.statusColor}`}>
                    {user.status}
                  </span>
                </td>
                <td className="flex gap-2 py-2">
                  <button
                    className="p-1 rounded hover:bg-red-800 text-red-400"
                    title="Supprimer"
                    onClick={() => {
                      setSelected(user._id);
                      setToggle(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </main>
);

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState();
  const [toggle, setToggle] = useState(false);

  const handleDeleteCancel = () => setToggle(false);

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Utilisateur supprimé avec succès');
        setUsers(users.filter((u) => u._id !== id));
        setToggle(false);
      } else {
        toast.error(data.message || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      toast.error('Erreur de réseau.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          toast.error(data.message || 'Erreur de récupération.');
        }
      } catch (err) {
        toast.error('Erreur de réseau.');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e2f]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow">
          <DashboardContent
            users={users}
            count={users.length}
            setToggle={setToggle}
            setSelected={setSelected}
          />

          {toggle && (
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
                    onClick={() => handleDeleteUser(selected)}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
