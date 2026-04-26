/**
 * Hero Modern Purple - Modern E-commerce Hero Section
 * 
 * Features:
 * - Fixed navigation with logo and mobile menu
 * - Purple gradient hero section with backdrop blur
 * - Trust indicators with checkmarks
 * - Mobile-first responsive design
 * - Dark/light mode support
 * - Smooth animations and transitions
 * 
 * Props/Attributes:
 * - theme: 'light' | 'dark' (default: 'light')
 * - brandName: Brand name for logo
 * - logoPath: SVG path for logo (optional, uses default if not provided)
 * - heroTitle: Main hero headline
 * - heroSubtitle: Hero description text
 * - ctaPrimaryText: Primary CTA button text
 * - ctaSecondaryText: Secondary CTA button text
 * - heroImage: Hero showcase image URL
 * - trustIndicators: Array of trust indicator objects with {text: string}
 * - navigationItems: Array of navigation items with {label: string, href: string}
 * 
 * Events:
 * - nav-click: Fired when navigation link is clicked (detail: {label, href})
 * - cta-primary-click: Fired when primary CTA is clicked
 * - cta-secondary-click: Fired when secondary CTA is clicked
 * - menu-toggle: Fired when mobile menu is toggled (detail: {isOpen: boolean})
 * 
 * Customization Points:
 * - Colors: Purple gradient, backdrop blur, button colors
 * - Layout: Navigation items, hero content layout
 * - Typography: Poppins font family
 * - Images: Hero showcase image, logo
 */

import { BaseComponent } from '../../../components/base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

