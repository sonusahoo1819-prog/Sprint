import React, { useState } from 'react';
import { Hourglass, AlertTriangle, Sparkles, Smile } from 'lucide-react';

export default function TimeTravel({ onStateChange }) {
  const [sliderVal, setSliderVal] = useState(1); // 0 = Procrastinate, 1 = Today (Normal), 2 = Optimal

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    if (onStateChange) {
      if (val === 0) onStateChange('procrastinate');
      else if (val === 1) onStateChange('today');
      else if (val === 2) onStateChange('optimized');
    }
  };

  const getStateDetails = () => {
    switch (sliderVal) {
      case 0:
        return {
          title: 'Timeline: Procrastination Spiral',
          desc: 'If you delay tasks today: 3 deadlines clash tomorrow, focus score drops to 24%, and project launch risks a 4-day delay.',
          color: '#EF4444',
          icon: AlertTriangle,
          badge: 'High Risk'
        };
      case 2:
        return {
          title: 'Timeline: Momentum Streak',
          desc: 'Sticking to the plan: All tasks completed before 5:00 PM, 96% focus score, and Sprint AI unlocks a 3h open slot Friday.',
          color: '#10B981',
          icon: Sparkles,
          badge: 'Optimal Goal'
        };
      case 1:
      default:
        return {
          title: 'Timeline: Today (Current Plan)',
          desc: 'Drag the timeline slider left or right to preview tomorrow based on your actions today.',
          color: '#3B82F6',
          icon: Hourglass,
          badge: 'Active Plan'
        };
    }
  };

  const details = getStateDetails();
  const Icon = details.icon;

  return (
    <div 
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hourglass size={18} color="var(--color-blue)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>AI Time Travel Simulator</h3>
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: '700',
          background: details.color,
          color: '#FFFFFF',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          boxShadow: `0 4px 12px ${details.color}33`,
          transition: 'all 0.3s ease'
        }}>
          {details.badge}
        </span>
      </div>

      {/* Slider block */}
      <div style={{ margin: '24px 0', padding: '0 8px' }}>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="1"
          value={sliderVal}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            height: '8px',
            borderRadius: '4px',
            outline: 'none',
            background: 'rgba(0,0,0,0.06)',
            WebkitAppearance: 'none',
          }}
        />

        {/* Labels below slider */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
          <span style={{ color: sliderVal === 0 ? '#EF4444' : 'inherit', transition: 'color 0.2s' }}>Procrastinate</span>
          <span style={{ color: sliderVal === 1 ? 'var(--color-blue)' : 'inherit', transition: 'color 0.2s' }}>Today</span>
          <span style={{ color: sliderVal === 2 ? '#10B981' : 'inherit', transition: 'color 0.2s' }}>Stick to Plan</span>
        </div>
      </div>

      {/* Results description block */}
      <div 
        className="neumorphic-inset"
        style={{
          display: 'flex',
          gap: '14px',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          alignItems: 'center',
          borderLeft: `4px solid ${details.color}`,
          transition: 'border-color 0.3s ease',
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `${details.color}15`,
          color: details.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          flexShrink: 0
        }}>
          <Icon size={16} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>{details.title}</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{details.desc}</p>
        </div>
      </div>
      
      {/* Slider styling overrides */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2.5px solid var(--color-blue);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}
