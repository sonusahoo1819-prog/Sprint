import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Mail, Sparkles, AlertCircle, ArrowRight, UserPlus, LogIn, User } from 'lucide-react';
import { fireCelebration } from '../components/Celebration';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all credentials.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (isSignUp && (!firstName.trim() || !lastName.trim())) {
      setErrorMsg('First name and Last name are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        // Sign Up request with user metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              middle_name: middleName.trim() || null
            }
          }
        });
        if (error) throw error;
        fireCelebration(e.clientX, e.clientY);
      } else {
        // Sign In request
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        fireCelebration(e.clientX, e.clientY);
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FAF9F6 100%)',
      }}
    >
      {/* Background blobs for spatial visual depth */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'var(--gradient-blue-purple)',
          filter: 'blur(100px)',
          opacity: 0.12,
          top: '10%',
          right: '15%',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'var(--gradient-mint-cyan)',
          filter: 'blur(80px)',
          opacity: 0.12,
          bottom: '10%',
          left: '15%',
        }}
      />

      {/* Main glass authentication card */}
      <div 
        className="glass-panel float-slow"
        style={{
          width: '90%',
          maxWidth: '460px',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 32px 80px rgba(99, 102, 241, 0.06), inset 0 4px 12px rgba(255,255,255,0.7)',
          textAlign: 'center',
        }}
      >
        {/* Branding header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-blue)', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          <Sparkles size={14} />
          Sprint Workspace Auth
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {isSignUp ? 'Create your Workstation' : 'Sign in to Sprint'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '28px' }}>
          {isSignUp ? 'Get started with your personalized AI productivity companion.' : 'Enter your credentials to access your schedule planner.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Sign Up Details (First Name, Last Name, Middle Name) */}
          {isSignUp && (
            <>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <User size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="First name *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 44px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                    }}
                    required
                  />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <User size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Last name *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 44px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      outline: 'none',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ position: 'relative', width: '100%' }}>
                <User size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Middle name (optional)"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    outline: 'none',
                    fontSize: '0.88rem',
                    fontWeight: '500',
                  }}
                />
              </div>
            </>
          )}

          {/* Email field */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Mail size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255, 255, 255, 0.9)',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: '500',
              }}
              required
            />
          </div>

          {/* Password field */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Lock size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255, 255, 255, 0.9)',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: '500',
              }}
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontSize: '0.78rem', textAlign: 'left', background: 'rgba(239, 68, 68, 0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)' }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium glow-blue"
            style={{
              padding: '14px',
              fontSize: '0.9rem',
              borderRadius: '12px',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : isSignUp ? (
              <>
                <UserPlus size={16} /> Create Account
              </>
            ) : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle between modes */}
        <div style={{ marginTop: '24px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button 
                onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                style={{ color: 'var(--color-blue)', fontWeight: '700', background: 'none', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button 
                onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                style={{ color: 'var(--color-blue)', fontWeight: '700', background: 'none', textDecoration: 'underline' }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
