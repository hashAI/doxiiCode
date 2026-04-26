import { BaseComponent } from './base-component.js';
import { productCategories } from '../assets/state.js';
import { navigate } from '../assets/router.js';
import { getImageUrl } from '../assets/utils.js';

class ImmersiveMenu extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        activeCategory: { type: String },
        isAnimating: { type: Boolean }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.activeCategory = null;
        this.isAnimating = false;
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener('menu:open', () => {
            this.open();
        });

        this.keyHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.keyHandler);
    }

    open() {
        this.isOpen = true;
        this.isAnimating = true;
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    close() {
        this.isAnimating = true;
        setTimeout(() => {
            this.isOpen = false;
            this.activeCategory = null;
            document.body.style.overflow = '';
        }, 300);
    }

    navigateTo(path) {
        this.close();
        setTimeout(() => {
            navigate(path);
        }, 400);
    }

    setActiveCategory(categoryId) {
        this.activeCategory = categoryId;
    }

    render() {
        if (!this.isOpen) return '';

        return this.html`
            <div class="fixed inset-0 z-[100] bg-noir-950 transition-opacity duration-500 ${this.isAnimating ? 'opacity-0' : 'opacity-100'}">
                <!-- Background Image (changes on hover) -->
                <div class="absolute inset-0 opacity-20 transition-opacity duration-700">
                    ${this.activeCategory ? this.html`
                        <img
                            src="${getImageUrl(this.activeCategory + ' luxury gold', 1500, Math.floor(Math.random() * 10))}"
                            alt=""
                            class="w-full h-full object-cover"
                        />
                    ` : this.html`
                        <img
                            src="${getImageUrl('luxury atelier dark', 1500, 7)}"
                            alt=""
                            class="w-full h-full object-cover"
                        />
                    `}
                    <div class="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/80 to-noir-950/60"></div>
                </div>

                <!-- Close Button -->
                <button
                    @click=${this.close}
                    class="absolute top-6 right-6 lg:top-8 lg:right-12 z-10 p-3 text-noir-300 hover:text-gold-400 transition-colors group">
                    <div class="relative w-6 h-6">
                        <span class="absolute top-1/2 left-0 w-6 h-px bg-current transform rotate-45"></span>
                        <span class="absolute top-1/2 left-0 w-6 h-px bg-current transform -rotate-45"></span>
                    </div>
                </button>

                <!-- Menu Content -->
                <div class="relative h-full flex flex-col lg:flex-row">
                    <!-- Left: Navigation -->
                    <div class="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-20 lg:py-12">
                        <!-- Logo -->
                        <div class="mb-8 lg:mb-16 opacity-0 animate-fade-in stagger-1">
                            <a href="#/" @click=${() => this.navigateTo('/')} class="inline-block">
                                <h2 class="text-3xl lg:text-4xl font-display text-noir-50 tracking-widest hover:text-gold-400 transition-colors">
                                    STORE
                                </h2>
                                <p class="text-[10px] text-noir-500 tracking-megawide uppercase mt-1">Atelier de Joaillerie</p>
                            </a>
                        </div>

                        <!-- Main Navigation -->
                        <nav class="space-y-3 lg:space-y-6">
                            <div class="opacity-0 animate-slide-up stagger-1">
                                <button
                                    @click=${() => this.navigateTo('/products/all')}
                                    @mouseenter=${() => this.setActiveCategory('all')}
                                    @mouseleave=${() => this.setActiveCategory(null)}
                                    class="group flex items-baseline gap-4 text-left w-full">
                                    <span class="text-xs text-noir-500 font-medium tracking-wide">01</span>
                                    <span class="text-4xl lg:text-6xl xl:text-7xl font-display font-medium text-noir-100 group-hover:text-gold-400 transition-colors duration-300">
                                        All Pieces
                                    </span>
                                </button>
                            </div>

                            ${productCategories.map((category, i) => this.html`
                                <div class="opacity-0 animate-slide-up stagger-${Math.min(i + 2, 5)}">
                                    <button
                                        @click=${() => this.navigateTo('/products/' + category.id)}
                                        @mouseenter=${() => this.setActiveCategory(category.id)}
                                        @mouseleave=${() => this.setActiveCategory(null)}
                                        class="group flex items-baseline gap-4 text-left w-full">
                                        <span class="text-xs text-noir-500 font-medium tracking-wide">0${i + 2}</span>
                                        <span class="text-4xl lg:text-6xl xl:text-7xl font-display font-medium text-noir-100 group-hover:text-gold-400 transition-colors duration-300">
                                            ${category.name}
                                        </span>
                                    </button>
                                </div>
                            `)}
                        </nav>

                        <!-- Bottom Links -->
                        <div class="mt-auto pt-12 lg:pt-20 flex flex-wrap items-center gap-x-8 gap-y-3 opacity-0 animate-fade-in stagger-5">
                            <theme-toggle></theme-toggle>
                            
                            <button
                                @click=${() => this.navigateTo('/search')}
                                class="text-sm text-noir-400 hover:text-gold-400 transition-colors tracking-wide hover-line">
                                Search
                            </button>
                            <button
                                @click=${() => { this.close(); window.dispatchEvent(new CustomEvent('collection:open')); }}
                                class="text-sm text-noir-400 hover:text-gold-400 transition-colors tracking-wide hover-line">
                                My Collection
                            </button>
                            <button
                                @click=${() => { this.close(); window.dispatchEvent(new CustomEvent('cart:open')); }}
                                class="text-sm text-noir-400 hover:text-gold-400 transition-colors tracking-wide hover-line">
                                Shopping Cart
                            </button>
                        </div>
                    </div>

                    <!-- Right: Featured Category Cards (Desktop) -->
                    <div class="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-center px-12 py-12 border-l border-noir-800/50">
                        <div class="opacity-0 animate-fade-in stagger-3">
                            <p class="text-xs text-gold-400 tracking-ultrawide uppercase mb-6">Featured Collections</p>

                            <div class="grid grid-cols-2 gap-4">
                                ${productCategories.slice(0, 4).map((category, i) => this.html`
                                    <button
                                        @click=${() => this.navigateTo('/products/' + category.id)}
                                        class="group relative aspect-square overflow-hidden img-reveal">
                                        <img
                                            src="${getImageUrl(category.name + ' elegant', 600, i + 10)}"
                                            alt="${category.name}"
                                            class="w-full h-full object-cover"
                                        />
                                        <div class="absolute inset-0 bg-gradient-to-t from-noir-950/80 to-transparent"></div>
                                        <div class="absolute bottom-0 left-0 right-0 p-4">
                                            <p class="text-sm font-display text-noir-100 group-hover:text-gold-400 transition-colors">${category.name}</p>
                                        </div>
                                        <div class="absolute top-3 right-3 w-8 h-8 border border-noir-300/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 text-noir-100"></i>
                                        </div>
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="mt-12 pt-8 border-t border-noir-800/50 opacity-0 animate-fade-in stagger-4">
                            <div class="grid grid-cols-2 gap-8">
                                <div>
                                    <p class="text-xs text-noir-500 tracking-wide uppercase mb-2">Atelier</p>
                                    <p class="text-sm text-noir-300">
                                        123 Jewellers Lane<br>
                                        London, W1S 2HQ
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-noir-500 tracking-wide uppercase mb-2">Contact</p>
                                    <p class="text-sm text-noir-300">
                                        +44 20 7123 4567<br>
                                        atelier@aurea.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Decorative Elements -->
                <div class="absolute bottom-8 left-8 lg:left-16 flex items-center gap-4 opacity-0 animate-fade-in stagger-5">
                    <div class="w-12 h-px bg-gold-400/30"></div>
                    <p class="text-[10px] text-noir-500 tracking-ultrawide uppercase">Est. 2024</p>
                </div>
            </div>
        `;
    }
}

customElements.define('immersive-menu', ImmersiveMenu);
