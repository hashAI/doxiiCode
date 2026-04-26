/**
 * Hero AI Geometric - Dark hero section with geometric SVG patterns
 * Inspired by: Modern AI/tech landing pages with geometric backgrounds
 * Features: Fixed navigation, mobile menu, geometric SVG background, community badge, dual CTAs
 *
 * @element hero-ai-geometric
 * @fires nav-click - When a navigation item is clicked
 * @fires cta-primary-click - When primary CTA is clicked
 * @fires cta-secondary-click - When secondary CTA (watch demo) is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroAIGeometric extends BaseComponent {
    static properties = {
        theme: { type: String },
        mobileMenuOpen: { type: Boolean },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'dark';
        this.mobileMenuOpen = false;

        this.config = {
            brandName: 'ShopSmart',
            navigation: [
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'Stories', href: '/stories' },
                { label: 'Pricing', href: '/pricing' }
            ],
            hero: {
                communityBadge: {
                    users: [
                        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
                        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop'
                    ],
                    text: 'Join community of 1m+ founders'
                },
                title: {
                    dark: 'Elevate your online store with smart tools.',
                    light: 'Elevate your online store with smart tools.'
                },
                subtitle: 'Unlock smarter workflows with ecommerce tools designed to boost productivity, simplify tasks and help you sell more with less effort.',
                cta: {
                    primary: 'Get started',
                    secondary: 'Watch demo'
                },
                image: {
                    dark: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-3.png',
                    light: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-3.png'
                }
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        // Initialize Lucide icons
        this._initLucide();
        // Load Poppins font
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
            // Load Lucide if not already loaded
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

    handlePrimaryCTA() {
        this.emit('cta-primary-click', { action: 'get-started' });
    }

    handleSecondaryCTA() {
        this.emit('cta-secondary-click', { action: 'watch-demo' });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.emit('theme-changed', { theme: this.theme });
    }

    renderGeometricBackground() {
        return html`
            <svg class="size-full absolute -z-10 inset-0" width="1440" height="720" viewBox="0 0 1440 720" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke="#1D293D" stroke-opacity=".7" d="M-15.227 702.342H1439.7" />
                <circle cx="711.819" cy="372.562" r="308.334" stroke="#1D293D" stroke-opacity=".7" />
                <circle cx="16.942" cy="20.834" r="308.334" stroke="#1D293D" stroke-opacity=".7" />
                <path stroke="#1D293D" stroke-opacity=".7" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
                <circle cx="782.595" cy="411.166" r="308.334" stroke="#1D293D" stroke-opacity=".7" />
            </svg>
        `;
    }

    renderDarkMode() {
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                hero-ai-geometric * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <div class="relative min-h-screen bg-[#0A0F1C] text-white overflow-hidden">
                ${this.renderGeometricBackground()}

                <!-- Hero Section -->
                <section class="flex flex-col max-md:gap-20 md:flex-row pb-20 pt-20 items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 relative z-10">
                    <div class="flex flex-col items-center md:items-start">
                        <!-- Community Badge -->
                        <div class="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-600 text-white text-xs">
                            <div class="flex items-center">
                                ${this.config.hero.communityBadge.users.map((imgSrc, index) => html`
                                    <img class="size-7 rounded-full border-3 border-white ${index > 0 ? '-translate-x-' + (index * 2) : ''}"
                                        src="${imgSrc}"
                                        alt="User ${index + 1}">
                                `)}
                            </div>
                            <p class="-translate-x-2">${this.config.hero.communityBadge.text}</p>
                        </div>

                        <!-- Hero Title -->
                        <h1 class="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-xl text-slate-50 mt-6">
                            ${this.config.hero.title.dark}
                        </h1>

                        <!-- Subtitle -->
                        <p class="text-center md:text-left text-sm text-slate-200 max-w-lg mt-2">
                            ${this.config.hero.subtitle}
                        </p>

                        <!-- CTAs -->
                        <div class="flex items-center gap-4 mt-8 text-sm">
                            <button class="bg-white hover:bg-slate-200 text-black active:scale-95 rounded-md px-7 h-11 transition-all"
                                    @click=${() => this.handlePrimaryCTA()}>
                                ${this.config.hero.cta.primary}
                            </button>
                            <button class="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-white/10 transition text-white rounded-md px-6 h-11"
                                    @click=${() => this.handleSecondaryCTA()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                                    <rect x="2" y="6" width="14" height="12" rx="2"/>
                                </svg>
                                <span>${this.config.hero.cta.secondary}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Hero Image -->
                    <img src="${this.config.hero.image.dark}"
                        alt="E-commerce showcase"
                        class="max-w-xs sm:max-w-sm lg:max-w-md transition-all duration-300">
                </section>
            </div>
        `;
    }

    renderLightMode() {
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                hero-ai-geometric * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <div class="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 overflow-hidden">
                <!-- Light Mode Geometric Background -->
                <svg class="size-full absolute -z-10 inset-0" width="1440" height="720" viewBox="0 0 1440 720" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="#E2E8F0" stroke-opacity=".7" d="M-15.227 702.342H1439.7" />
                    <circle cx="711.819" cy="372.562" r="308.334" stroke="#E2E8F0" stroke-opacity=".7" />
                    <circle cx="16.942" cy="20.834" r="308.334" stroke="#E2E8F0" stroke-opacity=".7" />
                    <path stroke="#E2E8F0" stroke-opacity=".7" d="M-15.227 573.66H1439.7M-15.227 164.029H1439.7" />
                    <circle cx="782.595" cy="411.166" r="308.334" stroke="#E2E8F0" stroke-opacity=".7" />
                </svg>

                <!-- Hero Section -->
                <section class="flex flex-col max-md:gap-20 md:flex-row pb-20 pt-20 items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 relative z-10">
                    <div class="flex flex-col items-center md:items-start">
                        <!-- Community Badge -->
                        <div class="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-slate-300 text-slate-900 text-xs bg-white/50">
                            <div class="flex items-center">
                                ${this.config.hero.communityBadge.users.map((imgSrc, index) => html`
                                    <img class="size-7 rounded-full border-3 border-white ${index > 0 ? '-translate-x-' + (index * 2) : ''}"
                                        src="${imgSrc}"
                                        alt="User ${index + 1}">
                                `)}
                            </div>
                            <p class="-translate-x-2">${this.config.hero.communityBadge.text}</p>
                        </div>

                        <!-- Hero Title -->
                        <h1 class="text-center md:text-left text-5xl leading-[68px] md:text-6xl md:leading-[84px] font-medium max-w-xl text-slate-900 mt-6">
                            ${this.config.hero.title.light}
                        </h1>

                        <!-- Subtitle -->
                        <p class="text-center md:text-left text-sm text-slate-700 max-w-lg mt-2">
                            ${this.config.hero.subtitle}
                        </p>

                        <!-- CTAs -->
                        <div class="flex items-center gap-4 mt-8 text-sm">
                            <button class="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 rounded-md px-7 h-11 transition-all"
                                    @click=${() => this.handlePrimaryCTA()}>
                                ${this.config.hero.cta.primary}
                            </button>
                            <button class="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-slate-100 transition text-slate-900 rounded-md px-6 h-11"
                                    @click=${() => this.handleSecondaryCTA()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                                    <rect x="2" y="6" width="14" height="12" rx="2"/>
                                </svg>
                                <span>${this.config.hero.cta.secondary}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Hero Image -->
                    <img src="${this.config.hero.image.light}"
                        alt="E-commerce showcase"
                        class="max-w-xs sm:max-w-sm lg:max-w-md transition-all duration-300">
                </section>
            </div>
        `;
    }

    render() {
        return this.theme === 'light' ? this.renderLightMode() : this.renderDarkMode();
    }
}

customElements.define('hero-ai-geometric', HeroAIGeometric);
