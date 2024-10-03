import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Task = ({ task, onToggle, onDelete }) => (
  <Card className="mb-2">
    <CardContent className="flex items-center justify-between">
      <div className="flex items-center">
        <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
        <span className={`ml-2 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.text}
        </span>
      </div>
      <Button variant="destructive" size="icon" onClick={() => onDelete(task.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Button>
    </CardContent>
  </Card>
);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('todoUsername');
    if (savedUsername) setUsername(savedUsername);
  }, []);

  useEffect(() => {
    if (username) localStorage.setItem('todoUsername', username);
  }, [username]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed && task.text.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'completed') return task.completed && task.text.toLowerCase().includes(searchTerm.toLowerCase());
    return task.text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto p-4 max-w-md sm:max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {username || 'Guest'}!</CardTitle>
          <Input 
            placeholder="Enter your name" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-2"
          />
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex">
            <Input 
              placeholder="Enter a new task" 
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addTask()}
              className="flex-grow mr-2"
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          <Input 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="flex mb-4">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="mr-2">All</Button>
            <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')} className="mr-2">Active</Button>
            <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')}>Completed</Button>
          </div>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <Task key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No tasks found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}