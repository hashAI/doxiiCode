import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';

class ImmersiveMenu extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean }
    };

    constructor() {
        super();
        this.isOpen = false;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('menu:open', () => this.open());
        window.addEventListener('menu:close', () => this.close());
        window.addEventListener('menu:toggle', () => this.toggle());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    navigateTo(path) {
        this.close();
        setTimeout(() => {
            navigate(path);
        }, 100);
    }

    render() {
        const menuItems = [
            { name: 'Store', path: '/products/all' },
            { name: 'Mac', path: '/products/Mac' },
            { name: 'iPad', path: '/products/iPad' },
            { name: 'iPhone', path: '/products/iPhone' },
            { name: 'Watch', path: '/products/Watch' },
            { name: 'Vision', path: '/products/Vision' },
            { name: 'AirPods', path: '/products/AirPods' },
            { name: 'TV & Home', path: '/products/Accessories' },
            { name: 'Entertainment', path: '#entertainment' },
            { name: 'Accessories', path: '/products/Accessories' },
            { name: 'Support', path: '#support' }
        ];

        return this.html`
            <!-- Full Screen Mobile Menu -->
            <div 
                class="fixed inset-0 z-50 transition-all duration-300 ${this.isOpen ? 'pointer-events-auto' : 'pointer-events-none'}">
                
                <!-- White Background -->
                <div class="absolute inset-0 bg-white transition-opacity duration-300 ${this.isOpen ? 'opacity-100' : 'opacity-0'}"></div>
                
                <!-- Content -->
                <div class="relative h-full flex flex-col">
                    <!-- Close Button -->
                    <div class="flex justify-end p-4">
                        <button 
                            @click=${this.close}
                            class="p-3 text-apple-gray/60 hover:text-apple-gray transition-colors ${this.isOpen ? 'opacity-100' : 'opacity-0'}"
                            style="transition-delay: ${this.isOpen ? '100ms' : '0ms'}">
                            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                                <path d="M4 4l12 12"/>
                                <path d="M16 4l-12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Menu Links -->
                    <nav class="flex-1 px-12 pt-4 overflow-y-auto">
                        <ul class="space-y-1">
                            ${menuItems.map((item, index) => this.html`
                                <li 
                                    class="transform transition-all duration-300 ${this.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}"
                                    style="transition-delay: ${this.isOpen ? `${50 + index * 30}ms` : '0ms'}">
                                    <button 
                                        @click=${() => this.navigateTo(item.path)}
                                        class="block w-full text-left py-2 text-3xl font-semibold text-apple-gray hover:text-apple-gray/60 transition-colors">
                                        ${item.name}
                                    </button>
                                </li>
                            `)}
                        </ul>
                    </nav>
                </div>
            </div>
        `;
    }
}

customElements.define('immersive-menu', ImmersiveMenu);

