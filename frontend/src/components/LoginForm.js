import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For routing
import './Auth.css';

export default function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data); // Pass logged-in user to App
      } else {
        alert('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Log In</button>
      <div className="switch">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </form>
  );
}
