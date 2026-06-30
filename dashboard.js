// dashboard.js - Dashboard Logic

let extractCount = 0;
let isSidebarOpen = false;

// Check authentication
if (sessionStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    loadExtractCount();
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('active');
    
    if (isSidebarOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function showDashboard() {
    document.getElementById('dashboardView').classList.add('active');
    document.getElementById('extractView').classList.remove('active');
    
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    menuItems[0].classList.add('active');
    
    if (isSidebarOpen) toggleSidebar();
    updateStats();
}

function showExtract() {
    document.getElementById('extractView').classList.add('active');
    document.getElementById('dashboardView').classList.remove('active');
    
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    menuItems[1].classList.add('active');
    
    if (isSidebarOpen) toggleSidebar();
}

function updateStats() {
    document.getElementById('totalExtracts').textContent = extractCount;
}

function loadExtractCount() {
    const count = localStorage.getItem('extractCount');
    if (count) {
        extractCount = parseInt(count);
        updateStats();
    }
}

function saveExtractCount() {
    localStorage.setItem('extractCount', extractCount.toString());
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
