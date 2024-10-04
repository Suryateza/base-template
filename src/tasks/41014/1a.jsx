import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Input, Label, Select, SelectItem, Checkbox
} from "@/components/ui";
import { format, addMinutes } from 'date-fns';

// Utility function to handle notifications
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

function notifyUser(task) {
  if (Notification.permission === 'granted') {
    new Notification(`Task Due: ${task.name}`, {
      body: task.description,
    });
  }
}

// Task component
function Task({ task, onEdit, onDelete, onComplete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Due: {format(new Date(task.date), 'Pp')}</p>
        <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onEdit(task)}>Edit</Button>
        <Button onClick={() => onDelete(task.id)} variant="destructive">Delete</Button>
        {!task.completed && <Button onClick={() => onComplete(task.id)}>Mark Completed</Button>}
      </CardFooter>
    </Card>
  );
}

// Main App Component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', description: '', date: '', recurring: false });
  const [filter, setFilter] = useState({ status: 'all', search: '' });

  useEffect(() => {
    requestNotificationPermission();
    const interval = setInterval(() => {
      const now = new Date();
      setTasks(currentTasks => 
        currentTasks.map(task => {
          if (!task.completed && new Date(task.date) <= now) {
            notifyUser(task);
            return { ...task, missed: true };
          }
          return task;
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false, missed: false }]);
    setNewTask({ name: '', description: '', date: '', recurring: false });
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completeTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: true } : task));
  };

  const filteredTasks = tasks.filter(task => 
    (filter.status === 'all' || 
     (filter.status === 'completed' && task.completed) || 
     (filter.status === 'pending' && !task.completed && !task.missed) ||
     (filter.status === 'missed' && task.missed)) &&
    (task.name.toLowerCase().includes(filter.search.toLowerCase()) || 
     task.description.toLowerCase().includes(filter.search.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={newTask.name} 
            onChange={e => setNewTask({...newTask, name: e.target.value})} 
            placeholder="Task Name" 
            className="mb-2"
          />
          <Input 
            value={newTask.description} 
            onChange={e => setNewTask({...newTask, description: e.target.value})} 
            placeholder="Description" 
            className="mb-2"
          />
          <Input 
            type="datetime-local" 
            value={newTask.date} 
            onChange={e => setNewTask({...newTask, date: e.target.value})} 
            className="mb-2"
          />
          <Checkbox 
            checked={newTask.recurring} 
            onCheckedChange={checked => setNewTask({...newTask, recurring: checked})}
          >
            Recurring
          </Checkbox>
          <Button onClick={addTask} className="mt-2">Add Task</Button>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Input 
          placeholder="Search tasks..." 
          value={filter.search}
          onChange={e => setFilter({...filter, search: e.target.value})}
          className="mb-2"
        />
        <Select onValueChange={value => setFilter({...filter, status: value})}>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="missed">Missed</SelectItem>
        </Select>
      </div>

      <div className="mt-4">
        {filteredTasks.map(task => (
          <Task 
            key={task.id} 
            task={task} 
            onEdit={updateTask} 
            onDelete={deleteTask} 
            onComplete={completeTask} 
          />
        ))}
      </div>
    </div>
  );
}