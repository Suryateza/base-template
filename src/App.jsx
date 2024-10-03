import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
    const [username, setUsername] = useState("");
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");

    const addTask = () => {
        if (newTask.trim() === "") return;
        setTasks([...tasks, { text: newTask, completed: false }]);
        setNewTask("");
    };

    const toggleTaskCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const filteredTasks = tasks
        .filter((task) =>
            task.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((task) => {
            if (filter === "active") return !task.completed;
            if (filter === "completed") return task.completed;
            return true;
        });

    return (
        <div className="min-h-screen bg-indigo-500 flex flex-col items-center p-6">
            <Card className="w-full max-w-md bg-white shadow-md rounded-md p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Hello, {username || "Guest"}!</CardTitle>
                    <CardDescription className="mt-2">Manage your tasks efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="text"
                            placeholder="Enter a new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={addTask}
                            className="mt-2 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
                        >
                            Add Task
                        </button>
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search tasks"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        {filteredTasks.map((task, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between mb-2 p-2 border-b ${task.completed ? "bg-green-100" : ""}`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(index)}
                                        className="mr-3"
                                    />
                                    <span
                                        className={`${
                                            task.completed
                                                ? "line-through text-gray-500"
                                                : ""
                                        }`}
                                    >
                                        {task.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteTask(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <button
                        onClick={() => setFilter("all")}
                        className={` px-4 rounded-md ${
                            filter === "all" ? "bg-indigo-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={` px-4 ml-2 rounded-md ${
                            filter === "active" ? "bg-indigo-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Active Tasks
                    </button>
                    <button
                        onClick={() => setFilter("completed")}
                        className={` px-4 ml-2 rounded-md ${
                            filter === "completed" ? "bg-indigo-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        Completed Tasks
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
}
