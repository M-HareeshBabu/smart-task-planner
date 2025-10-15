// Smart Task Planner JavaScript

class TaskPlanner {
    constructor() {
        this.tasks = [];
        this.categories = [];
        this.currentEditingTask = null;
        this.currentDate = new Date();
        this.filters = {
            status: '',
            priority: '',
            category: '',
            search: ''
        };
        this.sortBy = 'createdAt';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadCategories();
        await this.loadTasks();
        this.renderDashboard();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
                this.updateActiveNav(e.currentTarget);
            });
        });

        // Menu toggle for mobile
        document.querySelector('.menu-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });

        // Task modal
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.openTaskModal();
        });

        document.getElementById('cancel-task').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        // Category modal
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        document.getElementById('cancel-category').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.renderTasks();
        });

        // Filters
        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.renderTasks();
        });

        document.getElementById('priority-filter').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.renderTasks();
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.renderTasks();
        });

        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderTasks();
        });

        // Progress slider
        document.getElementById('task-progress').addEventListener('input', (e) => {
            document.getElementById('progress-value').textContent = e.target.value + '%';
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Settings
        document.getElementById('dark-mode').addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.target.checked);
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            tasks: 'Tasks',
            calendar: 'Calendar',
            analytics: 'Analytics',
            settings: 'Settings'
        };
        document.getElementById('page-title').textContent = titles[sectionName];

        // Render section-specific content
        if (sectionName === 'dashboard') {
            this.renderDashboard();
        } else if (sectionName === 'tasks') {
            this.renderTasks();
        } else if (sectionName === 'calendar') {
            this.renderCalendar();
        } else if (sectionName === 'analytics') {
            this.renderAnalytics();
        } else if (sectionName === 'settings') {
            this.renderSettings();
        }
    }

    updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    async loadTasks() {
        try {
            this.showLoading();
            const response = await fetch('/api/tasks');
            this.tasks = await response.json();
        } catch (error) {
            this.showToast('Error loading tasks', 'error');
            console.error('Error loading tasks:', error);
        } finally {
            this.hideLoading();
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            this.categories = await response.json();
            this.populateCategorySelects();
        } catch (error) {
            this.showToast('Error loading categories', 'error');
            console.error('Error loading categories:', error);
        }
    }

    populateCategorySelects() {
        const selects = ['task-category', 'category-filter'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = selectId === 'category-filter' ? '<option value="">All Categories</option>' : '';
            
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        });
    }

    async saveTask() {
        const formData = new FormData(document.getElementById('task-form'));
        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            priority: document.getElementById('task-priority').value,
            category: document.getElementById('task-category').value,
            dueDate: document.getElementById('task-due-date').value || null,
            estimatedTime: parseFloat(document.getElementById('task-estimated-time').value) || null,
            status: document.getElementById('task-status').value,
            progress: parseInt(document.getElementById('task-progress').value)
        };

        try {
            this.showLoading();
            let response;
            
            if (this.currentEditingTask) {
                response = await fetch(`/api/tasks/${this.currentEditingTask.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            } else {
                response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            }

            if (response.ok) {
                await this.loadTasks();
                this.closeTaskModal();
                this.showToast(this.currentEditingTask ? 'Task updated successfully' : 'Task created successfully', 'success');
                this.renderDashboard();
                this.renderTasks();
            } else {
                throw new Error('Failed to save task');
            }
        } catch (error) {
            this.showToast('Error saving task', 'error');
            console.error('Error saving task:', error);
        } finally {
            this.hideLoading();
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            this.showLoading();
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadTasks();
                this.showToast('Task deleted successfully', 'success');
                this.renderDashboard();
                this.renderTasks();
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            this.showToast('Error deleting task', 'error');
            console.error('Error deleting task:', error);
        } finally {
            this.hideLoading();
        }
    }

    async saveCategory() {
        const categoryData = {
            name: document.getElementById('category-name').value,
            color: document.getElementById('category-color').value
        };

        try {
            this.showLoading();
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                await this.loadCategories();
                this.closeCategoryModal();
                this.showToast('Category created successfully', 'success');
                this.renderSettings();
            } else {
                throw new Error('Failed to save category');
            }
        } catch (error) {
            this.showToast('Error saving category', 'error');
            console.error('Error saving category:', error);
        } finally {
            this.hideLoading();
        }
    }

    openTaskModal(task = null) {
        this.currentEditingTask = task;
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('task-form');

        if (task) {
            title.textContent = 'Edit Task';
            this.populateTaskForm(task);
        } else {
            title.textContent = 'Add New Task';
            form.reset();
            document.getElementById('progress-value').textContent = '0%';
        }

        modal.classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('task-modal').classList.remove('active');
        this.currentEditingTask = null;
    }

    openCategoryModal() {
        document.getElementById('category-modal').classList.add('active');
        document.getElementById('category-form').reset();
    }

    closeCategoryModal() {
        document.getElementById('category-modal').classList.remove('active');
    }

    populateTaskForm(task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-progress').value = task.progress;
        document.getElementById('progress-value').textContent = task.progress + '%';
        
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            document.getElementById('task-due-date').value = date.toISOString().slice(0, 16);
        }
        
        if (task.estimatedTime) {
            document.getElementById('task-estimated-time').value = task.estimatedTime;
        }
    }

    renderDashboard() {
        this.renderDashboardStats();
        this.renderTodayTasks();
        this.renderPriorityTasks();
        this.renderCategoryChart();
    }

    async renderDashboardStats() {
        try {
            const response = await fetch('/api/dashboard');
            const stats = await response.json();

            document.getElementById('total-tasks').textContent = stats.totalTasks;
            document.getElementById('completed-tasks').textContent = stats.completedTasks;
            document.getElementById('pending-tasks').textContent = stats.pendingTasks;
            document.getElementById('overdue-tasks').textContent = stats.overdueTasks;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    renderTodayTasks() {
        const today = new Date().toDateString();
        const todayTasks = this.tasks.filter(task => {
            if (!task.dueDate) return false;
            return new Date(task.dueDate).toDateString() === today;
        });

        const container = document.getElementById('today-tasks-list');
        container.innerHTML = '';

        if (todayTasks.length === 0) {
            container.innerHTML = '<p class="empty-state">No tasks due today</p>';
            return;
        }

        todayTasks.forEach(task => {
            const taskElement = this.createMiniTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    renderPriorityTasks() {
        const priorityTasks = this.tasks
            .filter(task => task.priority === 'high' && task.status !== 'completed')
            .slice(0, 5);

        const container = document.getElementById('priority-tasks-list');
        container.innerHTML = '';

        if (priorityTasks.length === 0) {
            container.innerHTML = '<p class="empty-state">No high priority tasks</p>';
            return;
        }

        priorityTasks.forEach(task => {
            const taskElement = this.createMiniTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createMiniTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item-mini ${task.priority}-priority`;
        div.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.category} • ${this.formatDate(task.dueDate)}</p>
        `;
        div.addEventListener('click', () => this.openTaskModal(task));
        return div;
    }

    renderCategoryChart() {
        const chartContainer = document.getElementById('category-chart');
        chartContainer.innerHTML = '';

        const categoryStats = {};
        this.categories.forEach(cat => {
            categoryStats[cat.id] = {
                name: cat.name,
                count: this.tasks.filter(task => task.category === cat.id).length,
                color: cat.color
            };
        });

        Object.values(categoryStats).forEach(stat => {
            if (stat.count > 0) {
                const bar = document.createElement('div');
                bar.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    margin-bottom: 0.5rem;
                    background: ${stat.color}20;
                    border-left: 4px solid ${stat.color};
                    border-radius: 0.25rem;
                `;
                bar.innerHTML = `
                    <span>${stat.name}</span>
                    <span style="font-weight: 600;">${stat.count}</span>
                `;
                chartContainer.appendChild(bar);
            }
        });
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const container = document.getElementById('tasks-grid');
        container.innerHTML = '';

        if (filteredTasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No tasks found</div>';
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        // Apply filters
        if (this.filters.status) {
            filtered = filtered.filter(task => task.status === this.filters.status);
        }
        
        if (this.filters.priority) {
            filtered = filtered.filter(task => task.priority === this.filters.priority);
        }
        
        if (this.filters.category) {
            filtered = filtered.filter(task => task.category === this.filters.category);
        }
        
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search)
            );
        }

        // Sort tasks
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'createdAt':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-card ${task.priority}-priority`;
        
        const category = this.categories.find(cat => cat.id === task.category);
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

        div.innerHTML = `
            <div class="task-header">
                <div>
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-meta">
                        <span class="task-badge priority-${task.priority}">${task.priority}</span>
                        <span class="task-badge status-${task.status}">${task.status.replace('-', ' ')}</span>
                        ${isOverdue ? '<span class="task-badge" style="background: #fef2f2; color: #dc2626;">Overdue</span>' : ''}
                    </div>
                </div>
            </div>
            
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            
            <div class="task-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
                <small>${task.progress}% complete</small>
            </div>
            
            <div class="task-footer">
                <div>
                    <small>${category ? category.name : 'No Category'}</small>
                    ${task.dueDate ? `<br><small>Due: ${this.formatDate(task.dueDate)}</small>` : ''}
                </div>
                <div class="task-actions">
                    <button class="action-btn edit" onclick="taskPlanner.openTaskModal(taskPlanner.tasks.find(t => t.id === '${task.id}'))">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="taskPlanner.deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        return div;
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;

        const container = document.getElementById('calendar-grid');
        container.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.style.cssText = 'font-weight: 600; padding: 1rem; background: #f1f5f9; text-align: center;';
            header.textContent = day;
            container.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            container.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.toDateString() === today.toDateString();
            
            dayElement.className = `calendar-day ${isToday ? 'today' : ''}`;
            
            const dayTasks = this.tasks.filter(task => {
                if (!task.dueDate) return false;
                const taskDate = new Date(task.dueDate);
                return taskDate.toDateString() === currentDate.toDateString();
            });

            dayElement.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="day-tasks">
                    ${dayTasks.map(task => `
                        <div class="calendar-task" style="background: ${this.getCategoryColor(task.category)}">
                            ${task.title}
                        </div>
                    `).join('')}
                </div>
            `;

            container.appendChild(dayElement);
        }
    }

    getCategoryColor(categoryId) {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.color : '#3b82f6';
    }

    renderAnalytics() {
        const productivityChart = document.getElementById('productivity-chart');
        const timeChart = document.getElementById('time-chart');

        // Simple analytics visualization
        productivityChart.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Productivity analytics will be displayed here</p>
                <p>Track your task completion trends over time</p>
            </div>
        `;

        timeChart.innerHTML = `
            <div style="text-align: center; color: #64748b;">
                <i class="fas fa-clock" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Time distribution analytics will be displayed here</p>
                <p>See how you spend time across different categories</p>
            </div>
        `;
    }

    renderSettings() {
        this.renderCategoriesList();
    }

    renderCategoriesList() {
        const container = document.getElementById('categories-list');
        container.innerHTML = '';

        this.categories.forEach(category => {
            const div = document.createElement('div');
            div.className = 'category-item';
            div.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div class="category-color" style="background-color: ${category.color}"></div>
                    <span>${category.name}</span>
                </div>
                <button class="btn btn-danger btn-sm" onclick="taskPlanner.deleteCategory('${category.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(div);
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    showLoading() {
        document.getElementById('loading').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.getElementById('toast-container').appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize the application
const taskPlanner = new TaskPlanner();

// Make taskPlanner globally accessible for onclick handlers
window.taskPlanner = taskPlanner;
