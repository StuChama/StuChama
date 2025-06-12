import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <Navbar />

      <div className="home-container">
        <h1 className="home-title">Welcome to StuChama</h1>
        <p className="home-subtitle">Save smarter. Achieve goals together.</p>

        <div className="home-buttons">
          <Link to="/login">
            <button className="home-button login">Login</button>
          </Link>
          <Link to="/signup">
            <button className="home-button signup">Sign Up</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
