// stream-status.js - نظام حالة البث الحقيقي
class StreamStatusManager {
    constructor() {
        this.twitchUsername = 'afrecus';
        this.checkInterval = 60000; // كل دقيقة
        this.indicatorElement = document.getElementById('liveIndicator');
        this.dotElement = null;
        this.textElement = null;
        this.currentStatus = null;
        this.currentLanguage = 'ar';
        
        this.init();
    }
    
    init() {
        console.log('Stream Status Manager Initializing...');
        
        if (!this.indicatorElement) {
            console.error('Live indicator element not found');
            return;
        }
        
        // الحصول على العناصر
        this.dotElement = this.indicatorElement.querySelector('.dot');
        this.textElement = this.indicatorElement.querySelector('span:last-child');
        
        // الحصول على اللغة الحالية
        this.currentLanguage = document.body.classList.contains('ltr') ? 'en' : 'ar';
        
        // التحقق أول مرة
        this.checkStreamStatus();
        
        // جدولة التحقق المنتظم
        setInterval(() => this.checkStreamStatus(), this.checkInterval);
        
        // الاستماع لتغيير اللغة
        document.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail.language;
            this.updateDisplay();
        });
        
        console.log('Stream Status Manager initialized successfully');
    }
    
    async checkStreamStatus() {
        try {
            console.log('Checking stream status...');
            
            // محاولة استخدام Twitch API
            const isLive = await this.checkTwitchAPI();
            
            // إذا فشل API، استخدم الطرق الاحتياطية
            if (isLive === null) {
                console.log('Using fallback method for stream status');
                this.useFallbackMethod();
                return;
            }
            
            this.currentStatus = isLive;
            this.updateDisplay();
            
            console.log(`Stream status: ${isLive ? 'LIVE' : 'OFFLINE'}`);
            
        } catch (error) {
            console.error('Error checking stream status:', error);
            this.useFallbackMethod();
        }
    }
    
    async checkTwitchAPI() {
        try {
            // يمكنك الحصول على Client ID من https://dev.twitch.tv/console/apps
            const clientId = 'YOUR_TWITCH_CLIENT_ID'; // احصل على واحد خاص بك
            const accessToken = 'YOUR_TWITCH_ACCESS_TOKEN'; // احصل على واحد خاص بك
            
            // طريقة 1: باستخدام Twitch API (يتطلب مصادقة)
            const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${this.twitchUsername}`, {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Twitch API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.data && data.data.length > 0;
            
        } catch (error) {
            console.warn('Twitch API failed, trying alternative methods...');
            return await this.checkAlternativeMethods();
        }
    }
    
    async checkAlternativeMethods() {
        try {
            // طريقة 2: استخدام Public Twitch API (بدون مصادقة)
            const response = await fetch(`https://twitch-proxy.freecodecamp.rocks/helix/streams?user_login=${this.twitchUsername}`);
            
            if (response.ok) {
                const data = await response.json();
                return data.data && data.data.length > 0;
            }
            
            // طريقة 3: التحقق من صفحة Twitch مباشرة
            const pageResponse = await fetch(`https://www.twitch.tv/${this.twitchUsername}`);
            if (pageResponse.ok) {
                const text = await pageResponse.text();
                return text.includes('isLiveBroadcast') || 
                       text.includes('"isLive":true') || 
                       text.includes('live-indicator');
            }
            
            return null;
            
        } catch (error) {
            console.warn('All stream check methods failed');
            return null;
        }
    }
    
    useFallbackMethod() {
        // طريقة احتياطية: جدولة افتراضية
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 = الأحد، 6 = السبت
        
        // مثال: البث أيام الأسبوع من 8 PM إلى 12 AM
        const isWeekday = day >= 0 && day <= 4; // الأحد إلى الخميس
        const isStreamTime = hour >= 20 || hour < 0; // 8 PM إلى 12 AM
        
        this.currentStatus = isWeekday && isStreamTime;
        this.updateDisplay();
        
        console.log('Using fallback schedule method');
    }
    
    updateDisplay() {
        if (!this.indicatorElement || !this.dotElement || !this.textElement) return;
        
        if (this.currentStatus) {
            // حالة البث المباشر
            this.indicatorElement.classList.add('live');
            this.dotElement.style.background = '#FF0000';
            this.dotElement.style.animation = 'pulse 1.5s infinite';
            
            // تحديث النص بناءً على اللغة
            this.textElement.textContent = this.currentLanguage === 'en' ? 'LIVE NOW' : 'بث مباشر';
            
            // إضافة تأثير إضافي
            this.indicatorElement.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.3)';
            
            // إشعار بصري إضافي (اختياري)
            this.addLiveNotification();
            
        } else {
            // حالة غير متصل
            this.indicatorElement.classList.remove('live');
            this.dotElement.style.background = '#666';
            this.dotElement.style.animation = 'none';
            
            // تحديث النص بناءً على اللغة
            this.textElement.textContent = this.currentLanguage === 'en' ? 'OFFLINE' : 'غير متصل';
            
            this.indicatorElement.style.boxShadow = 'none';
            this.removeLiveNotification();
        }
    }
    
    updateLanguage(lang) {
        this.currentLanguage = lang;
        this.updateDisplay();
    }
    
    addLiveNotification() {
        // إضافة إشعار بصري إذا لم يكن موجوداً
        if (!document.querySelector('.live-notification')) {
            const notification = document.createElement('div');
            notification.className = 'live-notification';
            notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: #FF0000;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
                    z-index: 10000;
                    animation: slideIn 0.5s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                ">
                    <span class="dot" style="
                        width: 10px;
                        height: 10px;
                        background: white;
                        border-radius: 50%;
                        animation: pulse 1.5s infinite;
                    "></span>
                    ${this.currentLanguage === 'en' ? 'LIVE NOW!' : 'بث مباشر الآن!'}
                </div>
            `;
            document.body.appendChild(notification);
            
            // إزالة الإشعار بعد 5 ثواني
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.5s ease';
                    setTimeout(() => notification.remove(), 500);
                }
            }, 5000);
        }
    }
    
    removeLiveNotification() {
        const notification = document.querySelector('.live-notification');
        if (notification) {
            notification.remove();
        }
    }
    
    // دالة للحصول على حالة البث الحالية
    getCurrentStatus() {
        return {
            isLive: this.currentStatus,
            lastChecked: new Date().toISOString(),
            language: this.currentLanguage
        };
    }
    
    // دالة لتغيير اسم المستخدم يدوياً
    setTwitchUsername(username) {
        if (username && username.trim() !== '') {
            this.twitchUsername = username.trim();
            console.log(`Twitch username updated to: ${this.twitchUsername}`);
            this.checkStreamStatus();
        }
    }
    
    // دالة لتغيير فترات التحقق
    setCheckInterval(interval) {
        if (interval >= 10000) { // لا تقل عن 10 ثواني
            this.checkInterval = interval;
            console.log(`Check interval updated to: ${interval}ms`);
        }
    }
}

// إضافة أنيميشن CSS للتنبيهات
const liveNotificationStyle = document.createElement('style');
liveNotificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .ltr .live-notification > div {
        right: auto;
        left: 20px;
        animation: slideInLTR 0.5s ease;
    }
    
    .ltr .live-notification > div.slide-out {
        animation: slideOutLTR 0.5s ease;
    }
    
    @keyframes slideInLTR {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutLTR {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(liveNotificationStyle);

// تهيئة نظام حالة البث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.streamStatusManager = new StreamStatusManager();
});

// API للتحكم من وحدة التحكم
window.StreamStatusAPI = {
    forceCheck: function() {
        if (window.streamStatusManager) {
            console.log('Manual stream status check requested');
            window.streamStatusManager.checkStreamStatus();
        }
    },
    
    setStatus: function(isLive) {
        if (window.streamStatusManager) {
            window.streamStatusManager.currentStatus = isLive;
            window.streamStatusManager.updateDisplay();
            console.log(`Stream status manually set to: ${isLive ? 'LIVE' : 'OFFLINE'}`);
        }
    },
    
    getStatus: function() {
        if (window.streamStatusManager) {
            return window.streamStatusManager.getCurrentStatus();
        }
        return null;
    },
    
    setUsername: function(username) {
        if (window.streamStatusManager) {
            window.streamStatusManager.setTwitchUsername(username);
        }
    },
    
    setInterval: function(interval) {
        if (window.streamStatusManager) {
            window.streamStatusManager.setCheckInterval(interval);
        }
    }
};
