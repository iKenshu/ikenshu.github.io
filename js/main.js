const CONFIG = {
    TYPEWRITER_CHAR_DELAY: 80,
    TYPEWRITER_START_DELAY: 300,
    SCROLL_DEBOUNCE: 10,
    SCROLL_TO_TOP_TRIGGER: 500,
    MAGNETIC_MOVE_LIMIT: 8,
    MAGNETIC_SENSITIVITY: 0.2,
    SCROLL_THRESHOLD: 0.15,
    SCROLL_ROOT_MARGIN: '0px 0px -50px 0px',
    START_DATE: '2022-02-01',
    NUMBER_ANIMATION_DURATION: 1000,
    NUMBER_ANIMATION_STEPS: 30
};

console.log(
    '%c👋 Hey there, fellow developer!',
    'color: #d97706; font-size: 20px; font-weight: bold; font-family: "Spectral", serif;'
);
console.log(
    '%cInterested in the code behind this page? Check it out on GitHub or reach out!',
    'color: #5a504b; font-size: 14px; font-family: "JetBrains Mono", monospace;'
);
console.log(
    '%c→ me@kevinmorales.xyz',
    'color: #c2410c; font-size: 14px; font-weight: bold;'
);

function typewriterEffect() {
    const element = document.getElementById('typewriter-name');
    const text = 'Kevin Morales';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, CONFIG.TYPEWRITER_CHAR_DELAY);
        }
    }

    setTimeout(type, CONFIG.TYPEWRITER_START_DELAY);
}

function updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.SCROLL_THRESHOLD,
        rootMargin: CONFIG.SCROLL_ROOT_MARGIN
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
}

function calculateYearsExperience() {
    const startDate = new Date(CONFIG.START_DATE);
    const currentDate = new Date();
    const years = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365));

    animateNumber(document.getElementById('years-experience'), years);
}

function animateNumber(element, targetNumber) {
    let current = 0;
    const increment = targetNumber / CONFIG.NUMBER_ANIMATION_STEPS;
    const stepTime = CONFIG.NUMBER_ANIMATION_DURATION / CONFIG.NUMBER_ANIMATION_STEPS;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            element.textContent = targetNumber;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

function setupMagneticLinks() {
    const links = document.querySelectorAll('.contact-link, .schedule-button');

    links.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = Math.max(
                -CONFIG.MAGNETIC_MOVE_LIMIT,
                Math.min(CONFIG.MAGNETIC_MOVE_LIMIT, x * CONFIG.MAGNETIC_SENSITIVITY)
            );
            const moveY = Math.max(
                -CONFIG.MAGNETIC_MOVE_LIMIT,
                Math.min(CONFIG.MAGNETIC_MOVE_LIMIT, y * CONFIG.MAGNETIC_SENSITIVITY)
            );

            link.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });
}

function setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > CONFIG.SCROLL_TO_TOP_TRIGGER) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupSkillHighlight() {
    const skillTexts = document.querySelectorAll('.skill-text');

    skillTexts.forEach(skillText => {
        const skills = skillText.textContent.split(',').map(s => s.trim());
        const highlightedHTML = skills.map(skill =>
            `<span class="skill-item">${skill}</span>`
        ).join(', ');

        skillText.innerHTML = highlightedHTML;
    });
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        typewriterEffect();
        setupScrollAnimations();
        setupMagneticLinks();
    } else {
        document.getElementById('typewriter-name').textContent = 'Kevin Morales';
        document.querySelectorAll('.fade-in-section').forEach(section => {
            section.classList.add('is-visible');
        });
    }

    calculateYearsExperience();
    updateCurrentYear();
    setupScrollToTop();
    setupSkillHighlight();
    setupKeyboardNavigation();

    const debouncedScrollProgress = debounce(updateScrollProgress, CONFIG.SCROLL_DEBOUNCE);
    window.addEventListener('scroll', debouncedScrollProgress);

    updateScrollProgress();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
