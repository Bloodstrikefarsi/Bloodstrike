// اسکریپت برای منوی هامبورگر و اسکرول نرم
document.addEventListener('DOMContentLoaded', function() {
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
    document.querySelectorAll('.game-card, .social-card, .about-text, .about-image, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // سیستم آمار بازدید و کاربران آنلاین
    class VisitTracker {
        constructor() {
            this.storageKey = 'bloodstrike_visits';
            this.onlineUsersKey = 'bloodstrike_online_users';
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
            
            // افزودن یا به‌روزرسانی کاربر فعلی
            onlineUsers[this.currentSessionId] = {
                id: this.currentSessionId,
                lastActive: now,
                name: this.generateRandomName(),
                avatar: this.generateRandomAvatar()
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
                                    <span>آنلاین</span>
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

    // مقداردهی سیستم آمار
    const visitTracker = new VisitTracker();
    
    // به‌روزرسانی اولیه نمایش
    const visitData = visitTracker.getVisitData();
    visitTracker.updateDisplay(visitData);
    
    const onlineUsers = visitTracker.getOnlineUsers();
    visitTracker.updateOnlineUsersDisplay(onlineUsers);
});
