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
      alert('Please agree to the terms and conditions.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    console.log('Form submitted:', formData);
  };

  return (
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4 relative">
       <div className="absolute top-50 flex justify-center w-full">
        <Link to="/" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
        <img
          src="/Images/Planifya-v2.png"
          alt="Planifya Logo"
          className="h-10 object-contain"
        />
        </Link>
      </div>

      <div className="w-full max-w-md mt-28 text-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Create an account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
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
              I agree to the <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">terms and conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-700 hover:bg-purple-800 rounded-lg font-medium"
          >
            Sign up
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/Login" className="text-blue-600 hover:underline dark:text-blue-400">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
