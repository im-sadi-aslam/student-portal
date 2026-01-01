import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './Teachers.css';

function TeacherSelection() {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [studentInfo, setStudentInfo] = useState({
    fullName: '',
    studentId: '',
    email: '',
    course: '',
    semester: ''
  });

  // Mock teacher data
  const teachers = [
    { id: 1, name: 'Dr. John Smith', subject: 'Mathematics', email: 'john.smith@university.edu' },
    { id: 2, name: 'Prof. Sarah Johnson', subject: 'Physics', email: 'sarah.j@university.edu' },
    { id: 3, name: 'Dr. Michael Brown', subject: 'Computer Science', email: 'm.brown@university.edu' },
    { id: 4, name: 'Prof. Emily Davis', subject: 'Chemistry', email: 'emily.d@university.edu' },
    { id: 5, name: 'Dr. Robert Wilson', subject: 'Biology', email: 'r.wilson@university.edu' },
    { id: 6, name: 'Prof. Lisa Anderson', subject: 'English Literature', email: 'l.anderson@university.edu' }
  ];

  const handleTeacherSelect = async () => {
    if (!selectedTeacher) {
      Swal.fire('Error!', 'Please select a teacher', 'error');
      return;
    }

    try {
      const teacher = teachers.find(t => t.id === parseInt(selectedTeacher));
      
      await addDoc(collection(db, 'teacherSelections'), {
        userId: auth.currentUser.uid,
        teacherId: teacher.id,
        teacherName: teacher.name,
        studentName: studentInfo.fullName || auth.currentUser.email,
        selectedAt: new Date().toISOString()
      });

      Swal.fire({
        title: 'Success!',
        html: `
          <div style="text-align: left;">
            <p><strong>Teacher Selected:</strong> ${teacher.name}</p>
            <p><strong>Subject:</strong> ${teacher.subject}</p>
            <p><strong>Email:</strong> ${teacher.email}</p>
            <p><strong>Your Selection has been recorded!</strong></p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="teachers-container">
      <h2>Teacher Selection Portal</h2>
      
      <div className="student-info-form">
        <h3>Student Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>Full Name</label>
            <input
              type="text"
              value={studentInfo.fullName}
              onChange={(e) => setStudentInfo({...studentInfo, fullName: e.target.value})}
              placeholder="Your full name"
            />
          </div>
          <div className="info-item">
            <label>Student ID</label>
            <input
              type="text"
              value={studentInfo.studentId}
              onChange={(e) => setStudentInfo({...studentInfo, studentId: e.target.value})}
              placeholder="Student ID"
            />
          </div>
          <div className="info-item">
            <label>Email</label>
            <input
              type="email"
              value={studentInfo.email}
              onChange={(e) => setStudentInfo({...studentInfo, email: e.target.value})}
              placeholder="Email address"
            />
          </div>
          <div className="info-item">
            <label>Course</label>
            <input
              type="text"
              value={studentInfo.course}
              onChange={(e) => setStudentInfo({...studentInfo, course: e.target.value})}
              placeholder="Course name"
            />
          </div>
          <div className="info-item">
            <label>Semester</label>
            <select
              value={studentInfo.semester}
              onChange={(e) => setStudentInfo({...studentInfo, semester: e.target.value})}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="teacher-selection">
        <h3>Select Your Teacher</h3>
        <div className="teachers-grid">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id}
              className={`teacher-card ${selectedTeacher == teacher.id ? 'selected' : ''}`}
              onClick={() => setSelectedTeacher(teacher.id)}
            >
              <div className="teacher-avatar">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="teacher-info">
                <h4>{teacher.name}</h4>
                <p className="subject">{teacher.subject}</p>
                <p className="email">{teacher.email}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="selection-actions">
          <button 
            onClick={handleTeacherSelect}
            className="select-teacher-btn"
            disabled={!selectedTeacher}
          >
            Select Teacher
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherSelection;