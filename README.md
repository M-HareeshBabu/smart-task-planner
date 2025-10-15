# 📋 Smart Task Planner

A modern, feature-rich task management web application built with Node.js backend and vanilla JavaScript frontend. Organize your tasks, boost productivity, and manage your time effectively!

![Smart Task Planner](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

## ✨ Features

### � **Dashboard**
- Real-time task statistics and overview
- Today's tasks at a glance
- High priority task tracking
- Category-wise task distribution
- Visual progress indicators

### ✅ **Task Management**
- Create, edit, and delete tasks
- Set priorities (High, Medium, Low)
- Add due dates and time estimates
- Track progress with percentage completion
- Categorize with custom categories
- Search and filter functionality
- Multiple sort options

### 📅 **Calendar View**
- Monthly calendar with task visualization
- Color-coded tasks by category
- Navigate between months
- Quick date-based task overview

### 📈 **Analytics**
- Productivity trends (coming soon)
- Time distribution analytics (coming soon)
- Task completion insights

### ⚙️ **Customization**
- Create custom categories with colors
- Flexible filtering and sorting
- Responsive mobile-friendly design
- Dark mode support (coming soon)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 14.0 or higher) - [Download here](https://nodejs.org/)
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-task-planner.git
   cd smart-task-planner
   ```

2. **Install dependencies** (if npm is working)
   ```bash
   npm install
   ```

3. **Start the server**
   
   **Option A:** Using npm (recommended)
   ```bash
   npm start
   ```
   
   **Option B:** Using the standalone server (no dependencies required)
   ```bash
   node server-standalone.js
   ```
   
   **Option C:** Development mode with auto-reload
   ```bash
   npm run dev
   ```

4. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
smart-task-planner/
├── public/                    # Frontend files
│   ├── index.html            # Main HTML file
│   ├── styles.css            # CSS styling
│   └── script.js             # JavaScript functionality
├── server.js                 # Express server (requires npm packages)
├── server-standalone.js      # Standalone server (no dependencies)
├── package.json              # Project dependencies
├── .env.example             # Environment variables template
├── README.md                # This file
├── INSTALLATION.md          # Detailed installation guide
├── install.bat              # Windows installer script
├── install.ps1              # PowerShell installer script
├── start.bat                # Windows start script
└── start-dev.bat            # Windows development script
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique ID generation
- **Node-cron** - Task scheduling

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography

## 🎯 Usage Guide

### Creating a Task
1. Click the **"Add Task"** button in the header
2. Fill in the task details:
   - **Title** (required)
   - Description
   - Priority level
   - Category
   - Due date
   - Estimated time
   - Status
   - Progress percentage
3. Click **"Save Task"**

### Managing Tasks
- **Edit**: Click the edit icon on any task card
- **Delete**: Click the delete icon on any task card
- **Filter**: Use the dropdown filters to view specific tasks
- **Search**: Use the search box to find tasks by title or description
- **Sort**: Change sorting order (by date, priority, title)

### Using Categories
1. Navigate to **Settings**
2. View existing categories
3. Click **"Add Category"** to create new ones
4. Choose a name and color for your category
5. Use categories when creating or editing tasks

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```env
PORT=3000
NODE_ENV=development
```

### Changing the Port

If port 3000 is already in use, you can change it:

1. Edit the `.env` file and set `PORT=3001` (or any available port)
2. Or set it temporarily: `PORT=3001 node server.js`

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## 🐛 Troubleshooting

### npm Install Fails

If you encounter npm installation issues:
1. Use the **standalone server**: `node server-standalone.js`
2. Or reinstall Node.js from [nodejs.org](https://nodejs.org/)

### Port Already in Use

```bash
# Change the port in .env file or run:
PORT=3001 node server.js
```

### PowerShell Execution Policy Error

Use Command Prompt instead, or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🚧 Roadmap

- [ ] User authentication and multi-user support
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Task collaboration and sharing
- [ ] Advanced analytics with charts
- [ ] Mobile app (React Native)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Recurring tasks
- [ ] File attachments
- [ ] Time tracking with timer
- [ ] Export tasks to CSV/PDF
- [ ] Dark mode toggle
- [ ] Offline support with PWA
- [ ] Email reminders

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Font Awesome for the beautiful icons
- Google Fonts for the Inter typeface
- The Node.js community for excellent documentation

---

**⭐ If you find this project useful, please consider giving it a star!**

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [INSTALLATION.md](INSTALLATION.md) guide

---

**Made with ❤️ for productivity enthusiasts**
