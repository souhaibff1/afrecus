// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeToggleContainer = document.getElementById('themeToggleContainer');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const currentYear = document.getElementById('currentYear');
const profileImgContainer = document.getElementById('profileImgContainer');
const statusText = document.getElementById('statusText');
const languageToggle = document.getElementById('languageToggle');
const langArBtn = document.getElementById('langArBtn');
const langEnBtn = document.getElementById('langEnBtn');
const motivationalMessage = document.getElementById('motivationalMessage');

// Twitch API Credentials
const TWITCH_CLIENT_ID = 'a1k8g8fw1cjymw9ox7ltlmvp7yoe0x';
const TWITCH_CLIENT_SECRET = 'mxh0bjhchxyqd5vf9xsq31j5hys8xg';
const TWITCH_USERNAME = 'afrecus';

// الجمل التحفيزية
const motivationalMessages = {
    en: [
        "Stay creative and keep pushing forward! 🎨",
        "Respect the grind, success is coming! 💪",
        "Streaming is more than a hobby - it's a passion! 🔥",
        "Keep shining and inspiring others! ✨",
        "Your journey matters - keep going! 🚀",
        "Every stream is a new adventure! 🎮",
        "Consistency is the key to growth! 🔑",
        "Believe in your content! 💫",
        "You're building a legacy, not just a channel! 🏆",
        "The community is with you! 🤝"
    ],
    ar: [
        "ابق مبدعاً واستمر في التقدم! 🎨",
        "احترم الجهد، النجاح قادم! 💪",
        "البث أكثر من مجرد هواية - إنه شغف! 🔥",
        "استمر في التميز وإلهام الآخرين! ✨",
        "رحلتك مهمة - استمر! 🚀",
        "كل بث هو مغامرة جديدة! 🎮",
        "الاستمرارية هي مفتاح النمو! 🔑",
        "آمن بمحتواك! 💫",
        "أنت تبني إرثاً، وليس فقط قناة! 🏆",
        "المجتمع معك! 🤝"
    ]
};

// Set current year
currentYear.textContent = new Date().getFullYear();

// Theme Toggle Function
function toggleTheme() {
    const isChecked = themeToggle.checked;
    
    if (isChecked) {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Add event listener to checkbox
themeToggle.addEventListener('change', toggleTheme);

// Add click event to the entire container
themeToggleContainer.addEventListener('click', function(e) {
    if (e.target !== themeToggle) {
        themeToggle.checked = !themeToggle.checked;
        toggleTheme();
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    themeToggle.checked = true;
    document.body.classList.add('light-theme');
}

// Language Toggle - FIXED VERSION
function initLanguageToggle() {
    // تحديث حالة الأزرار بناءً على اللغة المحفوظة
    const savedLanguage = localStorage.getItem('language') || 'ar';
    const isEnglish = savedLanguage === 'en';
    
    if (isEnglish) {
        switchLanguage('en');
        languageToggle.classList.add('english');
        langArBtn.classList.remove('active');
        langEnBtn.classList.add('active');
    } else {
        switchLanguage('ar');
        languageToggle.classList.remove('english');
        langArBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    }
    
    // إضافة مستمعي الأحداث
    langArBtn.addEventListener('click', () => {
        switchLanguage('ar');
        languageToggle.classList.remove('english');
        langArBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    });
    
    langEnBtn.addEventListener('click', () => {
        switchLanguage('en');
        languageToggle.classList.add('english');
        langArBtn.classList.remove('active');
        langEnBtn.classList.add('active');
    });
}

// وظيفة تبديل اللغة
function switchLanguage(lang) {
    const isEnglish = lang === 'en';
    
    // Update body classes and attributes
    if (isEnglish) {
        document.body.classList.add('ltr');
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    } else {
        document.body.classList.remove('ltr');
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    }
    
    // Update all text elements with data attributes
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        if (isEnglish) {
            if (element.hasAttribute('data-en')) {
                element.textContent = element.getAttribute('data-en');
            }
        } else {
            if (element.hasAttribute('data-ar')) {
                element.textContent = element.getAttribute('data-ar');
            }
        }
    });
    
    // Update button icons direction
    const exploreBtnIcon = document.querySelector('.explore-btn i');
    if (exploreBtnIcon) {
        exploreBtnIcon.className = isEnglish ? 'fas fa-arrow-right' : 'fas fa-arrow-left';
    }
    
    // Update rotating titles
    updateRotatingTitles(lang);
    
    // Update motivational message
    updateMotivationalMessage();
    
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Dispatch event for other components
    document.dispatchEvent(new Event('languageChanged'));
}

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Twitch Stream Status Functions
let accessToken = null;
let tokenExpiry = 0;

async function getTwitchAccessToken() {
    // Check if we have a valid token
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }
    
    try {
        const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Failed to get Twitch access token');
        }
        
        const data = await response.json();
        accessToken = data.access_token;
        // Token expires in 1 hour, set expiry 5 minutes earlier to be safe
        tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
        return accessToken;
    } catch (error) {
        console.error('Error getting Twitch access token:', error);
        return null;
    }
}

