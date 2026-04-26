import { BaseComponent } from './base-component.js';

class AppFooter extends BaseComponent {
    render() {
        return this.html`
            <!-- Footer (Desktop only - mobile uses bottom nav) -->
            <footer class="hidden lg:block bg-navy-900 text-white">
                <div class="container-desktop py-12">
                    <div class="grid grid-cols-4 gap-8">
                        <!-- Brand -->
                        <div>
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                                    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="8" cy="12" r="4"/>
                                        <circle cx="16" cy="12" r="4"/>
                                        <line x1="12" y1="12" x2="12" y2="12"/>
                                    </svg>
                                </div>
                                <span class="font-display font-bold text-xl">{{STORE_NAME}}</span>
                            </div>
                            <p class="text-gray-400 text-sm mb-4">{{STORE_TAGLINE}}</p>
                            <div class="flex gap-3">
                                <a href="#" class="w-10 h-10 bg-white/10 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                                    <i data-lucide="facebook" class="w-5 h-5"></i>
                                </a>
                                <a href="#" class="w-10 h-10 bg-white/10 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                                    <i data-lucide="instagram" class="w-5 h-5"></i>
                                </a>
                                <a href="#" class="w-10 h-10 bg-white/10 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                                    <i data-lucide="twitter" class="w-5 h-5"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div>
                            <h4 class="font-semibold mb-4">Shop</h4>
                            <ul class="space-y-2 text-sm text-gray-400">
                                <li><a href="#/products/eyeglasses" class="hover:text-brand-400 transition-colors">Eyeglasses</a></li>
                                <li><a href="#/products/sunglasses" class="hover:text-brand-400 transition-colors">Sunglasses</a></li>
                                <li><a href="#/products/contact-lenses" class="hover:text-brand-400 transition-colors">Contact Lenses</a></li>
                                <li><a href="#/products/accessories" class="hover:text-brand-400 transition-colors">Accessories</a></li>
                            </ul>
                        </div>

                        <!-- Help -->
                        <div>
                            <h4 class="font-semibold mb-4">Help</h4>
                            <ul class="space-y-2 text-sm text-gray-400">
                                <li><a href="#" class="hover:text-brand-400 transition-colors">FAQs</a></li>
                                <li><a href="#" class="hover:text-brand-400 transition-colors">Shipping & Delivery</a></li>
                                <li><a href="#" class="hover:text-brand-400 transition-colors">Returns & Exchanges</a></li>
                                <li><a href="#" class="hover:text-brand-400 transition-colors">Contact Us</a></li>
                            </ul>
                        </div>

                        <!-- Contact -->
                        <div>
                            <h4 class="font-semibold mb-4">Contact</h4>
                            <ul class="space-y-3 text-sm text-gray-400">
                                <li class="flex items-center gap-2">
                                    <i data-lucide="phone" class="w-4 h-4 text-brand-500"></i>
                                    <span>{{PHONE_NUMBER}}</span>
                                </li>
                                <li class="flex items-center gap-2">
                                    <i data-lucide="mail" class="w-4 h-4 text-brand-500"></i>
                                    <span>{{EMAIL_ADDRESS}}</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <i data-lucide="map-pin" class="w-4 h-4 text-brand-500 mt-0.5"></i>
                                    <span>{{STORE_ADDRESS}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Bottom Bar -->
                    <div class="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p class="text-sm text-gray-400">
                            &copy; ${new Date().getFullYear()} {{STORE_NAME}}. All rights reserved.
                        </p>
                        <div class="flex items-center gap-6 text-sm text-gray-400">
                            <a href="#" class="hover:text-brand-400 transition-colors">Privacy Policy</a>
                            <a href="#" class="hover:text-brand-400 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            <!-- Mobile Footer (Simple) -->
            <footer class="lg:hidden bg-gray-100 dark:bg-slate-800 py-6 px-4 mb-20">
                <div class="text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        &copy; ${new Date().getFullYear()} {{STORE_NAME}}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        All rights reserved.
                    </p>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
