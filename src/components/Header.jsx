import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* App Logo & Brand Title */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          pointerEvents: 'auto',
        }}
      >
        {/* Logo SVG Icon */}
        <div 
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--gradient-blue-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
            <path d="M56 18 L32 48 H48 L40 82 L68 50 H52 Z" fill="#FFFFFF" />
          </svg>
        </div>

        <span style={{ fontFamily: 'var(--font-family-title)', fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Sprint
        </span>
      </div>

      {/* Sun / Moon Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="glass-panel"
        aria-label="Toggle Theme"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          color: theme === 'dark' ? '#F59E0B' : '#6366F1',
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12) rotate(15deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        {theme === 'dark' ? (
          <Sun size={20} strokeWidth={2.2} />
        ) : (
          <Moon size={20} strokeWidth={2.2} />
        )}
      </button>
    </header>
  );
}
