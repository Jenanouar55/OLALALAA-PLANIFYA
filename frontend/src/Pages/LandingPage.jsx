import React from 'react';
import Navbar from '../components/Mainpage/Navbar';
import HeroSection from '../components/Mainpage/HeroSection';
import AvailablePosts from '../components/Mainpage/AvailablePosts';
import Stats from '../components/Mainpage/stats';
import Footer from '../components/Mainpage/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      {/* <AvailablePosts /> */}
      {/* <Stats /> */}
      <Footer />
    </>
  );
};

export default LandingPage;
