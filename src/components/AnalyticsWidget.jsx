import React, { useState } from 'react';
import { Award, Zap, HeartPulse, LineChart, Sparkles, TrendingUp } from 'lucide-react';

export default function AnalyticsWidget() {
  const [activeScore, setActiveScore] = useState('focus'); // focus, energy, momentum

  const achievements = [
    { id: 1, time: '09:00 AM', title: 'Completed: Kickoff Sync', xp: '+10 XP', icon: Award, color: 'var(--color-blue)' },
    { id: 2, time: '11:45 AM', title: 'Unblocked 2 major bugs', xp: '+30 XP', icon: Zap, color: 'var(--color-orange)' },
    { id: 3, time: '02:15 PM', title: 'Sprouted Rose in garden', xp: '+15 XP', icon: Sparkles, color: 'var(--color-pink)' },
  ];

  // SVG Chart path data
  const chartPoints = "10,90 40,75 70,82 100,50 130,45 160,25 190,15";

  return (
    <div 
      className="analytics-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        width: '100%',
      }}
    >
      {/* Left panel: Circular Focus Ring & Stats */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          height: '350px',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Biometric Sync</h3>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--color-mint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synced 2m ago</span>
        </div>

        {/* Focus Score Progress Circle */}
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyCentert: 'center' }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="56" stroke="rgba(0,0,0,0.03)" strokeWidth="8" fill="transparent" />
            <circle 
              cx="70" 
              cy="70" 
              r="56" 
              stroke="url(#analytics-circle-grad)" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray="351.8"
              strokeDashoffset="65" // Represents 82%
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0px 2px 8px rgba(99, 102, 241, 0.25))',
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
            <defs>
              <linearGradient id="analytics-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.05em' }}>82</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>%</span>
            <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Focus Score</p>
          </div>
        </div>

        {/* Small Progress Indicators */}
        <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
          <div 
            onClick={() => setActiveScore('focus')}
            className="neumorphic-inset"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: activeScore === 'focus' ? '1.5px solid var(--color-blue)' : '1px solid rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Energy</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px', color: 'var(--color-orange)' }}>
              <Zap size={12} fill="var(--color-orange)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>94%</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveScore('momentum')}
            className="neumorphic-inset"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: activeScore === 'momentum' ? '1.5px solid var(--color-blue)' : '1px solid rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Momentum</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px', color: 'var(--color-purple)' }}>
              <TrendingUp size={12} />
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>+12%</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveScore('burnout')}
            className="neumorphic-inset"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: activeScore === 'burnout' ? '1.5px solid var(--color-blue)' : '1px solid rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Burnout Risk</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px', color: 'var(--color-mint)' }}>
              <HeartPulse size={12} />
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Weekly Focus Chart & Achievements */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          height: '350px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Focus Trend</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>
            <LineChart size={14} />
            Weekly Average: 5.4h
          </div>
        </div>

        {/* Small SVG Sparkline Graph */}
        <div style={{ width: '100%', height: '110px', marginTop: '12px', position: 'relative' }}>
          <svg viewBox="0 0 200 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="200" y2="25" stroke="rgba(0,0,0,0.02)" strokeWidth="1" />
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(0,0,0,0.02)" strokeWidth="1" />
            <line x1="0" y1="75" x2="200" y2="75" stroke="rgba(0,0,0,0.02)" strokeWidth="1" />

            {/* Area under curve */}
            <path
              d={`M10,100 L10,90 L40,75 L70,82 L100,50 L130,45 L160,25 L190,15 L190,100 Z`}
              fill="url(#chart-area-grad)"
            />

            {/* Line Path */}
            <path
              d={`M10,90 L40,75 L70,82 L100,50 L130,45 L160,25 L190,15`}
              fill="none"
              stroke="url(#chart-line-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active glowing dot */}
            <circle cx="190" cy="15" r="5" fill="#06B6D4" stroke="#FFF" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px #06B6D4)' }} />

            {/* Gradients */}
            <defs>
              <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Achievements Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.6)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: item.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={12} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.title}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{item.time}</span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: 'var(--color-blue)',
                }}>
                  {item.xp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
