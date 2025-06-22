import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './login.module.css';
import { UserContext } from '../../context/UserContext';
import validator from 'validator';

export default function LoginForm() {
  const { setUserToken } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!validator.isEmail(credentials.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUserToken(data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        // Handle specific errors
        if (data.message === "Invalid email or password") {
          toast.error('Invalid email or password');
          setErrors({
            email: 'Invalid email or password',
            password: 'Invalid email or password'
          });
        } else {
          toast.error(data?.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Login error:', err.message);
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Welcome Back</h1>
        <h2 className={styles.subtitle}>Log In</h2>

        <div className={styles.formGroup}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </button>

        <div className={styles.switch}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
        <div className={styles.switch}>
          <Link to="/">Back</Link>
        </div>
      </form>
    </div>
  );
}