import React, { useState, useEffect } from 'react';
import { AlertCircle, ShieldAlert, Sparkles, HelpCircle, CheckCircle, Hourglass, ShieldCheck } from 'lucide-react';
import { fireCelebration } from './Celebration';
import { supabase } from '../lib/supabaseClient';

export default function DangerRadar({ session }) {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    // Listen for Kanban update events to sync in real-time
    window.addEventListener('sprint_refresh_tasks', fetchTasks);
    return () => {
      window.removeEventListener('sprint_refresh_tasks', fetchTasks);
    };
  }, [session]);

  const fetchTasks = async () => {
    if (!session?.user?.id) {
      setTasks([]);
      setActiveTask(null);
      return;
    }
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id);
    if (data) {
      // Filter out completed tasks
      const active = data.filter(t => t.status !== 'done');
      
      // Map tasks to Radar fields dynamically
      const mapped = active.map(t => {
        let zone = 'safe';
        let hoursLeft = 14;
        let suggestion = 'On track. Task scheduled for tomorrow morning during your typical peak layout design hours.';
        let color = '#10B981';

        if (t.urgency === 'High') {
          zone = 'danger';
          hoursLeft = 2;
          suggestion = 'Block calendar immediately. Sprint AI suggests auto-declining non-essential syncs to clear deep work focus.';
          color = '#EF4444';
        } else if (t.urgency === 'Medium') {
          zone = 'warning';
          hoursLeft = 6;
          suggestion = 'Suggesting 1 hour of Focus Bubble mode after lunch. Sprint AI will prepare local reference data.';
          color = '#F59E0B';
        }

        return {
          id: t.id,
          name: t.title,
          hoursLeft,
          importance: t.urgency,
          color,
          zone,
          suggestion
        };
      });

      setTasks(mapped);
      
      // Set active task default to the most urgent task
      if (mapped.length > 0) {
        const dangerTask = mapped.find(t => t.zone === 'danger');
        const warningTask = mapped.find(t => t.zone === 'warning');
        setActiveTask(dangerTask || warningTask || mapped[0]);
      } else {
        setActiveTask(null);
      }
    }
  };

  const handleResolve = async (id, e) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('tasks').update({ status: 'done' }).eq('id', id);
    if (!error) {
      fetchTasks();
      // Notify KanbanBoard and Analytics to reload
      window.dispatchEvent(new Event('sprint_refresh_tasks'));
      fireCelebration(e ? e.clientX : window.innerWidth / 2, e ? e.clientY : window.innerHeight / 2);
    } else {
      console.error('Failed to complete task in radar:', error);
    }
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
          boxSizing: 'border-box'
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
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {t.name} ({t.hoursLeft}h)
              </div>
            ))}
          </div>

          {/* Warning Zone (Center) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '32px' }}>Warning Zone (4 - 12h)</span>
            
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
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {t.name} ({t.hoursLeft}h)
              </div>
            ))}
          </div>

          {/* Critical Zone (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '32px' }}>Critical Zone (&lt;4h)</span>
            
            {tasks.filter(t => t.zone === 'danger').map(t => (
              <div 
                key={t.id} 
                onClick={() => setActiveTask(t)}
                className="glass-panel pulse-alert-border"
                style={{
                  position: 'absolute',
                  top: '40px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: activeTask?.id === t.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                  border: activeTask?.id === t.id ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.75)',
                  boxShadow: activeTask?.id === t.id ? '0 8px 20px rgba(239, 68, 68, 0.2)' : 'var(--glass-shadow)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transform: activeTask?.id === t.id ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                🚨 {t.name} ({t.hoursLeft}h)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Selected Task Analysis / Autopilot Plan */}
      {activeTask ? (
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.55)',
            border: `1.5px solid ${activeTask.color}`,
            boxShadow: `0 12px 32px rgba(31, 38, 135, 0.03)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `${activeTask.color}15`,
              color: activeTask.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-primary)' }}>{activeTask.name}</h4>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: activeTask.color,
                  color: 'white',
                  letterSpacing: '0.04em'
                }}>
                  {activeTask.importance} Priority
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.45' }}>
                ✨ <strong>Sprint AI Autopilot Plan:</strong> {activeTask.suggestion}
              </p>
            </div>
          </div>

          <button 
            onClick={(e) => handleResolve(activeTask.id, e)}
            className="btn-premium"
            style={{
              padding: '10px 20px',
              fontSize: '0.8rem',
              background: activeTask.color,
              boxShadow: `0 8px 20px ${activeTask.color}25`
            }}
          >
            <Sparkles size={14} /> Mitigate Danger
          </button>
        </div>
      ) : (
        <div 
          className="glass-panel"
          style={{
            padding: '32px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.08)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)' }}>All Tasks Cleared</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>No active deadline threats detected. Keep up the high momentum!</p>
          </div>
        </div>
      )}
    </div>
  );
}
