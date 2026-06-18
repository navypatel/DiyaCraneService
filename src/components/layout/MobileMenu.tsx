import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Landmark, PhoneCall, ShieldAlert, LogOut } from 'lucide-react';
import { NAVIGATION_LINKS } from '../../lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function MobileMenu({ isOpen, onClose, isAuthenticated, onLogout }: MobileMenuProps) {
  const location = useLocation();

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const variants = {
    hidden: { opacity: 0, y: '-100%' },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 180 }
    },
    exit: { 
      opacity: 0, 
      y: '-100%',
      transition: { duration: 0.25 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          id="mobile-drawer-overlay"
          className="fixed inset-0 z-50 bg-brand-black flex flex-col justify-between"
        >
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-brand-dark">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 overflow-hidden flex items-center justify-center p-0 rounded border border-white/20 bg-brand-black">
                <img 
                  src="/src/assets/images/crane_logo_1781694287869.jpg" 
                  alt="Diya Crane" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tighter text-white">
                DIYA <span className="text-brand-yellow">CRANE</span>
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-brand-yellow hover:bg-white/5 rounded transition-colors focus:outline-none"
              id="mobile-drawer-close"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links Area */}
          <div className="flex-grow px-6 py-8 flex flex-col gap-5 overflow-y-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Navigation Menu</span>
            
            <div className="flex flex-col gap-4">
              {NAVIGATION_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`py-3 text-2xl font-semibold transition-colors flex items-center ${
                      isActive 
                        ? 'text-brand-yellow border-l-4 border-brand-yellow pl-3 -ml-3' 
                        : 'text-white hover:text-brand-yellow'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {isAuthenticated && (
                <Link
                  to="/admin/dashboard"
                  onClick={onClose}
                  className="py-3 text-2xl font-semibold text-brand-yellow border-t border-white/10 mt-2 pt-5 flex items-center gap-2"
                >
                  <ShieldAlert className="w-6 h-6 text-brand-yellow" />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Footer Card */}
          <div className="p-6 bg-brand-dark border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/70">
              <PhoneCall className="w-5 h-5 text-brand-yellow" />
              <div className="flex flex-col">
                <span className="text-xs uppercase text-white/40">Immediate Support</span>
                <a href="tel:+919824996999" className="text-base font-bold text-white hover:text-brand-yellow transition-colors">+91 98249 96999</a>
              </div>
            </div>

            <Link
              to="/contact"
              onClick={onClose}
              className="w-full py-3.5 bg-brand-yellow text-brand-black font-extrabold text-center rounded hover:bg-brand-yellow-hover transition-colors shadow-lg shadow-brand-yellow/10"
            >
              Get a Free Quote
            </Link>

            {isAuthenticated && (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors font-medium border border-white/10 rounded flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out from Admin
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
