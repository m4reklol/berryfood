import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Upload, LogOut, AlertCircle, CheckCircle, User as UserIcon, Lock } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const AdminMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // If user is logged in and on /admin, redirect to /admin/menu
      if (session?.user && location.pathname === '/admin') {
        navigate('/admin/menu');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // If user just logged in and on /admin, redirect to /admin/menu
      if (session?.user && location.pathname === '/admin') {
        navigate('/admin/menu');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ type: 'error', text: 'Nesprávné přihlašovací údaje' });
      } else {
        // Successful login - redirect will happen via useEffect
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Chyba při přihlašování' });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
    setEmail('');
    setPassword('');
    setMessage(null);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setMessage({ type: 'error', text: 'Vyberte soubor' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Vyberte obrázek' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from('menus')
        .upload('daily-menu.webp', file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Denní menu bylo úspěšně nahráno!' });
      
      // Reset form
      form.reset();
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: 'Chyba při nahrávání souboru' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                ADMIN PŘIHLÁŠENÍ
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                  Email
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/50" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                    placeholder="vasmail@berryfood.cz"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                  Heslo
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-primary)]/50" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-[var(--color-accent)] focus:ring-[var(--color-accent)] border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-[var(--color-primary)]/70">
                  Zapamatovat přihlášení
                </label>
              </div>

              {message && (
                <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                  message.type === 'error' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--color-primary)]/90 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Přihlašování...' : 'Přihlásit se'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            ADMIN PANEL
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-[var(--color-primary)] hover:bg-gray-50 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Odhlásit se</span>
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
              NAHRÁT JÍDELNÍ LÍSTEK
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full"></div>
            </div>
          </div>

          <form onSubmit={handleFileUpload} className="space-y-6">
            <div>
              <label htmlFor="menu-file" className="block text-sm font-medium text-[var(--color-primary)] mb-2">
                Soubor s menu (JPG, PNG, WebP, AVIF)
              </label>
              <input
                type="file"
                id="menu-file"
                accept="image/*"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--color-accent)]/10 file:text-[var(--color-accent)] hover:file:bg-[var(--color-accent)]/20"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[var(--color-accent)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--color-accent)]/90 focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Nahrávání...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Nahrát menu</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;