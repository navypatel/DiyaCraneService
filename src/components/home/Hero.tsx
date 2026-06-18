import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Activity, CalendarCheck } from 'lucide-react';

export default function Hero() {
  const scrollToContent = () => {
    const nextElem = document.getElementById('stats-bar');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home-hero-section"
      className="relative min-h-[90vh] flex items-center justify-center bg-brand-black text-white pt-20 overflow-hidden"
    >
      {/* Background Image / Backup Industrial Mesh Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
        style={{ 
          backgroundImage: "url('/src/assets/images/fleet_crane_road_1781700201838.jpg')",
          backgroundColor: '#111'
        }}
      />
      
      {/* Construction theme grid lines backup for premium visual */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffd70010_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      {/* Hero Content Frame */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        
        {/* Experience badge */}
        <div 
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow rounded-full text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>10+ Years Trust • South Gujarat Mobile Fleet</span>
        </div>

        {/* Primary Headline */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-white tracking-tight leading-none text-center max-w-4xl"
          id="hero-heading"
        >
          Professional Crane Rental <br className="hidden sm:block"/>
          Services for <span className="text-brand-yellow">South Gujarat</span>
        </h1>

        {/* Subtitle */}
        <p 
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-sans"
          id="hero-subheading"
        >
          Trusted by 100+ Businesses. 100% Punctuality. Safety-focused operations featuring certified high tonnage <span className="text-white font-semibold">HYDRA</span> and <span className="text-white font-semibold">FARANA</span> mobile cranes.
        </p>

        {/* Action button container */}
        <div 
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          id="hero-buttons"
        >
          <Link
            to="/contact?service=general"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black text-base font-bold rounded shadow-md transform active:scale-95 transition-all border border-brand-black/20"
          >
            <CalendarCheck className="w-5 h-5" />
            Get a Quote
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand-red hover:bg-brand-red text-white text-base font-bold rounded transform active:scale-95 transition-all"
          >
            View Services
            <ArrowRight className="w-4 h-4 text-brand-yellow" />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-6 p-2 text-gray-400 hover:text-brand-yellow transition-colors hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
          aria-label="Scroll to content"
        >
          <div className="flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest text-gray-500 uppercase">
            <span>Explore Base</span>
            <ChevronDown className="w-5 h-5 animate-bounce-slow text-brand-yellow" />
          </div>
        </button>

      </div>
    </section>
  );
}
