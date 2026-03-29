import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { AuthResponse } from '../types';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await client.post<AuthResponse>('/auth/login', { username, password });
      await login(data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '0.5rem' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem' }}>Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
