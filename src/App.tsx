import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Loader2, LogOut, Landmark, Layers, ClipboardList, 
  LayoutDashboard, PlusSquare, ArrowLeft, Heart 
} from 'lucide-react';

// Common structures and layouts
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import ScrollTop from './components/layout/ScrollTop';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AddEntry from './pages/admin/AddEntry';
import History from './pages/admin/History';

function MainAppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const location = useLocation();
  const navigate = useNavigate();

  // Toast helper
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Check manual cookie session on page load
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error("Session integrity query collapsed:", err);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Handle successful login
  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    showToast('Authenticated as Administrator.', 'success');
  };

  // Handle manual logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        showToast('Successfully signed out.', 'info');
        navigate('/admin/login');
      } else {
        throw new Error('API logout error');
      }
    } catch (err: any) {
      showToast(err.message || 'Logout failed.', 'error');
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white font-mono text-xs gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
        <span>Authorizing terminal data...</span>
      </div>
    );
  }

  // Visual layout division
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-brand-yellow selection:text-brand-black">
      
      {/* 1. Public Pages layout items */}
      {!isAdminRoute && (
        <>
          <Navbar 
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </>
      )}

      {/* 2. Admin Header layout items */}
      {isAdminRoute && !isLoginPage && (
        <div className="bg-brand-black text-white py-4 border-b-2 border-brand-yellow sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-yellow" />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight">DIYA CRANE ADMIN</span>
                <span className="text-[9px] text-brand-yellow uppercase tracking-widest">Level 1 Operator</span>
              </div>
            </div>

            {/* Admin Toolbar links */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
              <Link 
                to="/admin/dashboard" 
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                  location.pathname === '/admin/dashboard' ? 'bg-brand-yellow text-brand-black font-semibold' : 'hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </Link>
              
              <Link 
                to="/admin/add-entry" 
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                  location.pathname === '/admin/add-entry' ? 'bg-brand-yellow text-brand-black font-semibold' : 'hover:bg-white/10'
                }`}
              >
                <PlusSquare className="w-4 h-4" />
                <span>Log Lift</span>
              </Link>
              
              <Link 
                to="/admin/history" 
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${
                  location.pathname === '/admin/history' ? 'bg-brand-yellow text-brand-black font-semibold' : 'hover:bg-white/10'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Logs & Email</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded bg-brand-red text-white hover:bg-red-700 transition-colors flex items-center gap-1.5 font-bold border border-transparent cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main visual pages display wrapper */}
      <main className="flex-grow">
        <Routes>
          
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceSlug" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Auth Views */}
          <Route 
            path="/admin/login" 
            element={
              <Login 
                isAuthenticated={isAuthenticated} 
                onLoginSuccess={handleLoginSuccess} 
              />
            } 
          />

          {/* Secure Admin Pages */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isCheckingAuth={checkingSession}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/add-entry" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isCheckingAuth={checkingSession}>
                <AddEntry />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/history" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isCheckingAuth={checkingSession}>
                <History />
              </ProtectedRoute>
            } 
          />

          {/* SPA Fallback Wildcard directs home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      {/* 3. Non-Admin footer items display */}
      {!isAdminRoute && <Footer />}

      {/* 4. Administrative page tiny footer */}
      {isAdminRoute && !isLoginPage && (
        <footer className="py-4 bg-[#111] text-center border-t border-white/5 font-mono text-[9px] text-white/35">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-2">
            <span>DIYA CRANE SERVICE • PROTECTED SYSTEM ENTRY</span>
            <span>ADMINISTRATOR TERMINAL</span>
          </div>
        </footer>
      )}

      {/* Floating back-to-top component */}
      {!isAdminRoute && <ScrollTop />}

      {/* Global status alert notifications */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          isOpen={!!toastMessage}
          onClose={() => setToastMessage('')} 
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainAppContent />
    </BrowserRouter>
  );
}
