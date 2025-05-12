import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-yellow-400 font-bold">Rekrute</span>
            <span className="ml-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text font-semibold">IT</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam aliquid dignissimos assumenda laboriosam ad excepturi molestiae neque nulla? Aliquam sapiente nisi quo ea esse blanditiis minima adipisci vero minus. Doloribus.
          </p>
        </div>

        <div className="md:w-1/3">
          <h3 className="text-base font-semibold mb-2">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, vitae animi architecto ipsam recusandae delectus 
          </p>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 mb-3 rounded border border-gray-600 bg-black text-white placeholder-gray-500"
          />
          <button className="w-full bg-[#514BEE] hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold">
            Subscribe now
          </button>
        </div>
      </div>
      <div className="mt-10 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
        <p className="text-xs text-gray-600">
          © Copyright Job Portal 2025.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
