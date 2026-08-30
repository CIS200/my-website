// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// Nav: add .scrolled class for backdrop blur
const navEl = document.querySelector('nav');
if (navEl) {
    window.addEventListener('scroll', () => {
        navEl.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// Animate stat numbers (home page only)
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
    let statsAnimated = false;
    const heroStats = document.querySelector('.hero-stats');

    const statsObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    statNumbers.forEach(el => {
                        const text = el.textContent;
                        const match = text.match(/[\d.]+/);
                        if (!match) return;

                        const num = parseFloat(match[0]);
                        const prefix = text.slice(0, text.indexOf(match[0]));
                        const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
                        const duration = 1200;
                        const start = performance.now();

                        function tick(now) {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const ease = 1 - Math.pow(1 - progress, 3);
                            el.textContent = prefix + Math.floor(num * ease) + suffix;
                            if (progress < 1) requestAnimationFrame(tick);
                            else el.textContent = text;
                        }

                        requestAnimationFrame(tick);
                    });
                }
            });
        },
        { threshold: 0.3 }
    );

    if (heroStats) statsObserver.observe(heroStats);
}

// Slideshow
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.slide-dots');
const prevBtn = document.querySelector('.slide-prev');
const nextBtn = document.querySelector('.slide-next');

if (slides.length > 0 && dotsContainer) {
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slide-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slide-dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Auto-advance every 4s
    let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 4000);

    // Pause on hover
    const container = document.querySelector('.slideshow-container');
    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(autoSlide));
        container.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentSlide + 1), 4000);
        });
    }
}

// Mobile menu
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinksEl = document.querySelector('.nav-links');

if (menuBtn && navLinksEl) {
    function resetMenuBtn() {
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    menuBtn.addEventListener('click', () => {
        navLinksEl.classList.toggle('open');
        const spans = menuBtn.querySelectorAll('span');
        if (navLinksEl.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            resetMenuBtn();
        }
    });
}
