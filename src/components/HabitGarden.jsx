import React, { useState, useEffect } from 'react';
import { Check, Flame, Plus, Sparkles, HelpCircle } from 'lucide-react';
import { fireCelebration } from './Celebration';
import { supabase } from '../lib/supabaseClient';

export default function HabitGarden({ session }) {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    fetchHabits();
  }, [session]);

  const fetchHabits = async () => {
    if (!session?.user?.id) {
      setHabits([]);
      return;
    }
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id);
    if (!error && data) {
      setHabits(data);
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const growthStage = Math.min(completedCount, 4);

  const toggleHabit = async (id, currentCompleted, currentStreak, e) => {
    const nextCompleted = !currentCompleted;
    const nextStreak = nextCompleted ? currentStreak + 1 : Math.max(currentStreak - 1, 0);

    if (nextCompleted) {
      fireCelebration(e.clientX, e.clientY);
    }

    const { error } = await supabase
      .from('habits')
      .update({ completed: nextCompleted, streak: nextStreak })
      .eq('id', id);

    if (!error) {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: nextCompleted, streak: nextStreak } : h));
    } else {
      console.error('Failed to toggle habit status:', error);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const colors = ['var(--color-blue)', 'var(--color-purple)', 'var(--color-mint)', 'var(--color-orange)', 'var(--color-pink)'];
    const newHabit = {
      name: newHabitName,
      streak: 0,
      completed: false,
      color: colors[habits.length % colors.length],
      user_id: session?.user?.id || null
    };

    const { error } = await supabase.from('habits').insert(newHabit);
    if (!error) {
      fetchHabits();
      setNewHabitName('');
    } else {
      console.error('Failed to add habit to database:', error);
    }
  };

  // Rendering the Plant SVG based on completed count
  const renderGardenPlant = () => {
    switch (growthStage) {
      case 0: // Seed / Sprout
        return (
          <g>
            <circle cx="100" cy="115" r="8" fill="#78350F" opacity="0.8" />
            <path d="M100,115 Q100,105 102,102" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" className="plant-sprout" />
            <path d="M102,102 Q105,98 108,100" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M102,102 Q98,97 94,98" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 1: // Small sprout
        return (
          <g>
            <circle cx="100" cy="115" r="10" fill="#78350F" opacity="0.8" />
            <path d="M100,115 Q98,90 102,85" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M101,98 C108,98 112,92 112,92 C112,92 105,90 101,98 Z" fill="#34D399" />
            <path d="M99,94 C92,94 88,88 88,88 C88,88 95,86 99,94 Z" fill="#34D399" />
          </g>
        );
      case 2: // Growing Stem
        return (
          <g>
            <path d="M100,115 Q95,80 100,60" stroke="#059669" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M98,95 C88,95 82,88 82,88 C82,88 92,84 98,95 Z" fill="#10B981" />
            <path d="M100,85 C110,85 116,78 116,78 C116,78 106,74 100,85 Z" fill="#10B981" />
            <path d="M98,72 C92,72 88,66 88,66 C88,66 94,64 98,72 Z" fill="#34D399" />
            <path d="M100,60 Q105,52 108,54" stroke="#34D399" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        );
      case 3: // Budding Flower
        return (
          <g>
            <path d="M100,115 Q95,75 100,50" stroke="#059669" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M98,90 C86,90 80,82 80,82 C80,82 92,78 98,90 Z" fill="#10B981" />
            <path d="M100,75 C112,75 118,67 118,67 C118,67 106,63 100,75 Z" fill="#10B981" />
            <path d="M99,65 Q88,58 90,52" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="90" cy="50" r="5" fill="#EF4444" />
            <circle cx="100" cy="46" r="8" fill="#EC4899" />
            <path d="M96,44 C96,40 100,36 100,36 C100,36 104,40 104,44 Z" fill="#F472B6" />
          </g>
        );
      case 4: // fully bloomed glowing flower
      default:
        return (
          <g className="bloom-glow-container">
            <path d="M100,115 Q95,70 100,45" stroke="#059669" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M98,85 C84,85 78,77 78,77 C78,77 90,73 98,85 Z" fill="#10B981" />
            <path d="M100,68 C114,68 120,60 120,60 C120,60 108,56 100,68 Z" fill="#10B981" />
            <path d="M98,60 Q84,52 82,48" stroke="#059669" strokeWidth="3.5" fill="none" />
            <circle cx="82" cy="48" r="6" fill="#F59E0B" />
            <circle cx="82" cy="48" r="3" fill="#FFFBEB" />
            
            <circle cx="100" cy="40" r="24" fill="rgba(236, 72, 153, 0.25)" filter="blur(8px)" className="pulse-glow" />
            
            <circle cx="100" cy="28" r="10" fill="#F472B6" />
            <circle cx="100" cy="52" r="10" fill="#F472B6" />
            <circle cx="88" cy="40" r="10" fill="#F472B6" />
            <circle cx="112" cy="40" r="10" fill="#F472B6" />
            <circle cx="92" cy="30" r="9" fill="#EC4899" />
            <circle cx="108" cy="30" r="9" fill="#EC4899" />
            <circle cx="92" cy="50" r="9" fill="#EC4899" />
            <circle cx="108" cy="50" r="9" fill="#EC4899" />
            <circle cx="100" cy="40" r="8" fill="#FBBF24" />
            <circle cx="100" cy="40" r="4" fill="#FFF" />
          </g>
        );
    }
  };

  return (
    <div 
      className="habit-garden-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        alignItems: 'start',
        padding: '24px 0',
      }}
    >
      {/* Left side: Habits List */}
      <div 
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Habit Garden</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
              Grow flowers by keeping your streaks alive today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{
              background: 'var(--gradient-mint-cyan)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}>
              Level {Math.floor(completedCount / 2) + 1} Sprout
            </span>
          </div>
        </div>

        {/* Habits list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={(e) => toggleHabit(habit.id, habit.completed, habit.streak, e)}
              className="glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: habit.completed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                borderLeft: `5px solid ${habit.color}`,
                cursor: 'pointer',
                transform: 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = habit.completed ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: habit.completed ? 'none' : '2px solid var(--text-tertiary)',
                    background: habit.completed ? habit.color : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {habit.completed && <Check size={14} color="#FFF" strokeWidth={3} />}
                </div>
                <span style={{
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: habit.completed ? 'line-through' : 'none',
                  color: habit.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                  transition: 'color 0.25s ease'
                }}>
                  {habit.name}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                <Flame size={16} fill="#F59E0B" strokeWidth={1} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{habit.streak}d</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Habit input form */}
        <form onSubmit={addHabit} style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Grow a new habit..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(255, 255, 255, 0.8)',
              outline: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-blue)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.06)'}
          />
          <button
            type="submit"
            className="glow-blue"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--gradient-blue-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
              transition: 'transform 0.25s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={20} />
          </button>
        </form>
      </div>

      {/* Right side: 3D Floating Garden Island */}
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          height: '420px',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <div style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '500' }}>
          <HelpCircle size={14} />
          Check off habits to nurture the plant.
        </div>

        {completedCount > 0 && (
          <div style={{ position: 'absolute', top: '30%', zIndex: 5, animation: 'float 2.5s ease-in-out infinite alternate', display: 'flex', gap: '30px' }}>
            <Sparkles size={16} color="gold" style={{ opacity: 0.6, animation: 'spin 10s linear infinite' }} />
            <Sparkles size={12} color="#06B6D4" style={{ opacity: 0.5, animation: 'spin 6s linear infinite reverse', marginTop: '20px' }} />
          </div>
        )}

        <div 
          className="float-slow"
          style={{
            width: '240px',
            height: '240px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            <g transform="translate(0, 45)">
              <ellipse cx="100" cy="138" rx="72" ry="16" fill="rgba(31, 38, 135, 0.08)" filter="blur(6px)" />
              <path d="M30,120 Q30,135 100,135 Q170,135 170,120 Q170,105 100,105 Q30,105 30,120 Z" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1" />
              <path d="M30,120 Q30,135 100,135 Q170,135 170,120 L165,130 Q165,145 100,145 Q35,145 35,130 Z" fill="url(#dirt-gradient)" />
              <ellipse cx="100" cy="120" rx="68" ry="12" fill="url(#grass-gradient)" />
              <circle cx="65" cy="155" r="2" fill="rgba(16, 185, 129, 0.4)" />
              <circle cx="135" cy="162" r="3" fill="rgba(6, 182, 212, 0.3)" />
              <circle cx="100" cy="168" r="1.5" fill="rgba(236, 72, 153, 0.4)" />
            </g>

            <defs>
              <linearGradient id="grass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="dirt-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
            </defs>

            <g transform="translate(0, 45)">
              {renderGardenPlant()}
            </g>
          </svg>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
            {completedCount === 0 ? 'Plant is dormant' : completedCount === habits.length ? 'Garden Fully Bloomed!' : 'Plant is growing...'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px' }}>
            {completedCount} of {habits.length} habits completed today
          </p>
        </div>

        <style>{`
          .pulse-glow {
            animation: orb-pulse 2s infinite alternate ease-in-out;
          }
          @keyframes orb-pulse {
            0% { transform: scale(0.95); opacity: 0.2; }
            100% { transform: scale(1.08); opacity: 0.45; }
          }
          .plant-sprout {
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
            animation: sprout-grow 1.2s forwards cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          @keyframes sprout-grow {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
