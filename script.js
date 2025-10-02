// اسکریپت اصلی سایت - بهبود یافته

// راه‌اندازی سایت پس از حل کپچا
document.addEventListener('DOMContentLoaded', function() {
    // سیستم تشخیص ربات - باید اول اجرا شود
    initBotDetection();
    
    // بقیه کدها فقط اگر کپچا حل شده باشد اجرا شوند
    if (localStorage.getItem('captchaSolved') === 'true') {
        initializeSite();
    }
});

// تابع اصلی برای راه‌اندازی سایت
function initializeSite() {
    // منوی همبرگر سمت چپ
    initLeftHamburgerMenu();
    
    // منوی هامبورگر اصلی
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // بستن منو هنگام کلیک روی لینک
        document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // اسکرول نرم برای لینک‌ها
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
    
    // افکت اسکرول برای هدر
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(28, 28, 30, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(28, 28, 30, 0.9)';
                header.style.backdropFilter = 'blur(10px)';
            }
        }
    });
    
    // انیمیشن برای عناصر هنگام اسکرول
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // مشاهده عناصر برای انیمیشن
    document.querySelectorAll('.game-card, .social-card, .fun-card, .stat-card, .register-form, .suggestions-form, .news-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // سیستم آمار بازدید و کاربران آنلاین
    const visitTracker = new VisitTracker();
    
    // به‌روزرسانی اولیه نمایش
    const visitData = visitTracker.getVisitData();
    visitTracker.updateDisplay(visitData);
    
    const onlineUsers = visitTracker.getOnlineUsers();
    visitTracker.updateOnlineUsersDisplay(onlineUsers);
    
    // سیستم ثبت نام
    initRegistrationSystem();
    
    // سیستم پیشنهادات
    initSuggestionsSystem();
    
    // سیستم تبلیغات
    initAdvertisementSystem();
    
    // سیستم پنل مدیریت
    initAdminPanel();
    
    // سیستم ساعت و تاریخ
    initDateTimeSystem();
}

// منوی همبرگر سمت چپ
function initLeftHamburgerMenu() {
    const leftHamburger = document.getElementById('leftHamburger');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const adminSideLink = document.getElementById('adminSideLink');
    
    if (leftHamburger && sideMenu) {
        leftHamburger.addEventListener('click', function() {
            sideMenu.classList.toggle('active');
        });
        
        closeMenu.addEventListener('click', function() {
            sideMenu.classList.remove('active');
        });
        
        // بستن منو هنگام کلیک روی لینک‌ها
        document.querySelectorAll('.side-menu-item').forEach(item => {
            item.addEventListener('click', function() {
                sideMenu.classList.remove('active');
            });
        });
        
        // لینک پنل مدیریت در منوی کناری
        if (adminSideLink) {
            adminSideLink.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('adminPanel').style.display = 'flex';
                sideMenu.classList.remove('active');
            });
        }
    }
}

// بقیه توابع بدون تغییر می‌مانند...
// [کدهای قبلی مربوط به VisitTracker و سایر سیستم‌ها]
