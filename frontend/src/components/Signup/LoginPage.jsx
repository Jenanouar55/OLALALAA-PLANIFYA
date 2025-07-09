import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../lib/axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/auth/login', formData);


      // const data = await response.json();

      console.log(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      toast.success('Connexion réussie !');
      setTimeout(() => navigate('/userDashboard'), 2000);
    } catch (err) {
      alert('Erreur de réseau.');
    }
  };

  return (
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow-lg p-6 sm:p-8 relative">

        <div className="flex justify-center mb-4">
          <Link to="/Home" className="flex items-center">
            <img src="/Images/Planifya-v2.png" alt="Logo Planifya" className="h-10 object-contain" />
          </Link>
        </div>

        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Connectez-vous à votre compte
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="nom@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 
                         block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Mot de passe
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 
                         block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-lg text-gray-600 dark:text-gray-300"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button
            type="submit"
            className="block w-40 mx-auto text-purple-700 hover:text-white border border-purple-700 
                       hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 
                       font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 
                       dark:border-purple-400 dark:text-purple-400 dark:hover:text-white 
                       dark:hover:bg-purple-500 dark:focus:ring-purple-900"
          >
            Se connecter
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Pas encore de compte ? <Link to="/signup" className="text-blue-600 dark:text-blue-400">Inscrivez-vous</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
