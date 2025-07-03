// Navbar.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './navbar.module.css';

const Navbar = () => {
  const { userToken, currentUser, clearToken, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    navigate('/');
    setIsMenuOpen(false);
    setShowDropdown(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const scrollToHowItWorks = () => {
    setIsMenuOpen(false);
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAuthenticated = !!userToken && !!currentUser;

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">StuChama</Link>
      </div>

      <div className={styles.menuButton} onClick={toggleMenu}>
        <div className={`${styles.menuLine} ${isMenuOpen ? styles.line1 : ''}`}></div>
        <div className={`${styles.menuLine} ${isMenuOpen ? styles.line2 : ''}`}></div>
        <div className={`${styles.menuLine} ${isMenuOpen ? styles.line3 : ''}`}></div>
      </div>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <a onClick={scrollToHowItWorks} className={styles.navLink}>How It Works</a>

        {isAuthenticated ? (
          <div className={styles.profileDropdown} ref={dropdownRef}>
            <img
              src={currentUser?.profile_picture || 'https://i.pravatar.cc/150?img=8'}
              alt="Profile"
              className={styles.profileIcon}
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <Link to="/dashboard" onClick={() => { setIsMenuOpen(false); setShowDropdown(false); }}>
                  Dashboard
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/signup" className={styles.signupBtn} onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            <Link to="/login" className={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>Log In</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
