// App.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', description: '', date: '', recurring: false });
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.name && newTask.date) {
      setTasks([...tasks, { ...newTask, id: Date.now(), status: 'pending' }]);
      setNewTask({ name: '', description: '', date: '', recurring: false });
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const markCompleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: 'completed' } : task
    ));
  };

  const checkDueTasks = () => {
    const now = new Date();
    setTasks(tasks.map(task => {
      if (new !== task.date && task.status === 'pending') {
        return { ...task, status: 'missed' };
      }
      return task;
    }));
  };

  useEffect(() => {
    const timer = setInterval(checkDueTasks, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [tasks]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Scheduler</h1>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={newTask.name} onChange={(e) => setNewTask({...newTask, name: e.target.value})} placeholder="Task Name" className="mb-2" />
            <Input value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="Description" className="mb-2" />
            <Input type="datetime-local" value={newTask.date} onChange={(e) => setNewTask({...newTask, date: e.target.value})} className="mb-2" />
            <Button onClick={addTask}>Add Task</Button>
          </CardContent>
        </Card>

        {/* Task List */}
        <div>
          {tasks.map(task => (
            <Card key={task.id} className="mb-2">
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
                <p>{format(new Date(task.date), 'Pp')}</p>
              </CardHeader>
              <CardContent>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
              </CardContent>
              <CardFooter>
                {task.status === 'pending' && <Button onClick={() => markCompleted(task.id)}>Complete</Button>}
                <Button onClick={() => deleteTask(task.id)} variant="destructive">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}