async function checkStreamStatus() {
    try {
        const accessToken = await getTwitchAccessToken();
        
        if (!accessToken) {
            // Fallback to offline status if can't get token
            showStatus('offline');
            return;
        }
        
        // Get user ID
        const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${TWITCH_USERNAME}`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!userResponse.ok) {
            throw new Error('Failed to get user info');
        }
        
        const userData = await userResponse.json();
        
        if (userData.data.length === 0) {
            showStatus('offline');
            return;
        }
        
        const userId = userData.data[0].id;
        
        // Check if stream is live
        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!streamResponse.ok) {
            throw new Error('Failed to get stream info');
        }
        
        const streamData = await streamResponse.json();
        
        if (streamData.data.length > 0) {
            // Stream is live (streaming)
            showStatus('live');
        } else {
            // User is offline
            showStatus('offline');
        }
        
    } catch (error) {
        console.error('Error checking stream status:', error);
        showStatus('offline');
    }
}

function showStatus(status) {
    // Remove all status classes
    profileImgContainer.classList.remove('live', 'offline');
    
    // Add the correct status class
    profileImgContainer.classList.add(status);
    
    // Update status text based on language
    const isEnglish = document.body.classList.contains('ltr');
    
    let statusKey = '';
    let statusValue = '';
    
    if (status === 'live') {
        statusKey = 'LIVE';
        statusValue = isEnglish ? 'LIVE' : 'بث مباشر';
    } else {
        statusKey = 'OFFLINE';
        statusValue = isEnglish ? 'OFFLINE' : 'غير متصل';
    }
    
    // Update status text data attributes
    statusText.setAttribute('data-en', statusKey);
    statusText.setAttribute('data-ar', statusValue);
    statusText.textContent = statusValue;
    
    // Update click handler
    profileImgContainer.onclick = function() {
        window.open('https://www.twitch.tv/afrecus', '_blank');
    };
    
    // Add title for hover
    let titleText = '';
    if (status === 'live') {
        titleText = isEnglish ? 'Click to watch live stream on Twitch' : 'انقر لمشاهدة البث المباشر على تويتش';
    } else {
        titleText = isEnglish ? 'Click to visit Twitch channel' : 'انقر لزيارة قناة تويتش';
    }
    profileImgContainer.title = titleText;
}

// Rotating Titles Functionality
function rotateTitles() {
    const titles = document.querySelectorAll('.rotating-title');
    let currentIndex = 0;
    
    // Find current active title
    titles.forEach((title, index) => {
        if (title.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Remove active class from current title
    titles[currentIndex].classList.remove('active');
    
    // Calculate next index
    currentIndex = (currentIndex + 1) % titles.length;
    
    // Add active class to next title
    titles[currentIndex].classList.add('active');
    
    // Update titles based on language
    updateRotatingTitles(document.body.classList.contains('ltr') ? 'en' : 'ar');
}

function updateRotatingTitles(lang) {
    const titles = document.querySelectorAll('.rotating-title');
    
    titles.forEach(title => {
        if (lang === 'en') {
            if (title.hasAttribute('data-en')) {
                title.textContent = title.getAttribute('data-en');
            }
        } else {
            if (title.hasAttribute('data-ar')) {
                title.textContent = title.getAttribute('data-ar');
            }
        }
    });
}

// Motivational Message Functionality
function updateMotivationalMessage() {
    if (!motivationalMessage) return;
    
    const isEnglish = document.body.classList.contains('ltr');
    const lang = isEnglish ? 'en' : 'ar';
    const messages = motivationalMessages[lang];
    
    // اختيار جملة عشوائية
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];
    
    // تحديث النص
    motivationalMessage.textContent = message;
}

// تغيير الجملة التحفيزية كل 15 ثانية
function rotateMotivationalMessage() {
    updateMotivationalMessage();
    setInterval(updateMotivationalMessage, 15000);
}

// Update status text when switching languages
document.addEventListener('languageChanged', () => {
    const isEnglish = document.body.classList.contains('ltr');
    const currentStatus = profileImgContainer.classList.contains('live') ? 'live' : 'offline';
    
    let statusValue = '';
    if (currentStatus === 'live') {
        statusValue = isEnglish ? 'LIVE' : 'بث مباشر';
    } else {
        statusValue = isEnglish ? 'OFFLINE' : 'غير متصل';
    }
    
    statusText.textContent = statusValue;
    updateRotatingTitles(isEnglish ? 'en' : 'ar');
    updateMotivationalMessage();
});

// Initialize on load
window.addEventListener('load', () => {
    // Animate hero text
    const heroText = document.querySelector('.hero-text');
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
    }, 300);
    
    // Animate profile image
    const profileImg = document.querySelector('.profile-img');
    profileImg.style.opacity = '0';
    profileImg.style.transform = 'translateY(30px) scale(0.9)';
    
    setTimeout(() => {
        profileImg.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        profileImg.style.opacity = '1';
        profileImg.style.transform = 'translateY(0) scale(1)';
    }, 600);
    
    // Initialize language toggle
    initLanguageToggle();
    
    // Check stream status
    checkStreamStatus();
    
    // Start rotating titles
    setInterval(rotateTitles, 3000);
    
    // Start rotating motivational messages
    rotateMotivationalMessage();
    
    // Check stream status every 10 seconds
    setInterval(checkStreamStatus, 10000);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.social-icon, .rule-item, .discord-container, .feature, .about-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
