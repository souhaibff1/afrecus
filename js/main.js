// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    // 1. تعيين سنة التذييل
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // 2. تبديل القائمة المتنقلة
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
    
    // 3. تبديل الوضع الداكن/فاتح
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // 4. تبديل اللغة
    const langAr = document.getElementById('langAr');
    const langEn = document.getElementById('langEn');
    const savedLang = localStorage.getItem('language') || 'ar';
    
    // تطبيق اللغة المحفوظة
    if (savedLang === 'en') {
        switchLanguage('en');
        langAr.classList.remove('active');
        langEn.classList.add('active');
    }
    
    // أحداث أزرار اللغة
    langAr.addEventListener('click', function() {
        switchLanguage('ar');
        langAr.classList.add('active');
        langEn.classList.remove('active');
        localStorage.setItem('language', 'ar');
    });
    
    langEn.addEventListener('click', function() {
        switchLanguage('en');
        langAr.classList.remove('active');
        langEn.classList.add('active');
        localStorage.setItem('language', 'en');
    });
    
    // 5. فحص حالة البث
    checkStreamStatus();
    
    // 6. تشغيل الأخبار (سيتم تشغيلها من news.js)
    
    // 7. تغيير الجمل التحفيزية
    rotateMotivationalQuotes();
    
    // 8. التمرير السلس للروابط
    setupSmoothScrolling();
});

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
    
    // تحديث الجملة التحفيزية
    updateMotivationalQuote(lang);
    
    // تحديث حالة البث
    updateStreamStatusText(lang);
    
    // تحديث عناوين السلايدر
    updateSliderTitles(lang);
    
    // إرسال حدث تغيير اللغة
    const languageEvent = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(languageEvent);
    
    console.log('Language switched to:', lang);
}

// تحديث جميع النصوص
function updateAllTexts(lang) {
    document.querySelectorAll('[data-ar], [data-en]').forEach(element => {
        if (lang === 'en' && element.hasAttribute('data-en')) {
            const englishText = element.getAttribute('data-en');
            if (englishText && englishText.trim() !== '') {
                element.textContent = englishText;
            }
        } else if (lang === 'ar' && element.hasAttribute('data-ar')) {
            const arabicText = element.getAttribute('data-ar');
            if (arabicText && arabicText.trim() !== '') {
                element.textContent = arabicText;
            }
        }
    });
}

// تحديث عناوين السلايدر
function updateSliderTitles(lang) {
    const titles = document.querySelectorAll('.slider-track .title');
    titles.forEach((title, index) => {
        if (lang === 'en' && title.hasAttribute('data-en')) {
            const englishText = title.getAttribute('data-en');
            if (englishText) {
                title.textContent = englishText;
            }
        } else if (lang === 'ar' && title.hasAttribute('data-ar')) {
            const arabicText = title.getAttribute('data-ar');
            if (arabicText) {
                title.textContent = arabicText;
            }
        }
    });
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

// دالة فحص حالة البث
async function checkStreamStatus() {
    const indicator = document.getElementById('liveIndicator');
    if (!indicator) return;
    
    const textElement = indicator.querySelector('span:last-child');
    const dot = indicator.querySelector('.dot');
    
    // حالة افتراضية (يمكنك إضافة API حقيقي هنا)
    const isLive = false;
    
    // الحصول على اللغة الحالية
    const isEnglish = document.body.classList.contains('ltr');
    
    if (isLive) {
        indicator.classList.add('live');
        dot.style.background = '#FF0000';
        dot.style.animation = 'pulse 1.5s infinite';
        textElement.textContent = isEnglish ? 'LIVE' : 'بث مباشر';
    } else {
        indicator.classList.remove('live');
        dot.style.background = '#666';
        dot.style.animation = 'none';
        textElement.textContent = isEnglish ? 'OFFLINE' : 'غير متصل';
    }
}

// تحديث نص حالة البث عند تغيير اللغة
function updateStreamStatusText(lang) {
    const indicator = document.getElementById('liveIndicator');
    if (!indicator) return;
    
    const textElement = indicator.querySelector('span:last-child');
    const dot = indicator.querySelector('.dot');
    
    // التحقق من حالة البث الحالية
    const isLive = indicator.classList.contains('live');
    
    if (isLive) {
        textElement.textContent = lang === 'en' ? 'LIVE' : 'بث مباشر';
        dot.style.background = '#FF0000';
    } else {
        textElement.textContent = lang === 'en' ? 'OFFLINE' : 'غير متصل';
        dot.style.background = '#666';
    }
}

// الجمل التحفيزية
const motivationalQuotes = {
    ar: [
        "استمر في التميز وإلهام الآخرين! ✨",
        "احترم الجهد، النجاح قادم! 💪",
        "البث أكثر من مجرد هواية - إنه شغف! 🔥",
        "ابق مبدعاً واستمر في التقدم! 🎨",
        "رحلتك مهمة - استمر! 🚀",
        "كل بث هو مغامرة جديدة! 🎮",
        "استمر في الإبداع والتألق! ⭐",
        "شارك شغفك مع العالم! 🌍"
    ],
    en: [
        "Keep shining and inspiring others! ✨",
        "Respect the grind, success is coming! 💪",
        "Streaming is more than a hobby - it's a passion! 🔥",
        "Stay creative and keep pushing forward! 🎨",
        "Your journey matters - keep going! 🚀",
        "Every stream is a new adventure! 🎮",
        "Keep creating and shining! ⭐",
        "Share your passion with the world! 🌍"
    ]
};

function rotateMotivationalQuotes() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) return;
    
    let quoteIndex = 0;
    
    // تعيين الاقتباس الأول
    const isEnglish = document.body.classList.contains('ltr');
    const lang = isEnglish ? 'en' : 'ar';
    const quotes = motivationalQuotes[lang];
    quoteElement.textContent = quotes[quoteIndex];
    
    // تغيير الاقتباس كل 10 ثواني
    setInterval(() => {
        const isEnglish = document.body.classList.contains('ltr');
        const lang = isEnglish ? 'en' : 'ar';
        const quotes = motivationalQuotes[lang];
        
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[quoteIndex];
        
        // تأثير بسيط
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.style.transition = 'opacity 0.5s';
            quoteElement.style.opacity = '1';
        }, 50);
    }, 10000);
}

function updateMotivationalQuote(lang) {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) return;
    
    const quotes = motivationalQuotes[lang];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    quoteElement.style.opacity = '0';
    setTimeout(() => {
        quoteElement.textContent = quotes[randomIndex];
        quoteElement.style.transition = 'opacity 0.5s';
        quoteElement.style.opacity = '1';
    }, 50);
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
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}
