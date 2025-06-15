import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import styles from './navbar.module.css';

const Navbar = () => {
  const { userToken, currentUser, clearToken, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    navigate('/');
  };

  const isAuthenticated = !!userToken && !!currentUser;

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
          <>
            <Link to="/dashboard" className={styles.dashboardBtn}>Dashboard</Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </>
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
