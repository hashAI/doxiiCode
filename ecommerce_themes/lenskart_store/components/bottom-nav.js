import { BaseComponent } from './base-component.js';

class BottomNav extends BaseComponent {
    static properties = {
        activeTab: { type: String }
    };

    constructor() {
        super();
        this.activeTab = this.getActiveTab();
        window.addEventListener('hashchange', () => {
            this.activeTab = this.getActiveTab();
            this.requestUpdate();
        });
    }

    getActiveTab() {
        const hash = window.location.hash.slice(1) || '/';
        if (hash === '/' || hash.startsWith('/products') || hash.startsWith('/product') || hash.startsWith('/search')) {
            return 'home';
        } else if (hash.startsWith('/stores')) {
            return 'stores';
        } else if (hash.startsWith('/3d-try-on')) {
            return '3d-try-on';
        } else if (hash.startsWith('/try-at-home')) {
            return 'try-at-home';
        } else if (hash.startsWith('/orders')) {
            return 'orders';
        }
        return 'home';
    }

    render() {
        const tabs = [
            { id: 'home', label: 'Home', icon: 'home', path: '#/' },
            { id: 'stores', label: 'Stores', icon: 'map-pin', path: '#/stores' },
            { id: '3d-try-on', label: '3D Try-On', icon: 'scan-face', path: '#/3d-try-on', special: true },
            { id: 'try-at-home', label: 'Try@Home', icon: 'package', path: '#/try-at-home' },
            { id: 'orders', label: 'Orders', icon: 'clipboard-list', path: '#/orders' }
        ];

        return this.html`
            <!-- Mobile Only Bottom Navigation -->
            <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 z-40 pb-safe">
                <div class="flex items-center justify-around py-2">
                    ${tabs.map(tab => this.html`
                        <a
                            href="${tab.path}"
                            class="flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] touch-feedback ${
                                tab.special
                                    ? 'relative -mt-6'
                                    : ''
                            }"
                        >
                            ${tab.special ? this.html`
                                <!-- Special 3D Try-On Button -->
                                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 ${
                                    this.activeTab === tab.id ? 'ring-4 ring-brand-200 dark:ring-brand-800' : ''
                                }">
                                    <i data-lucide="${tab.icon}" class="w-6 h-6 text-white"></i>
                                </div>
                                <span class="text-[10px] font-semibold text-brand-500 mt-1">${tab.label}</span>
                            ` : this.html`
                                <div class="relative">
                                    <i
                                        data-lucide="${tab.icon}"
                                        class="w-5 h-5 ${
                                            this.activeTab === tab.id
                                                ? 'text-brand-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }"
                                    ></i>
                                    ${this.activeTab === tab.id ? this.html`
                                        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full"></div>
                                    ` : ''}
                                </div>
                                <span class="text-[10px] font-medium ${
                                    this.activeTab === tab.id
                                        ? 'text-brand-500 font-semibold'
                                        : 'text-gray-500 dark:text-gray-400'
                                }">
                                    ${tab.label}
                                </span>
                            `}
                        </a>
                    `)}
                </div>
            </nav>

            <!-- Bottom padding for mobile content -->
            <div class="lg:hidden h-20"></div>
        `;
    }
}

customElements.define('bottom-nav', BottomNav);
