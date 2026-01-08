// news-manager.js - نظام إدارة الأخبار المتقدم
class NewsManager {
    constructor() {
        this.newsItems = [];
        this.motivationalQuotes = {
            ar: [],
            en: []
        };
        this.currentNewsIndex = 0;
        this.currentQuoteIndex = 0;
        this.tickerElement = document.getElementById('newsTicker');
        this.quoteElement = document.getElementById('motivationalQuote');
        this.configUrl = 'data/news-config.json';
        this.storageKey = 'afrecus_news_data';
        this.isInitialized = false;
        
        console.log('News Manager Initializing...');
        this.init();
    }
    
    async init() {
        try {
            // محاولة تحميل من ملف خارجي أولاً
            await this.loadFromExternalFile();
            
            // إذا فشل، حاول التحميل من localStorage
            if (this.newsItems.length === 0) {
                await this.loadFromLocalStorage();
            }
            
            // إذا لا تزال فارغة، استخدم البيانات الافتراضية
            if (this.newsItems.length === 0) {
                this.setDefaultData();
            }
            
            // بدء عرض البيانات
            this.startDisplay();
            
            // الاستماع لتغيير اللغة
            document.addEventListener('languageChanged', (e) => {
                this.handleLanguageChange(e.detail.language);
            });
            
            // التحقق من التحديثات كل ساعة
            setInterval(() => this.checkForUpdates(), 3600000);
            
            this.isInitialized = true;
            console.log('News Manager initialized successfully');
            console.log(`Loaded ${this.newsItems.length} news items`);
            console.log(`Loaded ${this.motivationalQuotes.ar.length} Arabic quotes`);
            console.log(`Loaded ${this.motivationalQuotes.en.length} English quotes`);
            
        } catch (error) {
            console.error('Failed to initialize News Manager:', error);
            this.setDefaultData();
            this.startDisplay();
        }
    }
    
