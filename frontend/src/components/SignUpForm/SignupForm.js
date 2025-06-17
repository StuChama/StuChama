import { useState } from 'react';
import styles from './signup.module.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';



export default function SignupForm() {

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        formData
      );

      if (response.data) {
        
        
        toast.success("Signup successful!");
        navigate('/login');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Signup failed';
      toast.error(message);
      console.error(message);
    }
  };

  return (
    <div className={styles.signupPage}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h1 className={styles.title}>New to StuChama?</h1>
        <h2 className={styles.subtitle}>Sign Up</h2>

        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          name="phone_number"
          type="tel"
          placeholder="Phone Number (optional)"
          value={formData.phone_number}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Sign Up</button>

        <div className={styles.switch}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}
