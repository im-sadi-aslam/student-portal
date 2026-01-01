import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import './Auth.css';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please enter both email and password',
        icon: 'warning',
        background: '#0f172a',
        color: 'white',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Success handled in App.jsx
    } catch (error) {
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }
      
      Swal.fire({
        title: 'Login Failed',
        text: errorMessage,
        icon: 'error',
        background: '#0f172a',
        color: 'white',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card animate-slide-in">
          {/* Welcome Section - FIXED */}
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h1 className="welcome-title">Welcome Back, Student!</h1>
            <p className="auth-subtitle">Login to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="student@university.edu"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="input-field"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="forgot-link">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="register-link">
              New here? <Link to="/signup" className="highlight-link">Create Account</Link>
            </p>
            
            <div className="social-login">
              <p className="social-text">Or continue with</p>
              <div className="social-buttons">
                <button type="button" className="social-btn google">
                  <span className="social-icon">G</span>
                  Google
                </button>
                <button type="button" className="social-btn microsoft">
                  <span className="social-icon">M</span>
                  Microsoft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - FIXED */}
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon-box">📚</div>
            <h3>Course Materials</h3>
            <p>Access all study materials</p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon-box">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey</p>
          </div>
          
          <div className="feature-box">
            <div className="feature-icon-box">🏆</div>
            <h3>Achievements</h3>
            <p>Unlock badges and rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;