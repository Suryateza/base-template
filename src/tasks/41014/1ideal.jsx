import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Task Component to display individual tasks
const Task = ({ task, editTask, deleteTask, completeTask, showCompleteButton, showEditButton }) => {
    return (
        <Card className="mb-4 bg-blue-100 rounded-lg shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">{task.name}</CardTitle>
                <CardDescription className="text-gray-600">{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">Scheduled Time: {task.date}</p>
                <p className="text-sm text-gray-500">Status: {task.completed ? "Completed" : task.incomplete ? "Incomplete" : "Pending"}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                {showCompleteButton && (
                    <button
                        onClick={completeTask}
                        className={`bg-green-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-green-500 ${task.incomplete ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={task.incomplete}
                    >
                        Mark as Completed
                    </button>
                )}
                {showEditButton && (
                    <div>
                        <button
                            onClick={editTask}
                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 transition duration-200 hover:bg-yellow-400"
                        >
                            Edit
                        </button>
                        <button
                            onClick={deleteTask}
                            className="bg-red-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-red-500"
                        >
                            Delete
                        </button>
                    </div>
                )}
                {/* Always show Delete button for Incomplete Tasks */}
                {!showEditButton && (
                    <button
                        onClick={deleteTask}
                        className="bg-red-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-red-500"
                    >
                        Delete
                    </button>
                )}
            </CardFooter>
        </Card>
    );
};

// Modal Component to display search results
const Modal = ({ isOpen, onClose, tasks }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <div>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div key={index} className="mb-2">
                                <h3 className="font-bold">{task.name}</h3>
                                <p className="text-gray-600">{task.description}</p>
                                <p className="text-sm text-gray-500">Scheduled Time: {task.date}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No tasks found.</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-600 text-white px-3 py-1 rounded transition duration-200 hover:bg-blue-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Main App Component
export default function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ name: "", description: "", date: "" });
    const [editingIndex, setEditingIndex] = useState(null);
    const [search, setSearch] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
    const [searchResults, setSearchResults] = useState([]); // State for search results

    // Add or Edit Task
    const addTask = () => {
        if (editingIndex !== null) {
            const updatedTasks = tasks.map((task, index) =>
                index === editingIndex ? { ...newTask, completed: false, incomplete: false } : task
            );
            setTasks(updatedTasks);
        } else {
            setTasks([...tasks, { ...newTask, completed: false, incomplete: false }]);
        }
        setNewTask({ name: "", description: "", date: "" });
        setEditingIndex(null);
    };

    // Edit Task
    const editTask = (index) => {
        setNewTask(tasks[index]);
        setEditingIndex(index);
    };

    // Delete Task
    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
        setCompletedTasks(completedTasks.filter((_, i) => i !== index));
        setIncompleteTasks(incompleteTasks.filter((_, i) => i !== index));
    };

    // Complete Task
    const completeTask = (index) => {
        const taskToComplete = tasks[index];
        taskToComplete.completed = true;
        taskToComplete.incomplete = false; // Mark as complete
        setTasks(tasks.filter((_, i) => i !== index));
        setCompletedTasks([...completedTasks, taskToComplete]);
    };

    // Check for overdue tasks and alert the user
    useEffect(() => {
        const checkOverdueTasks = () => {
            const now = new Date();
            const overdueTasks = [];
            const remainingTasks = [];

            tasks.forEach((task) => {
                const taskTime = new Date(task.date); // Convert the task date to a Date object

                if (!task.completed && !task.incomplete && taskTime <= now) {
                    overdueTasks.push(task);
                    alert(`Task "${task.name}" is overdue!`);
                    task.incomplete = true; // Mark task as incomplete
                } else {
                    remainingTasks.push(task);
                }
            });

            if (overdueTasks.length > 0) {
                setIncompleteTasks((prev) => [...prev, ...overdueTasks]);
                setTasks(remainingTasks);
            }
        };

        // Set an interval to check tasks every second
        const intervalId = setInterval(checkOverdueTasks, 1000);

        // Clear the interval on cleanup
        return () => clearInterval(intervalId);
    }, [tasks]);

    // Filter tasks by search term
    const filteredTasks = tasks.filter(
        (task) =>
            task.name.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase())
    );

    // Open modal with search results
    const handleSearch = () => {
        setSearchResults(filteredTasks);
        setModalOpen(true);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Task Scheduler</h1>

            {/* Task Form */}
            <div className="mb-6 bg-white p-5 rounded-lg shadow-lg">
                <input
                    type="text"
                    placeholder="Task Name"
                    className="block w-full p-3 mb-3 border border-gray-300 rounded-lg"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
                <textarea
                    placeholder="Task Description"
                    className="block w-full p-3 mb-3 border border-gray-300 rounded-lg"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <input
                    type="datetime-local"
                    className="block w-full p-3 mb-3 border border-gray-300 rounded-lg"
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                />
                <button
                    onClick={addTask}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg transition duration-200 hover:bg-blue-500"
                >
                    {editingIndex !== null ? "Update Task" : "Add Task"}
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Tasks"
                    className="block w-full p-3 mb-3 border border-gray-300 rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg transition duration-200 hover:bg-blue-500"
                >
                    Search
                </button>
            </div>

            {/* Tasks Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Tasks */}
                <div className="border rounded-lg bg-white shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-blue-500 mt-5 mb-4">Active Tasks</h2>
                    <div className="space-y-4 p-3">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task, index) => (
                                <Task
                                    key={index}
                                    task={task}
                                    editTask={() => editTask(index)}
                                    deleteTask={() => deleteTask(index)}
                                    completeTask={() => completeTask(index)}
                                    showCompleteButton={!task.incomplete} // Show complete button only for active tasks
                                    showEditButton={true} // Show edit button for active tasks
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No active tasks found.</p>
                        )}
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="border rounded-lg bg-white shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-green-500 mt-5 mb-4">Completed Tasks</h2>
                    <div className="space-y-4 p-3">
                        {completedTasks.length > 0 ? (
                            completedTasks.map((task, index) => (
                                <Task
                                    key={index}
                                    task={task}
                                    showCompleteButton={false} // No complete button for completed tasks
                                    showEditButton={false} // No edit button for completed tasks
                                    deleteTask={() => deleteTask(index)} // Allow delete from completed tasks
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No completed tasks.</p>
                        )}
                    </div>
                </div>

                {/* Incomplete Tasks */}
                <div className="border rounded-lg bg-white shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-red-500 mt-5 mb-4">Incomplete Tasks</h2>
                    <div className="space-y-4 p-3">
                        {incompleteTasks.length > 0 ? (
                            incompleteTasks.map((task, index) => (
                                <Task
                                    key={index}
                                    task={task}
                                    showCompleteButton={false} // No complete button for incomplete tasks
                                    showEditButton={false} // No edit button for incomplete tasks
                                    deleteTask={() => deleteTask(index)} // Allow delete from incomplete tasks
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No incomplete tasks.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Search Results */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} tasks={searchResults} />
        </div>
    );
}
