import React, { useState } from 'react';
import AIAssistant from '../components/AIAssistant';
import Navigation from '../components/Navigation';
import KanbanBoard from '../components/KanbanBoard';
import Calendar3D from '../components/Calendar3D';
import HabitGarden from '../components/HabitGarden';
import AnalyticsWidget from '../components/AnalyticsWidget';
import DangerRadar from '../components/DangerRadar';
import FocusBubble from '../components/FocusBubble';
import TimeTravel from '../components/TimeTravel';
import AutonomousPlanner from '../features/AutonomousPlanner';
import { Sparkles, Zap, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiState, setAiState] = useState('idle');
  const [focusTask, setFocusTask] = useState(null);
  const [timelineState, setTimelineState] = useState('today'); // procrastinate, today, optimized

  // Resolve first name metadata correctly for greeting
  const metaFirstName = session?.user?.user_metadata?.first_name;
  const userEmail = session?.user?.email || 'Explorer';
  const rawName = userEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
  const fallbackName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const userName = metaFirstName ? (metaFirstName.trim().charAt(0).toUpperCase() + metaFirstName.trim().slice(1)) : fallbackName;

  const handleStartFocus = (taskTitle) => {
    setFocusTask(taskTitle);
  };

  const handleVoiceCommand = async (command) => {
    const cmd = command.toLowerCase();
    
    const speakFeedback = (text, state = 'talking') => {
      window.dispatchEvent(new CustomEvent('sprint_speak', { detail: { text, state } }));
    };

    if (cmd.includes('add task') || cmd.includes('create task')) {
      const taskTitle = command.replace(/(add task|create task)/i, '').trim();
      if (taskTitle) {
        setAiState('thinking');
        const newTask = {
          title: taskTitle,
          status: 'todo',
          urgency: 'Medium',
          color: 'var(--color-blue)',
          duration: '1h',
          category: 'Work',
          energy: 'Routine focus',
          due_date: new Date().toISOString()
        };
        const { error } = await supabase.from('tasks').insert(newTask);
        if (!error) {
          window.dispatchEvent(new Event('sprint_refresh_tasks'));
          setAiState('celebrating');
          speakFeedback(`I have added the task: "${taskTitle}" to your workstation.`, 'celebrating');
          setTimeout(() => setAiState('idle'), 4000);
        } else {
          setAiState('idle');
          speakFeedback("Sorry, I encountered an issue adding that task.");
        }
      } else {
        speakFeedback("What task title would you like me to add?");
      }
    } else if (cmd.includes('focus') || cmd.includes('start focus')) {
      setFocusTask("Optimal Deep Focus Session");
      setAiState('celebrating');
      speakFeedback("Launching deep focus environment.", 'celebrating');
      setTimeout(() => setAiState('idle'), 3000);
    } else if (cmd.includes('garden') || cmd.includes('habits') || cmd.includes('go to habits')) {
      setActiveTab('garden');
      setAiState('celebrating');
      speakFeedback("Switching tab to your habit garden.", 'celebrating');
      setTimeout(() => setAiState('idle'), 3000);
    } else if (cmd.includes('dashboard') || cmd.includes('go to dashboard')) {
      setActiveTab('dashboard');
      setAiState('celebrating');
      speakFeedback("Opening your main workspace.", 'celebrating');
      setTimeout(() => setAiState('idle'), 3000);
    } else if (cmd.includes('optimize') || cmd.includes('optimize day')) {
      setAiState('thinking');
      speakFeedback("Running workspace scheduler optimization...", 'thinking');
      setTimeout(() => {
        setAiState('celebrating');
        speakFeedback("Workspace optimization complete.", 'celebrating');
        setTimeout(() => setAiState('idle'), 3000);
      }, 2500);
    } else if (cmd.includes('log out') || cmd.includes('sign out')) {
      speakFeedback("Signing you out of your workstation.", 'idle');
      setTimeout(() => {
        supabase.auth.signOut();
      }, 1500);
    } else {
      speakFeedback("I heard you, but that command is not registered. What else can I do for you?");
      setAiState('idle');
    }
  };

  const handleTimeTravelChange = (state) => {
    setTimelineState(state);
    if (state === 'procrastinate') {
      setAiState('thinking');
    } else if (state === 'optimized') {
      setAiState('celebrating');
    } else {
      setAiState('idle');
    }
  };

  const renderActiveWidget = () => {
    switch (activeTab) {
      case 'focus':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '380px' }}>
            <div 
              className="glass-panel"
              style={{
                padding: '40px',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                maxWidth: '480px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}
            >
              <Zap size={40} color="var(--color-blue)" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>Launch Focus Mode</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px', lineHeight: '1.45' }}>
                Enter an immersive, distraction-free spatial environment. The outside workspace dims, letting you focus solely on your current task.
              </p>
              <button 
                onClick={() => handleStartFocus("Optimize neural schedule algorithms")}
                className="btn-premium glow-blue"
                style={{ padding: '14px 28px' }}
              >
                Start Focus Session (25m)
              </button>
            </div>
          </div>
        );
      case 'planner':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <AutonomousPlanner />
            <DangerRadar />
          </div>
        );
      case 'garden':
        return <HabitGarden />;
      case 'analytics':
        return <AnalyticsWidget />;
      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px' }}>Sprint Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.6)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Biometric Syncing</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Adjust schedule based on active heart-rate and fatigue sensors.</p>
                </div>
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', background: 'var(--color-blue)', padding: '2px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
                </div>
              </div>
              <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.6)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Focus Soundscapes</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Play ambient binaural beats during Focus Bubble sessions.</p>
                </div>
                <div style={{ width: '40px', height: '20px', borderRadius: '10px', background: 'var(--color-blue)', padding: '2px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
                </div>
              </div>
              <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#EF4444' }}>Session Security</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Sign out of your active Sprint Workstation.</p>
                </div>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="btn-premium"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    background: '#EF4444',
                    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <KanbanBoard onStartFocus={handleStartFocus} />
            <Calendar3D />
          </div>
        );
    }
  };

  return (
    <div 
      className="dashboard-wrapper"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px 100px 24px',
        minHeight: '100vh',
        boxSizing: 'border-box',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Main Content Area */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Banner Alert based on Time Travel Slider state */}
        {timelineState === 'procrastinate' && (
          <div 
            className="glass-panel"
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1.5px solid rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.04)',
              animation: 'float 4s infinite alternate'
            }}
          >
            <ShieldAlert size={20} color="#EF4444" className="pulse-slow" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              <strong>Procrastination Path Active:</strong> Tomorrow's workload will increase by <strong>+4.5 hours</strong>. 3 deadlines are at critical risk. Optimize your schedule now to mitigate.
            </div>
          </div>
        )}

        {timelineState === 'optimized' && (
          <div 
            className="glass-panel"
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1.5px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.04)',
              animation: 'float 4s infinite alternate'
            }}
          >
            <ShieldCheck size={20} color="#10B981" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              <strong>Optimal Plan Selected:</strong> Streaks active. You are on track to unlock a <strong>3-hour open slot</strong> this Friday. Your Habit Garden plant is growing faster!
            </div>
          </div>
        )}

        {/* Current Active view */}
        <div style={{ minHeight: '400px' }}>
          {renderActiveWidget()}
        </div>
      </main>

      {/* Right Sidebar (AI assistant & Time Travel) */}
      <aside 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'sticky',
          top: '32px',
          height: 'fit-content'
        }}
      >
        {/* Floating AI Orb */}
        <div 
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
          }}
        >
          <AIAssistant state={aiState} userName={userName} onClick={setAiState} onVoiceCommand={handleVoiceCommand} />
        </div>

        {/* Time Travel Slider widget */}
        <TimeTravel onStateChange={handleTimeTravelChange} />
      </aside>

      {/* Dock Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Full-screen Focus Bubble Overlay */}
      {focusTask && (
        <FocusBubble 
          taskName={focusTask} 
          onClose={() => setFocusTask(null)} 
        />
      )}
    </div>
  );
}
