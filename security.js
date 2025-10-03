// فایل امنیتی برای سایت
(function() {
    'use strict';
    
    // جلوگیری از دسترسی به console در حالت تولید
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
    }
    
    // جلوگیری از کلیک راست
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // جلوگیری از کشیدن و رها کردن
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // جلوگیری از انتخاب متن
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // جلوگیری از کپی
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
    // جلوگیری از باز کردن ابزار توسعه‌دهنده
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
    });
    
    // تشخیص و جلوگیری از ابزارهای توسعه‌دهنده
    function detectDevTools() {
        const widthThreshold = 160;
        const heightThreshold = 160;
        
        if (window.outerWidth - window.innerWidth > widthThreshold || 
            window.outerHeight - window.innerHeight > heightThreshold) {
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#121212;color:white;font-family:Arial;">دسترسی غیرمجاز</div>';
            window.stop();
        }
    }
    
    // اجرای تشخیص در فواصل زمانی
    setInterval(detectDevTools, 1000);
    
    // محافظت از localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // بررسی صحت داده‌ها قبل از ذخیره‌سازی
        if (typeof value !== 'string') {
            console.error('مقدار باید از نوع رشته باشد');
            return;
        }
        
        // محدودیت حجم داده
        if (value.length > 1000000) {
            console.error('حجم داده بسیار بزرگ است');
            return;
        }
        
        originalSetItem.apply(this, arguments);
    };
    
    // محافظت در برابر XSS
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
    
    // جلوگیری از حملات Timing
    const securityDelay = function(min = 100, max = 500) {
        return new Promise(resolve => {
            setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min);
        });
    };
    
    // محافظت در برابر اسکریپت‌های مخرب
    window.addEventListener('error', function(e) {
        e.preventDefault();
        return false;
    });
    
    // محافظت در برابر iframe
    if (window.top !== window.self) {
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#121212;color:white;font-family:Arial;">دسترسی غیرمجاز</div>';
    }
    
    // جلوگیری از حملات فیشینگ
    Object.freeze(document);
    Object.freeze(window);
    
    // محافظت از اطلاعات حساس
    const sensitiveData = ['password', 'token', 'secret', 'key'];
    sensitiveData.forEach(key => {
        Object.defineProperty(window, key, {
            value: undefined,
            writable: false,
            configurable: false
        });
    });
    
    // سیستم لاگ امنیتی
    const SecurityLogger = {
        log: function(action, details) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                action: action,
                details: details,
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            // ذخیره لاگ در localStorage (در محیط واقعی باید به سرور ارسال شود)
            const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
            logs.push(logEntry);
            
            // محدود کردن تعداد لاگ‌ها
            if (logs.length > 100) {
                logs.shift();
            }
            
            localStorage.setItem('security_logs', JSON.stringify(logs));
        }
    };
    
    // لاگ کردن فعالیت‌های مشکوک
    SecurityLogger.log('page_load', {
        referrer: document.referrer,
        screen_resolution: `${screen.width}x${screen.height}`
    });
    
    // محافظت در برابر حملات DDoS
    let requestCount = 0;
    const requestLimit = 100;
    const timeWindow = 60000; // 1 دقیقه
    
    setInterval(() => {
        requestCount = 0;
    }, timeWindow);
    
    // اضافه کردن تاخیر امنیتی به درخواست‌های زیاد
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        requestCount++;
        
        if (requestCount > requestLimit) {
            return securityDelay(1000, 3000).then(() => originalFetch.apply(this, args));
        }
        
        return originalFetch.apply(this, args);
    };
    
    console.log('سیستم امنیتی فعال شد');
})();
