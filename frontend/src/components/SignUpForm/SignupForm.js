import React, { useState } from 'react';
import styles from './signup.module.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import validator from 'validator';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validator.isEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validator.isStrongPassword(formData.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        formData
      );

      if (response.data) {
        toast.success("Signup successful! Please log in");
        navigate('/login');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Signup failed';
      toast.error(message);
      
      // Set server errors if available
      if (error.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...error.response.data.errors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>New to StuChama?</h1>
        <h2 className={styles.subtitle}>Sign Up</h2>

        <div className={styles.formGroup}>
          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className={`${styles.input} ${errors.full_name ? styles.errorInput : ''}`}
          />
          {errors.full_name && <p className={styles.errorText}>{errors.full_name}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            name="phone_number"
            type="tel"
            placeholder="Phone Number (optional)"
            value={formData.phone_number}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
          />
          {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className={styles.switch}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}