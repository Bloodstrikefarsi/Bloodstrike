// اسکریپت برای سایت
document.addEventListener('DOMContentLoaded', function() {
    // سیستم ساعت و تاریخ
    initDateTimeSystem();
    
    // سیستم تبلیغات
    initAdvertisementSystem();
    
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
    document.querySelectorAll('.news-card, .game-feature, .stat-card, .social-card, .fun-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

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
        document.getElementById('datetime').textContent = persianDate;
    }
    
    // به‌روزرسانی هر ثانیه
    setInterval(updateDateTime, 1000);
    updateDateTime();
}

// سیستم تبلیغات
function initAdvertisementSystem() {
    const advertisement = document.getElementById('advertisement');
    const adClose = document.getElementById('adClose');
    
    if (!advertisement || !adClose) return;
    
    // نمایش تبلیغ پس از 10 ثانیه
    setTimeout(() => {
        advertisement.style.display = 'block';
    }, 10000);
    
    // بستن تبلیغ
    adClose.addEventListener('click', function() {
        advertisement.style.display = 'none';
    });
    
    // نمایش مجدد تبلیغ هر 1 دقیقه
    setInterval(() => {
        advertisement.style.display = 'block';
    }, 60000);
    
    // غیرفعال کردن لینک تبلیغات
    const adLink = advertisement.querySelector('a');
    if (adLink) {
        adLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('این بخش در حال حاضر غیرفعال است.');
        });
    }
}
