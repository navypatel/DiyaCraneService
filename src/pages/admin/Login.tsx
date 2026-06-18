import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, Landmark, AlertTriangle, KeyRound } from 'lucide-react';

interface LoginProps {
  isAuthenticated: boolean;
  onLoginSuccess: (user: any) => void;
}

export default function Login({ isAuthenticated, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // If already logged in, skip login page and go straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please specify both admin Username and Password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Autheticaton failed');
      }

      // Successful Auth trigger
      onLoginSuccess(data.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Verification connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark relative flex items-center justify-center px-4 py-16" id="admin-login-screen">
      
      {/* Dynamic graphic lines mimicking warning tape in background */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[repeating-linear-gradient(45deg,#FFD000,#FFD000_15px,#111_15px,#111_30px)]" />

      <div className="w-full max-w-sm flex flex-col gap-6" id="login-form-box">
        
        {/* Top Logo branding banner */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-brand-yellow text-brand-black p-3.5 rounded-lg font-bold border-2 border-white/20 shadow-xl mb-4 transform hover:rotate-3 transition-transform">
            <Landmark className="w-6 h-6 text-brand-black stroke-[2.5]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-white leading-none">
            DIYA <span className="text-brand-yellow">CRANE</span> SERVICE
          </h2>
          <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-1.5 block leading-none">
            Operations Management Hub
          </span>
        </div>

        {/* Input Card Container */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-white/5 relative">
          
          <div className="flex items-center gap-1.5 text-brand-red font-display text-[10.5px] uppercase font-mono tracking-wider font-extrabold mb-4">
            <KeyRound className="w-4 h-4 text-brand-yellow" />
            <span>Secure Credentials Check</span>
          </div>

          {errorMsg && (
            <div className="mb-4.5 bg-red-50 border border-red-200 text-brand-red p-3 rounded text-xs leading-relaxed flex gap-2" id="login-error-alert">
              <AlertTriangle className="w-4.5 h-4.5 text-brand-red flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Input 1: Username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="login-username" className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                Admin Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3 py-2.5 bg-brand-gray border border-gray-200 rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none focus:border-brand-yellow font-sans"
              />
            </div>

            {/* Input 2: Password */}
            <div className="flex flex-col gap-1 mb-2">
              <label htmlFor="login-password" className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                Secure Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2.5 bg-brand-gray border border-gray-200 rounded text-xs focus:ring-1 focus:ring-brand-yellow focus:outline-none focus:border-brand-yellow font-sans"
              />
            </div>

            {/* Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-yellow hover:bg-brand-yellow-hover disabled:bg-gray-100 text-brand-black disabled:text-gray-400 font-extrabold text-xs uppercase tracking-wider rounded transition-all shadow border border-brand-black/15 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-black" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

        </div>

        {/* Footer info lock link */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-[10.5px] font-mono uppercase tracking-wider text-white/40 hover:text-white transition-colors"
          >
            ← Return to public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
