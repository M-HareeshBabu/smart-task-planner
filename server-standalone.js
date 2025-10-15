const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// In-memory storage for tasks
let tasks = [];
let categories = [
  { id: 'work', name: 'Work', color: '#3498db' },
  { id: 'personal', name: 'Personal', color: '#e74c3c' },
  { id: 'health', name: 'Health', color: '#2ecc71' },
  { id: 'education', name: 'Education', color: '#f39c12' },
  { id: 'finance', name: 'Finance', color: '#9b59b6' }
];

// Helper function to generate UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res, pathname, method, parsedUrl.query);
    return;
  }

  // Serve static files
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, 'public', filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Handle API requests
function handleApiRequest(req, res, pathname, method, query) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let requestBody = {};
    if (body) {
      try {
        requestBody = JSON.parse(body);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }

    // Route handling
    if (pathname === '/api/tasks' && method === 'GET') {
      sendJson(res, 200, tasks);
    } 
    else if (pathname === '/api/tasks' && method === 'POST') {
      const newTask = {
        id: generateId(),
        title: requestBody.title,
        description: requestBody.description || '',
        priority: requestBody.priority || 'medium',
        status: requestBody.status || 'pending',
        category: requestBody.category || 'personal',
        dueDate: requestBody.dueDate || null,
        estimatedTime: requestBody.estimatedTime || null,
        actualTime: 0,
        progress: requestBody.progress || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reminders: [],
        subtasks: []
      };
      tasks.push(newTask);
      sendJson(res, 201, newTask);
    }
    else if (pathname.match(/^\/api\/tasks\/[\w-]+$/) && method === 'GET') {
      const id = pathname.split('/').pop();
      const task = tasks.find(t => t.id === id);
      if (task) {
        sendJson(res, 200, task);
      } else {
        sendJson(res, 404, { error: 'Task not found' });
      }
    }
    else if (pathname.match(/^\/api\/tasks\/[\w-]+$/) && method === 'PUT') {
      const id = pathname.split('/').pop();
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = {
          ...tasks[taskIndex],
          ...requestBody,
          updatedAt: new Date().toISOString()
        };
        sendJson(res, 200, tasks[taskIndex]);
      } else {
        sendJson(res, 404, { error: 'Task not found' });
      }
    }
    else if (pathname.match(/^\/api\/tasks\/[\w-]+$/) && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        res.writeHead(204);
        res.end();
      } else {
        sendJson(res, 404, { error: 'Task not found' });
      }
    }
    else if (pathname === '/api/categories' && method === 'GET') {
      sendJson(res, 200, categories);
    }
    else if (pathname === '/api/categories' && method === 'POST') {
      const newCategory = {
        id: requestBody.name.toLowerCase().replace(/\s+/g, '-'),
        name: requestBody.name,
        color: requestBody.color || '#95a5a6'
      };
      categories.push(newCategory);
      sendJson(res, 201, newCategory);
    }
    else if (pathname === '/api/dashboard' && method === 'GET') {
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
      sendJson(res, 200, stats);
    }
    else {
      sendJson(res, 404, { error: 'Route not found' });
    }
  });
}

// Helper to send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Start server
server.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 Smart Task Planner Server Started!');
  console.log('========================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('========================================');
});

// Handle errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other application or use a different port.`);
  } else {
    console.error('Server error:', err);
  }
});

module.exports = server;
