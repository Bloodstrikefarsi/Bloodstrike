// اسکریپت برای منوی هامبورگر و اسکرول نرم
document.addEventListener('DOMContentLoaded', function() {
    // سیستم تشخیص ربات - باید اول اجرا شود
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        initBotDetection();
    } else {
        // برای صفحات دیگر مستقیماً سایت را راه‌اندازی کن
        initializeSite();
    }
    
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
    
    // سیستم ساعت و تاریخ
    initDateTimeSystem();
    
    // بارگذاری اخبار
    loadNews();
    
    // بارگذاری بخش معرفی
    loadAboutContent();
}

// سیستم تشخیص ربات - کاملاً بازنویسی شده
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
    if (captchaMessage) captchaMessage.style.display = 'none';
    
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
        if (captchaMessage) {
            if (message) {
                captchaMessage.textContent = message;
                captchaMessage.className = `message ${type}`;
                captchaMessage.style.display = 'block';
            } else {
                captchaMessage.style.display = 'none';
            }
        }
    }
    
    // فوکوس روی فیلد ورودی
    captchaInput.focus();
}

// سیستم آمار بازدید و کاربران آنلاین - بهبود یافته
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

    // به‌روزرسانی کاربران آنلاین - بهبود یافته
    updateOnlineUsers() {
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000; // 15 دقیقه
        
        // دریافت لیست کاربران آنلاین
        let onlineUsers = this.getOnlineUsers();
        
        // دریافت کاربر فعلی
        const currentUser = this.getCurrentUser();
        
        // اگر کاربر فعلی وجود دارد، آن را به‌روزرسانی کن
        if (currentUser) {
            onlineUsers[currentUser.id] = {
                id: currentUser.id,
                lastActive: now,
                name: currentUser.username,
                avatar: currentUser.avatar,
                isRegistered: true
            };
        } else {
            // اگر کاربر مهمان است، یک شناسه ثابت برایش ایجاد کن
            const guestId = localStorage.getItem('guestUserId');
            if (!guestId) {
                const newGuestId = 'guest_' + this.generateSessionId();
                localStorage.setItem('guestUserId', newGuestId);
                onlineUsers[newGuestId] = {
                    id: newGuestId,
                    lastActive: now,
                    name: this.generateRandomGamingName(),
                    avatar: this.generateRandomAvatar(),
                    isRegistered: false
                };
            } else {
                onlineUsers[guestId] = {
                    id: guestId,
                    lastActive: now,
                    name: this.generateRandomGamingName(),
                    avatar: this.generateRandomAvatar(),
                    isRegistered: false
                };
            }
        }
        
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

    // دریافت کاربر فعلی
    getCurrentUser() {
        const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
        const currentUserId = localStorage.getItem('currentUserId');
        
        if (currentUserId) {
            return users.find(user => user.id === currentUserId);
        }
        return null;
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

    // تولید نام تصادفی گیمینگ برای کاربر مهمان
    generateRandomGamingName() {
        const names = [
            'ShadowHunter', 'DragonSlayer', 'NightWolf', 'PhoenixRising', 
            'CyberGhost', 'SteelTitan', 'QuantumBlade', 'NeonSpecter',
            'VoidWalker', 'IronFist', 'CrimsonKing', 'SolarFlare',
            'DarkKnight', 'BlazeWarrior', 'FrostGiant', 'ThunderStorm'
        ];
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
            const activeUsers = Object.values(users).filter(user => 
                Date.now() - user.lastActive < 15 * 60 * 1000
            );
            onlineUsersElement.textContent = activeUsers.length;
        }
        
        // به‌روزرسانی لیست کاربران
        if (onlineUsersListElement) {
            const userList = Object.values(users).filter(user => 
                Date.now() - user.lastActive < 15 * 60 * 1000
            );
            
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

// سیستم ثبت نام - بهبود یافته
function initRegistrationSystem() {
    const registerBtn = document.getElementById('registerBtn');
    const userEmail = document.getElementById('userEmail');
    const userPassword = document.getElementById('userPassword');
    const username = document.getElementById('username');
    const registerMessage = document.getElementById('registerMessage');
    
    if (!registerBtn || !userEmail || !userPassword || !username) return;
    
    registerBtn.addEventListener('click', function() {
        const email = userEmail.value.trim();
        const password = userPassword.value.trim();
        const userUsername = username.value.trim();
        
        if (!email || !password || !userUsername) {
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
        
        // بررسی وجود نام کاربری
        const existingUsername = users.find(user => user.username === userUsername);
        if (existingUsername) {
            showMessage(registerMessage, 'این نام کاربری قبلا انتخاب شده است.', 'error');
            return;
        }
        
        // ایجاد کاربر جدید
        const newUser = {
            id: 'user_' + Date.now(),
            username: userUsername,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // ذخیره کاربر
        users.push(newUser);
        localStorage.setItem('bloodstrike_users', JSON.stringify(users));
        
        // تنظیم کاربر فعلی
        localStorage.setItem('currentUserId', newUser.id);
        
        // نمایش پیام موفقیت
        showMessage(registerMessage, `حساب کاربری با موفقیت ایجاد شد! نام کاربری شما: ${userUsername}`, 'success');
        
        // پاک کردن فرم
        userEmail.value = '';
        userPassword.value = '';
        username.value = '';
        
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
    
    if (!submitSuggestion || !suggestionText) return;
    
    submitSuggestion.addEventListener('click', function() {
        const text = suggestionText.value.trim();
        
        if (!text) {
            showMessage(suggestionMessage, 'لطفا پیشنهاد خود را وارد کنید.', 'error');
            return;
        }
        
        // دریافت کاربر فعلی
        const users = JSON.parse(localStorage.getItem('bloodstrike_users') || '[]');
        const currentUserId = localStorage.getItem('currentUserId');
        const currentUser = currentUserId ? users.find(user => user.id === currentUserId) : null;
        
        // ایجاد پیشنهاد جدید
        const newSuggestion = {
            id: 'suggestion_' + Date.now(),
            userId: currentUser ? currentUser.id : 'guest',
            username: currentUser ? currentUser.username : 'کاربر مهمان',
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
    
    if (!advertisement || !adClose) return;
    
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

// سیستم پنل مدیریت - بهبود یافته
function initAdminPanel() {
    const adminLoginLink = document.getElementById('adminLoginLink');
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminClose = document.getElementById('adminClose');
    const adminLogout = document.getElementById('adminLogout');
    const adminEmail = document.getElementById('adminEmail');
    const adminPassword = document.getElementById('adminPassword');
    const adminPhone = document.getElementById('adminPhone');
    const adminMessage = document.getElementById('adminMessage');
    const adminContent = document.getElementById('adminContent');
    
    if (!adminLoginLink || !adminPanel) return;
    
    // باز کردن پنل مدیریت
    adminLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        adminPanel.style.display = 'flex';
        // پاک کردن فیلدها هنگام باز کردن پنل
        if (adminEmail) adminEmail.value = '';
        if (adminPassword) adminPassword.value = '';
        if (adminPhone) adminPhone.value = '';
        if (adminMessage) adminMessage.textContent = '';
    });
    
    // بستن پنل مدیریت
    adminClose.addEventListener('click', function() {
        adminPanel.style.display = 'none';
    });
    
    // ورود به پنل مدیریت
    adminLoginBtn.addEventListener('click', function() {
        const email = adminEmail.value.trim();
        const password = adminPassword.value.trim();
        const phone = adminPhone.value.trim();
        
        // اطلاعات ورود صحیح
        const correctEmail = 'bloodstrikefarsi80@gmail.com';
        const correctPassword = 'SALAMISH85@';
        const correctPhone = '13820126';
        
        if (email === correctEmail && password === correctPassword && phone === correctPhone) {
            // نمایش بخش مدیریت
            document.querySelector('.admin-login').style.display = 'none';
            adminContent.style.display = 'block';
            
            // بارگذاری داده‌ها
            loadAdminData();
        } else {
            showMessage(adminMessage, 'ایمیل، رمز عبور یا شماره موبایل اشتباه است.', 'error');
        }
    });
    
    // خروج از پنل مدیریت
    adminLogout.addEventListener('click', function() {
        adminContent.style.display = 'none';
        document.querySelector('.admin-login').style.display = 'block';
        adminPanel.style.display = 'none';
        if (adminEmail) adminEmail.value = '';
        if (adminPassword) adminPassword.value = '';
        if (adminPhone) adminPhone.value = '';
        if (adminMessage) adminMessage.textContent = '';
    });
    
    // مدیریت اخبار
    const addNewsBtn = document.getElementById('addNewsBtn');
    if (addNewsBtn) {
        addNewsBtn.addEventListener('click', function() {
            const newsTitle = document.getElementById('newsTitle').value.trim();
            const newsContent = document.getElementById('newsContent').value.trim();
            
            if (!newsTitle || !newsContent) {
                alert('لطفا عنوان و متن خبر را وارد کنید.');
                return;
            }
            
            const newNews = {
                id: 'news_' + Date.now(),
                title: newsTitle,
                content: newsContent,
                createdAt: new Date().toISOString()
            };
            
            const news = JSON.parse(localStorage.getItem('bloodstrike_news') || '[]');
            news.unshift(newNews); // اضافه کردن به ابتدای لیست
            localStorage.setItem('bloodstrike_news', JSON.stringify(news));
            
            // پاک کردن فرم
            document.getElementById('newsTitle').value = '';
            document.getElementById('newsContent').value = '';
            
            // بارگذاری مجدد اخبار
            loadAdminData();
            loadNews();
            
            alert('خبر با موفقیت اضافه شد.');
        });
    }
    
    // مدیریت بخش معرفی
    const saveAboutBtn = document.getElementById('saveAboutBtn');
    if (saveAboutBtn) {
        saveAboutBtn.addEventListener('click', function() {
            const aboutContent = document.getElementById('aboutContentAdmin').value.trim();
            
            if (!aboutContent) {
                alert('لطفا متن معرفی را وارد کنید.');
                return;
            }
            
            localStorage.setItem('bloodstrike_about', aboutContent);
            loadAboutContent();
            
            alert('متن معرفی با موفقیت ذخیره شد.');
        });
    }
}

// بارگذاری داده‌ها در پنل مدیریت
function loadAdminData() {
    // بارگذاری آمار
    const visitData = JSON.parse(localStorage.getItem('bloodstrike_visits') || '{}');
    const adminTotalVisits = document.getElementById('adminTotalVisits');
    const adminTodayVisits = document.getElementById('adminTodayVisits');
    
    if (adminTotalVisits) adminTotalVisits.textContent = visitData.totalVisits || 0;
    if (adminTodayVisits) adminTodayVisits.textContent = visitData.todayVisits || 0;
    
    // بارگذاری کاربران
    const users = JSON.parse(localStorage.getItem('bloodstrike_users') || '[]');
    const adminUserCount = document.getElementById('adminUserCount');
    if (adminUserCount) adminUserCount.textContent = users.length;
    
    const usersList = document.getElementById('usersList');
    if (usersList) {
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>هیچ کاربری ثبت‌نام نکرده است.</p>';
        } else {
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'admin-list-item';
                userElement.innerHTML = `
                    <div>
                        <strong>${user.username}</strong>
                        <br>
                        <small>نام کاربری</small>
                    </div>
                    <small>${new Date(user.createdAt).toLocaleDateString('fa-IR')}</small>
                `;
                usersList.appendChild(userElement);
            });
        }
    }
    
    // بارگذاری پیشنهادات
    const suggestions = JSON.parse(localStorage.getItem('bloodstrike_suggestions') || '[]');
    const suggestionsList = document.getElementById('suggestionsList');
    if (suggestionsList) {
        suggestionsList.innerHTML = '';
        
        if (suggestions.length === 0) {
            suggestionsList.innerHTML = '<p>هیچ پیشنهادی ثبت نشده است.</p>';
        } else {
            suggestions.forEach(suggestion => {
                const suggestionElement = document.createElement('div');
                suggestionElement.className = 'admin-list-item';
                suggestionElement.innerHTML = `
                    <div>
                        <strong>${suggestion.username}</strong>
                        <p>${suggestion.text}</p>
                    </div>
                    <small>${new Date(suggestion.createdAt).toLocaleDateString('fa-IR')}</small>
                `;
                suggestionsList.appendChild(suggestionElement);
            });
        }
    }
    
    // بارگذاری اخبار در پنل مدیریت
    const news = JSON.parse(localStorage.getItem('bloodstrike_news') || '[]');
    const newsList = document.getElementById('newsList');
    if (newsList) {
        newsList.innerHTML = '';
        
        if (news.length === 0) {
            newsList.innerHTML = '<p>هیچ خبری ثبت نشده است.</p>';
        } else {
            news.forEach(newsItem => {
                const newsElement = document.createElement('div');
                newsElement.className = 'admin-list-item';
                newsElement.innerHTML = `
                    <div>
                        <strong>${newsItem.title}</strong>
                        <p>${newsItem.content}</p>
                    </div>
                    <small>${new Date(newsItem.createdAt).toLocaleDateString('fa-IR')}</small>
                `;
                newsList.appendChild(newsElement);
            });
        }
    }
    
    // بارگذاری محتوای بخش معرفی در پنل مدیریت
    const aboutContent = localStorage.getItem('bloodstrike_about') || '';
    const aboutContentAdmin = document.getElementById('aboutContentAdmin');
    if (aboutContentAdmin) {
        aboutContentAdmin.value = aboutContent;
    }
}

// بارگذاری اخبار در صفحه اصلی
function loadNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    const news = JSON.parse(localStorage.getItem('bloodstrike_news') || '[]');
    
    if (news.length === 0) {
        newsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <p>هنوز خبری منتشر نشده است</p>
            </div>
        `;
    } else {
        newsContainer.innerHTML = news.map(newsItem => `
            <div class="news-card">
                <h3>${newsItem.title}</h3>
                <p>${newsItem.content}</p>
                <small>${new Date(newsItem.createdAt).toLocaleDateString('fa-IR')}</small>
            </div>
        `).join('');
    }
}

// بارگذاری محتوای بخش معرفی
function loadAboutContent() {
    const aboutContent = document.getElementById('aboutContent');
    if (!aboutContent) return;
    
    const content = localStorage.getItem('bloodstrike_about') || '';
    
    if (!content) {
        aboutContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-info-circle"></i>
                <p>محتوای معرفی هنوز اضافه نشده است</p>
            </div>
        `;
    } else {
        aboutContent.innerHTML = `
            <div class="about-text">
                <p>${content}</p>
            </div>
        `;
    }
}

// سیستم ساعت و تاریخ
function initDateTimeSystem() {
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const persianDate = now.toLocaleDateString('fa-IR', options);
        const datetimeElement = document.getElementById('datetime');
        if (datetimeElement) {
            datetimeElement.textContent = persianDate;
        }
    }
    
    // به‌روزرسانی هر ثانیه
    setInterval(updateDateTime, 1000);
    updateDateTime();
}

// تابع کمکی برای نمایش پیام
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // پنهان کردن خودکار پیام پس از 5 ثانیه
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// تابع کمکی برای بررسی ایمیل
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
