// اسکریپت برای منوی هامبورگر و اسکرول نرم
document.addEventListener('DOMContentLoaded', function() {
    // سیستم تشخیص ربات
    initBotDetection();
    
    // منوی هامبورگر
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // بستن منو هنگام کلیک روی لینک
    document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
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
        if (window.scrollY > 100) {
            header.style.background = 'rgba(28, 28, 30, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(28, 28, 30, 0.9)';
            header.style.backdropFilter = 'blur(10px)';
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
    
    // سیستم ساعت و تاریخ
    initDateTimeSystem();
});

// سیستم تشخیص ربات
function initBotDetection() {
    const botDetection = document.getElementById('botDetection');
    const captchaCode = document.getElementById('captchaCode');
    const captchaInput = document.getElementById('captchaInput');
    const captchaSubmit = document.getElementById('captchaSubmit');
    
    // تولید کد تصادفی برای کپچا
    function generateCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    // بررسی وضعیت کپچا در localStorage
    const captchaSolved = localStorage.getItem('captchaSolved');
    if (captchaSolved === 'true') {
        botDetection.style.display = 'none';
    } else {
        botDetection.style.display = 'flex';
        const captcha = generateCaptcha();
        captchaCode.textContent = captcha;
        
        captchaSubmit.addEventListener('click', function() {
            if (captchaInput.value.toUpperCase() === captcha) {
                localStorage.setItem('captchaSolved', 'true');
                botDetection.style.display = 'none';
            } else {
                alert('کد وارد شده صحیح نیست. لطفا دوباره تلاش کنید.');
                const newCaptcha = generateCaptcha();
                captchaCode.textContent = newCaptcha;
                captchaInput.value = '';
            }
        });
        
        // امکان Enter برای تایید
        captchaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                captchaSubmit.click();
            }
        });
    }
}

// سیستم آمار بازدید و کاربران آنلاین
class VisitTracker {
    constructor() {
        this.storageKey = 'bloodstrike_visits';
        this.onlineUsersKey = 'bloodstrike_online_users';
        this.usersKey = 'bloodstrike_users';
        this.currentSessionId = this.generateSessionId();
        this.init();
    }

    // تولید شناسه منحصر به فرد برای هر session
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // مقداردهی اولیه
    init() {
        this.trackVisit();
        this.updateOnlineUsers();
        this.setupPeriodicUpdates();
    }

    // ردیابی بازدید
    trackVisit() {
        const now = new Date();
        const today = now.toDateString();
        
        // دریافت داده‌های موجود
        let visitData = this.getVisitData();
        
        // افزایش بازدید کل
        visitData.totalVisits = (visitData.totalVisits || 0) + 1;
        
        // افزایش بازدید امروز
        if (visitData.lastVisitDate !== today) {
            visitData.todayVisits = 1;
            visitData.lastVisitDate = today;
        } else {
            visitData.todayVisits = (visitData.todayVisits || 0) + 1;
        }
        
        // ذخیره داده‌ها
        this.saveVisitData(visitData);
        
        // نمایش در صفحه
        this.updateDisplay(visitData);
    }

    // دریافت داده‌های بازدید
    getVisitData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    // ذخیره داده‌های بازدید
    saveVisitData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // به‌روزرسانی کاربران آنلاین
    updateOnlineUsers() {
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000; // 15 دقیقه
        
        // دریافت لیست کاربران آنلاین
        let onlineUsers = this.getOnlineUsers();
        
        // دریافت کاربران ثبت‌نام شده
        const registeredUsers = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
        const currentUser = registeredUsers[registeredUsers.length - 1]; // آخرین کاربر ثبت‌نام شده
        
        // افزودن یا به‌روزرسانی کاربر فعلی
        onlineUsers[this.currentSessionId] = {
            id: this.currentSessionId,
            lastActive: now,
            name: currentUser ? currentUser.name : this.generateRandomName(),
            avatar: this.generateRandomAvatar(),
            isRegistered: !!currentUser
        };
        
        // حذف کاربران غیرفعال (بیش از 15 دقیقه)
        Object.keys(onlineUsers).forEach(sessionId => {
            if (now - onlineUsers[sessionId].lastActive > fifteenMinutes) {
                delete onlineUsers[sessionId];
            }
        });
        
        // ذخیره لیست به‌روزرسانی شده
        this.saveOnlineUsers(onlineUsers);
        
        // نمایش در صفحه
        this.updateOnlineUsersDisplay(onlineUsers);
    }

