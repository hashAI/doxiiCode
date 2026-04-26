/**
 * Hero Grid Gradient Network - E-commerce hero section with grid pattern and gradient
 * Features: Mobile menu, responsive design, app download CTAs, user ratings, social proof
 *
 * @element hero-grid-gradient-network
 * @fires nav-click - When a navigation item is clicked
 * @fires nav-cta-click - When navigation CTA is clicked
 * @fires cta-app-store-click - When App Store button is clicked
 * @fires cta-play-store-click - When Play Store button is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled between light and dark
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroGridGradientNetwork extends BaseComponent {
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
                svg: `<svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.904 28.28q-1.54 0-2.744-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.82 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.868 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.456.924-3.276.924m-7.196 5.32V14.56h3.08v3.612l-.532 3.276.532 3.248V33.6zm6.692-8.232q1.12 0 1.96-.504a3.6 3.6 0 0 0 1.344-1.456q.504-.924.504-2.128t-.504-2.128a3.43 3.43 0 0 0-1.344-1.428q-.84-.532-1.96-.532t-1.988.532a3.43 3.43 0 0 0-1.344 1.428q-.476.924-.476 2.128t.476 2.128a3.6 3.6 0 0 0 1.344 1.456q.868.504 1.988.504M56.95 28V14.56h3.08V28zm3.08-7.476-1.064-.532q0-2.548 1.12-4.116 1.148-1.596 3.444-1.596 1.008 0 1.82.364.812.365 1.512 1.176l-2.016 2.072a2.1 2.1 0 0 0-.812-.56 3 3 0 0 0-1.036-.168q-1.287 0-2.128.812-.84.811-.84 2.548m14.156 7.756q-2.016 0-3.64-.896a7 7 0 0 1-2.548-2.52q-.924-1.596-.924-3.584t.924-3.556a6.87 6.87 0 0 1 2.492-2.52q1.596-.924 3.528-.924 1.876 0 3.304.868a6.05 6.05 0 0 1 2.268 2.38q.84 1.512.84 3.444 0 .336-.056.7a7 7 0 0 1-.112.756H69.23v-2.52h9.436l-1.148 1.008q-.056-1.232-.476-2.072a3 3 0 0 0-1.204-1.288q-.756-.448-1.876-.448-1.176 0-2.044.504a3.43 3.43 0 0 0-1.344 1.428q-.476.896-.476 2.156t.504 2.212 1.428 1.484q.924.504 2.128.504 1.037 0 1.904-.364a4 4 0 0 0 1.512-1.064l1.96 1.988a6.3 6.3 0 0 1-2.38 1.736 7.6 7.6 0 0 1-2.968.588m15.91 0q-1.54 0-2.745-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.821 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.869 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.455.924-3.276.924M82.898 28V7.84h3.08v10.024l-.532 3.248.532 3.276V28zm6.692-2.632q1.12 0 1.96-.504a3.6 3.6 0 0 0 1.344-1.456q.504-.924.504-2.128t-.504-2.128a3.43 3.43 0 0 0-1.344-1.428q-.84-.532-1.96-.532t-1.988.532a3.43 3.43 0 0 0-1.344 1.428q-.476.924-.476 2.128.001 1.204.476 2.128a3.6 3.6 0 0 0 1.344 1.456q.87.504 1.988.504m15.067 2.912q-1.708 0-3.052-.756a5.5 5.5 0 0 1-2.072-2.072q-.728-1.344-.728-3.08V14.56h3.08v7.672q0 .98.308 1.68.336.672.952 1.036.644.364 1.512.364 1.344 0 2.044-.784.728-.812.728-2.296V14.56h3.08v7.812q0 1.764-.756 3.108a5.3 5.3 0 0 1-2.044 2.072q-1.317.728-3.052.728m8.976-.28V14.56h3.08V28zm1.54-15.904q-.783 0-1.316-.532-.504-.532-.504-1.316t.504-1.316a1.8 1.8 0 0 1 1.316-.532q.813 0 1.316.532t.504 1.316q0 .784-.504 1.316t-1.316.532M120.169 28V7.84h3.08V28zm8.552 0V8.96h3.08V28zm-3.22-10.64v-2.8h9.52v2.8zm17.274 10.92q-1.708 0-3.052-.756a5.5 5.5 0 0 1-2.072-2.072q-.728-1.344-.728-3.08V14.56h3.08v7.672q0 .98.308 1.68.336.672.952 1.036.643.364 1.512.364 1.344 0 2.044-.784.728-.812.728-2.296V14.56h3.08v7.812q0 1.764-.756 3.108a5.3 5.3 0 0 1-2.044 2.072q-1.317.728-3.052.728m8.977-.28V14.56h3.08V28zm1.54-15.904q-.785 0-1.316-.532-.504-.532-.504-1.316t.504-1.316a1.8 1.8 0 0 1 1.316-.532q.812 0 1.316.532t.504 1.316-.504 1.316-1.316.532" fill="currentColor"/>
                    <path d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                text: 'ShopHub'
            },
            navigation: [
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'Collections', href: '/collections' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Docs', href: '/docs' }
            ],
            hero: {
                title: 'Grow your shopping network fuel your journey',
                subtitle: 'Discover amazing products, collaborate with friends, and grow your personal shopping experience.',
                cta: {
                    nav: 'Contact us',
                    appStore: 'Download on App Store',
                    playStore: 'Get it on Google Play'
                },
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=1000&fit=crop&q=80',
                rating: {
                    stars: 5,
                    text: 'Used by 1,000+ shoppers'
                },
                users: [
                    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
                    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60'
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

    handleNavCtaClick() {
        this.emit('nav-cta-click', {});
    }

    handleAppStoreClick() {
        this.emit('cta-app-store-click', {});
    }

    handlePlayStoreClick() {
        this.emit('cta-play-store-click', {});
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
            
            <section class="pb-32 md:pb-44 pt-12 bg-cover bg-center bg-no-repeat text-sm ${isDark ? 'bg-gray-900 text-slate-200' : 'bg-[url(\'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradient-bg-with-grid.png\')] text-slate-800'}">
                <!-- Hero Content -->
                <div class="flex flex-col-reverse gap-10 md:flex-row px-4 md:px-16 lg:px-24 xl:px-32 md:mt-20"> 
                    <!-- Text Content -->
                    <div class="max-md:text-center">
                        <h1 class="text-4xl md:text-6xl/[76px] font-semibold max-w-2xl ${isDark ? 'text-white' : 'text-slate-900'}">
                            ${this.config.hero.title}
                        </h1>

                        <p class="text-sm md:text-base max-w-md mt-6 max-md:px-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}">
                            ${this.config.hero.subtitle}
                        </p>

                        <!-- App Download Buttons -->
                        <div class="flex items-center justify-center md:justify-start gap-4 mt-6">
                            <button 
                                @click=${() => this.handleAppStoreClick()}
                                aria-label="Download on App Store" 
                                class="active:scale-95 transition-all" 
                                type="button"
                            >
                                <img 
                                    class="md:w-40 h-auto"
                                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/appDownload/appleStoreBtn.svg"
                                    alt="Download on App Store"
                                >
                            </button>
                            <button 
                                @click=${() => this.handlePlayStoreClick()}
                                aria-label="Download on Google Play" 
                                class="active:scale-95 transition-all" 
                                type="button"
                            >
                                <img 
                                    class="md:w-40 h-auto"
                                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/appDownload/googlePlayBtn.svg"
                                    alt="Get it on Google Play"
                                >
                            </button>
                        </div>

                        <!-- Social Proof -->
                        <div class="flex items-center justify-center md:justify-start mt-9">
                            <div class="flex -space-x-3.5 pr-3">
                                ${this.config.hero.users.map(url => html`
                                    <img 
                                        src="${url}" 
                                        alt="User avatar"
                                        class="size-10 border-2 ${isDark ? 'border-gray-800' : 'border-white'} rounded-full hover:-translate-y-px transition object-cover"
                                    >
                                `)}
                            </div>
                            <div>
                                <div class="flex items-center gap-px">
                                    ${Array(this.config.hero.rating.stars).fill(0).map(() => html`
                                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.85536 0.463527C6.00504 0.00287118 6.65674 0.00287028 6.80642 0.463526L7.82681 3.60397C7.89375 3.80998 8.08572 3.94946 8.30234 3.94946H11.6044C12.0888 3.94946 12.2901 4.56926 11.8983 4.85397L9.22687 6.79486C9.05162 6.92219 8.97829 7.14787 9.04523 7.35388L10.0656 10.4943C10.2153 10.955 9.68806 11.338 9.2962 11.0533L6.62478 9.11244C6.44954 8.98512 6.21224 8.98512 6.037 9.11244L3.36558 11.0533C2.97372 11.338 2.44648 10.955 2.59616 10.4943L3.61655 7.35388C3.68349 7.14787 3.61016 6.92219 3.43491 6.79486L0.763497 4.85397C0.37164 4.56927 0.573027 3.94946 1.05739 3.94946H4.35944C4.57606 3.94946 4.76803 3.80998 4.83497 3.60397L5.85536 0.463527Z" fill="#FF8F20"/>
                                        </svg>
                                    `)}
                                </div>
                                <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}">${this.config.hero.rating.text}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Hero Image -->
                    <div class="w-full md:max-w-xs lg:max-w-lg">
                        <img class="w-full h-auto rounded-lg" src="${this.config.hero.image}" alt="Shopping community">
                    </div>
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

customElements.define('hero-grid-gradient-network', HeroGridGradientNetwork);

