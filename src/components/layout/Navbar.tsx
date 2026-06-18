import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark, User, ShieldAlert } from 'lucide-react';
import { BRAND_COLORS, NAVIGATION_LINKS } from '../../lib/constants';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function Navbar({ onOpenMobileMenu, isAuthenticated, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'h-[65px] bg-white shadow-md border-b border-gray-100'
          : 'h-[80px] bg-white/95 md:bg-transparent md:backdrop-blur-none backdrop-blur-md'
      } flex items-center`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand Accent */}
          <Link to="/" className="flex items-center gap-3 group" id="navbar-brand-logo">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center p-0 rounded-md border border-brand-black/20 shadow-sm bg-brand-black group-hover:opacity-90 transition-opacity">
              <img 
                src="/src/assets/images/crane_logo_1781694287869.jpg" 
                alt="Diya Crane" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl md:text-2xl tracking-tighter text-brand-black flex items-center gap-1.5 leading-tight">
                DIYA <span className="text-brand-red">CRANE</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#666666] font-mono leading-none">
                Valsad • South Gujarat
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 font-medium" id="navbar-destop-menu">
            {NAVIGATION_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm transition-all duration-200 hover:text-brand-red ${
                    isActive
                      ? 'text-brand-red font-bold underline decoration-brand-yellow decoration-2 underline-offset-4'
                      : 'text-brand-black hover:bg-gray-50/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin link if signed in */}
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-semibold text-brand-yellow bg-brand-black hover:bg-brand-black/90 transition-all flex items-center gap-1 md:ml-2`}
              >
                <ShieldAlert className="w-4 h-4 text-brand-yellow animate-pulse" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-black font-semibold text-sm rounded shadow-sm hover:shadow-md active:scale-95 transition-all border border-brand-black/10"
              id="navbar-cta-quote"
            >
              Get a Quote
            </Link>

            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="hidden md:inline-flex items-center justify-center p-2 text-gray-500 hover:text-brand-red transition-colors"
                title="Logout from Admin"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 text-brand-black hover:bg-gray-100 rounded transition-colors focus:outline-none"
              id="navbar-mobile-toggle"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
