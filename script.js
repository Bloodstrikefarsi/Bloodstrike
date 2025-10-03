// اسکریپت برای منوی هامبورگر و اسکرول نرم
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
    // منوی هامبورگر
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
    document.querySelectorAll('.game-card, .social-card, .fun-card, .stat-card, .register-form, .suggestions-form').forEach(el => {
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
    
    // سیستم ساعت و تاریخ جدید
    initPersianDateTime();
}

// سیستم تشخیص ربات
function initBotDetection() {
    const botDetection = document.getElementById('botDetection');
    const captchaCode = document.getElementById('captchaCode');
    const captchaInput = document.getElementById('captchaInput');
    const captchaSubmit = document.getElementById('captchaSubmit');
    const captchaMessage = document.getElementById('captchaMessage');
    
    // بررسی اگر کپچا قبلاً حل شده باشد
    if (localStorage.getItem('captchaSolved') === 'true') {
        if (botDetection) botDetection.style.display = 'none';
        initializeSite();
        return;
    }
    
    // اگر عناصر کپچا وجود ندارند، سایت را مستقیماً راه‌اندازی کن
    if (!botDetection || !captchaCode || !captchaInput || !captchaSubmit) {
        console.error('عناصر کپچا پیدا نشدند');
        initializeSite();
        return;
    }
    
    // تولید کد تصادفی برای کپچا
    function generateCaptcha() {
        const chars = '0123456789';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    let currentCaptcha = generateCaptcha();
    
    // نمایش کپچا
    captchaCode.textContent = currentCaptcha;
    botDetection.style.display = 'flex';
    captchaMessage.style.display = 'none';
    
    // تابع برای بررسی کپچا
    function checkCaptcha() {
        const userInput = captchaInput.value.trim();
        
        if (userInput === '') {
            showCaptchaMessage('لطفا کد را وارد کنید', 'error');
            return false;
        }
        
        if (userInput === currentCaptcha) {
            // کپچا صحیح است
            localStorage.setItem('captchaSolved', 'true');
            botDetection.style.display = 'none';
            showCaptchaMessage('', 'success');
            initializeSite();
            return true;
        } else {
            // کپچا نادرست است
            showCaptchaMessage('کد وارد شده صحیح نیست. لطفا دوباره تلاش کنید.', 'error');
            currentCaptcha = generateCaptcha();
            captchaCode.textContent = currentCaptcha;
            captchaInput.value = '';
            captchaInput.focus();
            return false;
        }
    }
    
    // رویداد کلیک روی دکمه تایید
    captchaSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        checkCaptcha();
    });
    
    // امکان Enter برای تایید
    captchaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkCaptcha();
        }
    });
    
    // تابع نمایش پیام کپچا
    function showCaptchaMessage(message, type) {
        if (message) {
            captchaMessage.textContent = message;
            captchaMessage.className = `message ${type}`;
            captchaMessage.style.display = 'block';
        } else {
            captchaMessage.style.display = 'none';
        }
    }
    
    // فوکوس روی فیلد ورودی
    captchaInput.focus();
}

// سیستم ساعت و تاریخ فارسی جدید
function initPersianDateTime() {
    const dayNameElement = document.getElementById('dayName');
    const dayElement = document.getElementById('day');
    const monthElement = document.getElementById('month');
    const yearElement = document.getElementById('year');
    const timeElement = document.getElementById('time');
    
    const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    
    function updatePersianDateTime() {
        const now = new Date();
        
        // تبدیل به تاریخ شمسی
        const persianDate = toPersianDate(now);
        
        // به‌روزرسانی عناصر
        if (dayNameElement) dayNameElement.textContent = persianDays[now.getDay()];
        if (dayElement) dayElement.textContent = persianDate.day.toString().padStart(2, '0');
        if (monthElement) monthElement.textContent = persianDate.month.toString().padStart(2, '0');
        if (yearElement) yearElement.textContent = persianDate.year;
        
        // به‌روزرسانی زمان
        if (timeElement) {
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    // تابع تبدیل تاریخ میلادی به شمسی (ساده شده)
    function toPersianDate(gregorianDate) {
        // این یک تبدیل ساده است - برای دقت بیشتر از کتابخانه‌های تخصصی استفاده کنید
        const gYear = gregorianDate.getFullYear();
        const gMonth = gregorianDate.getMonth() + 1;
        const gDay = gregorianDate.getDate();
        
        // محاسبات ساده برای تبدیل
        let persianYear, persianMonth, persianDay;
        
        if (gMonth > 3 || (gMonth === 3 && gDay > 20)) {
            persianYear = gYear - 621;
        } else {
            persianYear = gYear - 622;
        }
        
        // محاسبه ماه و روز (ساده شده)
        const startFar = new Date(gYear, 2, 21);
        const diff = Math.floor((gregorianDate - startFar) / (1000 * 60 * 60 * 24));
        
        if (diff >= 0) {
            persianMonth = Math.floor(diff / 31) + 1;
            persianDay = (diff % 31) + 1;
        } else {
            // قبل از فروردین
            persianYear--;
            persianMonth = 12;
            persianDay = 30 + diff + 1;
        }
        
        return {
            year: persianYear,
            month: persianMonth,
            day: persianDay
        };
    }
    
    // به‌روزرسانی هر ثانیه
    setInterval(updatePersianDateTime, 1000);
    updatePersianDateTime();
}

// بقیه کدهای سیستم بدون تغییر می‌مانند...
// [کدهای VisitTracker و سایر سیستم‌ها بدون تغییر از فایل قبلی کپی شوند]
