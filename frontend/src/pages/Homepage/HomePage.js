// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <Navbar />
      
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Save Together, Succeed Together</h1>
          <p className="hero-subtitle">Join Student Chama Groups for Financial Growth</p>
        </div>

        {/* How it Works Section */}
        <div id="how-it-works" className="how-it-works">
          <h2 className="section-title">HOW STUCHAMA WORKS</h2>
          
          <div className="steps-container">
            <div className="step-card">
              <h3 className="step-title">REGISTER</h3>
              <p className="step-description">Sign up as a student with your name, email, and phone number.</p>
            </div>
            
            <div className="step-card">
              <h3 className="step-title">FORM OR JOIN GROUP</h3>
              <p className="step-description">Create a new group or join an existing one with a group code.</p>
            </div>
            
            <div className="step-card">
              <h3 className="step-title">SET GOALS AND CONTRIBUTE</h3>
              <p className="step-description">Define saving targets, contribute regularly, and track progress.</p>
            </div>
            
            <div className="step-card">
              <h3 className="step-title">TRACK AND MANAGE</h3>
              <p className="step-description">View reports, track contributions, download statements, and manage group rules transparently.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="home-buttons">
            <Link to="/signup">
              <button className="home-button signup">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="home-button login">Log In</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;