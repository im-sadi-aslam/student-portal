import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './Dashboard.css';

function Attendance() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, 'students'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const studentsList = [];
      querySnapshot.forEach((doc) => {
        studentsList.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentsList);
      
      // Initialize attendance state
      const initialAttendance = {};
      studentsList.forEach(student => {
        initialAttendance[student.id] = student.attendance || 'absent';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addStudent = async () => {
    if (!studentName.trim()) {
      Swal.fire('Error!', 'Please enter student name', 'error');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: studentName,
        userId: auth.currentUser.uid,
        attendance: 'absent',
        createdAt: new Date().toISOString()
      });
      
      setStudentName('');
      fetchStudents();
      Swal.fire('Success!', 'Student added successfully', 'success');
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, {
        attendance: status,
        markedAt: new Date().toISOString()
      });
      
      setAttendance(prev => ({
        ...prev,
        [studentId]: status
      }));
      
      Swal.fire('Success!', `Attendance marked as ${status}`, 'success');
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Student Attendance</h2>
      
      <div className="add-student-container">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          className="student-input"
        />
        <button onClick={addStudent} className="add-btn">Add Student</button>
      </div>
      
      <div className="students-list">
        <h3>Student List</h3>
        {students.length === 0 ? (
          <p className="no-data">No students added yet</p>
        ) : (
          students.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-info">
                <span className="student-name">{student.name}</span>
                <span className={`attendance-status ${attendance[student.id]}`}>
                  {attendance[student.id] || 'Not Marked'}
                </span>
              </div>
              <div className="attendance-buttons">
                <button 
                  onClick={() => markAttendance(student.id, 'present')}
                  className={`present-btn ${attendance[student.id] === 'present' ? 'active' : ''}`}
                >
                  Present
                </button>
                <button 
                  onClick={() => markAttendance(student.id, 'absent')}
                  className={`absent-btn ${attendance[student.id] === 'absent' ? 'active' : ''}`}
                >
                  Absent
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper function to update document
async function updateDoc(docRef, data) {
  const { updateDoc } = await import('firebase/firestore');
  return updateDoc(docRef, data);
}

export default Attendance;