import React from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
    return (
        <section className="bg-sky-200 min-h-screen flex items-center justify-center px-4 relative">
            <div className="absolute top-10 flex justify-center w-full">
                <Link to="/" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                    <img
                        src="/Images/Planifya-v2.png"
                        alt="Logo Planifya"
                        className="h-10 m-37 object-contain"
                    />
                </Link>
            </div>

            <div className="w-full max-w-md mt-28 bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-lg shadow-lg p-6 sm:p-8">
                <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
                    Connectez-vous à votre compte Admin
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
                        Revenir {' '}
                        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                            Se connecter
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    )
}

export default AdminLogin