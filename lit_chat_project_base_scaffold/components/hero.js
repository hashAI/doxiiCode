import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';

class EcomHero extends BaseComponent {
  render() {
    return this.html`
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white"></div>
        <div class="relative container mx-auto px-4 pt-14 pb-10 md:pt-20 md:pb-16">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div data-aos="fade-right">
              <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-xs text-brand-700">
                <i data-lucide="sparkles" class="w-4 h-4"></i> New season edit
              </span>
              <h1 class="mt-3 font-display text-4xl md:text-6xl font-semibold leading-tight">
                Elevate the everyday
              </h1>
              <p class="mt-4 text-gray-600 text-lg max-w-prose">
                Thoughtfully designed goods that blend form and function. Crafted to last, styled for now.
              </p>
              <div class="mt-8 flex flex-wrap gap-3">
                <button class="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-brand-600 text-white hover:bg-brand-700" @click=${() => navigate('/catalog')}>
                  Shop the collection <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
                <a class="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-gray-300 hover:bg-gray-50" href="#/catalog">
                  Explore categories <i data-lucide="grid-2x2" class="w-4 h-4"></i>
                </a>
              </div>
              <div class="mt-8 grid grid-cols-3 gap-4 text-sm">
                <div class="p-4 rounded-lg bg-white border">
                  <div class="font-semibold">Free shipping</div>
                  <div class="text-gray-600 mt-1">On orders over $50</div>
                </div>
                <div class="p-4 rounded-lg bg-white border">
                  <div class="font-semibold">Sustainable</div>
                  <div class="text-gray-600 mt-1">Responsibly made</div>
                </div>
                <div class="p-4 rounded-lg bg-white border">
                  <div class="font-semibold">4.6/5 rating</div>
                  <div class="text-gray-600 mt-1">Trusted by shoppers</div>
                </div>
              </div>
            </div>
            <div class="relative" data-aos="fade-left">
              <div class="relative mx-auto w-full max-w-md">
                <div class="aspect-[4/5] rounded-2xl overflow-hidden border shadow-card">
                  <img src="https://picsum.photos/seed/hero-a/1200/1200" alt="Collection" class="w-full h-full object-cover" />
                </div>
                <div class="absolute -bottom-6 -left-6 w-40 aspect-[3/4] rounded-xl overflow-hidden border shadow-card hidden sm:block">
                  <img src="https://picsum.photos/seed/hero-b/600/800" alt="Detail" class="w-full h-full object-cover" />
                </div>
                <div class="absolute -top-6 -right-6 w-32 aspect-square rounded-xl overflow-hidden border shadow-card hidden sm:block">
                  <img src="https://picsum.photos/seed/hero-c/512/512" alt="Accessory" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('ecom-hero', EcomHero);


