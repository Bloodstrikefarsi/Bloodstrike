// Persian Date and Time
function updateDateTime() {
    const now = new Date();
    
    // Format time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Format Persian date
    const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);
    
    document.getElementById('date').textContent = persianDate;
}

// Update date and time every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Statistics
function updateStats() {
    // Get current view count from localStorage or set default
    let viewCount = localStorage.getItem('viewCount') || 0;
    viewCount = parseInt(viewCount) + 1;
    localStorage.setItem('viewCount', viewCount);
    document.getElementById('view-count').textContent = viewCount.toLocaleString('fa-IR');
    
    // Simulate online users (based on active sessions)
    let onlineUsers = JSON.parse(localStorage.getItem('onlineUsers')) || [];
    
    // Add current user if not already in the list
    const currentUser = {
        id: localStorage.getItem('userId') || generateUserId(),
        name: generateRandomName(),
        lastActive: Date.now()
    };
    
    if (!onlineUsers.find(user => user.id === currentUser.id)) {
        onlineUsers.push(currentUser);
    } else {
        // Update last active time for existing user
        onlineUsers = onlineUsers.map(user => {
            if (user.id === currentUser.id) {
                return { ...user, lastActive: Date.now() };
            }
            return user;
        });
    }
    
    // Remove inactive users (more than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    onlineUsers = onlineUsers.filter(user => user.lastActive > fiveMinutesAgo);
    
    // Save updated online users
    localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
    
    // Update online count
    document.getElementById('online-count').textContent = onlineUsers.length.toLocaleString('fa-IR');
    
    // Update online users display
    updateOnlineUsersDisplay(onlineUsers);
    
    // Simulate download count
    const downloadCount = localStorage.getItem('downloadCount') || 24500;
    document.getElementById('download-count').textContent = parseInt(downloadCount).toLocaleString('fa-IR');
}

// Generate random user ID
function generateUserId() {
    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', id);
    return id;
}

// Generate random Persian names
function generateRandomName() {
    const names = ['علی', 'محمد', 'رضا', 'حسین', 'امیر', 'مهدی', 'سارا', 'نازنین', 'فاطمه', 'زهرا', 'پارسا', 'کیمیا'];
    const surnames = ['محمدی', 'احمدی', 'کریمی', 'رحیمی', 'جعفری', 'قاسمی', 'موسوی', 'صادقی'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    
    return `${randomName} ${randomSurname}`;
}

// Update online users display
function updateOnlineUsersDisplay(users) {
    const onlineUsersContainer = document.getElementById('online-users');
    onlineUsersContainer.innerHTML = '';
    
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        const firstLetter = user.name.charAt(0);
        
        userCard.innerHTML = `
            <div class="user-avatar">${firstLetter}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-status">
                    <span class="status-dot"></span>
                    <span>آنلاین</span>
                </div>
            </div>
        `;
        
        onlineUsersContainer.appendChild(userCard);
    });
}

// Update stats every 10 seconds
setInterval(updateStats, 10000);
updateStats(); // Initial call

// Advertisement Banner
function showAdBanner() {
    const adBanner = document.getElementById('ad-banner');
    adBanner.style.display = 'block';
    
    // Close ad after 60 seconds if not manually closed
    setTimeout(() => {
        if (adBanner.style.display !== 'none') {
            adBanner.style.display = 'none';
        }
    }, 60000);
}

// Show ad banner every minute
setInterval(showAdBanner, 60000);

// Close ad banner
document.getElementById('close-ad').addEventListener('click', function() {
    document.getElementById('ad-banner').style.display = 'none';
});

// Download buttons
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Increment download count
        let downloadCount = localStorage.getItem('downloadCount') || 24500;
        downloadCount = parseInt(downloadCount) + 1;
        localStorage.setItem('downloadCount', downloadCount);
        document.getElementById('download-count').textContent = downloadCount.toLocaleString('fa-IR');
        
        alert('لینک دانلود در حال حاضر در دسترس نیست. به زودی فعال خواهد شد.');
    });
});

// Sidebar functionality
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebar = document.getElementById('close-sidebar');

hamburgerMenu.addEventListener('click', function() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
});

closeSidebar.addEventListener('click', function() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close sidebar if open
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

// Initialize the page
window.addEventListener('DOMContentLoaded', function() {
    // Show first ad after 5 seconds
    setTimeout(showAdBanner, 5000);
});
