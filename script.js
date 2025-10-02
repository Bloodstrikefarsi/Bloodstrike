// اسکریپت برای تعاملی کردن سایت
document.addEventListener('DOMContentLoaded', function() {
    // منوی هامبورگر
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // بستن منو هنگام کلیک روی لینک
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', function() {
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
    
    // افکت پارالاکس برای پس‌زمینه
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.particle');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) translateZ(0)`;
        });
        
        // افکت شیشه‌ای برای هدر
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(15, 15, 26, 0.95)';
                header.style.backdropFilter = 'blur(30px)';
            } else {
                header.style.background = 'rgba(15, 15, 26, 0.8)';
                header.style.backdropFilter = 'blur(20px)';
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
                entry.target.style.transform = 'translateY(0) translateZ(0)';
            }
        });
    }, observerOptions);
    
    // مشاهده عناصر برای انیمیشن
    document.querySelectorAll('.game-card, .fun-card, .social-card, .feature, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) translateZ(0)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // افکت hover سه بعدی برای کارت‌ها
    document.querySelectorAll('.game-card, .fun-card, .social-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // سیستم ساده آمار بازدید
    function trackVisit() {
        let visitData = JSON.parse(localStorage.getItem('site_visits') || '{}');
        const today = new Date().toDateString();
        
        visitData.totalVisits = (visitData.totalVisits || 0) + 1;
        
        if (visitData.lastVisitDate !== today) {
            visitData.todayVisits = 1;
            visitData.lastVisitDate = today;
        } else {
            visitData.todayVisits = (visitData.todayVisits || 0) + 1;
        }
        
        localStorage.setItem('site_visits', JSON.stringify(visitData));
    }
    
    trackVisit();
    
    // افکت تایپ برای عنوان هیرو
    function initTypeEffect() {
        const titleWords = document.querySelectorAll('.title-word');
        titleWords.forEach((word, index) => {
            word.style.animationDelay = `${index * 0.2}s`;
        });
    }
    
    initTypeEffect();
    
    // مدیریت رسپانسیو
    function handleResize() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // پیش‌بارگذاری تصاویر و فونت‌ها
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// افکت‌های پیشرفته سه بعدی
function initAdvanced3DEffects() {
    // افکت مousse move برای کل صفحه
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const depth = (index + 1) * 20;
            const moveX = (mouseX - 0.5) * depth;
            const moveY = (mouseY - 0.5) * depth;
            
            particle.style.transform = `translate(${moveX}px, ${moveY}px) translateZ(0)`;
        });
    });
}

// راه‌اندازی افکت‌های پیشرفته پس از بارگذاری
window.addEventListener('load', initAdvanced3DEffects);
