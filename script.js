// script.js - Login Page Logic

function togglePassword() {
    const input = document.getElementById('githubToken');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function handleLogin() {
    const token = document.getElementById('githubToken').value.trim();
    const btn = document.getElementById('loginBtn');
    
    if (!token) {
        showToast('Vui lòng nhập GitHub Token', 'error');
        return;
    }
    
    if (!token.startsWith('ghp_')) {
        showToast('Token không hợp lệ. Token phải bắt đầu với "ghp_"', 'error');
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang xác thực...
    `;
    
    // Simulate authentication
    setTimeout(() => {
        // Store token in sessionStorage
        sessionStorage.setItem('githubToken', token);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1500);
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

// Check if already authenticated
if (sessionStorage.getItem('isAuthenticated') === 'true') {
    window.location.href = 'dashboard.html';
}
