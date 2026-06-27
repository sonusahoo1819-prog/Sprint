import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, Sparkles, HelpCircle, CheckCircle, Hourglass } from 'lucide-react';
import { fireCelebration } from './Celebration';

export default function DangerRadar() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Submit V1 Prototype Code', hoursLeft: 2, importance: 'High', color: '#EF4444', zone: 'danger', suggestion: 'Block calendar immediately. Sprint AI has auto-declined your 3:00 PM check-in to clear 2 hours of deep work.' },
    { id: 2, name: 'Prepare Client Briefing Deck', hoursLeft: 6, importance: 'Medium', color: '#F59E0B', zone: 'warning', suggestion: 'Suggesting 1 hour of Focus Bubble mode after lunch. Sprint AI will compile references for you.' },
    { id: 3, name: 'Review Frontend Design Spec', hoursLeft: 14, importance: 'Low', color: '#10B981', zone: 'safe', suggestion: 'On track. Task scheduled for tomorrow morning during your typical peak layout design hours.' }
  ]);

  const [activeTask, setActiveTask] = useState(tasks[0]);

  const handleResolve = (id, e) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTask && activeTask.id === id) {
      setActiveTask(null);
    }
    fireCelebration(e.clientX, e.clientY);
  };

  return (
    <div 
      className="danger-radar-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
      }}
    >
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hourglass size={20} color="var(--color-orange)" className="pulse-slow" />
            Deadline Danger Radar
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
            Sprint AI tracks task urgency in real-time and devises automated rescue plans.
          </p>
        </div>
      </div>

      {/* Urgency Timeline Axis */}
      <div 
        className="glass-panel"
        style={{
          padding: '32px 24px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.65)',
          position: 'relative',
        }}
      >
        {/* The axis line */}
        <div style={{
          position: 'absolute',
          top: '55px',
          left: '40px',
          right: '40px',
          height: '4px',
          background: 'linear-gradient(to right, #10B981 0%, #F59E0B 50%, #EF4444 100%)',
          borderRadius: '2px',
          opacity: 0.8
        }} />

        {/* Floating Tasks along Timeline */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2,
          padding: '0 10px',
          height: '90px',
        }}>
          {/* Safe Zone (Left) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '32px' }}>Safe Zone (&gt;12h)</span>
            
            {tasks.filter(t => t.zone === 'safe').map(t => (
              <div 
                key={t.id} 
                onClick={() => setActiveTask(t)}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '40px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: activeTask?.id === t.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
                  border: activeTask?.id === t.id ? '1.5px solid #10B981' : '1px solid rgba(255,255,255,0.7)',
                  boxShadow: activeTask?.id === t.id ? '0 8px 20px rgba(16, 185, 129, 0.15)' : 'var(--glass-shadow)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transform: activeTask?.id === t.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              >
                {t.name} ({t.hoursLeft}h)
              </div>
            ))}
          </div>

          {/* Warning Zone (Center) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#D97706', textTransform: 'uppercase', marginBottom: '32px' }}>Warning Zone (4-12h)</span>
            
            {tasks.filter(t => t.zone === 'warning').map(t => (
              <div 
                key={t.id} 
                onClick={() => setActiveTask(t)}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '40px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: activeTask?.id === t.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
                  border: activeTask?.id === t.id ? '1.5px solid #F59E0B' : '1px solid rgba(255,255,255,0.7)',
                  boxShadow: activeTask?.id === t.id ? '0 8px 20px rgba(245, 158, 11, 0.15)' : 'var(--glass-shadow)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transform: activeTask?.id === t.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              >
                {t.name} ({t.hoursLeft}h)
              </div>
            ))}
          </div>

          {/* Danger Zone (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#DC2626', textTransform: 'uppercase', marginBottom: '32px' }}>Critical Zone (&lt;4h)</span>
            
            {tasks.filter(t => t.zone === 'danger').map(t => (
              <div 
                key={t.id} 
                onClick={() => setActiveTask(t)}
                className="glass-panel pulse-glow-danger"
                style={{
                  position: 'absolute',
                  top: '40px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: activeTask?.id === t.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
                  border: activeTask?.id === t.id ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.7)',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.15)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transform: activeTask?.id === t.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              >
                🚨 {t.name} ({t.hoursLeft}h)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Task AI Recovery Plan Details */}
      {activeTask && (
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.55)',
            border: `1.5px solid ${activeTask.color}`,
            boxShadow: `0 12px 32px rgba(31, 38, 135, 0.03)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: activeTask.zone === 'danger' ? 'rgba(239, 68, 68, 0.08)' : activeTask.zone === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              color: activeTask.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {activeTask.zone === 'danger' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: '800' }}>{activeTask.name}</span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  background: activeTask.color,
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {activeTask.importance} Priority
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.45', marginTop: '4px' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--color-blue)" />
                  Sprint AI Autopilot Plan:
                </strong>{' '}
                {activeTask.suggestion}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => handleResolve(activeTask.id, e)}
            className="btn-premium"
            style={{
              padding: '10px 20px',
              fontSize: '0.82rem',
              background: activeTask.zone === 'danger' ? '#EF4444' : 'var(--gradient-blue-purple)',
              boxShadow: activeTask.zone === 'danger' ? '0 8px 24px rgba(239, 68, 68, 0.25)' : 'none',
              borderRadius: 'var(--radius-full)',
              flexShrink: 0
            }}
          >
            <CheckCircle size={16} />
            Mitigate Danger
          </button>
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
          🎉 All deadlines are fully mitigated. Excellent speed!
        </div>
      )}

      <style>{`
        .pulse-glow-danger {
          animation: glow-red 1.5s infinite alternate ease-in-out;
        }
        @keyframes glow-red {
          0% { box-shadow: 0 0 4px rgba(239, 68, 68, 0.2); }
          100% { box-shadow: 0 0 16px rgba(239, 68, 68, 0.5); }
        }
      `}</style>
    </div>
  );
}
