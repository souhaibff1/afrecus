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
    
    // 4. تبديل اللغة
    const langButtons = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('language') || 'ar';
    
    // تطبيق اللغة المحفوظة
    if (savedLang === 'en') {
        switchToEnglish();
        langButtons[0].classList.remove('active');
        langButtons[1].classList.add('active');
    }
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // تحديث الأزرار النشطة
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // تبديل اللغة
            if (lang === 'en') {
                switchToEnglish();
            } else {
                switchToArabic();
            }
            
            // حفظ التفضيل
            localStorage.setItem('language', lang);
        });
    });
    
    // 5. فحص حالة البث على تويتش
    checkStreamStatus();
    
    // 6. تحميل الأخبار
    loadNews();
    
    // 7. تغيير الجمل التحفيزية
    rotateMotivationalQuotes();
});

// دالة التبديل للغة الإنجليزية
function switchToEnglish() {
    document.body.classList.add('ltr');
    document.body.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    
    // هنا يمكنك إضافة ترجمة النصوص إذا أردت
    // لكن حالياً سنتركها كما هي للبساطة
}

// دالة التبديل للغة العربية
function switchToArabic() {
    document.body.classList.remove('ltr');
    document.body.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
}

// دالة فحص حالة البث
async function checkStreamStatus() {
    try {
        // محاولة الاتصال بـ Twitch API
        const response = await fetch('https://api.twitch.tv/helix/streams?user_login=afrecus', {
            headers: {
                'Client-ID': 'a1k8g8fw1cjymw9ox7ltlmvp7yoe0x',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // تحتاج إلى token هنا
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
    const viewerCount = document.getElementById('viewerCount');
    const streamGame = document.getElementById('streamGame');
    
    // تحديث المؤشر
    indicator.classList.add('live');
    indicator.innerHTML = '<span class="dot"></span><span>بث مباشر</span>';
    
    // تحديث عدد المشاهدين
    viewerCount.textContent = streamData.viewer_count + ' مشاهد';
    
    // تحديث اللعبة
    streamGame.textContent = streamData.game_name || 'ألعاب';
    
    // إضافة تأثير النبض للصورة
    const profileImg = document.getElementById('profileImg');
    profileImg.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5), 0 15px 40px rgba(0, 0, 0, 0.3)';
}

function updateOfflineStatus() {
    const indicator = document.getElementById('liveIndicator');
    const viewerCount = document.getElementById('viewerCount');
    const streamGame = document.getElementById('streamGame');
    
    // إعادة المؤشر للحالة الطبيعية
    indicator.classList.remove('live');
    indicator.innerHTML = '<span class="dot"></span><span>غير متصل</span>';
    
    // تعيين القيم الافتراضية
    viewerCount.textContent = '0 مشاهد';
    streamGame.textContent = 'غير متصل';
    
    // إزالة تأثير النبض
    const profileImg = document.getElementById('profileImg');
    profileImg.style.boxShadow = '';
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

// الجمل التحفيزية
const motivationalQuotes = [
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
];

// دورة الجمل التحفيزية
function rotateMotivationalQuotes() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) return;
    
    let quoteIndex = 0;
    
    // تغيير الجملة كل 15 ثانية
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;
        quoteElement.textContent = motivationalQuotes[quoteIndex];
        
        // إضافة تأثير بسيط
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.style.transition = 'opacity 0.5s';
            quoteElement.style.opacity = '1';
        }, 50);
    }, 15000);
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
