import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isConfigured } = useAuth();

  // Start in signup mode if navigated here from the "Sign up" button.
  const [mode, setMode] = useState(location.state?.mode === 'signup' ? 'signup' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!isConfigured) {
      setError('Login is not configured. Add your Supabase keys to the .env file.');
      return;
    }
    if (!email || !password) {
      setError('Please enter both an email and a password.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/');
      } else {
        const result = await signUp(email, password, name.trim());
        if (result.needsConfirmation) {
          setInfo('Account created! Check your email to confirm, then log in.');
          setMode('login');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button className={styles.back} onClick={() => navigate('/')}>← Home</button>
        <h1 className={styles.title}>
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </h1>
        <p className={styles.subtext}>
          {mode === 'login'
            ? 'Welcome back to the Tanaj Study Hub.'
            : 'Sign up to save your progress to the Tanaj Study Hub.'}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className={styles.label}>
              Name
              <input
                className={styles.input}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
          )}
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}
          {info && <div className={styles.info}>{info}</div>}

          <button className="nav-btn" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.toggle}>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                className={styles.linkBtn}
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setInfo('');
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                className={styles.linkBtn}
                onClick={() => {
                  setMode('login');
                  setError('');
                  setInfo('');
                }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
