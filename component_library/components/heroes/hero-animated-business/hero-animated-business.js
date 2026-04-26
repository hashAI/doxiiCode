/**
 * Hero Animated Business - E-commerce hero section with animated navbar and image gallery
 * Features: Mobile menu, animated navigation hover effects, gradient background, dual CTAs, image gallery
 *
 * @element hero-animated-business
 * @fires nav-click - When a navigation item is clicked
 * @fires cta-primary-click - When primary CTA (Get Started) is clicked
 * @fires cta-secondary-click - When secondary CTA (Learn More) is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled between light and dark
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroAnimatedBusiness extends BaseComponent {
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
            hero: {
                badge: {
                    text: 'Explore how we help grow brands.',
                    linkText: 'Read more'
                },
                title: 'Solutions to Elevate Your Shopping Experience',
                subtitle: 'Unlock amazing products with tailored recommendations designed for you. Simplify shopping, maximize satisfaction, and stay ahead in the marketplace.',
                cta: {
                    primary: 'Get Started',
                    secondary: 'Learn More'
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
    }

    closeMenu() {
        this.mobileMenuOpen = false;
        this.emit('menu-toggle', { open: false });
    }

    handleNavClick(item) {
        this.emit('nav-click', { item });
        this.closeMenu();
    }

    handlePrimaryCtaClick() {
        this.emit('cta-primary-click', {});
    }

    handleSecondaryCtaClick() {
        this.emit('cta-secondary-click', {});
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
            
            <section class="relative flex flex-col items-center pb-16 pt-24 bg-cover bg-center ${isDark ? 'bg-black text-white bg-[url(\'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-gradient-3.svg\')]' : 'bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 text-slate-800'}">
                <!-- Badge -->
                <div class="flex items-center gap-2 border ${isDark ? 'border-white/15' : 'border-slate-300'} rounded-full px-4 py-2 text-sm">
                    <p>${this.config.hero.badge.text}</p>
                    <a href="#" @click=${(e) => e.preventDefault()} class="flex items-center gap-1 font-medium ${isDark ? 'hover:text-slate-300' : 'hover:text-indigo-700'}">
                        ${this.config.hero.badge.linkText}
                        <i data-lucide="arrow-right" class="w-4 h-4 mt-0.5"></i>
                    </a>
                </div>

                <!-- Hero Title -->
                <h1 class="text-4xl md:text-6xl text-center font-semibold max-w-3xl mt-5 ${isDark ? 'bg-gradient-to-r from-white to-[#748298] text-transparent bg-clip-text' : 'text-slate-900'}">
                    ${this.config.hero.title}
                </h1>

                <!-- Subtitle -->
                <p class="${isDark ? 'text-slate-300' : 'text-slate-600'} md:text-base line-clamp-3 max-md:px-2 text-center max-w-2xl mt-3">
                    ${this.config.hero.subtitle}
                </p>

                <!-- CTA Buttons -->
                <div class="grid grid-cols-2 gap-2 mt-8 text-sm">
                    <button 
                        @click=${() => this.handlePrimaryCtaClick()}
                        class="px-8 py-3 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition rounded-full"
                    >
                        ${this.config.hero.cta.primary}
                    </button>
                    <button 
                        @click=${() => this.handleSecondaryCtaClick()}
                        class="flex items-center justify-center gap-2 ${isDark ? 'bg-white/10 border border-white/15' : 'bg-white border border-slate-300'} rounded-full px-6 py-3 transition hover:bg-opacity-80"
                    >
                        <span>${this.config.hero.cta.secondary}</span>
                        <i data-lucide="chevron-right" class="w-4 h-4 mt-0.5"></i>
                    </button>
                </div>

                <!-- Image Gallery -->
                <div aria-label="Product showcase" class="mt-12 flex max-md:overflow-x-auto gap-6 max-w-4xl w-full pb-6">
                    ${this.config.hero.images.map(url => html`
                        <img 
                            alt="Product showcase" 
                            class="w-36 h-44 rounded-lg hover:-translate-y-1 transition duration-300 object-cover flex-shrink-0 ${isDark ? '' : 'shadow-lg'}" 
                            src="${url}"
                        />
                    `)}
                </div>
            </section>
        `;
    }

    unsafeHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
}

customElements.define('hero-animated-business', HeroAnimatedBusiness);

