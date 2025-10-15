# 📋 Smart Task Planner

A modern task management web application built with **Node.js** and **vanilla JavaScript**. Organize tasks, track progress, and boost your productivity!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## ✨ Features

- ✅ Create, edit, and delete tasks with priorities
- 📊 Dashboard with real-time statistics
- 📅 Calendar view with color-coded tasks
- 🏷️ Custom categories with colors
- 🔍 Search and filter functionality
- 📱 Responsive mobile-friendly design

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+) - [Download](https://nodejs.org/)

### Installation

```bash
# Clone the repository
git clone https://github.com/M-HareeshBabu/smart-task-planner.git
cd smart-task-planner

# Install dependencies
npm install

# Start the server
npm start
```

**Or use the standalone server (no npm install needed):**
```bash
node server-standalone.js
```

Open your browser and go to `http://localhost:3000`

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, CORS, UUID, Node-cron  
**Frontend:** HTML5, CSS3, Vanilla JavaScript, Font Awesome

## 📁 Project Structure

```
smart-task-planner/
├── public/
│   ├── index.html        # Main HTML
│   ├── styles.css        # Styling
│   └── script.js         # Frontend logic
├── server.js             # Express server
├── server-standalone.js  # Standalone server (no dependencies)
└── package.json          # Dependencies
```

## 💡 Usage

1. **Add Task:** Click "Add Task" button and fill in details
2. **Edit Task:** Click edit icon on any task card
3. **Filter:** Use dropdowns to filter by status, priority, or category
4. **Categories:** Go to Settings to create custom categories

## 🔧 Configuration

Change the port by creating a `.env` file:
```env
PORT=3001
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/categories` | Get categories |
| GET | `/api/dashboard` | Get statistics |

## 🐛 Troubleshooting

**npm install fails?** → Use `node server-standalone.js`  
**Port in use?** → Change port in `.env` file  
**PowerShell error?** → Use Command Prompt instead

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👤 Author

**Hareesh Babu**
- GitHub: [@M-HareeshBabu](https://github.com/M-HareeshBabu)

---

**⭐ Star this repo if you find it useful!**
