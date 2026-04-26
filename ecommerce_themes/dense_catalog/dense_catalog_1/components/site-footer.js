import { BaseComponent } from './base-component.js';

class SiteFooter extends BaseComponent {
    render() {
        return this.html`
            <footer class="bg-slate-900 text-white mt-24">
                <div class="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-4">
                    <div class="space-y-4" data-aos="fade-up">
                        <h3 class="font-display text-2xl">Store Name</h3>
                        <p class="text-sm text-white/80">
                            Premium products and accessories for creators, developers, and enthusiasts.
                        </p>
                        <div class="flex gap-3">
                            <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition" aria-label="Twitter">
                                <i data-lucide="twitter"></i>
                            </button>
                            <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition" aria-label="YouTube">
                                <i data-lucide="youtube"></i>
                            </button>
                            <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition" aria-label="GitHub">
                                <i data-lucide="github"></i>
                            </button>
                        </div>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="50">
                        <p class="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">Shop</p>
                        <ul class="space-y-3 text-sm text-white/80">
                            <li><a href="#/products/all" class="hover:text-white">All Products</a></li>
                            <li><a href="#/products/all?category=Audio" class="hover:text-white">Audio</a></li>
                            <li><a href="#/products/all?category=Accessories" class="hover:text-white">Accessories</a></li>
                            <li><a href="#/lookbook" class="hover:text-white">Gallery</a></li>
                        </ul>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="100">
                        <p class="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">Support</p>
                        <ul class="space-y-3 text-sm text-white/80">
                            <li><a href="#/journal" class="hover:text-white">Blog</a></li>
                            <li><a href="#/journal" class="hover:text-white">Guides</a></li>
                            <li><a href="#/journal" class="hover:text-white">FAQs</a></li>
                            <li><a href="#/journal" class="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="150">
                        <p class="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">Newsletter</p>
                        <p class="text-sm text-white/80 mb-4">
                            Get the latest tech gear updates and exclusive deals.
                        </p>
                        <form class="flex gap-2">
                            <input type="email" placeholder="Email address" class="flex-1 px-4 py-3 rounded-full bg-white/10 focus:bg-white/20 outline-none placeholder:text-white/60">
                            <button type="submit" class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold">Join</button>
                        </form>
                    </div>
                </div>
                <div class="border-t border-white/10">
                    <div class="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-white/60">
                        <p>© ${new Date().getFullYear()} Store Name · Innovation meets quality</p>
                        <div class="flex gap-4">
                            <a href="#/legal" class="hover:text-white">Privacy</a>
                            <a href="#/legal" class="hover:text-white">Terms</a>
                            <a href="mailto:hello@store.com" class="hover:text-white">hello@store.com</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);
