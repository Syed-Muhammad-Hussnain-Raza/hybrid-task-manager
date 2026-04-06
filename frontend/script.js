const API_URL = window.location.origin + '/api/tasks';

// Load tasks when page loads
window.onload = () => {
    fetchTasks();
};

// Fetch all tasks from backend
async function fetchTasks() {
    try {
        const [personalRes, teamRes] = await Promise.all([
            fetch(`${API_URL}?type=personal`),
            fetch(`${API_URL}?type=team`)
        ]);
        
        const personalData = await personalRes.json();
        const teamData = await teamRes.json();
        
        displayTasks(personalData.data, 'personal');
        displayTasks(teamData.data, 'team');
        updateAnalytics(personalData.data, teamData.data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Make sure the backend is running.');
    }
}

// Display tasks in the UI
function displayTasks(tasks, type) {
    const container = document.getElementById(`${type}TasksList`);
    
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No tasks found. Add your first task!</p>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status === 'completed' ? 'completed' : ''}" data-id="${task._id}">
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                👤 Assigned to: ${escapeHtml(task.assignedTo)} | 
                📊 Status: ${task.status} | 
                📅 Created: ${new Date(task.createdAt).toLocaleDateString()}
            </div>
            <div class="task-actions">
                ${task.status !== 'completed' ? `<button class="complete-btn" onclick="markComplete('${task._id}')">✓ Mark Complete</button>` : ''}
                <button class="edit-btn" onclick="editTask('${task._id}', '${escapeHtml(task.title)}', '${escapeHtml(task.description || '')}', '${escapeHtml(task.assignedTo)}')">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Add a new task
async function addTask(type) {
    const titleInput = document.getElementById(`${type}Title`);
    const descInput = document.getElementById(`${type}Desc`);
    const assignedInput = document.getElementById(`${type}Assigned`);
    
    const task = {
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        assignedTo: assignedInput.value.trim(),
        type: type,
        status: 'pending'
    };
    
    if (!task.title || !task.assignedTo) {
        alert('Please fill in title and assigned to fields');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            titleInput.value = '';
            descInput.value = '';
            assignedInput.value = '';
            fetchTasks();
        } else {
            const error = await response.json();
            alert('Error adding task: ' + error.error);
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task');
    }
}

// Mark task as complete
async function markComplete(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });
        
        if (response.ok) {
            fetchTasks();
        } else {
            alert('Error marking task as complete');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Edit task
async function editTask(id, oldTitle, oldDesc, oldAssigned) {
    const newTitle = prompt('Edit title:', oldTitle);
    if (!newTitle) return;
    
    const newDesc = prompt('Edit description:', oldDesc);
    const newAssigned = prompt('Edit assigned to:', oldAssigned);
    if (!newAssigned) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                description: newDesc,
                assignedTo: newAssigned
            })
        });
        
        if (response.ok) {
            fetchTasks();
        } else {
            alert('Error editing task');
        }
    } catch (error) {
        console.error('Error editing task:', error);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchTasks();
        } else {
            alert('Error deleting task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Update analytics dashboard
function updateAnalytics(personalTasks, teamTasks) {
    // Personal tasks analytics
    const personalTotal = personalTasks.length;
    const personalCompleted = personalTasks.filter(t => t.status === 'completed').length;
    const personalPending = personalTotal - personalCompleted;
    
    document.getElementById('personalTotal').textContent = personalTotal;
    document.getElementById('personalCompleted').textContent = personalCompleted;
    document.getElementById('personalPending').textContent = personalPending;
    
    // Team tasks analytics
    const teamTotal = teamTasks.length;
    const teamCompleted = teamTasks.filter(t => t.status === 'completed').length;
    const teamPending = teamTotal - teamCompleted;
    
    document.getElementById('teamTotal').textContent = teamTotal;
    document.getElementById('teamCompleted').textContent = teamCompleted;
    document.getElementById('teamPending').textContent = teamPending;
}

// Helper function to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}