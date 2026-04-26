/**
 * Header Minimal Logo - Simple, clean header with logo and minimal navigation
 * Features: Minimalist design, mobile responsive, theme toggle, optional cart icon
 *
 * @element header-minimal-logo
 * @fires nav-click - When a navigation item is clicked
 * @fires cta-click - When CTA button is clicked
 * @fires cart-click - When cart is clicked
 * @fires theme-changed - When theme is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeaderMinimalLogo extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            brandName: 'Minimal',
            logo: {
                text: 'Minimal',
                showIcon: true
            },
            navigation: [
                { label: 'Shop', href: '/shop' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' }
            ],
            showCart: true,
            cart: {
                itemCount: 0
            },
            cta: {
                label: 'Sign In',
                action: 'signin'
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
        if (changedProperties.has('theme')) {
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

    handleNavClick(item) {
        this.emit('nav-click', { item });
    }

    handleCTAClick() {
        this.emit('cta-click', { action: this.config.cta.action });
    }

    handleCartClick() {
        this.emit('cart-click', {});
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

                header-minimal-logo * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <header class="w-full ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}">
                <nav class="container mx-auto px-6 py-6 flex items-center justify-between">
                    <!-- Logo -->
                    <a href="/" class="flex items-center gap-2 group">
                        ${this.config.logo.showIcon ? html`
                            <div class="${isDark ? 'bg-indigo-600' : 'bg-indigo-600'} w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                ${this.config.brandName.charAt(0)}
                            </div>
                        ` : ''}
                        <span class="text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}">${this.config.logo.text}</span>
                    </a>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex items-center gap-8">
                        ${this.config.navigation.map(item => html`
                            <a
                                href="${item.href}"
                                class="text-sm ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition"
                                @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}
                            >
                                ${item.label}
                            </a>
                        `)}
                    </nav>

                    <!-- Right Actions -->
                    <div class="flex items-center gap-4">
                        ${this.config.showCart ? html`
                            <button
                                @click=${this.handleCartClick}
                                class="relative p-2 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} rounded-lg transition"
                                aria-label="Shopping cart"
                            >
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                ${this.config.cart.itemCount > 0 ? html`
                                    <span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        ${this.config.cart.itemCount}
                                    </span>
                                ` : ''}
                            </button>
                        ` : ''}

                        <button
                            @click=${() => this.handleCTAClick()}
                            class="hidden md:block px-5 py-2 text-sm ${isDark ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'} rounded-lg transition font-medium"
                        >
                            ${this.config.cta.label}
                        </button>

                        <button
                            @click=${() => this.toggleTheme()}
                            class="p-2 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} rounded-lg transition"
                            aria-label="Toggle theme"
                        >
                            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                        </button>
                    </div>
                </nav>

                <!-- Mobile Navigation (Horizontal Scroll) -->
                <div class="md:hidden px-6 pb-4 overflow-x-auto">
                    <div class="flex gap-6 min-w-max">
                        ${this.config.navigation.map(item => html`
                            <a
                                href="${item.href}"
                                class="text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} whitespace-nowrap"
                                @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}
                            >
                                ${item.label}
                            </a>
                        `)}
                        <button
                            @click=${() => this.handleCTAClick()}
                            class="text-sm ${isDark ? 'text-white' : 'text-slate-900'} font-medium whitespace-nowrap"
                        >
                            ${this.config.cta.label}
                        </button>
                    </div>
                </div>
            </header>
        `;
    }
}

customElements.define('header-minimal-logo', HeaderMinimalLogo);
