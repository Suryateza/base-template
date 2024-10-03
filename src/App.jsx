import React, { useState, useEffect } from 'react';
import { Input, Button, Checkbox } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [username, setUsername] = useState('User'); // Placeholder for username

  useEffect(() => {
    // Here you might fetch tasks from an API or local storage
  }, []);

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return task.text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Welcome, {username}!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task" 
              className="flex-grow mr-2"
            />
            <Button onClick={addTask}>Add Task</Button>
          </div>
          <Input 
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="flex mb-4">
            <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
            <Button variant={filter === 'active' ? 'default' : 'outline'} onClick={() => setFilter('active')} className="ml-2">Active</Button>
            <Button variant={filter === 'completed' ? 'default' : 'outline'} onClick={() => setFilter('completed')} className="ml-2">Completed</Button>
          </div>
          <ul>
            {filteredTasks.map(task => (
              <li key={task.id} className="flex items-center mb-2">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTask(task.id)} 
                />
                <span className={`ml-2 flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.text}
                </span>
                <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)} className="ml-2">
                  ❌
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;