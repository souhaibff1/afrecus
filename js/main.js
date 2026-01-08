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
    
    // تحميل التفضيل المحفوظ
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
    
    // 4. تبديل اللغة - الإصلاح الكامل
    const langAr = document.getElementById('langAr');
    const langEn = document.getElementById('langEn');
    const savedLang = localStorage.getItem('language') || 'ar';
    
    // تطبيق اللغة المحفوظة عند التحميل
    if (savedLang === 'en') {
        setLanguage('en');
        langAr.classList.remove('active');
        langEn.classList.add('active');
    } else {
        setLanguage('ar');
        langAr.classList.add('active');
        langEn.classList.remove('active');
    }
    
    // أحداث أزرار اللغة
    langAr.addEventListener('click', function() {
        setLanguage('ar');
        langAr.classList.add('active');
        langEn.classList.remove('active');
        localStorage.setItem('language', 'ar');
    });
    
    langEn.addEventListener('click', function() {
        setLanguage('en');
        langAr.classList.remove('active');
        langEn.classList.add('active');
        localStorage.setItem('language', 'en');
    });
    
    // 5. فحص حالة البث على تويتش
    checkStreamStatus();
    
    // 6. تحميل الأخبار
    loadNews();
    
    // 7. تغيير الجمل التحفيزية
    rotateMotivationalQuotes();
    
    // 8. نعومة التمرير للروابط
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
});

// دالة تعيين اللغة
function setLanguage(lang) {
    if (lang === 'en') {
        // التبديل إلى الإنجليزية
        document.body.classList.add('ltr');
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        
        // تحديث النصوص
        updateTexts('en');
        
        // تحديث اتجاه زر التعديل
        const editTicker = document.querySelector('.edit-ticker');
        if (editTicker) {
            editTicker.style.left = 'auto';
            editTicker.style.right = '20px';
            editTicker.setAttribute('title', 'Edit News');
        }
    } else {
        // التبديل إلى العربية
        document.body.classList.remove('ltr');
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        
        // تحديث النصوص
        updateTexts('ar');
        
        // تحديث اتجاه زر التعديل
        const editTicker = document.querySelector('.edit-ticker');
        if (editTicker) {
            editTicker.style.right = 'auto';
            editTicker.style.left = '20px';
            editTicker.setAttribute('title', 'تعديل الأخبار');
        }
    }
    
    // تحديث اتجاه شريط الأخبار
    updateTickerDirection(lang);
}

// دالة تحديث النصوص
function updateTexts(lang) {
    const elements = document.querySelectorAll('[data-ar], [data-en]');
    
    elements.forEach(element => {
        if (lang === 'en' && element.hasAttribute('data-en')) {
            const text = element.getAttribute('data-en');
            if (text) {
                element.textContent = text;
            }
        } else if (lang === 'ar' && element.hasAttribute('data-ar')) {
            const text = element.getAttribute('data-ar');
            if (text) {
                element.textContent = text;
            }
        }
    });
}

// دالة تحديث اتجاه شريط الأخبار
function updateTickerDirection(lang) {
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent) return;
    
    // إيقاف الأنيميشن الحالية
    tickerContent.style.animation = 'none';
    
    // إعطاء الوقت لإعادة الرسم
    setTimeout(() => {
        if (lang === 'en') {
            tickerContent.style.paddingRight = '0';
            tickerContent.style.paddingLeft = '100%';
            tickerContent.style.animation = 'ticker-ltr 30s linear infinite';
        } else {
            tickerContent.style.paddingRight = '100%';
            tickerContent.style.paddingLeft = '0';
            tickerContent.style.animation = 'ticker 30s linear infinite';
        }
    }, 50);
}

// دالة فحص حالة البث
async function checkStreamStatus() {
    try {
        // محاولة الاتصال بـ Twitch API
        const response = await fetch('https://api.twitch.tv/helix/streams?user_login=afrecus', {
            headers: {
                'Client-ID': 'a1k8g8fw1cjymw9ox7ltlmvp7yoe0x',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // يمكنك إضافة token هنا إذا كان لديك
            }
        });
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            // البث مباشر
            updateLiveStatus(data.data[0]);
        } else {
            // غير متصل
            updateOfflineStatus();
        }
    } catch (error) {
        console.log('خطأ في فحص حالة البث:', error);
        updateOfflineStatus(); // حالة افتراضية
    }
}

function updateLiveStatus(streamData) {
    const indicator = document.getElementById('liveIndicator');
    const dot = indicator.querySelector('.dot');
    const text = indicator.querySelector('span:last-child');
    
    // تحديث المؤشر
    indicator.classList.add('live');
    dot.style.background = '#FF0000';
    dot.style.animation = 'pulse 1.5s infinite';
    
    // تحديث النص بناءً على اللغة
    const isEnglish = document.body.classList.contains('ltr');
    text.textContent = isEnglish ? 'LIVE' : 'بث مباشر';
    
    // إضافة تأثير النبض للصورة
    const profileImg = document.getElementById('profileImg');
    profileImg.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5), 0 15px 40px rgba(0, 0, 0, 0.3)';
    
    // تحديث العناوين الدوارة
    updateTitlesOnLive();
}

