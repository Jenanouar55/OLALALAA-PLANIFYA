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
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <header className="bg-white shadow-md p-4 flex justify-between items-center">
    <h2 className="text-3xl font-extrabold">
      <span className="text-yellow-400 font-bold">Rekrute</span>
      <span className="ml-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text font-semibold">
        Admin
      </span>
    </h2>
    <button className="text-gray-600 hover:text-blue-600">
      <Bell className="w-6 h-6" />
    </button>
  </header>
);

const Sidebar = () => (
  <aside className="bg-gradient-to-br from-blue-100 to-blue-50 md:w-64 p-6 h-screen flex flex-col justify-between shadow-md">
    <nav className="space-y-4 text-gray-800 font-medium">
      <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-600">
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </Link>
      <Link to="/users" className="flex items-center gap-3 hover:text-blue-600">
        <Users className="w-5 h-5" />
        Utilisateurs
      </Link>
      <Link to="/settings" className="flex items-center gap-3 hover:text-blue-600">
        <Settings className="w-5 h-5" />
        Paramètres
      </Link>
      <Link to="/contact" className="flex items-center gap-3 hover:text-blue-600">
        <Mail className="w-5 h-5" />
        Contact
      </Link>
    </nav>
  </aside>
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
    <Icon className="w-8 h-8 text-blue-500" />
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardContent = () => (
  <main className="flex justify-center items-start py-10 px-4">
    <div className="w-full max-w-6xl flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Bienvenue Admin 👋
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Utilisateurs" value="120" icon={User} />
        <StatCard title="Candidatures" value="48" icon={FileText} />
        <StatCard title="Nouveaux messages" value="5" icon={Mail} />
      </div>
      {/* <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Activité récente</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>✅ Haroual yasser a postulé pour le poste "Data Analyst".</li>
          <li>🕓 Nouvel utilisateur ajouté : Nouhaila.</li>
          <li>📨 Nouveau message reçu via le formulaire de contact.</li>
        </ul>
      </div> */}
      <div className="bg-white rounded-xl shadow-sm p-5 border">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gestion des utilisateurs</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-600 border-b">
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
                statusColor: "text-green-600",
              },
              {
                name: "HalimHalima",
                email: "Halima@example.com",
                role: "Utilisateur",
                status: "En attente",
                statusColor: "text-yellow-600",
              },
            ].map((user, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
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
                    className="p-1 rounded hover:bg-blue-100 text-blue-600"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-red-100 text-red-600"
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow ">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
