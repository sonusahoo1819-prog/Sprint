import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, CheckSquare, FileText, ArrowRight } from 'lucide-react';
import { fireCelebration } from '../components/Celebration';

export default function Landing({ onEnter }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStart = (e) => {
    fireCelebration(e.clientX, e.clientY);
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
      }}
    >
      {/* 3D Parallax Ambient Background Blobs */}
      <div 
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          background: 'var(--gradient-blue-purple)',
          filter: 'blur(120px)',
          opacity: 0.15,
          top: '15%',
          left: '20%',
          transform: `translate(${mouseOffset.x * -30}px, ${mouseOffset.y * -30}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          background: 'var(--gradient-mint-cyan)',
          filter: 'blur(100px)',
          opacity: 0.15,
          bottom: '15%',
          right: '25%',
          transform: `translate(${mouseOffset.x * -40}px, ${mouseOffset.y * -40}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Hero Content Panel (Middle) */}
      <div 
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          zIndex: 10,
          padding: '0 24px',
          transform: `translate(${mouseOffset.x * 10}px, ${mouseOffset.y * 10}px)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1.5px solid rgba(99, 102, 241, 0.15)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.05)',
            color: 'var(--color-blue)',
            fontSize: '0.85rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '32px',
          }}
        >
          <Sparkles size={16} />
          Welcome to the Spatial Era
        </div>

        <h1 
          style={{
            fontSize: '4.8rem',
            fontWeight: '900',
            lineHeight: '1.05',
            fontFamily: 'var(--font-family-title)',
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: '24px',
          }}
        >
          Meet <span style={{ background: 'var(--gradient-blue-purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sprint</span>.<br />
          Your Proactive AI Companion.
        </h1>

        <p 
          style={{
            fontSize: '1.15rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 40px auto',
            fontWeight: '500'
          }}
        >
          Sprint is not a to-do list. It’s an intelligent spatial workspace that schedules, prioritizes, and resolves deadlines before they are missed.
        </p>

        <button 
          onClick={handleStart}
          className="btn-premium glow-blue"
          style={{
            padding: '18px 44px',
            fontSize: '1.1rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          Enter Workspace
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Floating 3D/Spatial Glass Artifacts (Parallax Elements) */}
      
      {/* Floating Clock (Top Left) */}
      <div 
        className="glass-panel float-slow"
        style={{
          position: 'absolute',
          top: '12%',
          left: '10%',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          transform: `translate(${mouseOffset.x * 20}px, ${mouseOffset.y * 20}px) rotate(${mouseOffset.x * 5}deg)`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        <Clock size={36} color="var(--color-blue)" style={{ marginBottom: '8px' }} />
        <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>10:45 AM</span>
        <span style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--color-mint)', textTransform: 'uppercase' }}>Focus Peak</span>
      </div>

      {/* Floating Task Checklist (Bottom Left) */}
      <div 
        className="glass-panel float-medium"
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '12%',
          width: '200px',
          padding: '18px',
          borderRadius: 'var(--radius-md)',
          zIndex: 5,
          transform: `translate(${mouseOffset.x * 35}px, ${mouseOffset.y * 35}px) rotate(${mouseOffset.y * -4}deg)`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        <h4 style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckSquare size={14} color="var(--color-purple)" /> Today's Focus
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-mint)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: '600', textDecoration: 'line-through' }}>Setup System</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1.5px solid var(--text-tertiary)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: '700' }}>Review Burnout Risk</span>
          </div>
        </div>
      </div>

      {/* Floating Calendar Widget (Top Right) */}
      <div 
        className="glass-panel float-medium"
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '180px',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          zIndex: 5,
          transform: `translate(${mouseOffset.x * 25}px, ${mouseOffset.y * 25}px) rotate(${mouseOffset.x * -3}deg)`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        <h4 style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="var(--color-pink)" /> Schedule
        </h4>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1, height: '40px', background: 'var(--gradient-blue-purple)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: '600' }}>WED</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>01</span>
          </div>
          <div style={{ flex: 1, height: '40px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: '600', color: 'var(--text-secondary)' }}>THU</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>02</span>
          </div>
        </div>
      </div>

      {/* Floating Document (Bottom Right) */}
      <div 
        className="glass-panel float-slow"
        style={{
          position: 'absolute',
          bottom: '18%',
          right: '12%',
          width: '160px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          zIndex: 5,
          transform: `translate(${mouseOffset.x * 45}px, ${mouseOffset.y * 45}px) rotate(${mouseOffset.y * 6}deg)`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-blue)', marginBottom: '8px' }}>
          <FileText size={14} />
          <span style={{ fontSize: '0.72rem', fontWeight: '800' }}>AI Summary</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px', marginBottom: '6px' }} />
        <div style={{ width: '80%', height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px', marginBottom: '6px' }} />
        <div style={{ width: '50%', height: '4px', background: 'rgba(0,0,0,0.04)', borderRadius: '2px' }} />
      </div>

      {/* Ambient glowing floaters (Apple Vision Pro particles) */}
      <div style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', top: '35%', left: '40%', opacity: 0.25, filter: 'blur(1px)', animation: 'float 3s infinite alternate' }} />
      <div style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', bottom: '38%', right: '35%', opacity: 0.3, filter: 'blur(1px)', animation: 'float 5s infinite alternate-reverse' }} />
    </div>
  );
}
