import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key';

let supabaseClient;

const getTableDefaults = (table) => {
  return [];
};

// Reset old pre-seeded localStorage lists to start clean
['tasks', 'habits', 'events'].forEach(table => {
  const stored = localStorage.getItem(`sprint_${table}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.some(item => ['t1', 'h1', 'e1'].includes(item.id))) {
        localStorage.removeItem(`sprint_${table}`);
      }
    } catch (e) {
      localStorage.removeItem(`sprint_${table}`);
    }
  }
});

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
