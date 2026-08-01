import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedDishes from '../components/home/FeaturedDishes';
import AboutSection from '../components/home/AboutSection';
import Testimonials from '../components/home/Testimonials';
import ReservationCTA from '../components/home/ReservationCTA';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <AboutSection />
      <FeaturedDishes />
      <Testimonials />
      <ReservationCTA />
    </div>
  );
};

export default Home;
