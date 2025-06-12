import React, { useState } from 'react';
import './Auth.css';

export default function SignupForm({ onSignup }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  return React.createElement(
    'form',
    { className: 'auth-form', onSubmit: handleSubmit },
    React.createElement('h1', null, 'New to StuChama?'),
    React.createElement('h2', null, 'Sign Up'),

    React.createElement('input', {
      name: 'full_name',
      placeholder: 'Full Name',
      onChange: handleChange,
      value: formData.full_name,
      required: true
    }),

    React.createElement('input', {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      onChange: handleChange,
      value: formData.email,
      required: true
    }),

    React.createElement('input', {
      name: 'phone_number',
      type: 'tel',
      placeholder: 'Phone Number (optional)',
      onChange: handleChange,
      value: formData.phone_number
    }),

    React.createElement('input', {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      onChange: handleChange,
      value: formData.password,
      required: true
    }),

    React.createElement('button', { type: 'submit' }, 'Sign Up'),

    React.createElement(
      'div',
      { className: 'switch' },
      'Already have an account? ',
      React.createElement('a', { href: '/login' }, 'Log In')
    )
  );
}
