# Smart Task Planner - Installation Guide

## Prerequisites

Before running the Smart Task Planner, ensure you have the following installed:

1. **Node.js** (version 14.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: Open Command Prompt and type `node --version`

2. **npm** (Node Package Manager)
   - Usually comes with Node.js
   - Verify installation: Open Command Prompt and type `npm --version`

## Quick Start

### Option 1: Using Batch Files (Windows)

1. **Navigate to the project folder**
   ```
   c:\Unthinkable\smart-task-planner\
   ```

2. **For Development Mode:**
   - Double-click `start-dev.bat`
   - This will install dependencies and start the server with auto-reload

3. **For Production Mode:**
   - Double-click `start.bat`
   - This will install dependencies and start the server

### Option 2: Using Command Line

1. **Open Command Prompt or PowerShell**

2. **Navigate to the project directory:**
   ```cmd
   cd c:\Unthinkable\smart-task-planner
   ```

3. **Install dependencies:**
   ```cmd
   npm install
   ```

4. **Start the application:**
   
   For development (with auto-reload):
   ```cmd
   npm run dev
   ```
   
   For production:
   ```cmd
   npm start
   ```

## Accessing the Application

1. **Open your web browser**

2. **Navigate to:**
   ```
   http://localhost:3000
   ```

3. **You should see the Smart Task Planner interface**

## Troubleshooting

### Common Issues:

1. **"Node.js is not recognized"**
   - Make sure Node.js is properly installed
   - Restart your command prompt/terminal
   - Check if Node.js is in your system PATH

2. **"npm install" fails**
   - Check your internet connection
   - Try running as administrator
   - Clear npm cache: `npm cache clean --force`

3. **Port 3000 is already in use**
   - The application runs on port 3000 by default
   - If another application is using this port, you can change it by creating a `.env` file:
   ```
   PORT=3001
   ```

4. **PowerShell execution policy errors**
   - Run PowerShell as administrator
   - Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - Or use Command Prompt instead of PowerShell

### Getting Help:

- Check the main README.md file for detailed documentation
- Ensure all files are in the correct locations
- Verify that the `public` folder contains: index.html, styles.css, script.js
- Check that server.js and package.json are in the root directory

## Features Overview

Once the application is running, you can:

- ✅ Create and manage tasks
- 📊 View dashboard with statistics
- 📅 Use calendar view
- 🏷️ Organize with categories
- 🔍 Search and filter tasks
- 📱 Use on mobile devices (responsive design)

Enjoy using Smart Task Planner! 🚀
