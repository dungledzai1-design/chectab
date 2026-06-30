// qr-logic.js - QR Login Logic

let qrProcessActive = false;
let qrData = null;
let currentResult = null;
let statusInterval = null;
let scanTimeout = null;

// Status tracking
const STATUS = {
    IDLE: 'idle',
    WAITING: 'waiting',
    SCANNED: 'scanned',
    CONFIRMING: 'confirming',
    SUCCESS: 'success',
    ERROR: 'error'
};

let currentStatus = STATUS.IDLE;

function startQRProcess() {
    if (qrProcessActive) return;
    
    const btn = document.getElementById('startBtn');
    btn.disabled = true;
    btn.classList.add('running');
    btn.innerHTML = `
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tạo QR...
    `;
    
    qrProcessActive = true;
    
    // Reset UI
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('qrImage').style.display = 'none';
    document.querySelector('.qr-placeholder').style.display = 'flex';
    document.querySelector('.qr-container').classList.remove('active');
    
    resetStatusButtons();
    updateStatus(STATUS.WAITING);
    
    // Simulate QR generation
    setTimeout(() => {
        generateQRCode();
    }, 2000);
}

function generateQRCode() {
    // Simulate QR code generation
    const qrCode = `ZALO_QR_${Math.random().toString(36).substring(7)}`;
    qrData = {
        code: qrCode,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    };
    
    // In real implementation, call Zalo API to generate QR
    // For demo, we'll use a placeholder QR
    
    // Show QR image
    const qrImage = document.getElementById('qrImage');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData.code}`;
    qrImage.style.display = 'block';
    document.querySelector('.qr-placeholder').style.display = 'none';
    document.querySelector('.qr-container').classList.add('active');
    
    const btn = document.getElementById('startBtn');
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Đang chờ quét...
    `;
    
    updateStatus(STATUS.WAITING);
    
    // Simulate scanning after 5 seconds
    scanTimeout = setTimeout(() => {
        simulateQRScan();
    }, 5000);
}

function simulateQRScan() {
    updateStatus(STATUS.SCANNED);
    document.getElementById('statusScanned').classList.add('active');
    
    const btn = document.getElementById('startBtn');
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Đã quét, chờ duyệt...
    `;
    
    // Simulate confirmation after 3 seconds
    setTimeout(() => {
        simulateConfirmation();
    }, 3000);
}

function simulateConfirmation() {
    updateStatus(STATUS.CONFIRMING);
    document.getElementById('statusConfirmed').classList.add('active');
    
    const btn = document.getElementById('startBtn');
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Đang xác nhận...
    `;
    
    // Simulate success after 2 seconds
    setTimeout(() => {
        completeQRProcess();
    }, 2000);
}

function completeQRProcess() {
    currentStatus = STATUS.SUCCESS;
    
    // Generate IMEI and Cookie data
    const imei = generateIMEI();
    const cookies = generateCookies();
    
    currentResult = {
        imei: imei,
        cookies: cookies,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Update stats
    extractCount++;
    updateStats();
    saveExtractCount();
    
    // Show result
    showResult(currentResult);
    
    const btn = document.getElementById('startBtn');
    btn.disabled = false;
    btn.classList.remove('running');
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Start
    `;
    
    qrProcessActive = false;
    
    // Mark status buttons as success
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.add('success');
        btn.classList.remove('active');
    });
    
    showToast('Lấy IMEI và Cookie thành công!', 'success');
}

function generateIMEI() {
    const uuid = crypto.randomUUID ? crypto.randomUUID() : 
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    const hash = btoa(navigator.userAgent).substring(0, 32);
    return `${uuid}-${hash}`;
}

function generateCookies() {
    const cookies = {
        'zpw_sek': {
            domain: '.zalo.me',
            expirationDate: Math.floor(Date.now() / 1000) + 86400 * 30,
            hostOnly: false,
            httpOnly: true,
            name: 'zpw_sek',
            path: '/',
            sameSite: 'no_restriction',
            secure: true,
            session: false,
            storeId: '0',
            value: btoa(JSON.stringify({ 
                token: 'zalo_token_' + Math.random().toString(36).substring(7),
                uid: 'user_' + Math.floor(Math.random() * 1000000),
                timestamp: Date.now()
            }))
        },
        'zpw_enk': btoa('encrypted_' + Math.random().toString(36).substring(7)),
        'zpw_ws': btoa('websocket_' + Math.random().toString(36).substring(7))
    };
    
    // Python format (simple key-value)
    const pythonCookies = {};
    Object.keys(cookies).forEach(key => {
        if (typeof cookies[key] === 'object') {
            pythonCookies[key] = cookies[key].value;
        } else {
            pythonCookies[key] = cookies[key];
        }
    });
    
    // JS format (full cookie objects)
    const jsCookies = {
        url: 'https://chat.zalo.me',
        cookies: Object.keys(cookies).map(key => {
            if (typeof cookies[key] === 'object') {
                return cookies[key];
            } else {
                return {
                    name: key,
                    value: cookies[key]
                };
            }
        })
    };
    
    return {
        python: pythonCookies,
        javascript: jsCookies
    };
}

function showResult(result) {
    const container = document.getElementById('resultContainer');
    const content = document.getElementById('resultContent');
    
    const formattedResult = {
        imei: result.imei,
        cookies: {
            python: result.cookies.python,
            javascript: result.cookies.javascript
        },
        timestamp: result.timestamp,
        userAgent: result.userAgent
    };
    
    content.textContent = JSON.stringify(formattedResult, null, 2);
    container.style.display = 'block';
}

function copyResult() {
    const content = document.getElementById('resultContent');
    navigator.clipboard.writeText(content.textContent).then(() => {
        showToast('Đã copy kết quả!', 'success');
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNode(content);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        showToast('Đã copy kết quả!', 'success');
    });
}

function downloadResult() {
    const content = document.getElementById('resultContent');
    const data = content.textContent;
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zalo_imei_cookie_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Đã download file!', 'success');
}

function updateStatus(status) {
    currentStatus = status;
    document.getElementById('statusText').textContent = getStatusText(status);
    
    // Update status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active', 'success', 'error');
    });
    
    switch(status) {
        case STATUS.WAITING:
            document.getElementById('statusWaiting').classList.add('active');
            break;
        case STATUS.SCANNED:
            document.getElementById('statusScanned').classList.add('active');
            break;
        case STATUS.CONFIRMING:
            document.getElementById('statusConfirmed').classList.add('active');
            break;
        case STATUS.SUCCESS:
            document.querySelectorAll('.status-btn').forEach(btn => {
                btn.classList.add('success');
            });
            break;
        case STATUS.ERROR:
            document.querySelectorAll('.status-btn').forEach(btn => {
                btn.classList.add('error');
            });
            break;
    }
}

function resetStatusButtons() {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('active', 'success', 'error');
    });
}

function getStatusText(status) {
    switch(status) {
        case STATUS.WAITING: return 'Chờ quét QR';
        case STATUS.SCANNED: return 'Đã quét QR';
        case STATUS.CONFIRMING: return 'Chờ duyệt';
        case STATUS.SUCCESS: return 'Thành công';
        case STATUS.ERROR: return 'Lỗi';
        default: return 'Sẵn sàng';
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (scanTimeout) clearTimeout(scanTimeout);
    if (statusInterval) clearInterval(statusInterval);
});

// Real implementation would use WebSocket or polling to check QR status
// This is a simulation for demo purposes
