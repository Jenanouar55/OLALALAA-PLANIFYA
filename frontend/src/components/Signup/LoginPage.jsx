import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Connexion réussie');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Erreur de connexion');
      }
      } catch (err) {
      alert('Erreur de réseau.');
    }
  };

  return (
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute top-10 flex justify-center w-full">
        <Link to="/Home" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            src="/Images/Planifya-v2.png"
            alt="Logo Planifya"
            className="h-10 m-37 object-contain"
          />
        </Link>
      </div>

      <div className="w-full max-w-md mt-28 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Connectez-vous à votre compte
        </h1>

        <form className="space-y-4" action="#">
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
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 
                         block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 
                         block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                         dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
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
