"use strict";
class PortfolioApp {
    constructor() {
        this.themeKey = 'lilian-portfolio-theme';
        this.mobileMenuOpen = false;
        this.nav = null;
        this.navLinks = null;
        this.mobileBtn = null;
        this.themeToggle = null;
        this.themeIcon = null;
        this.theme = this.getStoredTheme();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.boot());
        }
        else {
            this.boot();
        }
    }
    getStoredTheme() {
        try {
            const stored = localStorage.getItem(this.themeKey);
            if (stored === 'dark' || stored === 'light')
                return stored;
        }
        catch { }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    storeTheme(t) {
        try {
            localStorage.setItem(this.themeKey, t);
        }
        catch { }
    }
    boot() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.getElementById('navLinks');
        this.mobileBtn = document.getElementById('mobileMenuBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.applyTheme(this.theme);
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupNavScrollStyle();
        this.setupNavScrollSpy();
        this.setupFadeIn();
        this.setupSmoothScroll();
        this.setupDynamicYear();
        this.setupForm();
    }
    applyTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        this.storeTheme(t);
        if (this.themeIcon) {
            this.themeIcon.textContent = t === 'dark' ? '☀️' : '🌙';
        }
    }
    setupThemeToggle() {
        if (!this.themeToggle)
            return;
        this.themeToggle.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme(this.theme);
        });
    }
    setupMobileMenu() {
        if (!this.mobileBtn || !this.navLinks)
            return;
        const close = () => {
            this.mobileMenuOpen = false;
            this.mobileBtn.setAttribute('aria-expanded', 'false');
            this.navLinks.setAttribute('data-visible', 'false');
            document.body.style.overflow = '';
        };
        const open = () => {
            this.mobileMenuOpen = true;
            this.mobileBtn.setAttribute('aria-expanded', 'true');
            this.navLinks.setAttribute('data-visible', 'true');
            document.body.style.overflow = 'hidden';
        };
        this.mobileBtn.addEventListener('click', () => {
            this.mobileMenuOpen ? close() : open();
        });
        this.navLinks.querySelectorAll('.nav__link').forEach((link) => {
            link.addEventListener('click', () => { if (this.mobileMenuOpen)
                close(); });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                close();
                this.mobileBtn.focus();
            }
        });
    }
    setupNavScrollStyle() {
        if (!this.nav)
            return;
        const handler = () => {
            this.nav.setAttribute('data-scrolled', String(window.scrollY > 20));
        };
        window.addEventListener('scroll', handler, { passive: true });
        handler();
    }
    setupFadeIn() {
        const elements = document.querySelectorAll('.fade-in');
        if (!elements.length)
            return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { rootMargin: '0px 0px -80px 0px', threshold: 0 });
        elements.forEach((el) => observer.observe(el));
    }
    setupNavScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav__link');
        if (!sections.length || !links.length)
            return;
        const sectionMap = new Map();
        const buildMap = () => {
            sectionMap.clear();
            sections.forEach((s) => {
                const id = s.getAttribute('id');
                if (id)
                    sectionMap.set(id, s.offsetTop);
            });
        };
        buildMap();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(buildMap, 200);
        });
        const handler = () => {
            const scrollPos = window.scrollY + 120;
            let current = '';
            sectionMap.forEach((top, id) => {
                if (scrollPos >= top)
                    current = id;
            });
            links.forEach((l) => l.classList.remove('active'));
            if (current) {
                links.forEach((l) => {
                    if (l.getAttribute('href') === `#${current}`)
                        l.classList.add('active');
                });
            }
        };
        window.addEventListener('scroll', handler, { passive: true });
        handler();
    }
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#')
                    return;
                const target = document.querySelector(href);
                if (!target)
                    return;
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 56,
                    behavior: 'smooth',
                });
            });
        });
    }
    setupDynamicYear() {
        const yearEl = document.getElementById('year');
        if (yearEl)
            yearEl.textContent = String(new Date().getFullYear());
    }
    setupForm() {
        const form = document.querySelector('.contact__form');
        if (!form)
            return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = '✓ Message Sent!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = original;
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }
}
new PortfolioApp();
//# sourceMappingURL=main.js.map