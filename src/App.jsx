import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Classes from './pages/Classes';
import YTTC from './pages/YTTC';
import Events from './pages/Events';
import Login from './pages/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Fetching SQLite data from your Node.js backend
  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        {/* Pass the tasks as props to the Home component */}
        <Route path="/" element={<Home tasks={tasks} />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/yttc" element={<YTTC />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        
        {/* Example: A dedicated route just to see the SQLite tasks */}
        <Route path="/tasks" element={
          <div style={{ padding: '20px' }}>
            <h1>Tasks from SQLite</h1>
            {tasks.length > 0 ? (
              tasks.map(task => <p key={task.id}>{task.content}</p>)
            ) : (
              <p>No tasks found.</p>
            )}
          </div>
        } />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
  