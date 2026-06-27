import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cpu, Sparkles, CheckCircle2, ArrowRight, Play, Hourglass } from 'lucide-react';
import { fireCelebration } from '../components/Celebration';

export default function AutonomousPlanner() {
  const [plannerState, setPlannerState] = useState('idle'); // idle, thinking, complete
  const canvasRef = useRef(null);

  useEffect(() => {
    if (plannerState !== 'thinking') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 140;

    // Nodes for neural network simulation
    const nodes = [];
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      frameId = requestAnimationFrame(draw);
    };
    draw();

    // End thinking state after 2.5 seconds
    const timer = setTimeout(() => {
      setPlannerState('complete');
      fireCelebration(window.innerWidth / 2, window.innerHeight / 2);
    }, 2500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [plannerState]);

  const handleOptimize = () => {
    setPlannerState('thinking');
  };

  return (
    <div 
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        width: '100%',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} color="var(--color-blue)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Autonomous Sprint Planner</h3>
        </div>
        
        {plannerState === 'idle' && (
          <button 
            onClick={handleOptimize}
            className="btn-premium glow-blue"
            style={{
              padding: '8px 18px',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <Cpu size={14} />
            Optimize Day
          </button>
        )}
      </div>

      {plannerState === 'idle' && (
        <div style={{ padding: '24px 16px', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Click <strong>Optimize Day</strong> to let Sprint AI automatically scan your tasks, meetings, and peak productivity hours to restructure your optimal calendar schedule.
          </p>
        </div>
      )}

      {plannerState === 'thinking' && (
        <div style={{ position: 'relative', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Cpu size={24} className="spin" color="var(--color-blue)" style={{ animation: 'spin 2s linear infinite' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-blue)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>rescheduling workflows...</span>
          </div>
        </div>
      )}

      {plannerState === 'complete' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Explanation panel */}
          <div 
            style={{
              background: 'rgba(16, 185, 129, 0.04)',
              border: '1.5px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '16px',
              padding: '16px 20px',
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-mint)',
              fontSize: '0.78rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}>
              <CheckCircle2 size={14} /> Optimization Succeeded
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              We moved your <strong>Team Sync</strong> to 09:30 AM (originally 09:00 AM) to open up a contiguous 2.5-hour Morning Deep Work slot. We blocked 2 focus sessions in your peak biometric focus zone.
            </p>
          </div>

          {/* New Optimized Schedule view */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-tertiary)' }}>09:00 AM</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-blue)' }}>Sprint Morning Briefing</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>15 mins</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-mint)' }}>09:15 AM</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} color="gold" /> Deep Work Block
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-mint)', fontWeight: '700' }}>2.25 hours (Auto-Blocked)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-tertiary)' }}>11:30 AM</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)' }}>Team Sync (Rescheduled)</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>30 mins</span>
            </div>
          </div>

          {/* Reset button */}
          <button 
            onClick={() => setPlannerState('idle')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              alignSelf: 'center',
              textDecoration: 'underline'
            }}
          >
            Reset Plan
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