function updateOfflineStatus() {
    const indicator = document.getElementById('liveIndicator');
    const dot = indicator.querySelector('.dot');
    const text = indicator.querySelector('span:last-child');
    
    // إعادة المؤشر للحالة الطبيعية
    indicator.classList.remove('live');
    dot.style.background = '#666';
    dot.style.animation = 'none';
    
    // تحديث النص بناءً على اللغة
    const isEnglish = document.body.classList.contains('ltr');
    text.textContent = isEnglish ? 'OFFLINE' : 'غير متصل';
    
    // إزالة تأثير النبض
    const profileImg = document.getElementById('profileImg');
    profileImg.style.boxShadow = '';
}

function updateTitlesOnLive() {
    // تحديث العناوين لتعكس حالة البث المباشر
    const titles = document.querySelectorAll('.title');
    const isEnglish = document.body.classList.contains('ltr');
    
    if (isEnglish) {
        titles[0].setAttribute('data-en', 'Live Streaming');
        titles[0].textContent = 'Live Streaming';
    } else {
        titles[0].setAttribute('data-ar', 'بث مباشر حي');
        titles[0].textContent = 'بث مباشر حي';
    }
}

// دالة تحميل الأخبار
function loadNews() {
    const news = JSON.parse(localStorage.getItem('afrecus_news')) || [
        "🎮 تابع على تويتش لتتلقى إشعارات البث المباشر!",
        "🌟 فيديو جديد على اليوتيوب قريباً! ترقبوه!",
        "📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!",
        "🔥 البث القادم غداً الساعة 8 مساءً!",
        "🎉 فعالية مجتمعية نهاية هذا الأسبوع! تفاصيل أكثر على الديسكورد!"
    ];
    
    const ticker = document.getElementById('newsTicker');
    let currentIndex = 0;
    
    // عرض أول خبر
    if (ticker && news.length > 0) {
        ticker.textContent = news[currentIndex];
        
        // تغيير الخبر كل 20 ثانية
        setInterval(() => {
            currentIndex = (currentIndex + 1) % news.length;
            ticker.textContent = news[currentIndex];
        }, 20000);
    }
}

// الجمل التحفيزية باللغتين
const motivationalQuotes = {
    ar: [
        "استمر في التميز وإلهام الآخرين! ✨",
        "احترم الجهد، النجاح قادم! 💪",
        "البث أكثر من مجرد هواية - إنه شغف! 🔥",
        "ابق مبدعاً واستمر في التقدم! 🎨",
        "رحلتك مهمة - استمر! 🚀",
        "كل بث هو مغامرة جديدة! 🎮",
        "الاستمرارية هي مفتاح النمو! 🔑",
        "آمن بمحتواك! 💫",
        "أنت تبني إرثاً، وليس فقط قناة! 🏆",
        "المجتمع معك! 🤝"
    ],
    en: [
        "Keep shining and inspiring others! ✨",
        "Respect the grind, success is coming! 💪",
        "Streaming is more than a hobby - it's a passion! 🔥",
        "Stay creative and keep pushing forward! 🎨",
        "Your journey matters - keep going! 🚀",
        "Every stream is a new adventure! 🎮",
        "Consistency is the key to growth! 🔑",
        "Believe in your content! 💫",
        "You're building a legacy, not just a channel! 🏆",
        "The community is with you! 🤝"
    ]
};

// دورة الجمل التحفيزية
function rotateMotivationalQuotes() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) return;
    
    let quoteIndex = 0;
    
    // تغيير الجملة كل 15 ثانية
    setInterval(() => {
        const isEnglish = document.body.classList.contains('ltr');
        const quotes = isEnglish ? motivationalQuotes.en : motivationalQuotes.ar;
        
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[quoteIndex];
        
        // إضافة تأثير بسيط
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.style.transition = 'opacity 0.5s';
            quoteElement.style.opacity = '1';
        }, 50);
    }, 15000);
}

// تحديث الجمل التحفيزية عند تغيير اللغة
document.addEventListener('languageChanged', function() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (quoteElement) {
        const isEnglish = document.body.classList.contains('ltr');
        const quotes = isEnglish ? motivationalQuotes.en : motivationalQuotes.ar;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = quotes[randomIndex];
    }
});

// إضافة حدث تغيير اللغة مخصص
function dispatchLanguageChange(lang) {
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// دالة لإضافة خبر جديد (تستخدم من صفحة الإدارة)
function addNewsItem(text) {
    const news = JSON.parse(localStorage.getItem('afrecus_news')) || [];
    news.push(text);
    localStorage.setItem('afrecus_news', JSON.stringify(news));
    return true;
}

// دالة لحذف جميع الأخبار
function clearAllNews() {
    localStorage.removeItem('afrecus_news');
    return true;
}

// جعل الدوال متاحة عالمياً لصفحة الإدارة
window.addNewsItem = addNewsItem;
window.clearAllNews = clearAllNews;
window.setLanguage = setLanguage;
