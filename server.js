const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for tasks (in production, use a proper database)
let tasks = [];
let categories = [
  { id: 'work', name: 'Work', color: '#3498db' },
  { id: 'personal', name: 'Personal', color: '#e74c3c' },
  { id: 'health', name: 'Health', color: '#2ecc71' },
  { id: 'education', name: 'Education', color: '#f39c12' },
  { id: 'finance', name: 'Finance', color: '#9b59b6' }
];

// Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority, dueDate, category, estimatedTime } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    priority: priority || 'medium',
    status: 'pending',
    category: category || 'personal',
    dueDate: dueDate || null,
    estimatedTime: estimatedTime || null,
    actualTime: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [],
    subtasks: []
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Get all categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Create new category
app.post('/api/categories', (req, res) => {
  const { name, color } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const newCategory = {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    color: color || '#95a5a6'
  };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// Get dashboard stats
app.get('/api/dashboard', (req, res) => {
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    todayTasks: tasks.filter(t => {
      if (!t.dueDate) return false;
      const today = new Date().toDateString();
      return new Date(t.dueDate).toDateString() === today;
    }).length,
    categoryStats: categories.map(cat => ({
      category: cat.name,
      count: tasks.filter(t => t.category === cat.id).length,
      color: cat.color
    }))
  };

  res.json(stats);
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Schedule daily reminder check (runs every hour)
cron.schedule('0 * * * *', () => {
  const now = new Date();
  tasks.forEach(task => {
    if (task.dueDate && task.status !== 'completed') {
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursUntilDue = Math.ceil(timeDiff / (1000 * 3600));
      
      // You can implement notification logic here
      if (hoursUntilDue === 24 || hoursUntilDue === 1) {
        console.log(`Reminder: Task "${task.title}" is due in ${hoursUntilDue} hour(s)`);
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Smart Task Planner server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});

module.exports = app;
