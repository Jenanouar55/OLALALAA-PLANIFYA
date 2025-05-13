import React from 'react';
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#e0f7fa] via-white to-[#e0f7fa] shadow-md text-white px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center gap-10">
        <div className="md:w-1/2 m-auto text-center">
          {/* <h2 className="text-2xl font-bold mb-2">
            <span className="text-yellow-400 font-bold">Rekrute</span>
            <span className="ml-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text font-semibold">IT</span>
          </h2> */}
          <Link to="/" className="flex items-center space-x-2 py-3 text-center justify-center">
            <img
              src="/Images/main-icon.png"
              alt="logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-extrabold text-blue-900">Planifyaa</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Planifya est une application web dédiée aux
            créateurs de contenu et aux agences social media,
            avec un focus sur le marché marocain. </p>
        </div>
      </div>
      <div className="icons text-center flex justify-center py-4 gap-2">
        <Link to="/">
          <FaLinkedin className='text-black text-3xl' />
        </Link>
        <Link to="/">
          <FaXTwitter className='text-black text-3xl' />
        </Link>
        <Link to="/">
          <FaInstagram className='text-black text-3xl' />
        </Link>


      </div>
      <div className=" text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
        <p className="text-xs text-gray-600">
          © Copyright Planifyaa 2025.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
