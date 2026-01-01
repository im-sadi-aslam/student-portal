import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
    course: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);
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
    
    // Validation
    if (!formData.fullName || !formData.studentId || !formData.email || !formData.password) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill all required fields',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
        background: '#0f172a',
        color: 'white'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Password Mismatch',
        text: 'Passwords do not match',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
        background: '#0f172a',
        color: 'white'
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        title: 'Weak Password',
        text: 'Password must be at least 6 characters',
        icon: 'warning',
        confirmButtonColor: '#3b82f6',
        background: '#0f172a',
        color: 'white'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonColor: '#3b82f6',
        background: '#0f172a',
        color: 'white'
      });
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        studentId: formData.studentId,
        course: formData.course || 'Not specified',
        semester: formData.semester || 'Not specified',
        createdAt: new Date().toISOString(),
        role: 'student',
        status: 'active'
      });

      // Success message
      Swal.fire({
        title: '🎉 Registration Successful!',
        html: `
          <div style="text-align: center; color: white;">
            <p>Welcome <strong>${formData.fullName}</strong>!</p>
            <p>Your student account has been created.</p>
            <p>Student ID: <strong>${formData.studentId}</strong></p>
          </div>
        `,
        icon: 'success',
        background: '#0f172a',
        color: 'white',
        confirmButtonText: 'Go to Dashboard',
        confirmButtonColor: '#10b981',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        }
      }).then(() => {
        navigate('/tasks');
      });

    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Swal.fire({
        title: 'Registration Failed',
        text: errorMessage,
        icon: 'error',
        background: '#0f172a',
        color: 'white',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Main Signup Form */}
        <div className="auth-card animate-slide-in">
          <div className="auth-header">
            <div className="auth-icon">📚</div>
            <h1>Student Registration</h1>
            <p className="auth-subtitle">Create your student account in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Student ID <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">🎫</span>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      placeholder="Enter student ID"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Course</label>
                  <div className="input-with-icon">
                    <span className="input-icon">📖</span>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="e.g., Computer Science"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Semester</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🎯</span>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                      <option value="3">Semester 3</option>
                      <option value="4">Semester 4</option>
                      <option value="5">Semester 5</option>
                      <option value="6">Semester 6</option>
                      <option value="7">Semester 7</option>
                      <option value="8">Semester 8</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="form-section">
              <h3 className="section-title">Account Information</h3>
              
              <div className="input-group">
                <label className="input-label">
                  Email Address <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">📧</span>
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
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Minimum 6 characters"
                      className="input-field"
                    />
                  </div>
                  <div className="input-hint">At least 6 characters</div>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">🔐</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="input-field"
                    />
                  </div>
                  <div className="input-hint">Must match password</div>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="form-section">
              <div className="checkbox-group">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p className="login-link">
              Already have an account? <Link to="/login" className="link">Login here</Link>
            </p>
            <p className="required-note">
              <span className="required">*</span> Required fields
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="features-title">Why Join Student Portal?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Access Courses</h3>
              <p>Get all course materials and resources in one place</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your academic journey with detailed analytics</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Guidance</h3>
              <p>Connect with professional teachers and mentors</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Earn Certificates</h3>
              <p>Get certified for your skills and achievements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;