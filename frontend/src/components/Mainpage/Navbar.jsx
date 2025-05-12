import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-6 transition-all duration-300 ${
        isAtTop
          ? 'bg-gradient-to-r from-white via-[#f0f4ff] to-[#e0f7fa] shadow-md'
          : 'bg-transparent'
      }`}
    >
      {/* Logo and Brand */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="/Images/main-icon.png"
          alt="logo"
          className="h-10 w-auto object-contain"
        />
        <span className="text-2xl font-extrabold text-blue-900">Planifyaa</span>
      </Link>

      {/* Right-side Navigation */}
      <div className="flex items-center space-x-6">
      <Link
        to="/login"
        className="text-blue-950 font-semibold text-base hover:underline tracking-wide"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="bg-[#514BEE] hover:bg-[#00C2CB] text-white font-bold py-2 px-6 rounded-2xl transition duration-300 shadow-sm"
      >
        Register
      </Link>
    </div>
    </nav>
  );
}

export default Navbar;