    // دریافت لیست کاربران آنلاین
    getOnlineUsers() {
        const data = localStorage.getItem(this.onlineUsersKey);
        return data ? JSON.parse(data) : {};
    }

    // ذخیره لیست کاربران آنلاین
    saveOnlineUsers(users) {
        localStorage.setItem(this.onlineUsersKey, JSON.stringify(users));
    }

    // تولید نام تصادفی برای کاربر
    generateRandomName() {
        const names = ['بازیکن ۱', 'بازیکن ۲', 'بازیکن ۳', 'بازیکن ۴', 'بازیکن ۵', 
                      'GamerPro', 'NightHunter', 'ShadowWolf', 'DragonSlayer', 'Phoenix'];
        return names[Math.floor(Math.random() * names.length)];
    }

    // تولید آواتار تصادفی
    generateRandomAvatar() {
        const avatars = ['fas fa-user', 'fas fa-user-ninja', 'fas fa-user-astronaut', 
                        'fas fa-robot', 'fas fa-gamepad', 'fas fa-mask'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    // به‌روزرسانی نمایش آمار
    updateDisplay(data) {
        const totalVisitsElement = document.getElementById('totalVisits');
        const todayVisitsElement = document.getElementById('todayVisits');
        
        if (totalVisitsElement) {
            totalVisitsElement.textContent = this.formatNumber(data.totalVisits || 0);
        }
        
        if (todayVisitsElement) {
            todayVisitsElement.textContent = this.formatNumber(data.todayVisits || 0);
        }
    }

    // به‌روزرسانی نمایش کاربران آنلاین
    updateOnlineUsersDisplay(users) {
        const onlineUsersElement = document.getElementById('onlineUsers');
        const onlineUsersListElement = document.getElementById('onlineUsersList');
        
        // به‌روزرسانی تعداد کاربران آنلاین
        if (onlineUsersElement) {
            onlineUsersElement.textContent = Object.keys(users).length;
        }
        
        // به‌روزرسانی لیست کاربران
        if (onlineUsersListElement) {
            const userList = Object.values(users);
            
            if (userList.length === 0) {
                onlineUsersListElement.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>هیچ کاربر آنلاینی وجود ندارد</p>
                    </div>
                `;
            } else {
                onlineUsersListElement.innerHTML = userList.map(user => `
                    <div class="user-card">
                        <div class="user-avatar">
                            <i class="${user.avatar}"></i>
                        </div>
                        <div class="user-info">
                            <div class="user-name">${user.name}</div>
                            <div class="user-status">
                                <div class="status-indicator"></div>
                                <span>${user.isRegistered ? 'ثبت‌نام شده' : 'مهمان'}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    // فرمت اعداد (جداسازی هزارگان)
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // تنظیم به‌روزرسانی دوره‌ای
    setupPeriodicUpdates() {
        // به‌روزرسانی هر 30 ثانیه
        setInterval(() => {
            this.updateOnlineUsers();
        }, 30000);
        
        // به‌روزرسانی فعالیت کاربر هنگام اسکرول یا کلیک
        ['click', 'scroll', 'keypress'].forEach(event => {
            document.addEventListener(event, () => {
                this.updateOnlineUsers();
            }, { passive: true });
        });
    }
}

// سیستم ثبت نام
function initRegistrationSystem() {
    const registerBtn = document.getElementById('registerBtn');
    const userEmail = document.getElementById('userEmail');
    const userPassword = document.getElementById('userPassword');
    const registerMessage = document.getElementById('registerMessage');
    
    registerBtn.addEventListener('click', function() {
        const email = userEmail.value.trim();
        const password = userPassword.value.trim();
        
        if (!email || !password) {
            showMessage(registerMessage, 'لطفا تمام فیلدها را پر کنید.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage(registerMessage, 'لطفا یک ایمیل معتبر وارد کنید.', 'error');
            return;
        }
        
        // بررسی وجود ایمیل در سیستم
        const users = JSON.parse(localStorage.getItem('bloodstrike_users') || '[]');
        const existingUser = users.find(user => user.email === email);
        
        if (existingUser) {
            showMessage(registerMessage, 'این ایمیل قبلا ثبت شده است.', 'error');
            return;
        }
        
        // تولید نام تصادفی
        const randomName = generateRandomName();
        
        // ایجاد کاربر جدید
        const newUser = {
            id: 'user_' + Date.now(),
            name: randomName,
            email: email,
            password: password, // در محیط واقعی باید هش شود
            createdAt: new Date().toISOString()
        };
        
        // ذخیره کاربر
        users.push(newUser);
        localStorage.setItem('bloodstrike_users', JSON.stringify(users));
        
        // نمایش پیام موفقیت
        showMessage(registerMessage, `حساب کاربری با موفقیت ایجاد شد! نام کاربری شما: ${randomName}`, 'success');
        
        // پاک کردن فرم
        userEmail.value = '';
        userPassword.value = '';
        
        // به‌روزرسانی لیست کاربران آنلاین
        const visitTracker = new VisitTracker();
        visitTracker.updateOnlineUsers();
    });
}

// سیستم پیشنهادات
function initSuggestionsSystem() {
    const submitSuggestion = document.getElementById('submitSuggestion');
    const suggestionText = document.getElementById('suggestionText');
    const suggestionMessage = document.getElementById('suggestionMessage');
    
    submitSuggestion.addEventListener('click', function() {
        const text = suggestionText.value.trim();
        
        if (!text) {
            showMessage(suggestionMessage, 'لطفا پیشنهاد خود را وارد کنید.', 'error');
            return;
        }
        
        // دریافت کاربران برای شناسایی کاربر فعلی
        const users = JSON.parse(localStorage.getItem('bloodstrike_users') || '[]');
        const currentUser = users.length > 0 ? users[users.length - 1] : null;
        
        // ایجاد پیشنهاد جدید
        const newSuggestion = {
            id: 'suggestion_' + Date.now(),
            userId: currentUser ? currentUser.id : 'guest',
            userName: currentUser ? currentUser.name : 'کاربر مهمان',
            text: text,
            createdAt: new Date().toISOString()
        };
        
        // ذخیره پیشنهاد
        const suggestions = JSON.parse(localStorage.getItem('bloodstrike_suggestions') || '[]');
        suggestions.push(newSuggestion);
        localStorage.setItem('bloodstrike_suggestions', JSON.stringify(suggestions));
        
        // نمایش پیام موفقیت
        showMessage(suggestionMessage, 'پیشنهاد شما با موفقیت ثبت شد. با تشکر!', 'success');
        
        // پاک کردن فرم
        suggestionText.value = '';
    });
}

// سیستم تبلیغات
function initAdvertisementSystem() {
    const advertisement = document.getElementById('advertisement');
    const adClose = document.getElementById('adClose');
    
    // نمایش تبلیغ پس از 30 ثانیه
    setTimeout(() => {
        advertisement.style.display = 'block';
    }, 30000);
    
    // بستن تبلیغ
    adClose.addEventListener('click', function() {
        advertisement.style.display = 'none';
    });
    
    // نمایش مجدد تبلیغ هر 1 دقیقه
    setInterval(() => {
        advertisement.style.display = 'block';
    }, 60000);
}

// سیستم پنل مدیریت
function initAdminPanel() {
    const adminLoginLink = document.getElementById('adminLoginLink');
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminClose = document.getElementById('adminClose');
    const adminLogout = document.getElementById('adminLogout');
    const adminEmail = document.getElementById('adminEmail');
    const adminPassword = document.getElementById('