    async loadFromExternalFile() {
        try {
            console.log('Loading news from external file...');
            
            const response = await fetch(this.configUrl + '?t=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const config = await response.json();
            
            // التحقق من بنية البيانات
            if (!config.news || !config.motivationalQuotes) {
                throw new Error('Invalid config structure');
            }
            
            // تحميل الأخبار
            const currentLang = this.getCurrentLanguage();
            const newsArray = config.news[currentLang] || [];
            
            this.newsItems = newsArray.map((text, index) => ({
                id: `news-${currentLang}-${index}-${Date.now()}`,
                text: text,
                lang: currentLang,
                source: 'external',
                timestamp: new Date().toISOString()
            }));
            
            // تحميل الاقتباسات
            this.motivationalQuotes = {
                ar: config.motivationalQuotes.ar || [],
                en: config.motivationalQuotes.en || []
            };
            
            // حفظ نسخة في localStorage
            this.saveToLocalStorage(config);
            
            console.log('Successfully loaded from external file');
            return true;
            
        } catch (error) {
            console.warn('Could not load from external file:', error.message);
            return false;
        }
    }
    
    async loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return false;
            
            const config = JSON.parse(savedData);
            const currentLang = this.getCurrentLanguage();
            
            // تحميل الأخبار
            if (config.news && config.news[currentLang]) {
                this.newsItems = config.news[currentLang].map((text, index) => ({
                    id: `news-${currentLang}-${index}-${Date.now()}`,
                    text: text,
                    lang: currentLang,
                    source: 'localStorage',
                    timestamp: new Date().toISOString()
                }));
            }
            
            // تحميل الاقتباسات
            if (config.motivationalQuotes) {
                this.motivationalQuotes = {
                    ar: config.motivationalQuotes.ar || [],
                    en: config.motivationalQuotes.en || []
                };
            }
            
            console.log('Successfully loaded from localStorage');
            return true;
            
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            localStorage.removeItem(this.storageKey);
            return false;
        }
    }
    
    saveToLocalStorage(config) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(config));
            console.log('Data saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    setDefaultData() {
        console.log('Setting default data');
        
        const currentLang = this.getCurrentLanguage();
        
        if (currentLang === 'ar') {
            this.newsItems = [
                { id: 'news-ar-1', text: "🎮 تابع على تويتش لتتلقى إشعارات البث المباشر!", lang: "ar", source: "default" },
                { id: 'news-ar-2', text: "🌟 فيديو جديد على اليوتيوب قريباً! ترقبوه!", lang: "ar", source: "default" },
                { id: 'news-ar-3', text: "📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!", lang: "ar", source: "default" },
                { id: 'news-ar-4', text: "🔥 البث القادم غداً الساعة 8 مساءً!", lang: "ar", source: "default" },
                { id: 'news-ar-5', text: "🎉 فعالية مجتمعية نهاية هذا الأسبوع!", lang: "ar", source: "default" },
                { id: 'news-ar-6', text: "🎮 كل بث هو مغامرة جديدة! 🎮", lang: "ar", source: "default" }
            ];
            
            this.motivationalQuotes.ar = [
                "استمر في التميز وإلهام الآخرين! ✨",
                "احترم الجهد، النجاح قادم! 💪",
                "البث أكثر من مجرد هواية - إنه شغف! 🔥",
                "ابق مبدعاً واستمر في التقدم! 🎨",
                "رحلتك مهمة - استمر! 🚀",
                "كل بث هو مغامرة جديدة! 🎮",
                "استمر في الإبداع والتألق! ⭐",
                "شارك شغفك مع العالم! 🌍"
            ];
            
            this.motivationalQuotes.en = [
                "Keep shining and inspiring others! ✨",
                "Respect the grind, success is coming! 💪",
                "Streaming is more than a hobby - it's a passion! 🔥",
                "Stay creative and keep pushing forward! 🎨",
                "Your journey matters - keep going! 🚀",
                "Every stream is a new adventure! 🎮",
                "Keep creating and shining! ⭐",
                "Share your passion with the world! 🌍"
            ];
            
        } else {
            this.newsItems = [
                { id: 'news-en-1', text: "🎮 Follow on Twitch to get notified when I go live!", lang: "en", source: "default" },
                { id: 'news-en-2', text: "🌟 New YouTube video coming soon! Stay tuned!", lang: "en", source: "default" },
                { id: 'news-en-3', text: "📢 Join our Discord community for exclusive content!", lang: "en", source: "default" },
                { id: 'news-en-4', text: "🔥 Next stream scheduled for tomorrow at 8 PM!", lang: "en", source: "default" },
                { id: 'news-en-5', text: "🎉 Community event this weekend!", lang: "en", source: "default" },
                { id: 'news-en-6', text: "🎮 Every stream is a new adventure! 🎮", lang: "en", source: "default" }
            ];
            
            this.motivationalQuotes.en = [
                "Keep shining and inspiring others! ✨",
                "Respect the grind, success is coming! 💪",
                "Streaming is more than a hobby - it's a passion! 🔥",
                "Stay creative and keep pushing forward! 🎨",
                "Your journey matters - keep going! 🚀",
                "Every stream is a new adventure! 🎮",
                "Keep creating and shining! ⭐",
                "Share your passion with the world! 🌍"
            ];
            
            this.motivationalQuotes.ar = [
                "استمر في التميز وإلهام الآخرين! ✨",
                "احترم الجهد، النجاح قادم! 💪",
                "البث أكثر من مجرد هواية - إنه شغف! 🔥",
                "ابق مبدعاً واستمر في التقدم! 🎨",
                "رحلتك مهمة - استمر! 🚀",
                "كل بث هو مغامرة جديدة! 🎮",
                "استمر في الإبداع والتألق! ⭐",
                "شارك شغفك مع العالم! 🌍"
            ];
        }
    }
    
    startDisplay() {
        // بدء عرض الأخبار
        this.updateNewsDisplay();
        this.updateQuoteDisplay();
        
        // تبديل الأخبار كل 8 ثواني
        this.newsInterval = setInterval(() => this.rotateNews(), 8000);
        
        // تبديل الاقتباسات كل 10 ثواني
        this.quoteInterval = setInterval(() => this.rotateQuote(), 10000);
        
        console.log('News display started');
    }
    
    rotateNews() {
        if (this.newsItems.length > 0) {
            this.currentNewsIndex = (this.currentNewsIndex + 1) % this.newsItems.length;
            this.updateNewsDisplay();
        }
    }
    
    rotateQuote() {
        if (this.quoteElement) {
            const currentLang = this.getCurrentLanguage();
            const quotes = this.motivationalQuotes[currentLang] || [];
            
            if (quotes.length > 0) {
                this.currentQuoteIndex = (this.currentQuoteIndex + 1) % quotes.length;
                this.updateQuoteDisplay();
            }
        }
    }
    
    updateNewsDisplay() {
        if (!this.tickerElement) return;
        
        if (this.newsItems.length === 0) {
            const message = this.getCurrentLanguage() === 'en' 
                ? "Welcome to Afrecus! 🎮" 
                : "مرحباً بكم في أفريكوس! 🎮";
            this.tickerElement.textContent = message;
            return;
        }
        
        const newsItem = this.newsItems[this.currentNewsIndex];
        if (newsItem && newsItem.text) {
            this.tickerElement.textContent = newsItem.text;
            
            // تأثير الانتقال
            this.tickerElement.style.opacity = '0';
            setTimeout(() => {
                this.tickerElement.style.transition = 'opacity 0.3s ease';
                this.tickerElement.style.opacity = '1';
            }, 50);
        }
    }
    
    updateQuoteDisplay() {
        if (!this.quoteElement) return;
        
        const currentLang = this.getCurrentLanguage();
        const quotes = this.motivationalQuotes[currentLang] || [];
        
        if (quotes.length > 0) {
            const quote = quotes[this.currentQuoteIndex];
            this.quoteElement.style.opacity = '0';
            
            setTimeout(() => {
                this.quoteElement.textContent = quote;
                this.quoteElement.style.transition = 'opacity 0.5s ease';
                this.quoteElement.style.opacity = '1';
            }, 300);
        }
    }
    
    handleLanguageChange(newLang) {
        console.log(`Language changed to ${newLang}, updating news...`);
        
        // إعادة تحميل البيانات للغة الجديدة
        this.loadFromLocalStorage().then(() => {
            this.currentNewsIndex = 0;
            this.currentQuoteIndex = 0;
            this.updateNewsDisplay();
            this.updateQuoteDisplay();
        });
    }
    
    async checkForUpdates() {
        try {
            console.log('Checking for news updates...');
            
            const response = await fetch(this.configUrl + '?t=' + Date.now());
            if (!response.ok) return;
            
            const newConfig = await response.json();
            const savedConfig = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            
            // مقارنة مع الإصدار السابق
            if (JSON.stringify(newConfig) !== JSON.stringify(savedConfig)) {
                console.log('News updates found, reloading...');
                await this.loadFromExternalFile();
                this.currentNewsIndex = 0;
                this.currentQuoteIndex = 0;
                this.updateNewsDisplay();
                this.updateQuoteDisplay();
            }
            
        } catch (error) {
            console.log('Update check failed:', error.message);
        }
    }
    
    getCurrentLanguage() {
        return document.body.classList.contains('ltr') ? 'en' : 'ar';
    }
    
    // API لإضافة أخبار مؤقتة
    addTemporaryNews(text, lang = 'auto') {
        const newsLang = lang === 'auto' ? this.getCurrentLanguage() : lang;
        
        const newsItem = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: text,
            lang: newsLang,
            source: 'temporary',
            timestamp: new Date().toISOString(),
            temporary: true
        };
        
        // إضافة في البداية
        this.newsItems.unshift(newsItem);
        this.currentNewsIndex = 0;
        this.updateNewsDisplay();
        
        // إزالة بعد 24 ساعة
        setTimeout(() => {
            this.newsItems = this.newsItems.filter(item => item.id !== newsItem.id);
            this.updateNewsDisplay();
        }, 24 * 60 * 60 * 1000);
        
        return newsItem.id;
    }
    
    // API لإدارة الأخبار
    getNewsCount() {
        return this.newsItems.length;
    }
    
    getQuoteCount(lang = null) {
        if (!lang) lang = this.getCurrentLanguage();
        return this.motivationalQuotes[lang]?.length || 0;
    }
    
    // لاستخدامها في وحدة التحكم
    debugInfo() {
        return {
            newsCount: this.newsItems.length,
            arabicQuotes: this.motivationalQuotes.ar.length,
            englishQuotes: this.motivationalQuotes.en.length,
            currentLanguage: this.getCurrentLanguage(),
            currentNewsIndex: this.currentNewsIndex,
            currentQuoteIndex: this.currentQuoteIndex,
            isInitialized: this.isInitialized
        };
    }
}

