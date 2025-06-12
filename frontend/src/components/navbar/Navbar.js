import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.css'; // This is correct if you're using CSS modules

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">StuChama</Link>
      </div>

      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/events">Events</Link>
        <Link to="/resources">Resources</Link>

        {isAuthenticated ? (
          <Link to="/dashboard" className={styles.dashboardBtn}>Dashboard</Link>
        ) : (
          <>
            <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
            <Link to="/login" className={styles.loginBtn}>Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
