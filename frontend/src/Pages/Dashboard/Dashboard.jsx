import React from "react";
import {
  Bell,
  LayoutDashboard,
  User,
  Settings,
  Mail,
  Users,
  FileText,
  Pencil,
  Trash2,
  PartyPopper,
} from "lucide-react";
import { Link } from "react-router-dom";

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
        events
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

const DashboardContent = () => (
  <main className="flex justify-center items-start py-10 px-4 bg-[#1e1e2f] min-h-screen">
    <div className="w-full max-w-6xl flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-white">
        Bienvenue Admin 👋
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Utilisateurs" value="120" icon={User} />
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
            {[
              {
                name: "Halim helima",
                email: "Halim@gmail.com",
                role: "Admin",
                status: "Actif",
                statusColor: "text-green-400",
              },
              {
                name: "HalimHalima",
                email: "Halima@example.com",
                role: "Utilisateur",
                status: "En attente",
                statusColor: "text-yellow-400",
              },
            ].map((user, idx) => (
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
                    className="p-1 rounded hover:bg-blue-800 text-blue-400"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-red-800 text-red-400"
                    title="Supprimer"
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
  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e2f]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
