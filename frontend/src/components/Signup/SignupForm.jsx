import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      toast.warning('Veuillez accepter les termes et conditions.');
      toast.warning('Veuillez accepter les termes et conditions.');
      return;
    }


    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Inscription réussie. Redirection...');
        Navigate("/ex")
        // setTimeout(() => Navigate('/login'), 2000);
        localStorage.setItem("token", data.token)
      } else {
        toast.error(data.message || 'Erreur lors de l’inscription.');
      }
    } catch (err) {
      toast.error('Erreur de réseau.');
    }
  };

  return (
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-center mb-4">
          <img src="/Images/Planifya-v2.png" alt="Logo" className="h-12" />
        </div>
        <h1 className="text-xl font-bold text-center mb-6 dark:text-white">Créer un compte</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="Prénom" required value={formData.firstName} onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />
          <input type="text" name="lastName" placeholder="Nom" required value={formData.lastName} onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />
          <input type="email" name="email" placeholder="Adresse e-mail" required value={formData.email} onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />

          {/* Password Field with Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mot de passe"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-sm text-gray-600 dark:text-gray-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmez le mot de passe"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-sm text-gray-600 dark:text-gray-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <input type="text" name="firstName" placeholder="Prénom" required value={formData.firstName} onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />
          <input type="text" name="lastName" placeholder="Nom" required value={formData.lastName} onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />
          <input type="email" name="email" placeholder="Adresse e-mail" required value={formData.email} onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" />

          {/* Password Field with Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mot de passe"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-sm text-gray-600 dark:text-gray-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmez le mot de passe"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-sm text-gray-600 dark:text-gray-300"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="flex items-start">
            <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange}
              className="mt-1 w-4 h-4" />
            <label className="ml-2 text-sm dark:text-gray-300">J'accepte les <a href="#" className="text-blue-600 dark:text-blue-400">termes</a></label>
            <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange}
              className="mt-1 w-4 h-4" />
            <label className="ml-2 text-sm dark:text-gray-300">J'accepte les <a href="#" className="text-blue-600 dark:text-blue-400">termes</a></label>
          </div>
          <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800">
            S'inscrire
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Vous avez déjà un compte ? <Link to="/login" className="text-blue-600 dark:text-blue-400">Se connecter</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
