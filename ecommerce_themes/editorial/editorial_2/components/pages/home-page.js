import { BaseComponent } from '../../components/base-component.js';
import { productsStore, collectionsMeta } from '../../assets/state.js';
import '../ui/product-card.js';

class HomePage extends BaseComponent {
    get heroImage() {
        return 'http://194.238.23.194/epicsum/media/image/runway%20fashion%20desert?size=1000&index=0';
    }

    render() {
        const featured = productsStore.getFeaturedProducts().slice(0, 4);
        const essentials = productsStore.products.slice(0, 6);

        return this.html`
            <section class="space-y-24">
                ${this.heroSection()}
                ${this.metricsStrip()}
                ${this.collectionTiles()}
                <div class="mx-auto max-w-6xl px-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Featured edit</p>
                            <h2 class="text-3xl font-display">Capsule 08 · Sculpted silhouettes</h2>
                        </div>
                        <a href="#/products/all" class="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em]">
                            View all
                            <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        ${featured.map(product => this.html`
                            <product-card data-product=${JSON.stringify(product)}></product-card>
                        `)}
                    </div>
                </div>
                <div class="mx-auto max-w-6xl px-6">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Everyday rituals</p>
                            <h2 class="text-3xl font-display">Essentials we live in</h2>
                        </div>
                    </div>
                    <div class="grid gap-6 sm:grid-cols-1">
                        ${essentials.map(product => this.html`
                            <article class="flex gap-5 border border-ink-100 dark:border-ink-800 rounded-3xl p-5">
                                <img src="${product.image}" alt="${product.name}" class="w-28 h-36 object-cover rounded-2xl">
                                <div class="flex-1 flex flex-col">
                                    <p class="text-xs uppercase tracking-[0.3em] text-ink-400">${product.category}</p>
                                    <h3 class="text-xl font-semibold">${product.name}</h3>
                                    <p class="text-sm text-ink-500 dark:text-ink-300">${product.description}</p>
                                    <div class="mt-auto flex items-center justify-between">
                                        <p class="font-semibold">$${product.price}</p>
                                        <button class="text-sm uppercase tracking-[0.3em]" @click=${() => this.goToProduct(product.id)}>
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </article>
                        `)}
                    </div>
                </div>
                ${this.newsletterSection()}
            </section>
        `;
    }

