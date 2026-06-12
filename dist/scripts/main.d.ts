interface AppState {
    theme: 'light' | 'dark';
    mobileMenuOpen: boolean;
}
declare class PortfolioApp {
    private state;
    private readonly themeKey;
    private readonly observer;
    private readonly sectionElements;
    private readonly navLinkElements;
    constructor();
    private getStoredTheme;
    private storeTheme;
    private init;
    private boot;
    private applyTheme;
    private setupThemeToggle;
    private setupMobileMenu;
    private setupNavScrollStyle;
    private setupFadeAnimations;
    private handleIntersection;
    private setupNavScrollSpy;
    private setupSmoothScroll;
    private setupCounterAnimation;
    private animateCounter;
    private setupForm;
}
//# sourceMappingURL=main.d.ts.map