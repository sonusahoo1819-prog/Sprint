import React, { useState } from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Target, 
  BrainCircuit, 
  Flower2, 
  BarChart3, 
  Settings, 
  Sparkles,
  Compass
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const menuItems = [
    { id: 'landing', label: 'Intro', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: "Today's Focus", icon: Target },
    { id: 'planner', label: 'AI Planner', icon: BrainCircuit },
    { id: 'garden', label: 'Habit Garden', icon: Flower2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className="navigation-dock-wrapper"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <nav 
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
          pointerEvents: 'auto',
          backdropFilter: 'blur(20px)',
          transform: 'translate3d(0,0,0)',
        }}
      >
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHovered = hoveredIdx === idx;
          
          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setActiveTab(item.id)}
              style={{
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Icon Button */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive 
                    ? 'var(--gradient-blue-purple)' 
                    : isHovered 
                      ? 'rgba(0, 0, 0, 0.03)' 
                      : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  transform: isHovered ? 'scale(1.15) translateY(-4px)' : 'scale(1) translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: isActive ? '0 8px 24px rgba(99, 102, 241, 0.35)' : 'none',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Glowing active dot */}
              {isActive && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--color-blue)',
                    boxShadow: '0 0 8px var(--color-blue)',
                  }}
                />
              )}

              {/* Tooltip */}
              <div
                style={{
                  position: 'absolute',
                  top: '-45px',
                  left: '50%',
                  transform: `translateX(-50%) translateY(${isHovered ? '0px' : '8px'})`,
                  opacity: isHovered ? 1 : 0,
                  pointerEvents: 'none',
                  background: 'rgba(31, 41, 55, 0.85)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
