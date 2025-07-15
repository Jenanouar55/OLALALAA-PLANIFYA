import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

function Navbar() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 px-6 transition-all duration-300 ${isAtTop ? 'bg-transparent' : 'bg-black/30 backdrop-blur-md shadow-lg'}`}>
      {/* Logo + Brand */}
      <Link to="/" className="flex items-center space-x-3">
        <img src="/Images/Planifya-v2.png" alt="logo" className="h-9 w-auto object-contain" />
      </Link>

      {/* Right Side */}
      <div className="relative">
        {isLoggedIn ? (
          <>
            <button onClick={toggleDropdown} className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7B61FF] text-white hover:bg-[#514BEE] focus:outline-none transition">
              <User />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 text-sm z-50">
                <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-800">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-[#514BEE] to-[#7B61FF] hover:from-[#00C2CB] hover:to-[#007F80] text-white font-semibold py-2 px-4 text-sm rounded-2xl transition duration-300 shadow-lg hover:shadow-xl"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
