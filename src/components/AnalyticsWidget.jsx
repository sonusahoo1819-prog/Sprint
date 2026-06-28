import React, { useState, useEffect } from 'react';
import { Award, Zap, HeartPulse, LineChart, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AnalyticsWidget({ session }) {
  const [activeScore, setActiveScore] = useState('focus'); // focus, energy, momentum
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
    // Listen for updates from other widgets
    window.addEventListener('sprint_refresh_tasks', fetchTasks);
    return () => {
      window.removeEventListener('sprint_refresh_tasks', fetchTasks);
    };
  }, [session]);

  const fetchTasks = async () => {
    if (!session?.user?.id) {
      setTasks([]);
      return;
    }
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id);
    if (data) {
      setTasks(data);
    }
  };

  // Filter completed and active items
  const completedTasks = tasks.filter(t => t.status === 'done');
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const inProgressCount = tasks.filter(t => t.status === 'progress').length;

  // Calculate dynamic stats
  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  
  // Dynamic Focus Score: percentage of completed tasks (default 100 if no tasks exist)
  const focusScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
  
  // Dynamic Energy: decreases when there are too many active/in-progress tasks
  const energyPercent = Math.max(100 - (activeTasks.length * 8) - (inProgressCount * 6), 65);
  
  // Dynamic Momentum: scales up as tasks are completed
  const momentumPercent = totalCount > 0 ? Math.min(Math.round((completedCount / totalCount) * 32), 100) : 0;
  
  // Dynamic Burnout risk warning based on active load
  const burnoutRisk = activeTasks.length >= 4 ? 'High' : activeTasks.length >= 2 ? 'Medium' : 'Low';

  // Map completed tasks directly to Achievements
  const achievements = completedTasks.map((t, idx) => {
    const completionTime = t.created_at 
      ? new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Recently';

    // XP allocation depending on the task urgency or length
    let xp = '+15 XP';
    if (t.urgency === 'High') {
      xp = '+30 XP';
    } else if (t.urgency === 'Medium') {
      xp = '+20 XP';
    }

    return {
      id: t.id || idx,
      time: completionTime,
      title: `Completed: ${t.title}`,
      xp: xp,
      icon: Award,
      color: t.color || 'var(--color-blue)'
    };
  }).slice(-3).reverse(); // Keep the 3 most recently completed tasks

  // Dynamic stroke calculation: stroke-dasharray is 351.8. 
  // Offset represents remaining score: (100 - focusScore) / 100 * 351.8
  const strokeDashoffset = 351.8 - (focusScore / 100) * 351.8;

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
          boxSizing: 'border-box'
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Biometric Sync</h3>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--color-mint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synced 2m ago</span>
        </div>

        {/* Focus Score Progress Circle */}
        <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0px 2px 8px rgba(99, 102, 241, 0.25))',
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
            <defs>
              <linearGradient id="analytics-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
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
            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.05em' }}>{focusScore}</span>
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
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{energyPercent}%</span>
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
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>+{momentumPercent}%</span>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px', color: burnoutRisk === 'High' ? 'var(--color-pink)' : 'var(--color-mint)' }}>
              <HeartPulse size={12} />
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{burnoutRisk}</span>
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
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Focus Trend</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>
            <LineChart size={14} />
            Weekly Average: {completedCount > 0 ? (completedCount * 1.2).toFixed(1) : 0}h
          </div>
        </div>

        {/* Small SVG Sparkline Graph */}
        <div style={{ width: '100%', height: '110px', marginTop: '12px', position: 'relative' }}>
          <svg viewBox="0 0 200 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="0" y1="25" x2="200" y2="25" stroke="rgba(0,0,0,0.02)" strokeWidth="1" />
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(0,0,0,0.02)" strokeWidth="1" />
            <line x1="0" y1="75" x2="200" y2="75" stroke="rgba(0,0,0,0.02)" strokeWidth="1" />

            {/* Area under curve (Dynamic based on completed count) */}
            <path
              d={`M10,100 L10,95 L40,${95 - Math.min(completedCount * 10, 30)} L70,${95 - Math.min(completedCount * 15, 45)} L100,${95 - Math.min(completedCount * 20, 60)} L130,${95 - Math.min(completedCount * 22, 65)} L160,${95 - Math.min(completedCount * 25, 75)} L190,${100 - focusScore} L190,100 Z`}
              fill="url(#chart-area-grad)"
            />

            {/* Line Path */}
            <path
              d={`M10,95 L40,${95 - Math.min(completedCount * 10, 30)} L70,${95 - Math.min(completedCount * 15, 45)} L100,${95 - Math.min(completedCount * 20, 60)} L130,${95 - Math.min(completedCount * 22, 65)} L160,${95 - Math.min(completedCount * 25, 75)} L190,${100 - focusScore}`}
              fill="none"
              stroke="url(#chart-line-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active glowing dot */}
            <circle cx="190" cy={100 - focusScore} r="5" fill="#3B82F6" stroke="#FFF" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px #3B82F6)' }} />

            {/* Gradients */}
            <defs>
              <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', width: '100%' }}>
          {achievements.length > 0 ? (
            achievements.map((item) => {
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
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    width: '100%',
                    boxSizing: 'border-box'
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
            })
          ) : (
            <div style={{ padding: '24px 12px', textAlign: 'center', border: '1px dashed rgba(0,0,0,0.04)', borderRadius: '12px', color: 'var(--text-tertiary)', fontSize: '0.78rem', width: '100%', boxSizing: 'border-box' }}>
              No focus activities logged yet. Complete tasks to earn XP.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
