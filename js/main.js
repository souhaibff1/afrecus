// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    console.log('Afrecus Website Initialized');
    
    // 1. تعيين سنة التذييل
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // 2. تفعيل Lazy Loading للصور
    enableLazyLoading();
    
    // 3. تبديل القائمة المتنقلة
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // 4. تبديل الوضع الداكن/فاتح
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('afrecus_theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('afrecus_theme', 'light');
            console.log('Theme changed to Light Mode');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('afrecus_theme', 'dark');
            console.log('Theme changed to Dark Mode');
        }
        
        // تحديث الأنيميشن بعد تغيير الثيم
        updateAnimations();
    });
    
    // 5. تبديل اللغة
    const langAr = document.getElementById('langAr');
    const langEn = document.getElementById('langEn');
    const savedLang = localStorage.getItem('afrecus_language') || 'ar';
    
    // تطبيق اللغة المحفوظة
    if (savedLang === 'en') {
        switchLanguage('en');
        langAr.classList.remove('active');
        langEn.classList.add('active');
        console.log('Language set to English');
    } else {
        console.log('Language set to Arabic');
    }
    
    // أحداث أزرار اللغة
    langAr.addEventListener('click', function() {
        switchLanguage('ar');
        langAr.classList.add('active');
        langEn.classList.remove('active');
        localStorage.setItem('afrecus_language', 'ar');
        console.log('Language switched to Arabic');
    });
    
    langEn.addEventListener('click', function() {
        switchLanguage('en');
        langAr.classList.remove('active');
        langEn.classList.add('active');
        localStorage.setItem('afrecus_language', 'en');
        console.log('Language switched to English');
    });
    
    // 6. التمرير السلس للروابط
    setupSmoothScrolling();
    
    // 7. تحميل الصور Lazy
    loadLazyImages();
    
    // 8. تحديث الأنيميشن
    updateAnimations();
    
    // 9. تأثيرات عند التمرير
    setupScrollEffects();
});

// دالة تفعيل Lazy Loading
function enableLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تحميل الصور Lazy
function loadLazyImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
            });
        }
    });
}

// دالة تبديل اللغة
function switchLanguage(lang) {
    const isEnglish = lang === 'en';
    
    // تحديث اتجاه الصفحة
    if (isEnglish) {
        document.body.classList.add('ltr');
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    } else {
        document.body.classList.remove('ltr');
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    }
    
    // تحديث كل النصوص
    updateAllTexts(lang);
    
    // تحديث شريط الأخبار
    updateNewsTickerDirection(lang);
    
    // تحديث حالة البث
    if (window.streamStatusManager) {
        window.streamStatusManager.updateLanguage(lang);
    }
    
    // تحديث عناوين السلايدر
    updateSliderTitles(lang);
    
    // إرسال حدث تغيير اللغة
    const languageEvent = new CustomEvent('languageChanged', { 
        detail: { 
            language: lang,
            timestamp: new Date().toISOString()
        } 
    });
    document.dispatchEvent(languageEvent);
    
    console.log('Language switched to:', lang);
}

// تحديث جميع النصوص
function updateAllTexts(lang) {
    const elements = document.querySelectorAll('[data-ar], [data-en]');
    let updatedCount = 0;
    
    elements.forEach(element => {
        if (lang === 'en' && element.hasAttribute('data-en')) {
            const englishText = element.getAttribute('data-en');
            if (englishText && englishText.trim() !== '') {
                element.textContent = englishText;
                updatedCount++;
            }
        } else if (lang === 'ar' && element.hasAttribute('data-ar')) {
            const arabicText = element.getAttribute('data-ar');
            if (arabicText && arabicText.trim() !== '') {
                element.textContent = arabicText;
                updatedCount++;
            }
        }
    });
    
    console.log(`Updated ${updatedCount} text elements for ${lang} language`);
}

