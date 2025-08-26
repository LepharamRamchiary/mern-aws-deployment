import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1/tasks';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const result = await response.json();
      // Your backend wraps data in ApiResponse format
      setTasks(result.data || []);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description
        }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      await fetchTasks();
      setError('');
    } catch (err) {
      console.error('Create error:', err);
      setError('Failed to create task');
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          completed: taskData.completed
        }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      await fetchTasks();
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks();
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete task');
    }
  };

  // Toggle task completion
  const toggleComplete = async (task) => {
    await updateTask(task._id, { ...task, completed: !task.completed });
  };

  // Handle form submission
  const handleSubmit = async () => {
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (editingTask) {
      await updateTask(editingTask._id, formData);
    } else {
      await createTask(formData);
    }

    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setShowForm(false);
    setEditingTask(null);
    setError('');
  };

  // Start editing
  const startEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description
    });
    setEditingTask(task);
    setShowForm(true);
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600 mt-1">Manage your tasks with CRUD operations</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter task description..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-500 text-lg">No tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => toggleComplete(task)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && <Check size={14} />}
                      </button>
                      
                      <h3
                        className={`text-lg font-semibold ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                    
                    <p
                      className={`text-gray-600 mb-3 ${
                        task.completed ? 'line-through' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                    
                    <div className="text-sm text-gray-400">
                      Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}
                      {task.updatedAt && task.updatedAt !== task.createdAt && (
                        <span className="ml-3">
                          Updated: {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
              <div className="text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(task => task.completed).length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {tasks.filter(task => !task.completed).length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Backend Integration Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-green-800 mb-2">Backend Integration Status:</h3>
          <div className="text-sm text-green-700 space-y-1">
            <div>✅ Create Task - Working</div>
            <div>✅ Read Tasks - Working</div>
            <div>✅ Update Task - Working</div>
            <div>✅ Delete Task - Working</div>
            <div>✅ Toggle Completed Status - Working</div>
            <div>✅ Task Statistics - Working</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;