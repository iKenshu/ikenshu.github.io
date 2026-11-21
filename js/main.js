const START_DATE = '2022-02-01';

function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function init() {
    const now = new Date();
    const years = Math.floor((now - new Date(START_DATE)) / (1000 * 60 * 60 * 24 * 365.25));
    document.getElementById('years-experience').textContent = years;
    document.getElementById('current-year').textContent = now.getFullYear();

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setupReveal();
    }
}

init();
