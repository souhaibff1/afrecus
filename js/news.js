// news.js - Simple News Management
class NewsManager {
    constructor() {
        this.newsItems = [];
        this.currentIndex = 0;
        this.tickerElement = document.getElementById('newsTicker');
        this.init();
    }
    
    init() {
        // تحميل الأخبار من localStorage أو استخدام الافتراضي
        this.loadNews();
        this.updateTicker();
        
        // تحديث الأخبار كل 20 ثانية
        setInterval(() => this.rotateNews(), 20000);
    }
    
    loadNews() {
        // محاولة تحميل الأخبار المخصصة
        const savedNews = localStorage.getItem('afrecus_custom_news');
        
        if (savedNews) {
            this.newsItems = JSON.parse(savedNews);
        } else {
            // أخبار افتراضية
            this.newsItems = this.getDefaultNews();
        }
    }
    
    getDefaultNews() {
        const isEnglish = document.body.classList.contains('ltr');
        
        if (isEnglish) {
            return [
                "🎮 Follow on Twitch to get notified when I go live!",
                "🌟 New YouTube video coming soon! Stay tuned!",
                "📢 Join our Discord community for exclusive content!",
                "🔥 Next stream scheduled for tomorrow at 8 PM!",
                "🎉 Community event this weekend! Check Discord for details!"
            ];
        } else {
            return [
                "🎮 تابع على تويتش لتتلقى إشعارات البث المباشر!",
                "🌟 فيديو جديد على اليوتيوب قريباً! ترقبوه!",
                "📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!",
                "🔥 البث القادم غداً الساعة 8 مساءً!",
                "🎉 فعالية مجتمعية نهاية هذا الأسبوع! تفاصيل أكثر على الديسكورد!"
            ];
        }
    }
    
    rotateNews() {
        this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
        this.updateTicker();
    }
    
    updateTicker() {
        if (this.tickerElement && this.newsItems[this.currentIndex]) {
            this.tickerElement.textContent = this.newsItems[this.currentIndex];
        }
    }
    
    addNewsItem(text, lang = 'both') {
        const newsItem = {
            text: text,
            lang: lang,
            timestamp: new Date().toISOString()
        };
        
        this.newsItems.push(newsItem);
        this.saveNews();
        this.updateTicker();
    }
    
    saveNews() {
        localStorage.setItem('afrecus_custom_news', JSON.stringify(this.newsItems));
    }
    
    clearNews() {
        this.newsItems = this.getDefaultNews();
        localStorage.removeItem('afrecus_custom_news');
        this.updateTicker();
    }
    
    getNewsList() {
        return this.newsItems;
    }
}

// إنشاء كائن global للوصول السهل
window.NewsManager = NewsManager;