    heroSection() {
        return this.html`
            <div class="relative">
                <div class="mx-auto max-w-6xl px-6 grid gap-10 lg:grid-cols-2 items-center">
                    <div class="space-y-6" data-aos="fade-up">
                        <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Store Name</p>
                        <h1 class="text-5xl md:text-6xl font-display leading-tight">
                            Wearable architecture for the modern atelier.
                        </h1>
                        <p class="text-ink-500 dark:text-ink-300 text-lg">
                            Seasonless layers, sculpted tailoring, and tactile textures—crafted with regenerative materials
                            and designed to be reinterpreted with every drop.
                        </p>
                        <div class="flex flex-wrap gap-4">
                            <a href="#/products/all" class="px-6 py-3 bg-ink-900 dark:bg-white text-white dark:text-ink-900 rounded-full flex items-center gap-2">
                                Shop Capsules
                                <i data-lucide="arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div data-aos="fade-left">
                        <div class="relative">
                            <img src="${this.heroImage}" alt="Store Name editorial" class="rounded-[32px] shadow-glow object-cover w-full h-[520px]">
                            <div class="absolute -bottom-10 -left-6 bg-white dark:bg-ink-900 p-6 rounded-3xl shadow-glow w-64">
                                <p class="text-xs uppercase tracking-[0.3em] text-ink-400 mb-2">Drop highlights</p>
                                <ul class="space-y-2 text-sm text-ink-600 dark:text-ink-200">
                                    <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-ink-900 dark:bg-white"></span> Responsible wool suiting</li>
                                    <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-ink-900 dark:bg-white"></span> Regenerative cotton denim</li>
                                    <li class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-ink-900 dark:bg-white"></span> Atelier-dyed silks</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    metricsStrip() {
        const items = [
            { label: 'Certified suppliers', value: '34' },
            { label: 'Studio fittings this season', value: '128' },
            { label: 'Minutes to craft a blazer', value: '620' },
            { label: 'Regenerative farms', value: '12' }
        ];
        return this.html`
            <div class="border-y border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-900/40">
                <div class="mx-auto max-w-6xl px-6 py-8 grid gap-6 md:grid-cols-4 text-center">
                    ${items.map(item => this.html`
                        <div>
                            <p class="text-3xl font-display">${item.value}</p>
                            <p class="text-xs uppercase tracking-[0.3em] text-ink-400">${item.label}</p>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    collectionTiles() {
        return this.html`
            <div class="mx-auto max-w-6xl px-6 grid gap-6 lg:grid-cols-3">
                ${collectionsMeta.map((collection, index) => this.html`
                    <article class="relative rounded-[32px] overflow-hidden group" data-aos="fade-up" data-aos-delay="${index * 80}">
                        <img src="${collection.image}" alt="${collection.name}" class="h-96 w-full object-cover transition duration-500 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent"></div>
                        <div class="absolute inset-x-0 bottom-0 p-8 text-white space-y-3">
                            <p class="text-xs uppercase tracking-[0.4em] text-white/70">${collection.category}</p>
                            <h3 class="text-3xl font-display">${collection.name}</h3>
                            <p class="text-sm text-white/80">${collection.description}</p>
                            <a href="#/products/${encodeURIComponent(collection.category)}" class="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em]">
                                ${collection.cta}
                                <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                            </a>
                        </div>
                    </article>
                `)}
            </div>
        `;
    }

    videoSection(film) {
        return this.html`
            <div class="mx-auto max-w-6xl px-6 flex flex-col gap-8 lg:grid lg:grid-cols-2 items-center">
                <div class="space-y-4 order-2 lg:order-1" data-aos="fade-right">
                    <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Campaign film</p>
                    <h2 class="text-4xl font-display">${film.title}</h2>
                    <p class="text-lg text-ink-500 dark:text-ink-300">${film.caption}</p>
                    <div class="flex gap-4">
                    </div>
                </div>
                <div class="relative order-1 lg:order-2" data-aos="fade-left">
                    <video
                        src="${film.video}"
                        autoplay
                        muted
                        loop
                        playsinline
                        class="w-full h-[360px] object-cover rounded-[32px] shadow-glow"
                    ></video>
                    <div class="absolute -bottom-6 -right-6 bg-white dark:bg-ink-900 p-4 rounded-2xl shadow-glow">
                        <p class="text-xs uppercase tracking-[0.3em] text-ink-400">Director</p>
                        <p class="font-semibold">Hadley Rue</p>
                    </div>
                </div>
            </div>
        `;
    }


    newsletterSection() {
        return this.html`
            <div class="mx-auto max-w-6xl px-6">
                <div class="rounded-[32px] bg-ink-900 text-white p-10 grid gap-8 lg:grid-cols-2 items-center">
                    <div>
                        <p class="text-xs uppercase tracking-[0.4em] text-white/70">Studio letters</p>
                        <h2 class="text-4xl font-display">Private fittings &amp; playlists.</h2>
                        <p class="text-white/80 mt-4">
                            Receive early access to drops, styling appointments, and playlists curated by our design team.
                        </p>
                    </div>
                    <form class="space-y-4">
                        <div class="flex flex-col gap-3">
                            <label class="text-xs uppercase tracking-[0.4em] text-white/60">Email</label>
                            <input type="email" class="px-4 py-3 rounded-full bg-white/10 focus:bg-white/20 outline-none" placeholder="you@email.com" required>
                        </div>
                        <button type="submit" class="w-full px-6 py-3 bg-white text-ink-900 rounded-full font-semibold">
                            Join the list
                        </button>
                        <p class="text-xs text-white/60">We send at most two letters per month.</p>
                    </form>
                </div>
            </div>
        `;
    }

    goToProduct(id) {
        window.location.hash = `/product/${id}`;
    }
}

customElements.define('home-page', HomePage);

