document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if(progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
        
        if(progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.classList.add('loaded');
                initScrollReveal(); // Trigger animations after load
            }, 500);
        }
    }, 100);

    // 2. Set Current Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 3. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('afrecus_theme');
    
    if (savedTheme === 'light') {
        document.body.classList.replace('dark-theme', 'light-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            document.body.classList.replace('dark-theme', 'light-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('afrecus_theme', 'light');
        } else {
            document.body.classList.replace('light-theme', 'dark-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('afrecus_theme', 'dark');
        }
    });

    // 4. Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    const savedLang = localStorage.getItem('afrecus_lang') || 'ar';
    const langTextSpan = langToggleBtn.querySelector('.lang-text');

    const setLanguage = (lang) => {
        const isEn = lang === 'en';
        document.documentElement.lang = lang;
        document.body.dir = isEn ? 'ltr' : 'rtl';
        langTextSpan.textContent = isEn ? 'AR' : 'EN';
        
        document.querySelectorAll('[data-ar]').forEach(el => {
            el.textContent = isEn ? el.getAttribute('data-en') : el.getAttribute('data-ar');
        });
        
        localStorage.setItem('afrecus_lang', lang);
    };

    setLanguage(savedLang);

    langToggleBtn.addEventListener('click', () => {
        const currentLang = localStorage.getItem('afrecus_lang') === 'en' ? 'ar' : 'en';
        setLanguage(currentLang);
    });

    // 5. Scroll Reveal Animations
    function initScrollReveal() {
        const hiddenElements = document.querySelectorAll('.hidden-el');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('show-el');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        hiddenElements.forEach(el => observer.observe(el));
    }

    // 6. Navigation Active State on Scroll
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 7. Konami Code Easter Egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerEasterEgg() {
        const toast = document.getElementById('easter-egg-toast');
        toast.classList.remove('hidden');
        toast.classList.add('show');
        
        // Cool css effect
        document.body.style.filter = 'hue-rotate(180deg) invert(10%)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 500);
        }, 5000);
    }

    // 8. Init Vanilla Tilt
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }
});
