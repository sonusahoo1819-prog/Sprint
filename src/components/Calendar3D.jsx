import React, { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { fireCelebration } from './Celebration';
import { supabase } from '../lib/supabaseClient';

export default function Calendar3D({ session }) {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday (index 2)
  const [hoveredDay, setHoveredDay] = useState(null);
  const [events, setEvents] = useState({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
  const [newEventTitle, setNewEventTitle] = useState('');

  const weekDays = [
    { name: 'Mon', date: '29', label: 'Monday' },
    { name: 'Tue', date: '30', label: 'Tuesday' },
    { name: 'Wed', date: '01', label: 'Wednesday' },
    { name: 'Thu', date: '02', label: 'Thursday' },
    { name: 'Fri', date: '03', label: 'Friday' },
    { name: 'Sat', date: '04', label: 'Saturday' },
    { name: 'Sun', date: '05', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [session]);

  const fetchEvents = async () => {
    if (!session?.user?.id) {
      setEvents({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
      return;
    }
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id);
    if (!error && data) {
      const grouped = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      data.forEach(item => {
        const d = parseInt(item.day);
        if (grouped[d]) {
          grouped[d].push(item);
        }
      });
      setEvents(grouped);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    
    const newEvent = {
      title: newEventTitle,
      time: '11:00 AM - 12:00 PM',
      type: 'focus',
      color: 'var(--color-blue)',
      day: selectedDay,
      user_id: session?.user?.id || null
    };

    const { error } = await supabase.from('events').insert(newEvent);
    if (!error) {
      fetchEvents();
      setNewEventTitle('');
      fireCelebration(e.clientX, e.clientY);
    } else {
      console.error('Failed to save calendar event to database:', error);
    }
  };

  return (
    <div 
      className="calendar-3d-layout"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
      }}
    >
      {/* Calendar Header */}
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-blue-purple)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
          }}>
            <Calendar size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Schedule Workstation</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>June 2026</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
          <span style={{ fontWeight: '700', fontSize: '0.9rem', minWidth: '80px', textAlign: 'center' }}>Week 27</span>
          <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Week Grid (3D perspective) */}
      <div 
        className="perspective-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '12px',
          padding: '10px 0',
        }}
      >
        {weekDays.map((day, idx) => {
          const isSelected = selectedDay === idx;
          const isHovered = hoveredDay === idx;
          const hasEvents = (events[idx] || []).length > 0;
          
          let transformStyle = 'rotateY(0deg) scale(1) translateZ(0)';
          if (isSelected) {
            transformStyle = 'rotateY(4deg) scale(1.03) translateZ(20px)';
          } else if (isHovered) {
            transformStyle = 'rotateY(-4deg) scale(1.01) translateZ(5px)';
          }

          return (
            <div
              key={day.name}
              onMouseEnter={() => setHoveredDay(idx)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => setSelectedDay(idx)}
              className="glass-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 12px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: isSelected 
                  ? 'rgba(255, 255, 255, 0.85)' 
                  : 'rgba(255, 255, 255, 0.4)',
                border: isSelected 
                  ? '1.5px solid var(--color-blue)' 
                  : '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: isSelected 
                  ? '0 16px 36px rgba(99, 102, 241, 0.1)' 
                  : 'var(--glass-shadow)',
                transform: transformStyle,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: isSelected ? 'var(--color-blue)' : 'var(--text-secondary)'
              }}>
                {day.name}
              </span>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: '800',
                marginTop: '6px',
                color: isSelected ? 'var(--color-blue)' : 'var(--text-primary)'
              }}>
                {day.date}
              </span>

              {hasEvents && (
                <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
                  {events[idx].map((ev, eIdx) => (
                    <div 
                      key={ev.id || eIdx}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: ev.color,
                        boxShadow: `0 0 6px ${ev.color}`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day View Details */}
      <div 
        className="glass-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '24px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Schedule for {weekDays[selectedDay].label}</span>
            <span style={{
              background: 'rgba(99, 102, 241, 0.08)',
              color: 'var(--color-blue)',
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {(events[selectedDay] || []).length} Items
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(events[selectedDay] || []).length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)', border: '1px dashed rgba(0,0,0,0.06)', borderRadius: '16px' }}>
                No events scheduled. Enjoy the open slot!
              </div>
            ) : (
              events[selectedDay].map((event) => (
                <div
                  key={event.id}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.75)',
                    borderLeft: `4px solid ${event.color}`,
                    transition: 'transform 0.25s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>{event.title}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} />
                      {event.time}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    color: event.type === 'meeting' ? 'var(--color-purple)' : 'var(--color-mint)',
                    background: event.type === 'meeting' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)'
                  }}>
                    {event.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div 
          style={{
            borderLeft: '1.5px solid rgba(0, 0, 0, 0.04)',
            paddingLeft: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-blue)', marginBottom: '12px' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Smart Scheduler</span>
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '8px' }}>Schedule with AI</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '16px', lineHeight: '1.4' }}>
            Sprint AI automatically finds a perfect slot inside your schedule that aligns with your peak focus hours.
          </p>

          <form onSubmit={addEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. Code Review with Team"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.85rem',
                fontWeight: '500',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="btn-premium"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.85rem',
                boxShadow: 'none',
              }}
            >
              <Plus size={16} />
              Book Optimal Slot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