// إنشاء ملف JSON تلقائياً إذا لم يكن موجوداً
async function createDefaultConfigFile() {
    const defaultConfig = {
        "news": {
            "ar": [
                "🎮 تابع على تويتش لتتلقى إشعارات البث المباشر!",
                "🌟 فيديو جديد على اليوتيوب قريباً! ترقبوه!",
                "📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!",
                "🔥 البث القادم غداً الساعة 8 مساءً!",
                "🎉 فعالية مجتمعية نهاية هذا الأسبوع!",
                "🎮 كل بث هو مغامرة جديدة! 🎮",
                "✨ استمر في الإبداع والإلهام! ✨"
            ],
            "en": [
                "🎮 Follow on Twitch to get notified when I go live!",
                "🌟 New YouTube video coming soon! Stay tuned!",
                "📢 Join our Discord community for exclusive content!",
                "🔥 Next stream scheduled for tomorrow at 8 PM!",
                "🎉 Community event this weekend!",
                "🎮 Every stream is a new adventure! 🎮",
                "✨ Keep creating and inspiring! ✨"
            ]
        },
        "motivationalQuotes": {
            "ar": [
                "استمر في التميز وإلهام الآخرين! ✨",
                "احترم الجهد، النجاح قادم! 💪",
                "البث أكثر من مجرد هواية - إنه شغف! 🔥",
                "ابق مبدعاً واستمر في التقدم! 🎨",
                "رحلتك مهمة - استمر! 🚀",
                "كل بث هو مغامرة جديدة! 🎮",
                "استمر في الإبداع والتألق! ⭐",
                "شارك شغفك مع العالم! 🌍"
            ],
            "en": [
                "Keep shining and inspiring others! ✨",
                "Respect the grind, success is coming! 💪",
                "Streaming is more than a hobby - it's a passion! 🔥",
                "Stay creative and keep pushing forward! 🎨",
                "Your journey matters - keep going! 🚀",
                "Every stream is a new adventure! 🎮",
                "Keep creating and shining! ⭐",
                "Share your passion with the world! 🌍"
            ]
        },
        "version": "1.0.0",
        "lastUpdated": new Date().toISOString()
    };
    
    return defaultConfig;
}

// تهيئة نظام الأخبار
document.addEventListener('DOMContentLoaded', function() {
    window.newsManager = new NewsManager();
});

// API للتحكم من وحدة التحكم
window.NewsAPI = {
    refresh: function() {
        if (window.newsManager) {
            window.newsManager.checkForUpdates();
        }
    },
    
    addNews: function(text, lang) {
        if (window.newsManager) {
            return window.newsManager.addTemporaryNews(text, lang);
        }
        return null;
    },
    
    getInfo: function() {
        if (window.newsManager) {
            return window.newsManager.debugInfo();
        }
        return null;
    },
    
    forceReload: async function() {
        if (window.newsManager) {
            await window.newsManager.loadFromExternalFile();
            window.newsManager.currentNewsIndex = 0;
            window.newsManager.currentQuoteIndex = 0;
            window.newsManager.updateNewsDisplay();
            window.newsManager.updateQuoteDisplay();
        }
    },
    
    createConfigFile: async function() {
        const config = await createDefaultConfigFile();
        
        // إنشاء رابط تحميل
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'news-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return config;
    }
};
