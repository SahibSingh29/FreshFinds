// function TaskList() {
//   const [details, setDetails] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8000')  
//       .then(res => {
//         setDetails(res.data);
//       })
//       .catch(err => console.error("Error fetching data:", err));
//   }, []);

//   return (
//     <div>
//         <header>Data Generated From Django</header>
//         <hr />
//             {details.length > 0 ? (
//               details.map((output, id) => (
//                 <div key={id}>
//                   <h2>{output.employee}</h2>
//                   <h3>{output.department}</h3>
//                 </div>
//               ))
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>
//   );
// }

// export default TaskList;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./TaskList.css";

const API_URL = "http://localhost:8000/tasks/";

const TaskList = ({ onOverdueCountChange }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "", time: "" });

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);

      const overdueTasks = response.data.filter(task =>
        task.is_overdue && !task.completed
      );
      onOverdueCountChange(overdueTasks.length); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [onOverdueCountChange]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    if (!newTask.title || !newTask.date || !newTask.time) {
      alert("Please fill in all required fields!");
      return;
    }
    try {
      await axios.post(API_URL, { ...newTask, completed: false });
      fetchTasks();
      setNewTask({ title: "", description: "", date: "", time: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`${API_URL}${id}/`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div style={{  minHeight: '88vh' }}>
    <div className="task-container">
      <h2>Farmer's Task List</h2>

      <div className="task-input">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
        />
        <input
          type="time"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Date: {task.date}</p>
              <p>Time: {task.time}</p>
              {task.is_overdue && !task.completed && (
                <p style={{ color: "red", fontWeight: "bold" }}>Overdue!</p>
              )}
            </div>
            <div className="task-buttons">
              <button onClick={() => toggleComplete(task.id, task.completed)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default TaskList;
