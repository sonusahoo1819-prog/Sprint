import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key';

let supabaseClient;

const getTableDefaults = (table) => {
  if (table === 'tasks') {
    return [
      { id: 't1', title: 'Optimize neural schedule algorithms', status: 'progress', urgency: 'High', color: 'var(--color-blue)', duration: '2h' },
      { id: 't2', title: 'Design Sprint Pitch Presentation', status: 'todo', urgency: 'Medium', color: 'var(--color-purple)', duration: '3.5h' },
      { id: 't3', title: 'Review biometric burnout triggers', status: 'todo', urgency: 'Low', color: 'var(--color-orange)', duration: '1h' },
      { id: 't4', title: 'Configure glassmorphic design tokens', status: 'done', urgency: 'Medium', color: 'var(--color-mint)', duration: '1.5h' },
      { id: 't5', title: 'Stitch MCP setup validation', status: 'done', urgency: 'High', color: 'var(--color-sky)', duration: '0.5h' }
    ];
  }
  if (table === 'habits') {
    return [
      { id: 'h1', name: '4 Hours of Deep Work', streak: 5, completed: false, color: 'var(--color-blue)' },
      { id: 'h2', name: 'Drink 3L Water', streak: 12, completed: false, color: 'var(--color-sky)' },
      { id: 'h3', name: 'Read 20 Pages', streak: 3, completed: false, color: 'var(--color-purple)' },
      { id: 'h4', name: '30 min Exercise', streak: 8, completed: false, color: 'var(--color-mint)' }
    ];
  }
  if (table === 'events') {
    return [
      { id: 'e1', title: 'Sprint Kickoff Sync', time: '09:00 AM - 10:00 AM', type: 'meeting', color: 'var(--color-blue)', day: 0 },
      { id: 'e2', title: 'Deep Work: Core Architecture', time: '11:00 AM - 01:00 PM', type: 'focus', color: 'var(--color-mint)', day: 0 },
      { id: 'e3', title: 'Client Pitch Presentation', time: '02:00 PM - 03:00 PM', type: 'meeting', color: 'var(--color-purple)', day: 1 },
      { id: 'e4', title: 'AI Planner Engine Integration', time: '10:00 AM - 12:30 PM', type: 'focus', color: 'var(--color-blue)', day: 2 },
      { id: 'e5', title: 'Sprint App Design Review', time: '03:00 PM - 04:00 PM', type: 'meeting', color: 'var(--color-pink)', day: 2 },
      { id: 'e6', title: 'Design System Audit & Cleanup', time: '01:30 PM - 03:30 PM', type: 'focus', color: 'var(--color-orange)', day: 3 },
      { id: 'e7', title: 'Weekly Review & Retro', time: '03:00 PM - 04:30 PM', type: 'meeting', color: 'var(--color-sky)', day: 4 }
    ];
  }
  return [];
};

