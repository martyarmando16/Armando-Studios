/* =========================================
   ARMANDO STUDIOS - Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('as-theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('as-theme', next);
    });

    // --- Language Toggle ---
    const langToggle = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('as-lang') || 'es';
    htmlEl.setAttribute('lang', currentLang);
    langToggle.textContent = currentLang === 'es' ? 'EN' : 'ES';

    function applyTranslations(lang) {
        const dict = translations[lang];
        if (!dict) return;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                if (el.hasAttribute('data-i18n-html') || dict[key].includes('<')) {
                    el.innerHTML = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });
        // Update page title
        document.title = lang === 'en'
            ? 'Armando Studios | Audiovisual Production'
            : 'Armando Studios | Producción Audiovisual';
    }

    // Apply saved language on load
    applyTranslations(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        htmlEl.setAttribute('lang', currentLang);
        localStorage.setItem('as-lang', currentLang);
        langToggle.textContent = currentLang === 'es' ? 'EN' : 'ES';
        applyTranslations(currentLang);
    });

    // --- Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });
    // Fallback: hide loader after 3s max
    setTimeout(() => loader.classList.add('hidden'), 3000);

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
        });

        function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX - 18}px, ${outlineY - 18}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        document.querySelectorAll('a, button, .service-card, .project-card, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.borderColor = 'var(--accent-light)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '36px';
                cursorOutline.style.height = '36px';
                cursorOutline.style.borderColor = 'var(--accent)';
            });
        });
    }

    // --- Navbar ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (4 + Math.random() * 6) + 's';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.width = (1 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
        countersAnimated = true;
    }

    // --- AOS (Animate On Scroll) Custom Implementation ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));

                // Trigger counter animation when stats are visible
                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // Also observe hero-stats directly
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) animateCounters();
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    // --- Skill Bars Animation ---
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // --- Projects Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Let the form submit naturally if action is configured
            // Otherwise prevent and show message
            if (contactForm.action.includes('placeholder')) {
                e.preventDefault();
                const btn = contactForm.querySelector('.btn-submit');
                const originalHTML = btn.innerHTML;
                const successMsg = currentLang === 'en' ? 'Message Sent!' : '¡Mensaje Enviado!';
                btn.innerHTML = `<span>${successMsg}</span> <i class="fas fa-check"></i>`;
                btn.style.background = '#25d366';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }
        });
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Parallax on Hero ---
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const scroll = window.scrollY;
            if (heroContent) {
                heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
                heroContent.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
            }
        }
    });

    // --- Tilt Effect on Cards (desktop only) ---
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.service-card, .skill-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});

// Add fadeInUp keyframe dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
