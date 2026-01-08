// news.js - Enhanced News Management
class NewsManager {
    constructor() {
        this.newsItems = [];
        this.currentIndex = 0;
        this.tickerElement = document.getElementById('newsTicker');
        this.newsKey = 'afrecus_news_items';
        this.init();
    }
    
    init() {
        // تحميل الأخبار
        this.loadNews();
        this.updateTicker();
        
        // تحديث الأخبار كل 30 ثانية
        setInterval(() => this.rotateNews(), 30000);
        
        // تحديث الأخبار عند تغيير اللغة
        document.addEventListener('languageChanged', (e) => {
            setTimeout(() => {
                this.updateTicker();
            }, 100);
        });
        
        // زر تحرير الأخبار في الشريط
        this.setupEditButton();
        
        console.log('News Manager initialized with', this.newsItems.length, 'news items');
    }
    
    setupEditButton() {
        // إذا كان زر التحرير غير موجود في HTML، نضيفه برمجياً
        if (!document.querySelector('.edit-news-btn')) {
            const tickerContainer = document.querySelector('.news-ticker');
            if (tickerContainer) {
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-news-btn';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.title = 'تحرير الأخبار';
                editBtn.onclick = () => window.open('news-admin.html', '_blank');
                tickerContainer.appendChild(editBtn);
            }
        }
    }
    
    loadNews() {
        try {
            const savedNews = localStorage.getItem(this.newsKey);
            
            if (savedNews) {
                this.newsItems = JSON.parse(savedNews);
                // تأكد من أن جميع العناصر لها النص الصحيح
                this.newsItems = this.newsItems.filter(item => item && item.text && item.text.trim());
                
                if (this.newsItems.length === 0) {
                    this.newsItems = this.getDefaultNews();
                    this.saveNews();
                }
            } else {
                this.newsItems = this.getDefaultNews();
                this.saveNews();
            }
        } catch (error) {
            console.error('Error loading news:', error);
            this.newsItems = this.getDefaultNews();
        }
    }
    
    getDefaultNews() {
        const isEnglish = document.body.classList.contains('ltr');
        
        if (isEnglish) {
            return [
                { text: "🎮 Follow on Twitch to get notified when I go live!", lang: "en" },
                { text: "🌟 New YouTube video coming soon! Stay tuned!", lang: "en" },
                { text: "📢 Join our Discord community for exclusive content!", lang: "en" },
                { text: "🔥 Next stream scheduled for tomorrow at 8 PM!", lang: "en" },
                { text: "🎉 Community event this weekend! Check Discord for details!", lang: "en" }
            ];
        } else {
            return [
                { text: "🎮 تابع على تويتش لتتلقى إشعارات البث المباشر!", lang: "ar" },
                { text: "🌟 فيديو جديد على اليوتيوب قريباً! ترقبوه!", lang: "ar" },
                { text: "📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!", lang: "ar" },
                { text: "🔥 البث القادم غداً الساعة 8 مساءً!", lang: "ar" },
                { text: "🎉 فعالية مجتمعية نهاية هذا الأسبوع! تفاصيل أكثر على الديسكورد!", lang: "ar" }
            ];
        }
    }
    
    rotateNews() {
        if (this.newsItems.length > 0) {
            this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
            this.updateTicker();
        }
    }
    
    updateTicker() {
        if (!this.tickerElement) {
            this.tickerElement = document.getElementById('newsTicker');
            if (!this.tickerElement) return;
        }
        
        if (this.newsItems.length === 0) {
            this.tickerElement.textContent = "Welcome to Afrecus! 🎮";
            return;
        }
        
        // الحصول على الخبر الحالي
        const newsItem = this.newsItems[this.currentIndex];
        
        if (newsItem && newsItem.text) {
            this.tickerElement.textContent = newsItem.text;
        } else {
            // إذا كان الخبر غير صالح، انتقل للخبر التالي
            this.rotateNews();
        }
    }
    
    addNewsItem(text, lang = 'auto') {
        if (!text || !text.trim()) {
            alert('Please enter news text');
            return false;
        }
        
        const newsItem = {
            text: text.trim(),
            lang: lang === 'auto' ? (document.body.classList.contains('ltr') ? 'en' : 'ar') : lang,
            timestamp: new Date().toISOString(),
            id: Date.now() + Math.random().toString(36).substr(2, 9)
        };
        
        this.newsItems.push(newsItem);
        this.saveNews();
        this.updateTicker();
        
        return true;
    }
    
    saveNews() {
        try {
            localStorage.setItem(this.newsKey, JSON.stringify(this.newsItems));
        } catch (error) {
            console.error('Error saving news:', error);
            // إذا كان التخزين ممتلئاً، احتفظ فقط بـ 20 خبراً
            if (this.newsItems.length > 20) {
                this.newsItems = this.newsItems.slice(-20);
                localStorage.setItem(this.newsKey, JSON.stringify(this.newsItems));
            }
        }
    }
    
    clearAllNews() {
        if (confirm('Are you sure you want to delete all news items?')) {
            this.newsItems = this.getDefaultNews();
            this.saveNews();
            this.currentIndex = 0;
            this.updateTicker();
            return true;
        }
        return false;
    }
    
    getNewsByLang(lang) {
        if (lang === 'all') return this.newsItems;
        return this.newsItems.filter(item => item.lang === lang);
    }
    
    deleteNewsItem(id) {
        const initialLength = this.newsItems.length;
        this.newsItems = this.newsItems.filter(item => item.id !== id);
        
        if (this.newsItems.length < initialLength) {
            this.saveNews();
            if (this.currentIndex >= this.newsItems.length) {
                this.currentIndex = 0;
            }
            this.updateTicker();
            return true;
        }
        return false;
    }
    
    // دالة مساعدة للصفحة الإدارية
    getAllNews() {
        return [...this.newsItems].reverse(); // الأحدث أولاً
    }
}

// إنشاء كائن global للوصول السهل
window.NewsManager = NewsManager;

// تهيئة تلقائية عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    window.newsManager = new NewsManager();
});