// Load Google Fonts (Poppins)
const loadGoogleFonts = () => {
    if (document.querySelector('link[href*="fonts.googleapis.com"][href*="Poppins"]')) {
        return;
    }
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

// Load Lucide Icons
const loadLucide = () => {
    return new Promise((resolve, reject) => {
        if (window.lucide) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js';
        script.onload = () => {
            if (window.lucide) {
                resolve();
            } else {
                reject(new Error('Lucide failed to load'));
            }
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export class HeroModernPurple extends BaseComponent {
    static properties = {
        theme: { type: String, reflect: true },
        brandName: { type: String },
        logoPath: { type: String },
        heroTitle: { type: String },
        heroSubtitle: { type: String },
        ctaPrimaryText: { type: String },
        ctaSecondaryText: { type: String },
        heroImage: { type: String },
        trustIndicators: { type: Array },
        navigationItems: { type: Array },
        mobileMenuOpen: { type: Boolean, state: true }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.brandName = 'ShopHub';
        this.logoPath = null;
        this.heroTitle = 'Discover Premium Products Today';
        this.heroSubtitle = 'Shop the latest trends with fast shipping and easy returns. Quality products at unbeatable prices.';
        this.ctaPrimaryText = 'Shop Now';
        this.ctaSecondaryText = 'Watch Demo';
        this.heroImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&q=80';
        this.trustIndicators = [
            { text: 'Free shipping' },
            { text: '30-day returns' },
            { text: 'Secure checkout' }
        ];
        this.navigationItems = [
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Collections', href: '/collections' },
            { label: 'About', href: '/about' }
        ];
        this.mobileMenuOpen = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        // Read initial theme from attribute
        const attrTheme = this.getAttribute('theme');
        if (attrTheme) {
            this.theme = attrTheme;
        } else {
            // Check for system preference and set theme
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.theme = 'dark';
                this.setAttribute('theme', 'dark');
            }
        }
        loadGoogleFonts();
        await loadLucide();
    }
    
    static get observedAttributes() {
        return ['theme'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'theme' && newValue !== oldValue && newValue !== null) {
            this.theme = newValue || 'light';
            this.requestUpdate('theme', oldValue);
        }
    }

    firstUpdated() {
        this._initializeIcons();
        this._setupMobileMenu();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        this._initializeIcons();
        
        if (changedProperties.has('mobileMenuOpen')) {
            this._updateMobileMenu();
        }
    }

    _initializeIcons() {
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
    }

    _setupMobileMenu() {
        const openMenuBtn = this.querySelector('#open-menu');
        const closeMenuBtn = this.querySelector('#close-menu');
        const mobileNav = this.querySelector('#mobile-navlinks');

        if (openMenuBtn) {
            openMenuBtn.addEventListener('click', () => {
                this.mobileMenuOpen = true;
            });
        }

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                this.mobileMenuOpen = false;
            });
        }

        // Close menu when clicking outside
        if (mobileNav) {
            mobileNav.addEventListener('click', (e) => {
                if (e.target === mobileNav) {
                    this.mobileMenuOpen = false;
                }
            });
        }
    }

    _updateMobileMenu() {
        const mobileNav = this.querySelector('#mobile-navlinks');
        if (mobileNav) {
            if (this.mobileMenuOpen) {
                mobileNav.classList.remove('-translate-x-full');
                mobileNav.classList.add('translate-x-0');
            } else {
                mobileNav.classList.remove('translate-x-0');
                mobileNav.classList.add('-translate-x-full');
            }
        }

        this.dispatchEvent(new CustomEvent('menu-toggle', {
            detail: { isOpen: this.mobileMenuOpen },
            bubbles: true,
            composed: true
        }));
    }

    _handleNavClick(e, item) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('nav-click', {
            detail: { label: item.label, href: item.href },
            bubbles: true,
            composed: true
        }));
    }

    _handleCTAPrimary(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('cta-primary-click', {
            bubbles: true,
            composed: true
        }));
    }

    _handleCTASecondary(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('cta-secondary-click', {
            bubbles: true,
            composed: true
        }));
    }

    _renderHeroTitle() {
        const words = this.heroTitle.split(' ');
        const lastWord = words.pop();
        const rest = words.join(' ');
        const isDark = this.theme === 'dark';
        return html`
            ${rest}${rest ? ' ' : ''}
            <span class="bg-gradient-to-r ${isDark ? 'from-purple-500 to-purple-300' : 'from-indigo-500 to-indigo-300'} px-3 rounded-xl text-nowrap">${lastWord}</span>
        `;
    }

    _getDefaultLogo() {
        // Simple text-based logo that adapts to theme
        return html`
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-purple-600 flex items-center justify-center">
                    <span class="text-white font-bold text-lg">${this.brandName.charAt(0)}</span>
                </div>
                <span class="text-xl font-bold text-slate-900 dark:text-white">${this.brandName}</span>
            </div>
        `;
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <section class="flex flex-col items-center text-sm bg-white dark:bg-black bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] dark:bg-none bg-cover bg-center bg-no-repeat">
                <!-- Top Banner (Light mode only) -->
                ${!isDark ? html`
                    <div class="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-[#4F39F6] to-[#FDFEFF]">
                        <p>
                            <span class="px-3 py-1 rounded-md text-indigo-600 bg-white mr-2">Launch offer</span>
                            Try ${this.brandName} today and get $50 free credits
                        </p>
                    </div>
                ` : ''}
                
                <!-- Navigation -->
                <nav class="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/80 dark:bg-black/40 text-slate-800 dark:text-white text-sm">
                    <a href="/" @click="${(e) => this._handleNavClick(e, { label: 'Home', href: '/' })}">
                        ${this.logoPath ? html`<img src="${this.logoPath}" alt="${this.brandName}" width="155" height="40" />` : this._getDefaultLogo()}
                    </a>

                    <div class="hidden md:flex items-center gap-8 transition duration-500">
                        ${this.navigationItems.map(item => html`
                            <a 
                                href="${item.href}" 
                                class="hover:text-slate-500 dark:hover:text-purple-400 transition"
                                @click="${(e) => this._handleNavClick(e, item)}"
                            >
                                ${item.label}
                            </a>
                        `)}
                    </div>

                    <div class="hidden md:block space-x-3">
                        <button 
                            class="px-6 py-2 bg-indigo-600 dark:bg-purple-600 hover:bg-indigo-700 dark:hover:bg-purple-700 transition text-white rounded-md"
                            @click="${this._handleCTAPrimary}"
                        >
                            ${this.ctaPrimaryText}
                        </button>
                        <button 
                            class="hover:bg-slate-100 dark:hover:bg-purple-950/50 transition px-6 py-2 border border-indigo-600 dark:border-purple-600 rounded-md text-slate-600 dark:text-white"
                            @click="${this._handleCTASecondary}"
                        >
                            Login
                        </button>
                    </div>

                    <button 
                        id="open-menu" 
                        class="md:hidden active:scale-90 transition"
                        aria-label="Open menu"
                    >
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                </nav>

                <!-- Mobile Navigation -->
                <div 
                    id="mobile-navlinks" 
                    class="fixed inset-0 z-[100] bg-white/60 dark:bg-black/40 text-slate-800 dark:text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 -translate-x-full"
                >
                    ${this.navigationItems.map(item => html`
                        <a 
                            href="${item.href}"
                            class="hover:text-indigo-600 dark:hover:text-purple-400 transition"
                            @click="${(e) => { this._handleNavClick(e, item); this.mobileMenuOpen = false; }}"
                        >
                            ${item.label}
                        </a>
                    `)}
                    <button 
                        id="close-menu" 
                        class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 dark:bg-purple-600 hover:bg-slate-200 dark:hover:bg-purple-700 transition text-black dark:text-white rounded-md flex"
                        aria-label="Close menu"
                    >
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>

                <!-- Hero Section -->
                <main class="flex flex-col items-center max-md:px-2">
                    ${isDark ? html`
                        <div class="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-32 bg-black text-white pt-24">
                            <div class="absolute top-28 -z-1 left-1/4 size-72 bg-purple-600 blur-[300px] opacity-60"></div>
                    ` : ''}
                    
                    <a 
                        href="#" 
                        class="${isDark ? 'group flex items-center gap-2 rounded-full p-1 pr-3 mt-44 text-purple-100 bg-purple-200/15' : 'mt-32 flex items-center gap-2 border border-indigo-200 rounded-full p-1 pr-3 text-sm font-medium text-indigo-500 bg-indigo-200/20'}"
                        @click="${this._handleCTAPrimary}"
                    >
                        <span class="bg-indigo-600 dark:bg-purple-800 text-white text-xs px-3 py-1 rounded-full">
                            NEW
                        </span>
                        <p class="flex items-center gap-1">
                            <span>${isDark ? 'Try our 30-day free return policy' : 'Try 7 days free trial option'}</span>
                            ${isDark ? html`
                                <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-0.5 transition duration-300"></i>
                            ` : html`
                                <svg class="mt-1" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m1 1 4 3.5L1 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            `}
                        </p>
                    </a>

                    <h1 class="text-center text-5xl leading-[68px] md:text-6xl ${isDark ? 'md:leading-[84px] font-medium max-w-2xl mt-6' : 'md:leading-[80px] font-semibold max-w-4xl'} text-slate-900 dark:text-white">
                        ${isDark ? this._renderHeroTitle() : this.heroTitle}
                    </h1>

                    <p class="text-center text-base text-slate-700 dark:text-slate-200 max-w-lg ${isDark ? 'mt-6' : 'mt-2'}">
                        ${this.heroSubtitle}
                    </p>

                    <div class="flex ${isDark ? 'flex-col sm:flex-row' : ''} items-center gap-4 mt-8">
                        <button 
                            class="flex items-center gap-2 bg-indigo-600 dark:bg-purple-600 hover:bg-indigo-700 dark:hover:bg-purple-700 text-white active:scale-95 ${isDark ? 'rounded-full px-7' : 'rounded-lg px-7'} h-11 transition"
                            @click="${this._handleCTAPrimary}"
                        >
                            ${this.ctaPrimaryText}
                            ${!isDark ? html`
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            ` : ''}
                        </button>
                        <button 
                            class="${isDark ? 'flex items-center gap-2' : ''} border border-slate-600 dark:border-purple-900 active:scale-95 hover:bg-white/10 dark:hover:bg-purple-950/50 transition text-slate-600 dark:text-white ${isDark ? 'rounded-full px-6' : 'rounded-lg px-8'} h-11"
                            @click="${this._handleCTASecondary}"
                        >
                            ${isDark ? html`<i data-lucide="video" class="w-6 h-6"></i>` : ''}
                            <span>${isDark ? this.ctaSecondaryText : 'Pricing'}</span>
                        </button>
                    </div>

                    ${this.trustIndicators.length > 0 && isDark ? html`
                        <div class="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
                            ${this.trustIndicators.map(indicator => html`
                                <p class="flex items-center gap-2">
                                    <i data-lucide="check" class="size-5 text-purple-600"></i>
                                    <span class="text-slate-400">${indicator.text}</span>
                                </p>
                            `)}
                        </div>
                    ` : ''}

                    <img 
                        src="${this.heroImage}"
                        class="w-full rounded-[15px] max-w-4xl mt-16"
                        alt="Hero showcase"
                        loading="lazy"
                    />
                    
                    ${isDark ? html`</div>` : ''}
                </main>
            </section>
        `;
    }
}

customElements.define('hero-modern-purple', HeroModernPurple);

