// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp3285538.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center p-4">
        <div className="animate__animated animate__fadeInDown">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 animate__animated animate__fadeInDown">
            Dive Into the World of Movies
          </h1>
          <p className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white mb-8 animate__animated animate__fadeIn animate__delay-1s">
            Explore unlimited movies and TV shows. Watch anywhere, anytime.
          </p>
        </div>
        <Link to="/login" className="bg-red-600 text-white text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-red-700 transition transform hover:scale-105 duration-300 ease-in-out animate__animated animate__pulse animate__infinite">
          Get Started
        </Link>
        <div className="absolute bottom-10 left-0 right-0 text-white text-center animate__animated animate__fadeInUp animate__delay-2s">
          <FaPlay size={24} className="mx-auto mb-2 animate-bounce" />
          <p className="text-xs sm:text-sm md:text-md">Experience seamless streaming with Flicksasa recommendation engine</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
