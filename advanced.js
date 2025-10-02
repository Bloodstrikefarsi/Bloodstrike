// فایل پیشرفته برای ویژگی‌های حرفه‌ای سایت

class AdvancedFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.initSmoothScrolling();
        this.initLazyLoading();
        this.initPageTransitions();
        this.initPerformanceOptimization();
        this.initAdvancedAnimations();
        this.initDynamicBackground();
        this.initNotificationSystem();
        this.initOfflineSupport();
    }

    // اسکرول نرم پیشرفته
    initSmoothScrolling() {
        // بهبود اسکرول نرم با انیمیشن بهتر
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // اضافه کردن افکت اسکرول پارالکس
        window.addEventListener('scroll', this.handleParallax);
    }

    // لودینگ lazy برای تصاویر
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // انتقال بین صفحات
    initPageTransitions() {
        // اضافه کردن افکت انتقال هنگام کلیک روی لینک‌ها
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    return;
                }
                
                if (!link.getAttribute('target')) {
                    e.preventDefault();
                    this.pageTransition(link.href);
                }
            });
        });
    }

    pageTransition(url) {
        // ایجاد افکت fade out قبل از رفتن به صفحه جدید
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // بهینه‌سازی عملکرد
    initPerformanceOptimization() {
        // debounce برای events
        this.optimizeScroll();
        this.optimizeResize();
        
        // پیش‌لود کردن منابع مهم
        this.preloadCriticalResources();
    }

    optimizeScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollPerformance();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    optimizeResize() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleScrollPerformance() {
        // بهینه‌سازی عملکرد هنگام اسکرول
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    handleResize() {
        // بهینه‌سازی برای تغییر سایز ویندو
        this.adjustLayout();
    }

    adjustLayout() {
        // تنظیمات ریسپانسیو پیشرفته
        const width = window.innerWidth;
        
        if (width < 768) {
            document.body.classList.add('mobile-view');
            document.body.classList.remove('desktop-view');
        } else {
            document.body.classList.add('desktop-view');
            document.body.classList.remove('mobile-view');
        }
    }

    // انیمیشن‌های پیشرفته
    initAdvancedAnimations() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initLoadingAnimations();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // اضافه کردن تاخیر برای انیمیشن‌های مختلف
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        }, observerOptions);

        // مشاهده عناصر برای انیمیشن
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initHoverEffects() {
        // افکت‌های hover پیشرفته
        document.querySelectorAll('.card, .btn, .social-card').forEach(element => {
            element.addEventListener('mouseenter', this.handleHoverEnter);
            element.addEventListener('mouseleave', this.handleHoverLeave);
        });
    }

    handleHoverEnter(e) {
        const element = e.currentTarget;
        element.style.transform = 'translateY(-5px) scale(1.02)';
        element.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
    }

    handleHoverLeave(e) {
        const element = e.currentTarget;
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = '';
    }

    initLoadingAnimations() {
        // انیمیشن‌های loading
        this.createLoadingSpinner();
    }

    createLoadingSpinner() {
        // ایجاد spinner برای لودینگ‌های آینده
        const spinner = document.createElement('div');
        spinner.className = 'advanced-spinner';
        spinner.innerHTML = `
            <div class="spinner-circle"></div>
            <div class="spinner-text">در حال بارگذاری...</div>
        `;
        document.body.appendChild(spinner);
    }

    // پس‌زمینه داینامیک
    initDynamicBackground() {
        this.createParticles();
        this.initGradientAnimation();
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        document.querySelector('.hero-background').appendChild(particlesContainer);

        // ایجاد ذرات متحرک
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${Math.random() * 20 + 10}s infinite linear;
            `;
            particlesContainer.appendChild(particle);
        }

        // اضافه کردن animation برای ذرات
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(0) translateX(0); }
                25% { transform: translateY(-20px) translateX(10px); }
                50% { transform: translateY(-40px) translateX(0); }
                75% { transform: translateY(-20px) translateX(-10px); }
                100% { transform: translateY(0) translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    initGradientAnimation() {
        // انیمیشن برای gradient background
        const hero = document.querySelector('.hero');
        let hue = 0;
        
        setInterval(() => {
            hue = (hue + 0.5) % 360;
            hero.style.background = `
                linear-gradient(
                    135deg,
                    hsl(${hue}, 70%, 15%),
                    hsl(${(hue + 120) % 360}, 70%, 10%),
                    hsl(${(hue + 240) % 360}, 70%, 15%)
                )
            `;
        }, 100);
    }

    // سیستم نوتیفیکیشن
    initNotificationSystem() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        document.body.appendChild(this.notificationContainer);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        this.notificationContainer.appendChild(notification);

        // نمایش نوتیفیکیشن
        setTimeout(() => notification.classList.add('show'), 100);

        // بستن خودکار
        const timeout = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // بستن دستی
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    // پشتیبانی آفلاین
    initOfflineSupport() {
        // تشخیص وضعیت آنلاین/آفلاین
        window.addEventListener('online', this.handleOnlineStatus);
        window.addEventListener('offline', this.handleOfflineStatus);
        
        // کش کردن داده‌های مهم
        this.initCaching();
    }

    handleOnlineStatus() {
        this.showNotification('اتصال اینترنت برقرار شد', 'success', 3000);
        // همگام‌سازی داده‌های آفلاین
        this.syncOfflineData();
    }

    handleOfflineStatus() {
        this.showNotification('اتصال اینترنت قطع شد', 'warning', 5000);
    }

    initCaching() {
        // کش کردن داده‌های مهم در localStorage
        if ('caches' in window) {
            // استفاده از Cache API برای منابع استاتیک
            this.cacheCriticalResources();
        }
    }

    cacheCriticalResources() {
        // کش کردن منابع مهم
        const criticalResources = [
            '/styles.css',
            '/script.js',
            '/advanced.js'
        ];

        caches.open('bloodstrike-cache-v1').then(cache => {
            cache.addAll(criticalResources);
        });
    }

    syncOfflineData() {
        // همگام‌سازی داده‌های آفلاین با سرور
        const offlineData = JSON.parse(localStorage.getItem('offline-data') || '[]');
        
        if (offlineData.length > 0) {
            this.showNotification('در حال همگام‌سازی داده‌های آفلاین...', 'info');
            
            // شبیه‌سازی ارسال داده‌ها به سرور
            setTimeout(() => {
                localStorage.removeItem('offline-data');
                this.showNotification('همگام‌سازی با موفقیت انجام شد', 'success');
            }, 2000);
        }
    }

    // پیش‌لود کردن منابع حیاتی
    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'font';
            document.head.appendChild(link);
        });
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ویژگی‌های پیشرفته برای پنل مدیریت
class AdvancedAdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.initRealTimeUpdates();
        this.initDataExport();
        this.initAdvancedFilters();
        this.initCharts();
    }

    initRealTimeUpdates() {
        // بروزرسانی real-time آمار
        setInterval(() => {
            this.updateRealTimeStats();
        }, 5000);
    }

    updateRealTimeStats() {
        // شبیه‌سازی بروزرسانی real-time
        const onlineUsers = document.getElementById('onlineUsers');
        if (onlineUsers) {
            const currentCount = parseInt(onlineUsers.textContent);
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
            const newCount = Math.max(0, currentCount + variation);
            onlineUsers.textContent = newCount;
            
            // بروزرسانی در منوی کناری
            const sideOnlineUsers = document.getElementById('sideOnlineUsers');
            if (sideOnlineUsers) {
                sideOnlineUsers.textContent = newCount;
            }
        }
    }

    initDataExport() {
        // قابلیت export داده‌ها
        this.setupExportButtons();
    }

    setupExportButtons() {
        // ایجاد دکمه‌های export در پنل مدیریت
        const exportSection = document.createElement('div');
        exportSection.className = 'admin-section';
        exportSection.innerHTML = `
            <h3>خروجی داده‌ها</h3>
            <div class="export-buttons">
                <button class="btn btn-primary" id="exportUsers">خروجی کاربران</button>
                <button class="btn btn-primary" id="exportSuggestions">خروجی پیشنهادات</button>
                <button class="btn btn-primary" id="exportStats">خروجی آمار</button>
            </div>
        `;

        const adminSections = document.querySelector('.admin-sections');
        if (adminSections) {
            adminSections.appendChild(exportSection);
            
            // اضافه کردن event listeners
            document.getElementById('exportUsers').addEventListener('click', () => this.exportData('users'));
            document.getElementById('exportSuggestions').addEventListener('click', () => this.exportData('suggestions'));
            document.getElementById('exportStats').addEventListener('click', () => this.exportData('stats'));
        }
    }

    exportData(type) {
        let data, filename, content;
        
        switch (type) {
            case 'users':
                data = JSON.parse(localStorage.getItem('bloodstrike_users') || '[]');
                filename = 'users.json';
                content = JSON.stringify(data, null, 2);
                break;
            case 'suggestions':
                data = JSON.parse(localStorage.getItem('bloodstrike_suggestions') || '[]');
                filename = 'suggestions.json';
                content = JSON.stringify(data, null, 2);
                break;
            case 'stats':
                data = JSON.parse(localStorage.getItem('bloodstrike_visits') || '{}');
                filename = 'stats.json';
                content = JSON.stringify(data, null, 2);
                break;
        }

        this.downloadFile(content, filename, 'application/json');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    initAdvancedFilters() {
        // فیلترهای پیشرفته برای داده‌ها
        this.setupSearchFilters();
    }

    setupSearchFilters() {
        // ایجاد فیلترهای جستجو در پنل مدیریت
        const usersSection = document.querySelector('.admin-section:nth-child(1)');
        const suggestionsSection = document.querySelector('.admin-section:nth-child(2)');
        
        if (usersSection) {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'جستجو در کاربران...';
            searchInput.className = 'admin-search';
            usersSection.insertBefore(searchInput, usersSection.querySelector('.admin-list'));
            
            searchInput.addEventListener('input', (e) => this.filterUsers(e.target.value));
        }

        if (suggestionsSection) {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'جستجو در پیشنهادات...';
            searchInput.className = 'admin-search';
            suggestionsSection.insertBefore(searchInput, suggestionsSection.querySelector('.admin-list'));
            
            searchInput.addEventListener('input', (e) => this.filterSuggestions(e.target.value));
        }
    }

    filterUsers(query) {
        const usersList = document.getElementById('usersList');
        const items = usersList.querySelectorAll('.admin-list-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    filterSuggestions(query) {
        const suggestionsList = document.getElementById('suggestionsList');
        const items = suggestionsList.querySelectorAll('.admin-list-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    initCharts() {
        // ایجاد چارت‌های آماری
        this.setupStatsCharts();
    }

    setupStatsCharts() {
        // ایجاد چارت‌های ساده برای آمار
        const statsSection = document.querySelector('.admin-section:nth-child(3)');
        if (statsSection) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'stats-chart';
            chartContainer.innerHTML = `
                <h4>نمودار بازدیدها (7 روز گذشته)</h4>
                <div class="chart-bars">
                    ${this.generateChartBars()}
                </div>
            `;
            statsSection.appendChild(chartContainer);
        }
    }

    generateChartBars() {
        let bars = '';
        for (let i = 6; i >= 0; i--) {
            const height = Math.floor(Math.random() * 80) + 20;
            const day = new Date();
            day.setDate(day.getDate() - i);
            const dayName = day.toLocaleDateString('fa-IR', { weekday: 'short' });
            
            bars += `
                <div class="chart-bar">
                    <div class="bar" style="height: ${height}%"></div>
                    <span>${dayName}</span>
                </div>
            `;
        }
        return bars;
    }
}

// راه‌اندازی ویژگی‌های پیشرفته پس از بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    // راه‌اندازی ویژگی‌های پیشرفته اصلی
    window.advancedFeatures = new AdvancedFeatures();
    
    // راه‌اندازی پنل مدیریت پیشرفته
    window.advancedAdminPanel = new AdvancedAdminPanel();
    
    // اضافه کردن استایل‌های پیشرفته
    addAdvancedStyles();
});

// اضافه کردن استایل‌های CSS برای ویژگی‌های پیشرفته
function addAdvancedStyles() {
    const advancedStyles = `
        /* استایل‌های پیشرفته */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .parallax {
            transition: transform 0.1s ease;
        }
        
        .advanced-spinner {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 2rem;
            border-radius: 10px;
            z-index: 9999;
            display: none;
        }
        
        .spinner-circle {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        .spinner-text {
            color: white;
            text-align: center;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .notification-container {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
        }
        
        .notification {
            background: var(--dark-color);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            transform: translateX(-100%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-success {
            border-left: 4px solid #4cd964;
        }
        
        .notification-error {
            border-left: 4px solid var(--accent-color);
        }
        
        .notification-warning {
            border-left: 4px solid #ffcc00;
        }
        
        .notification-info {
            border-left: 4px solid var(--secondary-color);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--light-color);
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .admin-search {
            width: 100%;
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: var(--light-color);
        }
        
        .stats-chart {
            margin-top: 1rem;
        }
        
        .chart-bars {
            display: flex;
            justify-content: space-between;
            align-items: end;
            height: 150px;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        .chart-bar {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            margin: 0 0.25rem;
        }
        
        .bar {
            width: 20px;
            background: linear-gradient(to top, var(--primary-color), var(--secondary-color));
            border-radius: 4px 4px 0 0;
            transition: height 0.3s ease;
        }
        
        .chart-bar span {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            opacity: 0.8;
        }
        
        .export-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .mobile-view .nav-menu {
            flex-direction: column;
        }
        
        .desktop-view .nav-menu {
            flex-direction: row;
        }
        
        /* بهبودهای ظاهری */
        .card {
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        
        /* پشتیبانی از حالت تاریک/روشن */
        @media (prefers-color-scheme: light) {
            :root {
                --light-color: #1c1c1e;
                --dark-color: #f2f2f7;
                --darker-color: #ffffff;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = advancedStyles;
    document.head.appendChild(styleSheet);
}
