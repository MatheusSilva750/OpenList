import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApiDocs from './pages/ApiDocs';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login'); // 'login', 'register', 'dashboard', 'docs'

  // Monitor Supabase auth session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setView('dashboard');
      } else {
        setUser(null);
        setView('login');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setView('dashboard');
      } else {
        setUser(null);
        setView(current => (current === 'register' ? 'register' : 'login'));
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Route views
  if (!user) {
    if (view === 'register') {
      return (
        <Register 
          onAuthSuccess={(usr) => { setUser(usr); setView('dashboard'); }} 
          navigateToLogin={() => setView('login')} 
        />
      );
    }
    return (
      <Login 
        onAuthSuccess={(usr) => { setUser(usr); setView('dashboard'); }} 
        navigateToRegister={() => setView('register')} 
      />
    );
  }

  if (view === 'docs') {
    return (
      <ApiDocs 
        navigateToDashboard={() => setView('dashboard')} 
      />
    );
  }

  return (
    <Dashboard 
      user={user} 
      onLogout={handleLogout} 
      navigateToDocs={() => setView('docs')} 
    />
  );
}
