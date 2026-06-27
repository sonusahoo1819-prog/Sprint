import React, { useState, useEffect, useRef } from 'react';

export default function AIAssistant({ state = 'idle', userName = 'Explorer', onClick }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const orbRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!orbRef.current) return;
      const rect = orbRef.current.getBoundingClientRect();
      const orbCenterX = rect.left + rect.width / 2;
      const orbCenterY = rect.top + rect.height / 2;
      
      // Calculate offset distance
      const dx = e.clientX - orbCenterX;
      const dy = e.clientY - orbCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Maximum distance we track for tilting (e.g., 400px)
      const maxDistance = 400;
      const strength = Math.min(distance / maxDistance, 1);
      
      // Calculate rotation angles (up to 15 degrees)
      const angle = 15;
      const rx = -(dy / (distance || 1)) * strength * angle;
      const ry = (dx / (distance || 1)) * strength * angle;
      
      // Calculate subtle translation offset (up to 12px)
      const tx = (dx / (distance || 1)) * strength * 12;
      const ty = (dy / (distance || 1)) * strength * 12;

      setMousePos({ rx, ry, tx, ty });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getOrbColor = () => {
    switch (state) {
      case 'thinking':
        return 'var(--gradient-orange-pink)';
      case 'celebrating':
        return 'var(--gradient-mint-cyan)';
      case 'talking':
        return 'var(--gradient-purple-sky)';
      case 'idle':
      default:
        return 'var(--gradient-blue-purple)';
    }
  };

  const getAssistantMessage = () => {
    switch (state) {
      case 'thinking':
        return 'Sprint AI is optimizing your workflow...';
      case 'celebrating':
        return 'Incredible job! Momentum increased by +12%';
      case 'talking':
        return `Listening... Speak your mind, ${userName}.`;
      case 'idle':
      default:
        return 'I am keeping you on track today.';
    }
  };

  return (
    <div 
      className="ai-assistant-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Glow Ambient Layer */}
      <div 
        className="orb-glow-back"
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          background: getOrbColor(),
          filter: 'blur(30px)',
          opacity: state === 'thinking' || state === 'celebrating' ? 0.8 : 0.5,
          borderRadius: '50%',
          transform: `translate(${mousePos.tx * 0.5 || 0}px, ${mousePos.ty * 0.5 || 0}px)`,
          transition: 'background 0.8s ease, transform 0.1s ease-out',
        }}
      />

      {/* Holographic Orb */}
      <div
        ref={orbRef}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ rx: 0, ry: 0, tx: 0, ty: 0 });
        }}
        style={{
          width: '90px',
          height: '90px',
          background: getOrbColor(),
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(255, 255, 255, 0.75)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), inset 0 -10px 20px rgba(0, 0, 0, 0.1), inset 0 10px 20px rgba(255, 255, 255, 0.4)',
          transform: `perspective(600px) rotateX(${mousePos.rx || 0}deg) rotateY(${mousePos.ry || 0}deg) translate3d(${mousePos.tx || 0}px, ${mousePos.ty || 0}px, 0) scale(${isHovered ? 1.08 : 1})`,
          transition: 'transform 0.1s ease-out, background 0.8s ease, box-shadow 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Reflection Highlight */}
        <div 
          style={{
            position: 'absolute',
            top: '8%',
            left: '18%',
            width: '24px',
            height: '12px',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            transform: 'rotate(-25deg)',
          }}
        />

        {/* Minimal Face Elements (Spatial Vibe) */}
        <div 
          className="orb-face"
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${mousePos.tx * 0.4 || 0}px, ${mousePos.ty * 0.4 || 0}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {state === 'thinking' ? (
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="dot-thinking" style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'orb-dot-bounce 0.6s infinite alternate' }} />
              <span className="dot-thinking" style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'orb-dot-bounce 0.6s infinite alternate 0.2s' }} />
              <span className="dot-thinking" style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'orb-dot-bounce 0.6s infinite alternate 0.4s' }} />
            </div>
          ) : state === 'celebrating' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '5px', height: '5px', background: 'white', borderRadius: '50%', transform: 'scaleY(0.7)' }} />
                <span style={{ width: '5px', height: '5px', background: 'white', borderRadius: '50%', transform: 'scaleY(0.7)' }} />
              </div>
              <div style={{ width: '12px', height: '6px', borderBottom: '2px solid white', borderRadius: '0 0 8px 8px' }} />
            </div>
          ) : state === 'talking' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '12px' }}>
              <div style={{ width: '3px', height: '4px', background: 'white', borderRadius: '2px', animation: 'orb-voice 0.4s infinite alternate' }} />
              <div style={{ width: '3px', height: '12px', background: 'white', borderRadius: '2px', animation: 'orb-voice 0.4s infinite alternate 0.1s' }} />
              <div style={{ width: '3px', height: '6px', background: 'white', borderRadius: '2px', animation: 'orb-voice 0.4s infinite alternate 0.2s' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ width: '4px', height: '4px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '50%' }} />
                <span style={{ width: '4px', height: '4px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '50%' }} />
              </div>
              <div style={{ width: '6px', height: '2px', background: 'rgba(255, 255, 255, 0.85)', borderRadius: '1px' }} />
            </div>
          )}
        </div>

        {/* Orbiting particles */}
        {state === 'thinking' && (
          <div className="thinking-rings" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '1px dashed rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            animation: 'spin 4s linear infinite',
          }} />
        )}
      </div>

      {/* Message Balloon */}
      <div 
        className="glass-panel"
        style={{
          padding: '8px 16px',
          borderRadius: '16px',
          fontSize: '0.85rem',
          fontWeight: '500',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          maxWidth: '240px',
        }}
      >
        {getAssistantMessage()}
      </div>

      {/* Floating Animations CSS injected */}
      <style>{`
        @keyframes orb-dot-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }
        @keyframes orb-voice {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.4); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
