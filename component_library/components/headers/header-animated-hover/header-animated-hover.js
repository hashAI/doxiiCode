/**
 * Header Animated Hover - Navigation header with animated slide-up hover effect
 * Features: Animated navigation hover effects, mobile menu, theme toggle, glassmorphic design
 *
 * @element header-animated-hover
 * @fires nav-click - When a navigation item is clicked
 * @fires cta-click - When CTA button is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeaderAnimatedHover extends BaseComponent {
    static properties = {
        theme: { type: String },
        mobileMenuOpen: { type: Boolean },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.mobileMenuOpen = false;

        this.config = {
            brandName: 'ShopHub',
            logo: {
                svg: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4.706" cy="16" r="4.706" fill="currentColor" />
                    <circle cx="16.001" cy="4.706" r="4.706" fill="currentColor" />
                    <circle cx="16.001" cy="27.294" r="4.706" fill="currentColor" />
                    <circle cx="27.294" cy="16" r="4.706" fill="currentColor" />
                </svg>`,
                text: 'ShopHub'
            },
            navigation: [
                { label: 'Products', href: '/products' },
                { label: 'Collections', href: '/collections' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Docs', href: '/docs' }
            ],
            cta: {
                primary: { label: 'Get Started', action: 'get-started' },
                secondary: { label: 'Contact', action: 'contact' }
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

    unsafeHTML(htmlString) {
        const template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content;
    }

    toggleMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.emit('menu-toggle', { open: this.mobileMenuOpen });
    }

    closeMenu() {
        this.mobileMenuOpen = false;
        this.emit('menu-toggle', { open: false });
    }

    handleNavClick(item) {
        this.emit('nav-click', { item });
        this.closeMenu();
    }

    handleCTAClick(action) {
        this.emit('cta-click', { action });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.emit('theme-changed', { theme: this.theme });
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                header-animated-hover * {
                    font-family: 'Poppins', sans-serif;
                }

                /* Animated navigation hover effect */
                .nav-link {
                    position: relative;
                    overflow: hidden;
                    height: 1.5rem;
                    display: block;
                }

                .nav-link span {
                    display: block;
                    transition: transform 300ms;
                }

                .nav-link:hover span:first-child {
                    transform: translateY(-100%);
                }

                .nav-link span:last-child {
                    position: absolute;
                    top: 100%;
                    left: 0;
                }

                .nav-link:hover span:last-child {
                    transform: translateY(-100%);
                }
            </style>

            <header class="w-full ${isDark ? 'bg-black text-white' : 'bg-white text-slate-800'}">
                <!-- Navigation -->
                <nav class="flex items-center border mx-4 my-4 max-md:w-[calc(100%-2rem)] max-md:justify-between ${isDark ? 'border-slate-700' : 'border-slate-300'} px-6 py-4 rounded-full text-sm">
                    <!-- Logo -->
                    <a href="#" @click=${(e) => { e.preventDefault(); this.handleNavClick({ label: 'Home', href: '/' }); }} class="flex items-center gap-2">
                        ${this.config.logo.svg ? html`<div class="inline-block w-8 h-8" .innerHTML=${this.config.logo.svg}></div>` : ''}
                        ${this.config.logo.text ? html`<span class="text-xl font-semibold">${this.config.brandName}</span>` : ''}
                    </a>

                    <!-- Desktop Navigation -->
                    <div class="hidden md:flex items-center gap-6 ml-7">
                        ${this.config.navigation.map(item => html`
                            <a
                                href="${item.href}"
                                @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}
                                class="nav-link cursor-pointer"
                            >
                                <span>${item.label}</span>
                                <span>${item.label}</span>
                            </a>
                        `)}
                    </div>

                    <!-- Desktop CTAs -->
                    <div class="hidden ml-auto md:flex items-center gap-4">
                        <button
                            @click=${() => this.handleCTAClick(this.config.cta.secondary.action)}
                            class="border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-400 hover:bg-slate-100'} px-4 py-2 rounded-full text-sm font-medium transition"
                        >
                            ${this.config.cta.secondary.label}
                        </button>
                        <button
                            @click=${() => this.handleCTAClick(this.config.cta.primary.action)}
                            class="px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${isDark ? 'bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black hover:bg-slate-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'}"
                        >
                            ${this.config.cta.primary.label}
                        </button>

                        <!-- Theme Toggle -->
                        <button
                            @click=${() => this.toggleTheme()}
                            class="p-2 rounded-full transition ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}"
                            aria-label="Toggle theme"
                        >
                            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button
                        @click=${() => this.toggleMenu()}
                        class="md:hidden"
                        aria-label="Toggle menu"
                    >
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                </nav>

                <!-- Mobile Menu -->
                <div class="md:hidden fixed ${this.mobileMenuOpen ? 'flex' : 'hidden'} top-0 text-base left-0 ${isDark ? 'bg-black' : 'bg-white'} w-full h-full flex-col items-center justify-center gap-4 z-50">
                    ${this.config.navigation.map(item => html`
                        <a
                            @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}
                            class="${isDark ? 'hover:text-indigo-400' : 'hover:text-indigo-600'} cursor-pointer"
                            href="${item.href}"
                        >
                            ${item.label}
                        </a>
                    `)}
                    <button
                        @click=${() => { this.handleCTAClick(this.config.cta.secondary.action); this.closeMenu(); }}
                        class="border ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-400 hover:bg-slate-100'} px-4 py-2 rounded-full text-sm font-medium transition"
                    >
                        ${this.config.cta.secondary.label}
                    </button>
                    <button
                        @click=${() => { this.handleCTAClick(this.config.cta.primary.action); this.closeMenu(); }}
                        class="px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${isDark ? 'bg-white text-black hover:bg-slate-100' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}"
                    >
                        ${this.config.cta.primary.label}
                    </button>
                    <button
                        @click=${() => this.toggleMenu()}
                        class="mt-4 p-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} rounded-full"
                    >
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
            </header>
        `;
    }
}

customElements.define('header-animated-hover', HeaderAnimatedHover);
