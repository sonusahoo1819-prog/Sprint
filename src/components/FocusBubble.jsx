import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Zap, Volume2, Sparkles } from 'lucide-react';
import { fireCelebration } from './Celebration';

export default function FocusBubble({ taskName = "Build Sprint Spatial Dashboard UI", onClose }) {
  const [totalDuration, setTotalDuration] = useState(25 * 60); // Default 25m
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState(true);

  // Web Audio Context refs for real focus sounds
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscLeftRef = useRef(null);
  const oscRightRef = useRef(null);
  const noiseNodeRef = useRef(null);

  // standard 1-second interval ticking
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      fireCelebration(window.innerWidth / 2, window.innerHeight / 2);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Audio lifecycle binder
  useEffect(() => {
    if (ambientSound && isRunning) {
      startFocusAudio();
    } else {
      stopFocusAudio();
    }
    return () => stopFocusAudio();
  }, [ambientSound, isRunning]);

  const startFocusAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Binaural Beat: Left Oscillator (100Hz)
      const oscL = ctx.createOscillator();
      oscL.frequency.value = 100;
      const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pannerL) pannerL.pan.value = -1;

      // Right Oscillator (110Hz -> creates a 10Hz Alpha Focus Wave)
      const oscR = ctx.createOscillator();
      oscR.frequency.value = 110;
      const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pannerR) pannerR.pan.value = 1;

      // Soft Brown noise generator (simulates wind/ocean rustling)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; 
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      // Soft volume main gain
      const mainGain = ctx.createGain();
      mainGain.gain.value = 0.06;
      gainNodeRef.current = mainGain;

      // Connections
      if (pannerL && pannerR) {
        oscL.connect(pannerL).connect(mainGain);
        oscR.connect(pannerR).connect(mainGain);
      } else {
        oscL.connect(mainGain);
        oscR.connect(mainGain);
      }
      noise.connect(mainGain);
      mainGain.connect(ctx.destination);

      oscL.start(0);
      oscR.start(0);
      noise.start(0);

      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;
      noiseNodeRef.current = noise;
    } catch (e) {
      console.warn("Failed to initialize Web Audio:", e);
    }
  };

  const stopFocusAudio = () => {
    if (oscLeftRef.current) {
      try { oscLeftRef.current.stop(); } catch(e){}
      oscLeftRef.current = null;
    }
    if (oscRightRef.current) {
      try { oscRightRef.current.stop(); } catch(e){}
      oscRightRef.current = null;
    }
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch(e){}
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const selectPreset = (mins) => {
    const secs = mins * 60;
    setTotalDuration(secs);
    setTimeLeft(secs);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div 
      className="focus-bubble-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(50px) saturate(140%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Immersive moving ambient lights */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.15)',
          filter: 'blur(120px)',
          animation: 'focus-ambient-blob-1 15s infinite alternate ease-in-out',
          zIndex: -1,
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.12)',
          filter: 'blur(100px)',
          animation: 'focus-ambient-blob-2 20s infinite alternate ease-in-out',
          zIndex: -1,
        }}
      />

      {/* Floating Exit Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <X size={20} />
      </button>

      {/* Main Focus Container */}
      <div 
        className="glass-panel float-slow"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 60px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 32px 80px rgba(99, 102, 241, 0.08), inset 0 4px 12px rgba(255,255,255,0.7)',
          maxWidth: '560px',
          width: '90%',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Current Active Task details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-blue)', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
          <Zap size={14} className="pulse-slow" />
          Active Focus Session
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', lineHeight: '1.35' }}>
          {taskName}
        </h2>

        {/* Focus Presets Options */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
          {[15, 25, 30, 45, 60].map((mins) => {
            const isSelected = totalDuration === mins * 60;
            return (
              <button
                key={mins}
                onClick={() => selectPreset(mins)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  background: isSelected ? 'var(--gradient-blue-purple)' : 'rgba(0, 0, 0, 0.03)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {mins === 60 ? '1 Hour' : `${mins} min`}
              </button>
            );
          })}
        </div>

        {/* Breathing Focus Ring */}
        <div 
          className={isRunning ? "breathing-focus-bubble" : ""}
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '2px solid rgba(99, 102, 241, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '32px',
            background: 'rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.01)',
          }}
        >
          {/* Animated circular progress bar */}
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <circle 
              cx="90" 
              cy="90" 
              r="84" 
              stroke="url(#focus-grad)" 
              strokeWidth="4" 
              fill="transparent"
              strokeDasharray="527.7"
              strokeDashoffset={527.7 - (527.7 * progress) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <defs>
              <linearGradient id="focus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time digits */}
          <span style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Audio toggle */}
          <button 
            onClick={() => setAmbientSound(!ambientSound)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: ambientSound ? 'rgba(99, 102, 241, 0.08)' : 'rgba(0, 0, 0, 0.03)',
              color: ambientSound ? 'var(--color-blue)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              outline: 'none'
            }}
          >
            <Volume2 size={18} />
          </button>

          {/* Play / Pause */}
          <button
            onClick={toggleTimer}
            className="btn-premium glow-blue"
            style={{
              width: '140px',
              padding: '14px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            {isRunning ? (
              <>
                <Pause size={16} fill="white" />
                Pause
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                Focus
              </>
            )}
          </button>
        </div>

        {/* Ambient details */}
        {ambientSound && isRunning && (
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-mint)', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={12} className="pulse-slow" />
            Playing: Deep Focus Waves
          </div>
        )}
      </div>

      <style>{`
        .breathing-focus-bubble {
          animation: breath 8s infinite ease-in-out;
        }
        @keyframes breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); box-shadow: 0 0 32px rgba(99, 102, 241, 0.15); }
        }
        @keyframes focus-ambient-blob-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(120px, -80px) scale(1.2); }
        }
        @keyframes focus-ambient-blob-2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-100px, 120px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
