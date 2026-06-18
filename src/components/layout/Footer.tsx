import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Phone, Mail, MapPin, MessageSquare, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-brand-black text-white pt-16 pb-8 border-t-4 border-brand-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-yellow text-brand-black p-2 rounded font-bold">
                <Landmark className="w-5 h-5 text-brand-black" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tighter text-white">
                DIYA <span className="text-brand-yellow">CRANE</span>
              </span>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed font-sans mt-2">
              Premium mobile crane rental services operating in South Gujarat. 10+ years of uncompromised safety, prompt booking schedules, and highly experienced heavy rig operators.
            </p>

            <div className="flex items-center gap-3 mt-3">
              <a 
                href="https://wa.me/919824996999?text=Hello%20Diya%20Crane%20Service%2C%20I%20would%20like%20to%20enquire%20about%20crane%20rentals."
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-lg"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-brand-yellow border-b border-white/10 pb-2">Quick Navigation</h4>
            <div className="grid grid-cols-1 gap-2.5 text-sm text-gray-400">
              {[
                { name: 'Home Base', path: '/' },
                { name: 'Services Fleet', path: '/services' },
                { name: 'Our Business Story', path: '/about' },
                { name: 'Project Gallery Visuals', path: '/gallery' },
                { name: 'Submit Quotation', path: '/contact' },
                { name: 'Data Operator Portal', path: '/admin/login' }
              ].map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="flex items-center gap-1 hover:text-brand-yellow transition-all duration-200 hover:translate-x-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-brand-yellow" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Fleet specifications */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-brand-yellow border-b border-white/10 pb-2">Our Fleet</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-400">
              <Link to="/services/hydra" className="group hover:text-brand-yellow transition-colors">
                <span className="block font-semibold text-white group-hover:text-brand-yellow text-sm">HYDRA Escort Series</span>
                <span className="text-xs text-gray-500 block">12-ton to 18-ton mobile cranes</span>
              </Link>
              <Link to="/services/farana" className="group hover:text-brand-yellow transition-colors mt-2">
                <span className="block font-semibold text-white group-hover:text-brand-yellow text-sm">FARANA Pick & Carry</span>
                <span className="text-xs text-gray-500 block">15-ton to 25-ton high clearance</span>
              </Link>
            </div>
          </div>

          {/* Column 4: Address Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-bold text-base uppercase tracking-wider text-brand-yellow border-b border-white/10 pb-2">Contact Details</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <a href="tel:+919824996999" className="flex items-start gap-2.5 hover:text-brand-yellow transition-colors">
                <Phone className="w-4 h-4 mt-0.5 text-brand-yellow flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white text-xs font-mono uppercase tracking-widest leading-none">Call Support</span>
                  <span className="font-bold font-sans text-white text-sm">+91 98249 96999</span>
                </div>
              </a>
              <a href="mailto:info@diyacraneservice.com" className="flex items-start gap-2.5 hover:text-brand-yellow transition-colors">
                <Mail className="w-4 h-4 mt-0.5 text-brand-yellow flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white text-xs font-mono uppercase tracking-widest leading-none">Email Address</span>
                  <span className="font-sans text-sm">info@diyacraneservice.com</span>
                </div>
              </a>
              <div className="flex items-start gap-2.5 text-sm leading-relaxed">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-yellow flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white text-xs font-mono uppercase tracking-widest leading-none">Operational Base</span>
                  <span className="text-xs font-sans">
                    Chanvai road, near Ambaji tample, Parnera, Gujarat 396020
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Separator and Sub-Footer */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-sans">
            &copy; {currentYear} Diya Crane Service. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="border-r border-white/10 pr-4">Valsad, South Gujarat</span>
            <span className="text-brand-yellow font-mono text-[10px] uppercase">Safety Certified Operator Base</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