// تحديث عناوين السلايدر
function updateSliderTitles(lang) {
    const titles = document.querySelectorAll('.slider-track .title');
    titles.forEach((title, index) => {
        if (lang === 'en' && title.hasAttribute('data-en')) {
            const englishText = title.getAttribute('data-en');
            if (englishText) {
                title.textContent = englishText;
                title.classList.add('title-transition');
            }
        } else if (lang === 'ar' && title.hasAttribute('data-ar')) {
            const arabicText = title.getAttribute('data-ar');
            if (arabicText) {
                title.textContent = arabicText;
                title.classList.add('title-transition');
            }
        }
    });
    
    setTimeout(() => {
        titles.forEach(title => title.classList.remove('title-transition'));
    }, 300);
}

// تحديث اتجاه شريط الأخبار
function updateNewsTickerDirection(lang) {
    const ticker = document.querySelector('.ticker-content');
    if (!ticker) return;
    
    // إيقاف الأنيميشن الحالية
    ticker.style.animation = 'none';
    
    setTimeout(() => {
        if (lang === 'en') {
            ticker.style.paddingRight = '0';
            ticker.style.paddingLeft = '100%';
            ticker.style.animation = 'ticker-ltr 30s linear infinite';
        } else {
            ticker.style.paddingRight = '100%';
            ticker.style.paddingLeft = '0';
            ticker.style.animation = 'ticker 30s linear infinite';
        }
    }, 10);
}

// التمرير السلس
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // تحديث URL بدون إعادة تحميل الصفحة
                history.pushState(null, null, targetId);
            }
        });
    });
}

// تحديث الأنيميشن
function updateAnimations() {
    // إعادة تشغيل أنيميشن السلايدر
    const sliderTrack = document.querySelector('.slider-track');
    if (sliderTrack) {
        const animation = sliderTrack.style.animation;
        sliderTrack.style.animation = 'none';
        
        setTimeout(() => {
            sliderTrack.style.animation = animation;
        }, 10);
    }
    
    // إعادة تشغيل أنيميشن شريط الأخبار
    const ticker = document.querySelector('.ticker-content');
    if (ticker) {
        const animation = ticker.style.animation;
        ticker.style.animation = 'none';
        
        setTimeout(() => {
            ticker.style.animation = animation;
        }, 10);
    }
}

// تأثيرات عند التمرير
function setupScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر
    const elementsToAnimate = document.querySelectorAll('.profile-card, .about-content, .social-card, .discord-card, .rules-list');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// دالة مساعدة للتحقق من الاتصال بالإنترنت
function checkOnlineStatus() {
    if (!navigator.onLine) {
        console.warn('User is offline');
        // يمكن إضافة رسالة للمستخدم هنا
    }
}

// التحقق من الاتصال عند التحميل وعند التغيير
window.addEventListener('load', checkOnlineStatus);
window.addEventListener('online', () => {
    console.log('User is back online');
    // تحديث البيانات إذا لزم الأمر
});
window.addEventListener('offline', checkOnlineStatus);

// منع السلوك الافتراضي للنماذج
document.addEventListener('submit', function(e) {
    e.preventDefault();
});

// تحسين أداء التمرير
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    document.body.classList.add('scrolling');
    
    scrollTimeout = setTimeout(function() {
        document.body.classList.remove('scrolling');
    }, 100);
});

// إضافة فئة للجسم عند تحميل الصفحة
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // إخفاء مؤشر التحميل إذا كان موجوداً
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// تسجيل الأخطاء
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.message, 'at', e.filename, 'line', e.lineno);
});

// دعم خدمة العمال (Service Worker) - اختياري
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope:', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}

// API للصفحة الإدارية (اختياري)
window.AfrecusAPI = {
    getSiteInfo: function() {
        return {
            version: '2.0.0',
            lastUpdate: new Date().toISOString(),
            features: ['Multi-language', 'Dark/Light Mode', 'Live Stream Status', 'News Management']
        };
    },
    
    resetSettings: function() {
        if (confirm('Are you sure you want to reset all settings?')) {
            localStorage.removeItem('afrecus_theme');
            localStorage.removeItem('afrecus_language');
            localStorage.removeItem('afrecus_news_config');
            location.reload();
        }
    }
};
