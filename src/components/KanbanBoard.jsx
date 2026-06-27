import React, { useState, useEffect } from 'react';
import { Play, Check, Clock, Plus, Star, Sparkles } from 'lucide-react';
import { fireCelebration } from './Celebration';
import { supabase } from '../lib/supabaseClient';

export default function KanbanBoard({ onStartFocus }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (!error && data) {
      setTasks(data);
    }
  };

  const completeTask = async (id, e) => {
    fireCelebration(e.clientX, e.clientY);
    const { error } = await supabase.from('tasks').update({ status: 'done' }).eq('id', id);
    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t));
    } else {
      console.error('Failed to complete task in database:', error);
    }
  };

  const startTask = async (id) => {
    const { error } = await supabase.from('tasks').update({ status: 'progress' }).eq('id', id);
    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'progress' } : t));
      const task = tasks.find(t => t.id === id);
      if (task && onStartFocus) {
        onStartFocus(task.title);
      }
    } else {
      console.error('Failed to start task in database:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      status: 'todo',
      urgency: 'Medium',
      color: 'var(--color-blue)',
      duration: '1.5h'
    };

    const { error } = await supabase.from('tasks').insert(newTask);
    if (!error) {
      fetchTasks();
      setNewTaskTitle('');
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

        <form onSubmit={addTask} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Add new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.82rem',
              fontWeight: '500',
              outline: 'none',
              minWidth: '200px',
            }}
          />
          <button type="submit" className="btn-premium" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

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
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderLeft: `4px solid ${task.color}`,
                    cursor: 'grab',
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
                        onClick={() => startTask(task.id)}
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
