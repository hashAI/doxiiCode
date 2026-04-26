import { BaseComponent } from './base-component.js';
import { showOverlay, hideOverlay } from '../assets/utils.js';
import { frameShapes } from '../assets/state.js';

class SideMenu extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        expandedSection: { type: String }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.expandedSection = null;
    }

    open() {
        this.isOpen = true;
        showOverlay(() => this.close());
        this.requestUpdate();
    }

    close() {
        this.isOpen = false;
        hideOverlay();
        this.requestUpdate();
    }

    toggleSection(section) {
        this.expandedSection = this.expandedSection === section ? null : section;
        this.requestUpdate();
    }

    navigateTo(path) {
        window.location.hash = path;
        this.close();
    }

    render() {
        return this.html`
            <div class="side-drawer ${this.isOpen ? 'open' : ''}">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-3">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Ctext x='10' y='28' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%23042A5B'%3Elenskart%3C/text%3E%3C/svg%3E" alt="Lenskart" class="h-8">
                        </div>
                        <button @click=${this.close} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-feedback">
                            <i data-lucide="x" class="w-5 h-5 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <!-- User Section -->
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                <i data-lucide="user" class="w-6 h-6 text-primary-900 dark:text-primary-200"></i>
                            </div>
                            <div>
                                <p class="font-bold text-lg dark:text-white">Hi Specsy!</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Login or Signup to track</p>
                            </div>
                        </div>
                        <button class="w-full bg-primary-900 dark:bg-primary-700 text-white py-2 rounded-lg font-semibold hover:bg-primary-800 dark:hover:bg-primary-600 transition-colors touch-feedback">
                            Login/Signup
                        </button>
                    </div>

                    <!-- Menu Items -->
                    <div class="flex-1 overflow-y-auto">
                        <!-- Talk to us -->
                        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                            <a href="tel:9999899998" class="flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors">
                                <span class="font-medium">Talk to us</span>
                                <div class="flex items-center gap-2">
                                    <i data-lucide="phone" class="w-4 h-4"></i>
                                    <span class="font-semibold">9999899998</span>
                                </div>
                            </a>
                        </div>

                        <!-- Shop Eyeglasses -->
                        <div class="border-b border-gray-200 dark:border-gray-700">
                            <button
                                @click=${() => this.toggleSection('eyeglasses')}
                                class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span class="font-semibold text-gray-900 dark:text-white">Shop Eyeglasses</span>
                                <i data-lucide="chevron-${this.expandedSection === 'eyeglasses' ? 'up' : 'down'}" class="w-5 h-5 text-gray-500"></i>
                            </button>
                            ${this.expandedSection === 'eyeglasses' ? this.html`
                                <div class="px-4 pb-4 space-y-1">
                                    ${frameShapes.map(shape => this.html`
                                        <button
                                            @click=${() => this.navigateTo(`/products/eyeglasses?shape=${shape.id}`)}
                                            class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            ${shape.label}
                                        </button>
                                    `)}
                                    <button
                                        @click=${() => this.navigateTo('/products/eyeglasses')}
                                        class="w-full text-left p-3 text-primary-900 dark:text-primary-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        View All Eyeglasses
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Shop Sunglasses -->
                        <div class="border-b border-gray-200 dark:border-gray-700">
                            <button
                                @click=${() => this.toggleSection('sunglasses')}
                                class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span class="font-semibold text-gray-900 dark:text-white">Shop Sunglasses</span>
                                <i data-lucide="chevron-${this.expandedSection === 'sunglasses' ? 'up' : 'down'}" class="w-5 h-5 text-gray-500"></i>
                            </button>
                            ${this.expandedSection === 'sunglasses' ? this.html`
                                <div class="px-4 pb-4 space-y-1">
                                    <button
                                        @click=${() => this.navigateTo('/products/sunglasses?type=wayfarer')}
                                        class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Wayfarer
                                    </button>
                                    <button
                                        @click=${() => this.navigateTo('/products/sunglasses?type=aviator')}
                                        class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Aviator
                                    </button>
                                    <button
                                        @click=${() => this.navigateTo('/products/sunglasses?type=cat-eye')}
                                        class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Cat Eye
                                    </button>
                                    <button
                                        @click=${() => this.navigateTo('/products/sunglasses')}
                                        class="w-full text-left p-3 text-primary-900 dark:text-primary-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        View All Sunglasses
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Shop Contact Lens -->
                        <div class="border-b border-gray-200 dark:border-gray-700">
                            <button
                                @click=${() => this.toggleSection('contact-lenses')}
                                class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span class="font-semibold text-gray-900 dark:text-white">Shop Contact Lens</span>
                                <i data-lucide="chevron-${this.expandedSection === 'contact-lenses' ? 'up' : 'down'}" class="w-5 h-5 text-gray-500"></i>
                            </button>
                            ${this.expandedSection === 'contact-lenses' ? this.html`
                                <div class="px-4 pb-4 space-y-1">
                                    <button
                                        @click=${() => this.navigateTo('/products/contact-lenses?type=daily')}
                                        class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Daily Disposable
                                    </button>
                                    <button
                                        @click=${() => this.navigateTo('/products/contact-lenses?type=monthly')}
                                        class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        @click=${() => this.navigateTo('/products/contact-lenses?type=colored')}
                                        class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Colored Lenses
                                    </button>
                                    <button
                                        @click=${() => this.navigateTo('/products/contact-lenses')}
                                        class="w-full text-left p-3 text-primary-900 dark:text-primary-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        View All Contact Lenses
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Other Links -->
                        <div class="p-4 space-y-2">
                            <button
                                @click=${() => this.navigateTo('/')}
                                class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Lenskart@Home
                            </button>
                            <button
                                @click=${() => this.navigateTo('/')}
                                class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Store Locator
                            </button>
                            <button
                                @click=${() => this.navigateTo('/')}
                                class="w-full text-left p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Gold Membership
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('side-menu', SideMenu);
