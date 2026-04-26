/**
 * Mobile Menu Drawer Component - Sidebar Design
 * - Slide-in from left navigation for mobile devices
 * - Clean, professional design
 * - Links to all pages
 */

import { BaseComponent } from './base-component.js';
import { closeDrawer } from '../assets/utils.js';
import { navigate, isActive } from '../assets/router.js';

class EcomMobileMenu extends BaseComponent {
    handleClose() {
        closeDrawer('mobile-menu');
    }

    handleLinkClick(path, e) {
        e.preventDefault();
        navigate(path);
        this.handleClose();
    }

    handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            this.handleClose();
        }
    }

    render() {
        return this.html`
            <!-- Backdrop -->
            <div
                id="mobile-menu"
                class="drawer fixed inset-0 z-50 hidden"
                @click="${this.handleBackdropClick}"
            >
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

                <!-- Sidebar Panel -->
                <div class="drawer-panel absolute top-0 left-0 bottom-0 w-80 max-w-[80vw] bg-white dark:bg-gray-900 shadow-2xl transform -translate-x-full transition-transform duration-250 ease-out overflow-y-auto">

                    <!-- Promo Header -->
                    <div class="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 p-5">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <div class="text-xs text-gray-600 dark:text-gray-400 mb-0.5">FLAT ₹300 OFF</div>
                                <div class="text-base font-bold text-gray-900 dark:text-white">ON YOUR 1ST PURCHASE</div>
                                <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">+ EXCITING OFFERS</div>
                            </div>
                            <button
                                @click="${this.handleClose}"
                                class="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex-shrink-0"
                                aria-label="Close menu"
                            >
                                <i data-lucide="x" class="text-gray-900 dark:text-gray-100" width="22" height="22"></i>
                            </button>
                        </div>
                        <button class="w-full py-2.5 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 font-semibold text-sm rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            SIGN UP / LOGIN
                        </button>
                    </div>

                    <!-- Main Categories -->
                    <nav class="py-2">
                        <ul>
                            <li>
                                <a
                                    href="#/catalog?category=men"
                                    @click="${(e) => this.handleLinkClick('/catalog?category=men', e)}"
                                    class="menu-item"
                                >
                                    <span class="font-semibold text-gray-900 dark:text-white">Men</span>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#/catalog?category=women"
                                    @click="${(e) => this.handleLinkClick('/catalog?category=women', e)}"
                                    class="menu-item"
                                >
                                    <span class="font-semibold text-gray-900 dark:text-white">Women</span>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#/catalog?category=kids"
                                    @click="${(e) => this.handleLinkClick('/catalog?category=kids', e)}"
                                    class="menu-item"
                                >
                                    <span class="font-semibold text-gray-900 dark:text-white">Kids</span>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#/catalog?category=home-living"
                                    @click="${(e) => this.handleLinkClick('/catalog?category=home-living', e)}"
                                    class="menu-item"
                                >
                                    <span class="font-semibold text-gray-900 dark:text-white">Home & Living</span>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#/catalog?category=beauty"
                                    @click="${(e) => this.handleLinkClick('/catalog?category=beauty', e)}"
                                    class="menu-item"
                                >
                                    <span class="font-semibold text-gray-900 dark:text-white">Beauty</span>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Divider -->
                    <div class="border-t border-gray-200 dark:border-gray-800 my-2"></div>

                    <!-- Special Sections -->
                    <nav class="py-2">
                        <ul>
                            <li>
                                <a href="#/catalog?new=true" class="menu-item">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-900 dark:text-white">Myntra Studio</span>
                                        <span class="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">NEW</span>
                                    </div>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#/catalog?new=true" class="menu-item">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-gray-900 dark:text-white">Myntra Mall</span>
                                        <span class="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">NEW</span>
                                    </div>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#/about" class="menu-item">
                                    <span class="font-medium text-gray-900 dark:text-white">Myntra Insider</span>
                                    <i data-lucide="chevron-right" width="20" height="20" class="text-gray-400"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- Divider -->
                    <div class="border-t border-gray-200 dark:border-gray-800 my-2"></div>

                    <!-- Other Links -->
                    <nav class="py-2">
                        <ul>
                            <li>
                                <a href="#/catalog?gift-cards=true" class="menu-item">
                                    <span class="text-gray-700 dark:text-gray-300">Gift Cards</span>
                                </a>
                            </li>
                            <li>
                                <a href="#/contact" class="menu-item">
                                    <span class="text-gray-700 dark:text-gray-300">Contact Us</span>
                                </a>
                            </li>
                            <li>
                                <a href="#/about" class="menu-item">
                                    <span class="text-gray-700 dark:text-gray-300">FAQs</span>
                                </a>
                            </li>
                            <li>
                                <a href="#/about" class="menu-item">
                                    <span class="text-gray-700 dark:text-gray-300">Legal</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <!-- App Promo -->
                    <div class="p-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                                <svg width="32" height="32" viewBox="0 0 53 36" class="fill-myntra-pink">
                                    <path d="M12.5 0L0 36h6.8l2.5-7.2h13.4l2.5 7.2h6.8L19.5 0h-7zm-1.3 22.4l4.3-12.4 4.3 12.4H11.2z"></path>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <div class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    Enjoy The Best
                                </div>
                                <div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Shopping Experience!
                                </div>
                                <button class="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                    GET MYNTRA APP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .drawer.open {
                    display: block;
                }

                .drawer.open .drawer-panel {
                    transform: translateX(0);
                }

                .menu-item {
                    @apply flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800;
                }
            </style>
        `;
    }
}

customElements.define('ecom-mobile-menu', EcomMobileMenu);
