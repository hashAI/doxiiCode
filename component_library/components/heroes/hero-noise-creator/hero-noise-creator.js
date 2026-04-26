/**
 * Hero Noise Creator - E-commerce hero section with noise background texture
 * Features: Mobile menu, centered layout, email signup, community badge, responsive design
 *
 * @element hero-noise-creator
 * @fires nav-cta-click - When navigation CTA (Sign up) is clicked
 * @fires email-submit - When email form is submitted
 * @fires theme-changed - When theme is toggled between light and dark
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroNoiseCreator extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object },
        email: { type: String }
    };

    constructor() {
        super();
        this.theme = 'dark';
        this.email = '';

        this.config = {
            brandName: 'ShopHub',
            logo: {
                svg: `<svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.904 28.28q-1.54 0-2.744-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.82 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.868 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.456.924-3.276.924m-7.196 5.32V14.56h3.08v3.612l-.532 3.276.532 3.248V33.6zm6.692-8.232q1.12 0 1.96-.504a3.6 3.6 0 0 0 1.344-1.456q.504-.924.504-2.128t-.504-2.128a3.43 3.43 0 0 0-1.344-1.428q-.84-.532-1.96-.532t-1.988.532a3.43 3.43 0 0 0-1.344 1.428q-.476.924-.476 2.128t.476 2.128a3.6 3.6 0 0 0 1.344 1.456q.868.504 1.988.504M56.95 28V14.56h3.08V28zm3.08-7.476-1.064-.532q0-2.548 1.12-4.116 1.148-1.596 3.444-1.596 1.008 0 1.82.364.812.365 1.512 1.176l-2.016 2.072a2.1 2.1 0 0 0-.812-.56 3 3 0 0 0-1.036-.168q-1.287 0-2.128.812-.84.811-.84 2.548m14.156 7.756q-2.016 0-3.64-.896a7 7 0 0 1-2.548-2.52q-.924-1.596-.924-3.584t.924-3.556a6.87 6.87 0 0 1 2.492-2.52q1.596-.924 3.528-.924 1.876 0 3.304.868a6.05 6.05 0 0 1 2.268 2.38q.84 1.512.84 3.444 0 .336-.056.7a7 7 0 0 1-.112.756H69.23v-2.52h9.436l-1.148 1.008q-.056-1.232-.476-2.072a3 3 0 0 0-1.204-1.288q-.756-.448-1.876-.448-1.176 0-2.044.504a3.43 3.43 0 0 0-1.344 1.428q-.476.896-.476 2.156t.504 2.212 1.428 1.484q.924.504 2.128.504 1.037 0 1.904-.364a4 4 0 0 0 1.512-1.064l1.96 1.988a6.3 6.3 0 0 1-2.38 1.736 7.6 7.6 0 0 1-2.968.588m15.91 0q-1.54 0-2.745-.644a5.1 5.1 0 0 1-1.904-1.82q-.672-1.148-.672-2.604v-3.864q0-1.456.7-2.604a4.9 4.9 0 0 1 1.904-1.792q1.204-.672 2.716-.672 1.821 0 3.276.952a6.44 6.44 0 0 1 2.324 2.52q.869 1.567.868 3.556 0 1.96-.868 3.556a6.5 6.5 0 0 1-2.324 2.492q-1.455.924-3.276.924M82.898 28V7.84h3.08v10.024l-.532 3.248.532 3.276V28zm6.692-2.632q1.12 0 1.96-.504a3.6 3.6 0 0 0 1.344-1.456q.504-.924.504-2.128t-.504-2.128a3.43 3.43 0 0 0-1.344-1.428q-.84-.532-1.96-.532t-1.988.532a3.43 3.43 0 0 0-1.344 1.428q-.476.924-.476 2.128.001 1.204.476 2.128a3.6 3.6 0 0 0 1.344 1.456q.87.504 1.988.504m15.067 2.912q-1.708 0-3.052-.756a5.5 5.5 0 0 1-2.072-2.072q-.728-1.344-.728-3.08V14.56h3.08v7.672q0 .98.308 1.68.336.672.952 1.036.644.364 1.512.364 1.344 0 2.044-.784.728-.812.728-2.296V14.56h3.08v7.812q0 1.764-.756 3.108a5.3 5.3 0 0 1-2.044 2.072q-1.317.728-3.052.728m8.976-.28V14.56h3.08V28zm1.54-15.904q-.783 0-1.316-.532-.504-.532-.504-1.316t.504-1.316a1.8 1.8 0 0 1 1.316-.532q.813 0 1.316.532t.504 1.316q0 .784-.504 1.316t-1.316.532M120.169 28V7.84h3.08V28zm8.552 0V8.96h3.08V28zm-3.22-10.64v-2.8h9.52v2.8zm17.274 10.92q-1.708 0-3.052-.756a5.5 5.5 0 0 1-2.072-2.072q-.728-1.344-.728-3.08V14.56h3.08v7.672q0 .98.308 1.68.336.672.952 1.036.643.364 1.512.364 1.344 0 2.044-.784.728-.812.728-2.296V14.56h3.08v7.812q0 1.764-.756 3.108a5.3 5.3 0 0 1-2.044 2.072q-1.317.728-3.052.728m8.977-.28V14.56h3.08V28zm1.54-15.904q-.785 0-1.316-.532-.504-.532-.504-1.316t.504-1.316a1.8 1.8 0 0 1 1.316-.532q.812 0 1.316.532t.504 1.316-.504 1.316-1.316.532" fill="currentColor"/>
                    <path d="m8.75 11.3 6.75 3.884 6.75-3.885M8.75 34.58v-7.755L2 22.939m27 0-6.75 3.885v7.754M2.405 15.408 15.5 22.954l13.095-7.546M15.5 38V22.939M29 28.915V16.962a2.98 2.98 0 0 0-1.5-2.585L17 8.4a3.01 3.01 0 0 0-3 0L3.5 14.377A3 3 0 0 0 2 16.962v11.953A2.98 2.98 0 0 0 3.5 31.5L14 37.477a3.01 3.01 0 0 0 3 0L27.5 31.5a3 3 0 0 0 1.5-2.585" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                text: 'ShopHub'
            },
            hero: {
                badge: {
                    text: 'Join community of 1m+ founders',
                    users: [
                        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50',
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50',
                        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop'
                    ]
                },
                title: 'Empowering shoppers to discover on their own terms.',
                subtitle: 'Flexible filters, thoughtful design and the freedom to shop your way. No limitations, no compromises.',
                announcement: 'Secure your spot early and unlock our limited-time founding discount.',
                cta: {
                    nav: 'Sign up',
                    email: 'Early access'
                },
                emailPlaceholder: 'Enter email address'
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._initLucide();
        this._loadFonts();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('theme')) {
            this._initLucide();
        }
    }

    _loadFonts() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link1 = document.createElement('link');
            link1.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link1.rel = 'stylesheet';
            document.head.appendChild(link1);
        }
        if (!document.querySelector('link[href*="Berkshire+Swash"]')) {
            const link2 = document.createElement('link');
            link2.href = 'https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap';
            link2.rel = 'stylesheet';
            document.head.appendChild(link2);
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

    handleNavCtaClick() {
        this.emit('nav-cta-click', {});
    }

    handleEmailSubmit(e) {
        e.preventDefault();
        this.emit('email-submit', { email: this.email });
        this.email = '';
    }

    handleEmailInput(e) {
        this.email = e.target.value;
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
                .font-berkshire {
                    font-family: 'Berkshire Swash', cursive;
                }
            </style>
            
            <section class="flex flex-col items-center pb-48 pt-24 text-center text-sm max-md:px-2 bg-cover bg-center ${isDark ? 'bg-gray-900 text-white' : 'bg-[url(\'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-image-grain.png\')] text-white'}">
                <!-- Community Badge -->
                <div class="flex flex-wrap items-center justify-center p-1.5 md:mt-4 rounded-full border ${isDark ? 'border-slate-600' : 'border-slate-400'} text-xs">
                    <div class="flex items-center">
                        ${this.config.hero.badge.users.map((url, index) => html`
                            <img 
                                class="size-7 rounded-full border-3 ${isDark ? 'border-gray-800' : 'border-white'} ${index > 0 ? '-translate-x-' + (index * 2) : ''}" 
                                src="${url}" 
                                alt="User ${index + 1}"
                            >
                        `)}
                    </div>
                    <p class="${this.config.hero.badge.users.length > 0 ? '-translate-x-2' : ''}">${this.config.hero.badge.text}</p>
                </div>

                <!-- Hero Title -->
                <h1 class="font-berkshire text-[45px]/[52px] md:text-6xl/[65px] mt-6 max-w-4xl">
                    ${this.config.hero.title}
                </h1>

                <!-- Subtitle -->
                <p class="text-base mt-2 max-w-xl ${isDark ? 'text-slate-300' : 'text-white'}">
                    ${this.config.hero.subtitle}
                </p>

                <!-- Announcement -->
                <p class="text-base mt-3 md:mt-7 max-w-xl ${isDark ? 'text-slate-300' : 'text-white'}">
                    ${this.config.hero.announcement}
                </p>

                <!-- Email Signup Form -->
                <form 
                    @submit=${(e) => this.handleEmailSubmit(e)}
                    class="flex items-center mt-8 max-w-lg h-16 w-full rounded-full border ${isDark ? 'border-slate-600' : 'border-slate-50'}"
                >
                    <input 
                        type="email" 
                        .value=${this.email}
                        @input=${(e) => this.handleEmailInput(e)}
                        placeholder="${this.config.hero.emailPlaceholder}" 
                        class="w-full h-full outline-none bg-transparent pl-6 pr-2 text-white placeholder:${isDark ? 'text-slate-400' : 'text-slate-300'} rounded-full"
                        required
                    >
                    <button 
                        type="submit"
                        class="text-nowrap px-8 md:px-10 h-12 mr-2 rounded-full font-medium transition ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-slate-800 hover:bg-gray-300'}"
                    >
                        ${this.config.hero.cta.email}
                    </button>
                </form>
            </section>
        `;
    }

    unsafeHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
}

customElements.define('hero-noise-creator', HeroNoiseCreator);

