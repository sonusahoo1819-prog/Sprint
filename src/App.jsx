import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import CommandCenter from './components/CommandCenter';
import Dashboard from './pages/Dashboard';
import Celebration from './components/Celebration';
import Auth from './pages/Auth';
import Header from './components/Header';
import { supabase } from './lib/supabaseClient';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [appStage, setAppStage] = useState('landing'); // landing, briefing, dashboard
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        setAppStage('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          gap: '12px',
        }}
      >
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.1)', borderTopColor: 'var(--color-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Initializing Sprint AI...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If no user is logged in, redirect to Auth page with Header
  if (!session) {
    return (
      <div className="sprint-app-root" style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
        <CustomCursor />
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="noise-overlay" />
        <Celebration />
        <div className="ambient-bg">
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
        </div>
        <Auth />
      </div>
    );
  }

  // Parse user name from metadata or email prefix for greeting
  const metaFirstName = session.user?.user_metadata?.first_name;
  const userEmail = session.user?.email || 'Explorer';
  const rawName = userEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
  const fallbackName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const userName = metaFirstName ? (metaFirstName.trim().charAt(0).toUpperCase() + metaFirstName.trim().slice(1)) : fallbackName;

  return (
    <div className="sprint-app-root" style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      <CustomCursor />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="noise-overlay" />
      <Celebration />

      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {appStage === 'landing' && (
        <Landing onEnter={() => setAppStage('briefing')} />
      )}

      {appStage === 'briefing' && (
        <CommandCenter userName={userName} onAssemble={() => setAppStage('dashboard')} />
      )}

      {appStage === 'dashboard' && (
        <div className="fade-in-workspace" style={{ animation: 'fade-workspace-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards', paddingTop: '60px' }}>
          <Dashboard session={session} onNavigateHome={() => setAppStage('landing')} />
        </div>
      )}

      <style>{`
        @keyframes fade-workspace-in {
          0% {
            opacity: 0;
            transform: scale(0.98) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
