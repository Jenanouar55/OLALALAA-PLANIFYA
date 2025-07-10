import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { registerUser } from '../../features/authSlice'; // Adjust path to your slice

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      toast.warn('Please agree to the terms and conditions.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // --- Prepare and dispatch Redux action ---
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
    };

    dispatch(registerUser(payload))
      .unwrap() // Use .unwrap() to handle promise state
      .then((data) => {
        toast.success('Registration successful! Redirecting...');
        setTimeout(() => navigate("/login"), 2000); // Redirect to profile creation
      })
      .catch((err) => {
        // Display the specific error message from the backend
        toast.error(err.message || 'Registration failed. Please try again.');
      });
  };

  return (
    <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4 dark:bg-slate-900">
      <ToastContainer theme="colored" />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
        <div className="flex justify-center mb-4">
          <img src="/Images/Planifya-v2.png" alt="Logo" className="h-12" />
        </div>
        <h1 className="text-xl font-bold text-center mb-6 dark:text-white">Create Your Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button type="button" onClick={() => setShowConfirm((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300">
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreed"
              id="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="agreed" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the <a href="#" className="font-medium text-purple-600 hover:underline dark:text-purple-500">terms and conditions</a>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-purple-700 text-white font-semibold py-3 rounded-lg hover:bg-purple-800 transition disabled:bg-purple-900 disabled:cursor-not-allowed"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="font-medium text-purple-600 hover:underline dark:text-purple-500">Log in</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;