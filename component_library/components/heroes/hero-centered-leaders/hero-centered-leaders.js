/**
 * Hero Centered Leaders - E-commerce hero section with centered content and horizontal image gallery
 * Features: Mobile menu, announcement badge, centered CTA, horizontal scrolling image gallery
 *
 * @element hero-centered-leaders
 * @fires nav-click - When a navigation item is clicked
 * @fires nav-cta-login-click - When login CTA is clicked
 * @fires nav-cta-signup-click - When signup CTA is clicked
 * @fires cta-primary-click - When primary CTA (Read Success Stories) is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled between light and dark
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroCenteredLeaders extends BaseComponent {
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
                url: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg',
                text: 'ShopHub'
            },
            navigation: [
                { label: 'Products', href: '/products' },
                { label: 'Collections', href: '/collections' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Docs', href: '/docs' }
            ],
            hero: {
                badge: {
                    text: 'Explore how we help grow brands.',
                    icon: 'arrow-right'
                },
                title: 'Preferred choice of shoppers in',
                titleHighlight: 'every category',
                subtitle: 'Learn why professionals trust our marketplace to complete their shopping journey.',
                cta: {
                    primary: 'Browse Products',
                    login: 'Login',
                    signup: 'Sign up'
                },
                images: [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=735&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=687&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=687&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=687&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=764&auto=format&fit=crop'
                ]
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

    toggleMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.emit('menu-toggle', { open: this.mobileMenuOpen });
        
        if (this.mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.mobileMenuOpen = false;
        this.emit('menu-toggle', { open: false });
        document.body.style.overflow = '';
    }

    handleNavClick(item) {
        this.emit('nav-click', { item });
        this.closeMenu();
    }

    handleLoginClick() {
        this.emit('nav-cta-login-click', {});
        this.closeMenu();
    }

    handleSignupClick() {
        this.emit('nav-cta-signup-click', {});
        this.closeMenu();
    }

    handlePrimaryCtaClick() {
        this.emit('cta-primary-click', {});
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.emit('theme-changed', { theme: this.theme });
    }

    render() {
        const isDark = this.theme === 'dark';
        
        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            
            <section class="h-full ${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-[#f7f9ff] via-[#fffbee] to-[#f7f9ff]'}">
                <!-- Main Content - Centered -->
                <main class="flex-grow flex flex-col items-center px-6 sm:px-10 max-w-7xl mx-auto w-full pt-6">
                    <!-- Announcement Badge -->
                    <button
                        @click=${(e) => e.preventDefault()}
                        class="mt-10 mb-6 flex items-center space-x-2 border ${isDark ? 'border-indigo-500 text-indigo-400' : 'border-indigo-600 text-indigo-600'} text-xs rounded-full px-4 pr-1.5 py-1.5 ${isDark ? 'hover:bg-indigo-900/30' : 'hover:bg-indigo-50'} transition"
                        type="button"
                    >
                        <span>${this.config.hero.badge.text}</span>
                        <span class="flex items-center justify-center size-6 p-1 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-indigo-600'}">
                            <i data-lucide="${this.config.hero.badge.icon}" class="w-3 h-3 text-white"></i>
                        </span>
                    </button>

                    <!-- Title - Centered -->
                    <h1 class="text-center ${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-3xl sm:text-4xl md:text-5xl max-w-2xl leading-tight">
                        ${this.config.hero.title}
                        <span class="${isDark ? 'text-indigo-400' : 'text-indigo-600'}">
                            ${this.config.hero.titleHighlight}
                        </span>
                    </h1>

                    <!-- Subtitle - Centered -->
                    <p class="mt-4 text-center ${isDark ? 'text-slate-300' : 'text-gray-600'} max-w-md text-sm sm:text-base leading-relaxed">
                        ${this.config.hero.subtitle}
                    </p>

                    <!-- CTA Button - Centered -->
                    <button
                        @click=${() => this.handlePrimaryCtaClick()}
                        class="mt-8 bg-indigo-600 text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-indigo-700 transition"
                        type="button"
                    >
                        <span>${this.config.hero.cta.primary}</span>
                        <i data-lucide="arrow-right" class="w-5 h-5"></i>
                    </button>

                    <!-- Horizontal Image Gallery -->
                    <div aria-label="Product showcase" class="mt-12 flex max-md:overflow-x-auto gap-6 max-w-4xl w-full pb-6">
                        ${this.config.hero.images.map(url => html`
                            <img 
                                alt="Product showcase" 
                                class="w-36 h-44 rounded-lg hover:-translate-y-1 transition duration-300 object-cover flex-shrink-0 ${isDark ? '' : 'shadow-lg'}" 
                                src="${url}"
                            />
                        `)}
                    </div>
                </main>
            </section>
        `;
    }
}

customElements.define('hero-centered-leaders', HeroCenteredLeaders);

