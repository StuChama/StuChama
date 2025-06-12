import React, { useState } from 'react';
import './Auth.css';

export default function SignupForm({ onSignup }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const data = await res.json();
      onSignup(data);
    } else {
      alert('Signup failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>New to StuChama?</h1>
      <h2>Sign Up</h2>

      <input
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="phone_number"
        type="tel"
        placeholder="Phone Number (optional)"
        value={formData.phone_number}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>

      <div className="switch">
        Already have an account? <a href="/login">Log In</a>
      </div>
    </form>
  );
}
