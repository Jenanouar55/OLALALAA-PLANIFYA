import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="flex p-10 my-10 justify-between items-center min-h-[calc(100vh-96px)] bg-green from-white via-[#f0f4ff] to-[#e0f7fa]">
      <div className="w-1/2">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-blue-950">
          Planifiez. Créez. <span className="text-[#514BEE]">Brillez.</span>
        </h1>

        <p className="py-6 text-gray-700 text-lg max-w-xl">
          Le calendrier intelligent pour les créateurs et agences : idées, légendes et jours clés, tout en un seul endroit.
        </p>

        
        <div className="flex gap-4 mt-6">
          <Link
            to="/"
            className="bg-[#514BEE] hover:bg-[#00C2CB] text-white font-bold py-3 px-6 rounded-2xl transition duration-300 shadow-md"
          >
             Commencer gratuitement
          </Link>
       {/*   <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#f0f4ff] text-[#514BEE] hover:bg-[#00C2CB] hover:text-white font-medium py-2 px-5 rounded-full shadow-sm transition duration-300"
        >
           Découvrir les fonctionnalités
        </Link> */}

        </div>
      </div>

      
      <img
        src="/Images/Hero.png"
        alt="Planifyaa illustration"
        className="w-1/3 drop-shadow-lg"
      />
    </div>
  );
}

export default HeroSection;
