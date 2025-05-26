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
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-center mb-4">
          <img src="/Images/Planifya-v2.png" alt="Logo" className="h-12" />
        </div>
        <h1 className="text-xl font-bold text-center mb-4 dark:text-white">Connectez-vous à votre compte</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Adresse e-mail" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />
          <input type="password" name="password" placeholder="Mot de passe" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />
          <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800">
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
