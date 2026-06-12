/**
 * LILIAN WAIRIMU MURIITHI — Optimized Portfolio Script
 * 
 * Performance priorities:
 * - Minimal re-renders (no per-frame animations)
 * - Efficient IntersectionObserver (single observer, no transforms)
 * - Lightweight DOM queries with caching
 * - No Framer Motion or heavy animation libraries
 * - Subtle, professional animations only
 */

class PortfolioApp {
  private readonly themeKey = 'lilian-portfolio-theme';
  private theme: 'light' | 'dark';
  private mobileMenuOpen = false;

  // Cached DOM references
  private nav: HTMLElement | null = null;
  private navLinks: HTMLElement | null = null;
  private mobileBtn: HTMLElement | null = null;
  private themeToggle: HTMLElement | null = null;
  private themeIcon: HTMLElement | null = null;

  constructor() {
    this.theme = this.getStoredTheme();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.boot());
    } else {
      this.boot();
    }
  }

  private getStoredTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem(this.themeKey);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch { /* ignore */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private storeTheme(t: 'light' | 'dark'): void {
    try { localStorage.setItem(this.themeKey, t); } catch { /* ignore */ }
  }

  private boot(): void {
    // Cache elements
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

  // -------- THEME --------
  private applyTheme(t: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', t);
    this.storeTheme(t);
    if (this.themeIcon) {
      this.themeIcon.textContent = t === 'dark' ? '☀️' : '🌙';
    }
  }

  private setupThemeToggle(): void {
    if (!this.themeToggle) return;
    this.themeToggle.addEventListener('click', () => {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      this.applyTheme(this.theme);
    });
  }

  // -------- MOBILE MENU --------
  private setupMobileMenu(): void {
    if (!this.mobileBtn || !this.navLinks) return;

    const close = () => {
      this.mobileMenuOpen = false;
      this.mobileBtn!.setAttribute('aria-expanded', 'false');
      this.navLinks!.setAttribute('data-visible', 'false');
      document.body.style.overflow = '';
    };

    const open = () => {
      this.mobileMenuOpen = true;
      this.mobileBtn!.setAttribute('aria-expanded', 'true');
      this.navLinks!.setAttribute('data-visible', 'true');
      document.body.style.overflow = 'hidden';
    };

    this.mobileBtn.addEventListener('click', () => {
      this.mobileMenuOpen ? close() : open();
    });

    this.navLinks.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => { if (this.mobileMenuOpen) close(); });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) { close(); this.mobileBtn!.focus(); }
    });
  }

  // -------- SCROLL SHADOW --------
  private setupNavScrollStyle(): void {
    if (!this.nav) return;
    const handler = () => {
      this.nav!.setAttribute('data-scrolled', String(window.scrollY > 20));
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  // -------- FADE IN (single observer, no transform animations for perf) --------
  private setupFadeIn(): void {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0 });

    elements.forEach((el) => observer.observe(el));
  }

  // -------- SCROLL SPY --------
  private setupNavScrollSpy(): void {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll<HTMLAnchorElement>('.nav__link');
    if (!sections.length || !links.length) return;

    const sectionMap = new Map<string, number>();

    const buildMap = () => {
      sectionMap.clear();
      sections.forEach((s) => {
        const id = s.getAttribute('id');
        if (id) sectionMap.set(id, (s as HTMLElement).offsetTop);
      });
    };

    buildMap();

    // Rebuild on resize
    let resizeTimer: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildMap, 200);
    });

    const handler = () => {
      const scrollPos = window.scrollY + 120;
      let current = '';

      sectionMap.forEach((top, id) => {
        if (scrollPos >= top) current = id;
      });

      links.forEach((l) => l.classList.remove('active'));
      if (current) {
        links.forEach((l) => {
          if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
        });
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  // -------- SMOOTH SCROLL --------
  private setupSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href) as HTMLElement | null;
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 56, // nav height
          behavior: 'smooth',
        });
      });
    });
  }

  // -------- DYNAMIC YEAR --------
  private setupDynamicYear(): void {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // -------- FORM --------
  private setupForm(): void {
    const form = document.querySelector('.contact__form') as HTMLFormElement | null;
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
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