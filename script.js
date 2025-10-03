// اسکریپت اصلی سایت
document.addEventListener('DOMContentLoaded', function() {
    // سیستم آمار بازدید و کاربران آنلاین
    const visitTracker = new VisitTracker();
    
    // سیستم ساعت و تاریخ
    initDateTimeSystem();
    
    // سیستم تبلیغات
    initAdvertisementSystem();
    
    // به‌روزرسانی اولیه نمایش
    const visitData = visitTracker.getVisitData();
    visitTracker.updateDisplay(visitData);
    
    const onlineUsers = visitTracker.getOnlineUsers();
    visitTracker.updateOnlineUsersDisplay(onlineUsers);
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
            lastActive: now
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

    // به‌روزرسانی نمایش آمار
    updateDisplay(data) {
        const totalVisitsElement = document.getElementById('totalVisits');
        const totalVisitsCounter = document.getElementById('totalVisitsCounter');
        const todayVisitsCounter = document.getElementById('todayVisitsCounter');
        
        if (totalVisitsElement) {
            totalVisitsElement.textContent = this.formatNumber(data.totalVisits || 0);
        }
        
        if (totalVisitsCounter) {
            totalVisitsCounter.textContent = this.formatNumber(data.totalVisits || 0);
        }
        
        if (todayVisitsCounter) {
            todayVisitsCounter.textContent = this.formatNumber(data.todayVisits || 0);
        }
    }

    // به‌روزرسانی نمایش کاربران آنلاین
    updateOnlineUsersDisplay(users) {
        const onlineUsersElement = document.getElementById('onlineUsers');
        const onlineUsersCounter = document.getElementById('onlineUsersCounter');
        const userCount = Object.keys(users).length;
        
        if (onlineUsersElement) {
            onlineUsersElement.textContent = userCount;
        }
        
        if (onlineUsersCounter) {
            onlineUsersCounter.textContent = userCount;
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

// سیستم تبلیغات
function initAdvertisementSystem() {
    const advertisement = document.getElementById('advertisement');
    const adClose = document.getElementById('adClose');
    
    if (!advertisement || !adClose) return;
    
    // نمایش تبلیغ پس از 60 ثانیه
    setTimeout(() => {
        advertisement.style.display = 'block';
    }, 60000);
    
    // بستن تبلیغ
    adClose.addEventListener('click', function() {
        advertisement.style.display = 'none';
    });
    
    // نمایش مجدد تبلیغ هر 1 دقیقه
    setInterval(() => {
        advertisement.style.display = 'block';
    }, 60000);
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
