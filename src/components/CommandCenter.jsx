import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Activity, ArrowRight } from 'lucide-react';

export default function CommandCenter({ userName = 'Explorer', onAssemble }) {
  const [typedText, setTypedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  
  const fullText = `Good morning, ${userName}. Based on your biometric data, you have 5 hours of high peak focus today. I've detected 2 critical deadlines approaching. Shall we assemble your optimal workflow plan?`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 25); // Typing speed

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="command-center-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div 
        className="glass-panel float-slow"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.65)',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 32px 80px rgba(99, 102, 241, 0.08), inset 0 4px 12px rgba(255,255,255,0.7)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow ambient background inside the card */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '35%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'var(--gradient-blue-purple)',
          filter: 'blur(50px)',
          opacity: 0.25,
          zIndex: -1,
        }} />

        {/* Diagnostic Chip */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.12)',
          color: 'var(--color-blue)',
          fontSize: '0.78rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '28px'
        }}>
          <Activity size={14} className="pulse-slow" />
          Sprint Neural Sync Active
        </div>

        {/* Main Briefing text */}
        <div style={{ minHeight: '120px', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2.1rem',
            fontWeight: '800',
            lineHeight: '1.35',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-title)',
            letterSpacing: '-0.03em',
          }}>
            {typedText}
            {!showButton && <span className="cursor-blink" style={{ fontWeight: '300', color: 'var(--color-blue)' }}>|</span>}
          </h1>
        </div>

        {/* Action Button */}
        <div style={{
          opacity: showButton ? 1 : 0,
          transform: showButton ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showButton ? 'auto' : 'none',
        }}>
          <button
            onClick={onAssemble}
            className="btn-premium glow-blue"
            style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            Assemble Optimal Plan
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .pulse-slow {
          animation: pulse-op 2s infinite alternate ease-in-out;
        }
        @keyframes pulse-op {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .cursor-blink {
          animation: blink 0.8s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
