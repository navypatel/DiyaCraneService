import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import StatsBar from '../components/home/StatsBar';
import Services from '../components/home/Services';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FinalCTA from '../components/home/FinalCTA';

export default function Home() {
  // Guarantee window is scrolled to top on initial page mount/transition
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" id="home-page-view">
      <Hero />
      <StatsBar />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
