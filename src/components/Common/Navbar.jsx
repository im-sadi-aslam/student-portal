import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/tasks', icon: '📝', label: 'Tasks' },
    { path: '/attendance', icon: '📊', label: 'Attendance' },
    { path: '/teachers', icon: '👨‍🏫', label: 'Teachers' },
  ];

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <div className="logo-icon">🎓</div>
          <div>
            <h1 className="logo-text">Student Portal</h1>
            <p className="logo-sub">Smart Learning Platform</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* User Info */}
        <div className="user-section">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p className="user-name">Student</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            <span className="logout-icon">↩</span>
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="mobile-user-info">
            <p>Logged in as: {user?.email}</p>
            <button onClick={onLogout} className="mobile-logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;