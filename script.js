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
    // Simulate view count (random between 1500-2500)
    const viewCount = Math.floor(Math.random() * 1000) + 1500;
    document.getElementById('view-count').textContent = viewCount.toLocaleString('fa-IR');
    
    // Simulate online users (random between 80-150)
    const onlineCount = Math.floor(Math.random() * 70) + 80;
    document.getElementById('online-count').textContent = onlineCount.toLocaleString('fa-IR');
    
    // Simulate download count (random between 5000-10000)
    const downloadCount = Math.floor(Math.random() * 5000) + 5000;
    document.getElementById('download-count').textContent = downloadCount.toLocaleString('fa-IR');
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
        alert('لینک دانلود در حال حاضر در دسترس نیست. به زودی فعال خواهد شد.');
    });
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
        }
    });
});

// Initialize the page
window.addEventListener('DOMContentLoaded', function() {
    // Show first ad after 5 seconds
    setTimeout(showAdBanner, 5000);
});
