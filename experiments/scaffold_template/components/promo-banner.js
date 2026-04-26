/**
 * Promotional Banner Component - Myntra Style
 * - Eye-catching offer banners
 * - Full-width with gradient backgrounds
 * - Promotional codes and discounts
 */

import { BaseComponent } from './base-component.js';

class EcomPromoBanner extends BaseComponent {
    static properties = {
        message: { type: String },
        code: { type: String },
        bgGradient: { type: String }
    };

    constructor() {
        super();
        this.message = 'FLAT ₹300 OFF';
        this.code = 'MYNTRA300';
        this.bgGradient = 'from-purple-600 via-pink-600 to-red-500';
    }

    connectedCallback() {
        super.connectedCallback();
        // Read attributes
        if (this.hasAttribute('message')) {
            this.message = this.getAttribute('message');
        }
        if (this.hasAttribute('code')) {
            this.code = this.getAttribute('code');
        }
        if (this.hasAttribute('bg-gradient')) {
            this.bgGradient = this.getAttribute('bg-gradient');
        }
    }

    render() {
        return this.html`
            <div class="relative overflow-hidden bg-gradient-to-r ${this.bgGradient}">
                <div class="max-w-7xl mx-auto px-4 py-3">
                    <div class="flex items-center justify-between text-white">
                        <div class="flex items-center gap-3 flex-1">
                            <span class="text-xl font-bold">${this.message}</span>
                            ${this.code ? this.html`
                                <div class="hidden sm:flex items-center gap-2">
                                    <span class="text-sm opacity-90">USE CODE:</span>
                                    <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded border border-white/30 text-sm font-semibold tracking-wide">
                                        ${this.code}
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                        <span class="text-xs opacity-75 hidden md:inline">*T&C Apply</span>
                    </div>
                </div>

                <!-- Decorative Pattern -->
                <div class="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" class="w-full h-full">
                        <circle cx="20" cy="20" r="15" fill="white"/>
                        <circle cx="60" cy="40" r="20" fill="white"/>
                        <circle cx="80" cy="80" r="10" fill="white"/>
                    </svg>
                </div>
            </div>
        `;
    }
}

customElements.define('ecom-promo-banner', EcomPromoBanner);
