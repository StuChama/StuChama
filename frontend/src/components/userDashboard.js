import React from 'react';
import './userDashboard.css';

const UserDashboard = () => {
  const chamaCards = Array.from({ length: 4 }, (_, index) =>
    React.createElement('div', { key: index, className: 'chama-card' })
  );

  return React.createElement(
    'div',
    { className: 'dashboard-container' },
    // Sidebar
    React.createElement(
      'div',
      { className: 'sidebar' },
      React.createElement('img', {
        src: '/path/to/profile.jpg',
        alt: 'User',
        className: 'profile-pic'
      }),
      React.createElement(
        'nav',
        { className: 'nav-links' },
        React.createElement(
          'button',
          { className: 'nav-button active' },
          React.createElement('span', { className: 'material-icons' }, 'home'),
          ' HOME'
        ),
        React.createElement(
          'button',
          { className: 'nav-button' },
          React.createElement('span', { className: 'material-icons' }, 'settings'),
          ' SETTINGS'
        ),
        React.createElement(
          'button',
          { className: 'nav-button' },
          React.createElement('span', { className: 'material-icons' }, 'logout'),
          ' LOGOUT'
        )
      )
    ),

    // Main Content
    React.createElement(
      'div',
      { className: 'main-content' },
      React.createElement(
        'button',
        { className: 'back-button' },
        React.createElement('span', { className: 'material-icons' }, 'undo'),
        ' BACK'
      ),
      React.createElement('h1', { className: 'main-title' }, 'MY CHAMAS'),
      React.createElement('div', { className: 'chamas-grid' }, ...chamaCards),
      React.createElement(
        'div',
        { className: 'action-buttons' },
        React.createElement('button', { className: 'action-btn' }, 'CREATE CHAMA'),
        React.createElement('button', { className: 'action-btn' }, 'JOIN CHAMA')
      )
    )
  );
};

export default UserDashboard;
