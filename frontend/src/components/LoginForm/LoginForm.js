import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './login.module.css';

export default function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        const errorData = await res.json();
        const message = errorData?.message || 'Invalid email or password';
        toast.error(message);
      }
    } catch (err) {
      console.error('Login error:', err.message);
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Welcome Back</h1>
        <h2 className={styles.subtitle}>Log In</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Log In</button>

        <div className={styles.switch}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
