import React from 'react';
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-[#0b0c10] text-gray-300 pt-16 pb-10 overflow-hidden">
      {/* Divider glow line */}
      <div className="absolute top-0 left-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent transform -translate-x-1/2 opacity-30"></div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-4">
          <img src="/Images/main-icon.png" alt="Planifyaa Logo" className="h-10 w-auto object-contain" />
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Planifyaa
          </span>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-400 max-w-lg mb-6">
          Plateforme tout-en-un pour les créateurs et agences, Planifyaa simplifie la planification de contenu avec style et intelligence.
        </p>

        {/* Social Icons */}
        <div className="flex gap-6 mb-6">
          <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur transition">
            <FaLinkedin className="text-xl text-white hover:text-blue-400" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur transition">
            <FaXTwitter className="text-xl text-white hover:text-sky-400" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur transition">
            <FaInstagram className="text-xl text-white hover:text-pink-400" />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-3">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms & Conditions</a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Planifyaa. Tous droits réservés.
        </p>
      </div>

      {/* Starry glow background (soft effect) */}
      <div className="absolute -bottom-32 left-1/2 w-[400px] h-[400px] bg-indigo-700 opacity-20 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none" />
    </footer>
  );
};

export default Footer;
