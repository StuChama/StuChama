import React, { useState } from 'react';
import './Auth.css';

export default function SignupForm({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) onSignup(await res.json());
    else alert('Signup failed');
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>New to StuChama?</h1>
      <h2>Sign Up</h2>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={formData.name}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={formData.password}
        required
      />
      <label className="remember-me">
        <input
          type="checkbox"
          name="remember"
          checked={formData.remember}
          onChange={handleChange}
        />
        Remember Me
      </label>
      <button type="submit">Sign Up</button>
      <div className="switch">
        Already have an account? <a href="/login">Log In</a>
      </div>
    </form>
  );
}
