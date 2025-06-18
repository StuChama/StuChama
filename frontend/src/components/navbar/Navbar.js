// Navbar.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './navbar.module.css';

const Navbar = () => {
  const { userToken, currentUser, clearToken, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToHowItWorks = () => {
    setIsMenuOpen(false);
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAuthenticated = !!userToken && !!currentUser;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">StuChama</Link>
      </div>

      {/* Mobile menu button */}
      <div className={styles.menuButton} onClick={toggleMenu}>
        <div className={`${styles.menuLine} ${isMenuOpen ? styles.line1 : ''}`}></div>
        <div className={`${styles.menuLine} ${isMenuOpen ? styles.line2 : ''}`}></div>
        <div className={`${styles.menuLine} ${isMenuOpen ? styles.line3 : ''}`}></div>
      </div>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        
        {/* How It Works link */}
        <a onClick={scrollToHowItWorks} className={styles.navLink}>
          How It Works
        </a>

        {isAuthenticated ? (
          <div className={styles.authLinks}>
            <Link to="/dashboard" className={styles.dashboardBtn} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link to="/signup" className={styles.signupBtn} onClick={() => setIsMenuOpen(false)}>
              Sign Up
            </Link>
            <Link to="/login" className={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>
              Log In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;