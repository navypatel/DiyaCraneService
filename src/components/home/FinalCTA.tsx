import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Eye, Landmark } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section id="final-cta-section" className="py-20 bg-brand-dark text-white relative">
      {/* Background warning pattern lines to fit heavy equipment crane branding */}
      <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(45deg,#FFD000,#FFD000_15px,#1A1A1A_15px,#1A1A1A_30px)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        
        <div className="p-3 bg-brand-yellow text-brand-black rounded-lg mb-6 w-fit rotate-3 shadow-md border-2 border-brand-black">
          <Landmark className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight" id="final-cta-heading">
          Ready to Move Your <span className="text-brand-yellow">Project Slabs</span>?
        </h2>
        
        <p className="mt-4 text-base sm:text-lg text-gray-350 max-w-2xl font-sans">
          Hire safety-compliant, prompt crane solutions starting today. Our fleet is stationed across Valsad and available for emergency shifts or long-term masonry bookings.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto" id="final-cta-buttons">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black text-base font-bold rounded shadow-lg hover:shadow-brand-yellow/15 active:scale-95 transition-all text-center"
          >
            <PhoneCall className="w-5 h-5 text-brand-black" />
            Book a Crane Shift
          </Link>
          <Link
            to="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 hover:border-white/50 text-white text-base font-semibold rounded active:scale-95 transition-all text-center"
          >
            <Eye className="w-5 h-5 text-gray-400" />
            View Photo Gallery
          </Link>
        </div>

      </div>
    </section>
  );
}
