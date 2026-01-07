// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeToggleContainer = document.getElementById('themeToggleContainer');
const enBtn = document.getElementById('enBtn');
const arBtn = document.getElementById('arBtn');
const languageBg = document.querySelector('.language-bg');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const currentYear = document.getElementById('currentYear');
const profileImgContainer = document.getElementById('profileImgContainer');
const statusText = document.getElementById('statusText');
const floatingMessage = document.getElementById('floatingMessage');
const messageClose = document.getElementById('messageClose');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeText = document.getElementById('welcomeText');

// Twitch API Credentials
const TWITCH_CLIENT_ID = 'a1k8g8fw1cjymw9ox7ltlmvp7yoe0x';
const TWITCH_CLIENT_SECRET = 'mxh0bjhchxyqd5vf9xsq31j5hys8xg';
const TWITCH_USERNAME = 'afrecus';

// Welcome messages arrays
const welcomeMessages = {
    en: [
        { title: "Welcome Back!", text: "We're glad to see you again!" },
        { title: "Stay Creative!", text: "Keep pushing your creative boundaries!" },
        { title: "Respect The Grind!", text: "Success comes from consistent effort!" },
        { title: "Streaming is Life!", text: "More than just a hobby, it's a passion!" },
        { title: "Keep Shining!", text: "Your content brightens our day!" }
    ],
    ar: [
        { title: "مرحباً مجدداً!", text: "سعيدون برؤيتك مرة أخرى!" },
        { title: "ابق مبدعاً!", text: "استمر في توسيع حدود إبداعك!" },
        { title: "احترم الجهد!", text: "النجاح يأتي من الجهد المستمر!" },
        { title: "البث هو الحياة!", text: "أكثر من مجرد هواية، إنها شغف!" },
        { title: "استمر في التميز!", text: "محتواك يضيء يومنا!" }
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
    // Don't trigger if clicking on the checkbox itself
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

// Language Toggle
arBtn.addEventListener('click', () => switchLanguage('ar'));
enBtn.addEventListener('click', () => switchLanguage('en'));

function switchLanguage(lang) {
    if (lang === 'ar') {
        // Switch to Arabic
        arBtn.classList.add('active');
        enBtn.classList.remove('active');
        languageBg.style.transform = 'translateX(0)';
        document.body.classList.remove('ltr');
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        // Switch to English
        enBtn.classList.add('active');
        arBtn.classList.remove('active');
        languageBg.style.transform = 'translateX(60px)';
        document.body.classList.add('ltr');
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
    
    // Update all text elements with data attributes
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        if (lang === 'en') {
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
        exploreBtnIcon.className = lang === 'ar' ? 'fas fa-arrow-left' : 'fas fa-arrow-right';
    }
    
    // Update rotating titles
    updateRotatingTitles(lang);
    
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Dispatch event for other components
    document.dispatchEvent(new Event('languageChanged'));
}

// Check for saved language preference
const savedLanguage = localStorage.getItem('language');
if (savedLanguage === 'en') {
    switchLanguage('en');
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
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
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
    
    // Update news ticker
    updateNewsTicker(status);
}

function updateNewsTicker(status) {
    const tickerContent = document.querySelector('.ticker-content');
    const isEnglish = document.body.classList.contains('ltr');
    
    if (status === 'live') {
        const liveText = isEnglish 
            ? '🎮 Afrecus is currently live on Twitch! Come join the fun!'
            : '🎮 أفريكوس بث مباشر الآن على تويتش! تعال وانضم للمتعة!';
            
        tickerContent.innerHTML = `
            <span>${liveText}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span data-en="🌟 New YouTube video out now! Check it out!" data-ar="🌟 فيديو جديد على اليوتيوب! شاهدوه الآن!">${isEnglish ? '🌟 New YouTube video out now! Check it out!' : '🌟 فيديو جديد على اليوتيوب! شاهدوه الآن!'}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span data-en="📢 Join our Discord community for exclusive content!" data-ar="📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!">${isEnglish ? '📢 Join our Discord community for exclusive content!' : '📢 انضم لمجتمع الديسكورد للحصول على محتوى حصري!'}</span>
        `;
    } else {
        tickerContent.innerHTML = `
            <span data-en="🌟 New YouTube video out now! Check it out!" data-ar="🌟 فيديو جديد على اليوتيوب! شاهدوه الآن!">${isEnglish ? '🌟 New YouTube video out now! Check it out!' : '🌟 فيديو جديد على اليوتيوب! شاهدوه الآن!'}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span data-en="📢 Follow on Twitch to get notified when Afrecus goes live!" data-ar="📢 تابع على تويتش للحصول على إشعار عندما يبدأ أفريكوس البث!">${isEnglish ? '📢 Follow on Twitch to get notified when Afrecus goes live!' : '📢 تابع على تويتش للحصول على إشعار عندما يبدأ أفريكوس البث!'}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span data-en="🎮 Join our Discord community for exclusive content!" data-ar="🎮 انضم لمجتمع الديسكورد للحصول على محتوى حصري!">${isEnglish ? '🎮 Join our Discord community for exclusive content!' : '🎮 انضم لمجتمع الديسكورد للحصول على محتوى حصري!'}</span>
        `;
    }
}

// Rotating Titles Functionality
function rotateTitles() {
    const titles = document.querySelectorAll('.rotating-title');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    
    // Find current active title
    titles.forEach((title, index) => {
        if (title.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Remove active class from current title
    titles[currentIndex].classList.remove('active');
    indicators[currentIndex].classList.remove('active');
    
    // Calculate next index
    currentIndex = (currentIndex + 1) % titles.length;
    
    // Add active class to next title
    titles[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');
    
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

// Welcome Message Functionality
function showWelcomeMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date().getTime();
    const isEnglish = document.body.classList.contains('ltr');
    const lang = isEnglish ? 'en' : 'ar';
    
    // Show message if first visit or if more than 2 hours have passed
    if (!lastVisit || (now - lastVisit) > 2 * 60 * 60 * 1000) {
        // Get random welcome message
        const messages = welcomeMessages[lang];
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomMessage = messages[randomIndex];
        
        // Update message content
        welcomeTitle.textContent = randomMessage.title;
        welcomeText.textContent = randomMessage.text;
        
        // Show message
        setTimeout(() => {
            floatingMessage.classList.add('show');
        }, 3000); // Show after 3 seconds
        
        // Update last visit time
        localStorage.setItem('lastVisit', now);
    }
}

// Close welcome message
messageClose.addEventListener('click', () => {
    floatingMessage.classList.remove('show');
});

// Auto-hide message after 10 seconds
setTimeout(() => {
    floatingMessage.classList.remove('show');
}, 10000);

// Initialize animations on load
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
    
    // Check stream status
    checkStreamStatus();
    
    // Start rotating titles
    setInterval(rotateTitles, 3000); // Rotate every 3 seconds
    
    // Show welcome message
    showWelcomeMessage();
    
    // Check stream status every 10 seconds
    setInterval(checkStreamStatus, 10000);
});

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
    updateNewsTicker(currentStatus);
    updateRotatingTitles(isEnglish ? 'en' : 'ar');
    
    // Update welcome message if shown
    if (floatingMessage.classList.contains('show')) {
        const lang = isEnglish ? 'en' : 'ar';
        const messages = welcomeMessages[lang];
        const randomIndex = Math.floor(Math.random() * messages.length);
        const randomMessage = messages[randomIndex];
        
        welcomeTitle.textContent = randomMessage.title;
        welcomeText.textContent = randomMessage.text;
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        floatingMessage.classList.remove('show');
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
document.querySelectorAll('.social-icon, .rule-item, .discord-container, .feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