// Fluent Mock Query Builder for LocalStorage Fallback
class MockSupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.updateValues = null;
    this.isDelete = false;
  }

  select() {
    const stored = localStorage.getItem(`sprint_${this.table}`);
    const data = stored ? JSON.parse(stored) : getTableDefaults(this.table);
    if (!stored) {
      localStorage.setItem(`sprint_${this.table}`, JSON.stringify(data));
    }
    
    // Filter tasks/habits/events by current user session if user logged in
    const session = JSON.parse(localStorage.getItem('sprint_session'));
    const userId = session?.user?.id;
    if (userId) {
      // Filter out items belonging to other users, but show unassigned/default items
      const userFiltered = data.filter(item => !item.user_id || item.user_id === userId);
      return Promise.resolve({ data: userFiltered, error: null });
    }

    return Promise.resolve({ data, error: null });
  }

  insert(records) {
    const stored = localStorage.getItem(`sprint_${this.table}`);
    const data = stored ? JSON.parse(stored) : getTableDefaults(this.table);
    
    const session = JSON.parse(localStorage.getItem('sprint_session'));
    const userId = session?.user?.id;

    const recordsArray = Array.isArray(records) ? records : [records];
    const newRecords = recordsArray.map(r => ({
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      user_id: userId || null,
      ...r
    }));

    const updated = [...data, ...newRecords];
    localStorage.setItem(`sprint_${this.table}`, JSON.stringify(updated));
    return Promise.resolve({ data: newRecords, error: null });
  }

  update(values) {
    this.updateValues = values;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  eq(column, value) {
    const stored = localStorage.getItem(`sprint_${this.table}`);
    const data = stored ? JSON.parse(stored) : getTableDefaults(this.table);
    
    if (this.isDelete) {
      const updated = data.filter(item => item[column] !== value);
      localStorage.setItem(`sprint_${this.table}`, JSON.stringify(updated));
      return Promise.resolve({ data: null, error: null });
    }

    if (this.updateValues) {
      const updated = data.map(item => {
        if (item[column] === value) {
          return { ...item, ...this.updateValues };
        }
        return item;
      });
      localStorage.setItem(`sprint_${this.table}`, JSON.stringify(updated));
      return Promise.resolve({ data: updated.filter(item => item[column] === value), error: null });
    }

    const filtered = data.filter(item => item[column] === value);
    return Promise.resolve({ data: filtered, error: null });
  }
}

// Mock Authentication Client
class MockSupabaseAuth {
  constructor() {
    this.listeners = [];
  }

  signUp({ email, password, options }) {
    const users = JSON.parse(localStorage.getItem('sprint_users')) || [];
    if (users.find(u => u.email === email)) {
      return Promise.resolve({ data: null, error: { message: 'User account already exists.' } });
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      user_metadata: options?.data || {}
    };

    localStorage.setItem('sprint_users', JSON.stringify([...users, newUser]));
    
    const session = {
      user: { 
        id: newUser.id, 
        email,
        user_metadata: newUser.user_metadata
      }
    };

    localStorage.setItem('sprint_session', JSON.stringify(session));
    this.notifyListeners('SIGNED_IN', session);

    return Promise.resolve({ data: { session, user: session.user }, error: null });
  }

  signInWithPassword({ email, password }) {
    const users = JSON.parse(localStorage.getItem('sprint_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return Promise.resolve({ data: null, error: { message: 'Invalid email or password.' } });
    }

    const session = {
      user: { 
        id: user.id, 
        email,
        user_metadata: user.user_metadata || {}
      }
    };

    localStorage.setItem('sprint_session', JSON.stringify(session));
    this.notifyListeners('SIGNED_IN', session);

    return Promise.resolve({ data: { session, user: session.user }, error: null });
  }

  signOut() {
    localStorage.removeItem('sprint_session');
    this.notifyListeners('SIGNED_OUT', null);
    return Promise.resolve({ error: null });
  }

  getSession() {
    const session = JSON.parse(localStorage.getItem('sprint_session'));
    return Promise.resolve({ data: { session }, error: null });
  }

  onAuthStateChange(callback) {
    this.listeners.push(callback);
    const session = JSON.parse(localStorage.getItem('sprint_session'));
    
    // Fire initial state notification
    setTimeout(() => {
      callback('INITIAL_SESSION', session);
    }, 0);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(l => l !== callback);
          }
        }
      }
    };
  }

  notifyListeners(event, session) {
    this.listeners.forEach(callback => callback(event, session));
  }
}

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Sprint connected successfully to Supabase backend.');
  } catch (err) {
    console.error('Failed to initialize Supabase. Switching to local mock client.', err);
    supabaseClient = {
      from: (table) => new MockSupabaseQueryBuilder(table),
      auth: new MockSupabaseAuth()
    };
  }
} else {
  console.warn('VITE_SUPABASE_URL/KEY variables are not set. Active Mock database and Auth initialized on localStorage.');
  supabaseClient = {
    from: (table) => new MockSupabaseQueryBuilder(table),
    auth: new MockSupabaseAuth()
  };
}

export const supabase = supabaseClient;
