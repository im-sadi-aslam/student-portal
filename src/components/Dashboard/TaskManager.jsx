import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './Dashboard.css';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksList = [];
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksList);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch tasks',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      await addDoc(collection(db, 'tasks'), {
        text: newTask,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        completed: false
      });
      setNewTask('');
      fetchTasks();
      Swal.fire({
        title: 'Success!',
        text: 'Task added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const deleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        fetchTasks();
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    }
  };

  const updateTask = async (taskId, completed) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !completed
      });
      fetchTasks();
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = async (taskId) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        text: editingText
      });
      setEditingTaskId(null);
      fetchTasks();
      Swal.fire('Updated!', 'Task updated successfully.', 'success');
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Task Management</h2>
      <div className="task-input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="task-input"
        />
        <button onClick={addTask} className="add-btn">Add Task</button>
      </div>
      
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            {editingTaskId === task.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(task.id)} className="save-btn">Save</button>
                <button onClick={() => setEditingTaskId(null)} className="cancel-btn">Cancel</button>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => updateTask(task.id, task.completed)}
                    className="task-checkbox"
                  />
                  <span className="task-text">{task.text}</span>
                </div>
                <div className="task-actions">
                  <button onClick={() => startEdit(task)} className="edit-btn">Edit</button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskManager;