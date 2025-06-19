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
          ? 'bg-transparent'
          : 'bg-black/30 backdrop-blur-md shadow-lg'
      }`}
    >
      {/* Logo + Brand */}
      <Link to="/" className="flex items-center space-x-3">
        <img
          src="/Images/Planifya-v2.png"
          alt="logo"
          className="h-9 w-auto object-contain"
        />
        
      </Link>

      {/* Links */}
            <div className="flex items-center space-x-6">
            <Link
        to="/login"
        className="bg-gradient-to-r from-[#514BEE] to-[#7B61FF] 
                  hover:from-[#00C2CB] hover:to-[#007F80] 
                  text-white font-semibold 
                  py-2 px-7 text-lg 
                  rounded-2xl 
                  transition duration-300 
                  shadow-lg hover:shadow-xl 
                  transform hover:scale-105"
      >
        Login
      </Link>

      </div>
    </nav>
  );
}

export default Navbar;
