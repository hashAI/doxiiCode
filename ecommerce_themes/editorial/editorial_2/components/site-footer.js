import { BaseComponent } from './base-component.js';

class SiteFooter extends BaseComponent {
    render() {
        return this.html`
            <footer class="bg-ink-900 text-white mt-24">
                <div class="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-4">
                    <div class="space-y-4" data-aos="fade-up">
                        <h3 class="font-display text-2xl">Store Name</h3>
                        <p class="text-sm text-white/80">
                            Modular apparel systems crafted with regenerative materials and atelier-level finishing.
                        </p>
                        <div class="flex gap-3">
                            <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition" aria-label="Instagram">
                                <i data-lucide="instagram"></i>
                            </button>
                            <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition" aria-label="Share">
                                <i data-lucide="share-2"></i>
                            </button>
                            <button class="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition" aria-label="Spotify">
                                <i data-lucide="music-3"></i>
                            </button>
                        </div>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="50">
                        <p class="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">Shop</p>
                        <ul class="space-y-3 text-sm text-white/80">
                            <li><a href="#/collections" class="hover:text-white">Women</a></li>
                            <li><a href="#/collections?category=Men" class="hover:text-white">Men</a></li>
                            <li><a href="#/collections?category=Accessories" class="hover:text-white">Accessories</a></li>
                            <li><a href="#/lookbook" class="hover:text-white">Lookbook</a></li>
                        </ul>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="100">
                        <p class="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">About</p>
                        <ul class="space-y-3 text-sm text-white/80">
                            <li><a href="#/journal" class="hover:text-white">Journal</a></li>
                            <li><a href="#/journal" class="hover:text-white">Atelier</a></li>
                            <li><a href="#/journal" class="hover:text-white">Materials</a></li>
                            <li><a href="#/journal" class="hover:text-white">Stockists</a></li>
                        </ul>
                    </div>
                    <div data-aos="fade-up" data-aos-delay="150">
                        <p class="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">Studio Letters</p>
                        <p class="text-sm text-white/80 mb-4">
                            Receive capsule launches, styling sessions, and the occasional playlist.
                        </p>
                        <form class="flex gap-2">
                            <input type="email" placeholder="Email address" class="flex-1 px-4 py-3 rounded-full bg-white/10 focus:bg-white/20 outline-none placeholder:text-white/60">
                            <button type="submit" class="px-5 py-3 bg-white text-ink-900 rounded-full font-semibold">Join</button>
                        </form>
                    </div>
                </div>
                <div class="border-t border-white/10">
                    <div class="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-white/60">
                        <p>© ${new Date().getFullYear()} Store Name · Crafted with passion</p>
                        <div class="flex gap-4">
                            <a href="#/legal" class="hover:text-white">Privacy</a>
                            <a href="#/legal" class="hover:text-white">Terms</a>
                            <a href="mailto:studio@store.com" class="hover:text-white">studio@store.com</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);

