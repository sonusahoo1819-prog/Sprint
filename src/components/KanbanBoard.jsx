import React, { useState, useEffect } from 'react';
import { Play, Check, Clock, Plus, Star, Sparkles, X, Zap, Trash2 } from 'lucide-react';
import { fireCelebration } from './Celebration';
import { supabase } from '../lib/supabaseClient';

export default function KanbanBoard({ onStartFocus }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [urgency, setUrgency] = useState('Medium urgency');
  const [effort, setEffort] = useState('30 mins');
  const [energyLevel, setEnergyLevel] = useState('Routine focus');
  
  // Default due date to current local time formatted for datetime-local inputs
  const getLocalDateTimeString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const [dueDateTime, setDueDateTime] = useState(getLocalDateTimeString());

  useEffect(() => {
    fetchTasks();
    window.addEventListener('sprint_refresh_tasks', fetchTasks);
    return () => {
      window.removeEventListener('sprint_refresh_tasks', fetchTasks);
    };
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (!error && data) {
      setTasks(data);
    }
  };

  const completeTask = async (id, e) => {
    if (e) e.stopPropagation();
    fireCelebration(e ? e.clientX : window.innerWidth / 2, e ? e.clientY : window.innerHeight / 2);
    const { error } = await supabase.from('tasks').update({ status: 'done' }).eq('id', id);
    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t));
      window.dispatchEvent(new Event('sprint_refresh_tasks')); // reload analytics!
    } else {
      console.error('Failed to complete task in database:', error);
    }
  };

  const startTask = async (id) => {
    const { error } = await supabase.from('tasks').update({ status: 'progress' }).eq('id', id);
    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'progress' } : t));
      window.dispatchEvent(new Event('sprint_refresh_tasks')); // reload analytics!
      const task = tasks.find(t => t.id === id);
      if (task && onStartFocus) {
        onStartFocus(task.title);
      }
    } else {
      console.error('Failed to start task in database:', error);
    }
  };

  const deleteTask = async (id, e) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== id));
      window.dispatchEvent(new Event('sprint_refresh_tasks')); // reload analytics!
    } else {
      console.error('Failed to delete task:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Map categories to colors
    const colorMap = {
      Work: 'var(--color-blue)',
      Personal: 'var(--color-purple)',
      Health: 'var(--color-orange)',
      Study: 'var(--color-sky)'
    };

    // Clean urgency string for database compatibility
    const cleanUrgency = urgency.replace(' urgency', '');

    const newTask = {
      title: newTaskTitle,
      status: 'todo',
      urgency: cleanUrgency,
      color: colorMap[category] || 'var(--color-blue)',
      duration: effort
    };

    const { error } = await supabase.from('tasks').insert(newTask);
    if (!error) {
      fetchTasks();
      // Reset states
      setNewTaskTitle('');
      setCategory('Work');
      setUrgency('Medium urgency');
      setEffort('30 mins');
      setEnergyLevel('Routine focus');
      setDueDateTime(getLocalDateTimeString());
      setIsModalOpen(false);
      fireCelebration(e.clientX, e.clientY);
    } else {
      console.error('Failed to insert task to database:', error);
    }
  };

  const getColumns = () => {
    return {
      todo: { name: 'To Do', items: tasks.filter(t => t.status === 'todo'), gradient: 'var(--gradient-orange-pink)' },
      progress: { name: 'In Progress', items: tasks.filter(t => t.status === 'progress'), gradient: 'var(--gradient-blue-purple)' },
      done: { name: 'Done', items: tasks.filter(t => t.status === 'done'), gradient: 'var(--gradient-mint-cyan)' }
    };
  };

  const columns = getColumns();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Header and Add Task */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Workspace Kanban</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>Drag tasks or launch focus sessions directly from cards.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-premium"
          style={{ padding: '10px 22px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Add Priority Task
        </button>
      </div>

      {/* Structured Task Creator Modal */}
      {isModalOpen && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '32px',
              borderRadius: '24px',
              background: 'var(--bg-cream)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 24px 75px rgba(0, 0, 0, 0.45)',
              position: 'relative',
              boxSizing: 'border-box',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Header / Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Add Priority Task
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Task Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Task Title
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Prep slide deck outline"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Grid Fields: Category & Urgency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Category
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Study">Study</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Urgency
                  </label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Low urgency">Low urgency</option>
                    <option value="Medium urgency">Medium urgency</option>
                    <option value="High urgency">High urgency</option>
                  </select>
                </div>
              </div>

              {/* Grid Fields: Effort & Energy Level */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Effort
                  </label>
                  <select 
                    value={effort}
                    onChange={(e) => setEffort(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1.5 hours">1.5 hours</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} /> Energy Level
                  </label>
                  <select 
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Routine focus">Routine focus</option>
                    <option value="Deep focus">Deep focus</option>
                    <option value="High energy">High energy</option>
                    <option value="Low energy">Low energy</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Time */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Due Date & Time
                </label>
                <input 
                  type="datetime-local"
                  value={dueDateTime}
                  onChange={(e) => setDueDateTime(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.88rem',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="btn-premium"
                style={{
                  padding: '14px 28px',
                  fontSize: '0.95rem',
                  marginTop: '12px',
                  borderRadius: '14px',
                  width: '100%'
                }}
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Keyframe animation definitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Kanban Board Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
        {Object.entries(columns).map(([colKey, col]) => (
          <div 
            key={colKey}
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(0, 0, 0, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colKey === 'todo' ? 'var(--color-orange)' : colKey === 'progress' ? 'var(--color-blue)' : 'var(--color-mint)' }} />
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>{col.name}</span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                {col.items.length}
              </span>
            </div>

            {/* Column Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {col.items.map((task) => (
                <div
                  key={task.id}
                  className="glass-panel"
                  onClick={(e) => {
                    if (e.target.closest('button')) return;
                    if (colKey === 'todo') {
                      startTask(task.id);
                    } else if (colKey === 'progress') {
                      completeTask(task.id, e);
                    }
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderLeft: `4px solid ${task.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) rotate(0.5deg)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(31, 38, 135, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
                    e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: task.urgency === 'High' ? 'var(--color-pink)' : task.urgency === 'Medium' ? 'var(--color-blue)' : 'var(--color-mint)'
                    }}>
                      {task.urgency}
                    </span>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} />
                      {task.duration}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.88rem', fontWeight: '700', lineHeight: '1.4', color: 'var(--text-primary)', marginBottom: '16px' }}>
                    {task.title}
                  </h4>

                  {/* Actions inside Card */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(0, 0, 0, 0.02)', paddingTop: '10px' }}>
                    {colKey !== 'done' && (
                      <button
                        onClick={(e) => completeTask(task.id, e)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(16, 185, 129, 0.08)',
                          color: 'var(--color-mint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Mark completed"
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                    )}

                    {colKey === 'todo' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startTask(task.id);
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(99, 102, 241, 0.08)',
                          color: 'var(--color-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Start focus block"
                      >
                        <Play size={12} fill="var(--color-blue)" stroke="none" />
                      </button>
                    )}

                    {colKey === 'done' && (
                      <button
                        onClick={(e) => deleteTask(task.id, e)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: 'var(--color-pink)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {col.items.length === 0 && (
                <div style={{ padding: '36px 12px', textAlign: 'center', border: '1px dashed rgba(0,0,0,0.04)', borderRadius: '12px', color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                  No tasks here.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
