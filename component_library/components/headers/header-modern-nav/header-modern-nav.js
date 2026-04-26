/**
 * Header Modern Nav - Modern navigation header with mobile menu and theme toggle
 * Features: Fixed navigation, mobile menu, announcement bar, theme toggle, CTA buttons
 *
 * @element header-modern-nav
 * @fires nav-click - When a navigation item is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled
 * @fires cta-click - When CTA button is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeaderModernNav extends BaseComponent {
    static properties = {
        theme: { type: String },
        mobileMenuOpen: { type: Boolean },
        config: { type: Object },
        showAnnouncement: { type: Boolean }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.mobileMenuOpen = false;
        this.showAnnouncement = true;

        this.config = {
            brandName: 'ShopFlow',
            announcement: {
                badge: 'Launch Offer',
                text: 'Start selling today and get 30 days free + $100 in ad credits'
            },
            navigation: [
                { label: 'Shop', href: '/shop' },
                { label: 'Products', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' }
            ],
            cta: {
                primary: { label: 'Get Started', action: 'get-started' },
                secondary: { label: 'Login', action: 'login' }
            },
            cart: {
                show: true,
                itemCount: 0
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._initLucide();
        this._loadFont();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('theme') || changedProperties.has('mobileMenuOpen')) {
            this._initLucide();
        }
    }

    _loadFont() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    _initLucide() {
        if (window.lucide) {
            setTimeout(() => {
                window.lucide.createIcons();
            }, 0);
        } else {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lucide@latest';
            script.onload = () => {
                setTimeout(() => {
                    window.lucide.createIcons();
                }, 0);
            };
            document.head.appendChild(script);
        }
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.emit('menu-toggle', { open: this.mobileMenuOpen });
    }

    handleNavClick(item) {
        this.emit('nav-click', { item });
    }

    handleCTAClick(action) {
        this.emit('cta-click', { action });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.emit('theme-changed', { theme: this.theme });
    }

    renderLightMode() {
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                header-modern-nav * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <header class="w-full">
                <!-- Announcement Bar -->
                ${this.showAnnouncement ? html`
                    <div class="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-[#4F39F6] to-[#FDFEFF]">
                        <p>
                            <span class="px-3 py-1 rounded-md text-indigo-600 bg-white mr-2">${this.config.announcement.badge}</span>
                            ${this.config.announcement.text}
                        </p>
                    </div>
                ` : ''}

                <!-- Navigation -->
                <nav class="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/80 text-slate-800 text-sm border-b border-slate-200">
                    <a href="/" class="font-bold text-xl text-indigo-600">
                        ${this.config.brandName}
                    </a>

                    <div class="hidden md:flex items-center gap-8 transition duration-500">
                        ${this.config.navigation.map(item => html`
                            <a href="${item.href}"
                               class="hover:text-slate-500 transition"
                               @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}>
                                ${item.label}
                            </a>
                        `)}
                    </div>

                    <div class="hidden md:flex items-center space-x-3">
                        ${this.config.cart.show ? html`
                            <button class="relative p-2 hover:bg-slate-100 rounded-md transition"
                                    @click=${() => this.handleCTAClick('cart')}>
                                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                ${this.config.cart.itemCount > 0 ? html`
                                    <span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        ${this.config.cart.itemCount}
                                    </span>
                                ` : ''}
                            </button>
                        ` : ''}

                        <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md"
                                @click=${() => this.handleCTAClick(this.config.cta.primary.action)}>
                            ${this.config.cta.primary.label}
                        </button>
                        <button class="hover:bg-slate-100 transition px-6 py-2 border border-indigo-600 rounded-md"
                                @click=${() => this.handleCTAClick(this.config.cta.secondary.action)}>
                            ${this.config.cta.secondary.label}
                        </button>
                    </div>

                    <!-- Theme Toggle -->
                    <button @click=${() => this.toggleTheme()}
                            class="hidden md:block ml-3 p-2 rounded-md hover:bg-slate-100 transition"
                            aria-label="Toggle theme">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                        </svg>
                    </button>

                    <button @click=${() => this.toggleMobileMenu()}
                            class="md:hidden active:scale-90 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
                        </svg>
                    </button>
                </nav>

                <!-- Mobile Menu -->
                <div class="fixed inset-0 z-[100] bg-white/95 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${this.mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
                    ${this.config.navigation.map(item => html`
                        <a href="${item.href}"
                           class="hover:text-indigo-600 transition"
                           @click=${(e) => { e.preventDefault(); this.handleNavClick(item); this.toggleMobileMenu(); }}>
                            ${item.label}
                        </a>
                    `)}
                    <button class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md"
                            @click=${() => { this.handleCTAClick(this.config.cta.primary.action); this.toggleMobileMenu(); }}>
                        ${this.config.cta.primary.label}
                    </button>
                    <button @click=${() => this.toggleMobileMenu()}
                            class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
            </header>
        `;
    }

    renderDarkMode() {
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                header-modern-nav * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <header class="w-full">
                <!-- Announcement Bar -->
                ${this.showAnnouncement ? html`
                    <div class="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-purple-600 to-purple-400">
                        <p>
                            <span class="px-3 py-1 rounded-md text-purple-600 bg-white mr-2">${this.config.announcement.badge}</span>
                            ${this.config.announcement.text}
                        </p>
                    </div>
                ` : ''}

                <!-- Navigation -->
                <nav class="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-slate-900/80 text-white text-sm border-b border-slate-700">
                    <a href="/" class="font-bold text-xl text-purple-400">
                        ${this.config.brandName}
                    </a>

                    <div class="hidden md:flex items-center gap-8 transition duration-500">
                        ${this.config.navigation.map(item => html`
                            <a href="${item.href}"
                               class="hover:text-purple-300 transition"
                               @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}>
                                ${item.label}
                            </a>
                        `)}
                    </div>

                    <div class="hidden md:flex items-center space-x-3">
                        ${this.config.cart.show ? html`
                            <button class="relative p-2 hover:bg-slate-800 rounded-md transition"
                                    @click=${() => this.handleCTAClick('cart')}>
                                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                ${this.config.cart.itemCount > 0 ? html`
                                    <span class="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        ${this.config.cart.itemCount}
                                    </span>
                                ` : ''}
                            </button>
                        ` : ''}

                        <button class="px-6 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-md"
                                @click=${() => this.handleCTAClick(this.config.cta.primary.action)}>
                            ${this.config.cta.primary.label}
                        </button>
                        <button class="hover:bg-slate-800 transition px-6 py-2 border border-purple-600 text-white rounded-md"
                                @click=${() => this.handleCTAClick(this.config.cta.secondary.action)}>
                            ${this.config.cta.secondary.label}
                        </button>
                    </div>

                    <!-- Theme Toggle -->
                    <button @click=${() => this.toggleTheme()}
                            class="hidden md:block ml-3 p-2 rounded-md hover:bg-slate-800 transition"
                            aria-label="Toggle theme">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                        </svg>
                    </button>

                    <button @click=${() => this.toggleMobileMenu()}
                            class="md:hidden active:scale-90 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
                        </svg>
                    </button>
                </nav>

                <!-- Mobile Menu -->
                <div class="fixed inset-0 z-[100] bg-slate-900/95 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${this.mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}">
                    ${this.config.navigation.map(item => html`
                        <a href="${item.href}"
                           class="hover:text-purple-300 transition"
                           @click=${(e) => { e.preventDefault(); this.handleNavClick(item); this.toggleMobileMenu(); }}>
                            ${item.label}
                        </a>
                    `)}
                    <button class="px-8 py-3 bg-purple-600 hover:bg-purple-700 transition text-white rounded-md"
                            @click=${() => { this.handleCTAClick(this.config.cta.primary.action); this.toggleMobileMenu(); }}>
                        ${this.config.cta.primary.label}
                    </button>
                    <button @click=${() => this.toggleMobileMenu()}
                            class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
            </header>
        `;
    }

    render() {
        return this.theme === 'light' ? this.renderLightMode() : this.renderDarkMode();
    }
}

customElements.define('header-modern-nav', HeaderModernNav);
