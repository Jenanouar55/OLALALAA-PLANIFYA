import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Veuillez accepter les termes et conditions.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    console.log('Formulaire soumis :', formData);
  };

  return (
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute top-10 flex justify-center w-full">
        <Link to="/" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            src="/Images/Planifya-v2.png"
            alt="Logo Planifya"
            className="h-18 object-contain"
          />
        </Link>
      </div>

      <div className="w-full max-w-md mt-32 text-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Créer un compte
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmez le mot de passe"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              J'accepte les <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">termes et conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-700 hover:bg-purple-800 rounded-lg font-medium"
          >
            S'inscrire
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte ?{' '}
            <Link to="/Login" className="text-blue-600 hover:underline dark:text-blue-400">Se connecter</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
