import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import Swal from 'sweetalert2';
import Navbar from './components/Common/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import TaskManager from './components/Dashboard/TaskManager';
import Attendance from './components/Dashboard/Attendance';
import TeacherSelection from './components/Teachers/TeacherSelection';
import PrivateRoute from './components/Common/PrivateRoute';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        Swal.fire({
          title: 'Login Successful!',
          text: `Welcome to Student Portal`,
          icon: 'success',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#4CAF50',
          timer: 2000,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    });

    if (result.isConfirmed) {
      try {
        await auth.signOut();
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2196F3'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Student Portal...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/tasks" : "/login"} />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/tasks" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/tasks" />} />
            <Route path="/tasks" element={<PrivateRoute user={user}><TaskManager /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute user={user}><Attendance /></PrivateRoute>} />
            <Route path="/teachers" element={<PrivateRoute user={user}><TeacherSelection /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;