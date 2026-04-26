import { BaseComponent } from '../components/base-component.js';

class PageHome extends BaseComponent {
  render() {
    return this.html`
      <ecom-hero></ecom-hero>
      <ecom-product-grid title="Featured"></ecom-product-grid>
      <section class="container mx-auto px-4 mt-16 grid md:grid-cols-3 gap-6" data-aos="fade-up">
        <div class="p-6 rounded-lg border bg-white">
          <div class="flex items-center gap-2 font-semibold"><i data-lucide="truck" class="w-5 h-5 text-brand-600"></i> Free shipping</div>
          <p class="mt-2 text-sm text-gray-600">Enjoy free shipping on orders over $50 in the US.</p>
        </div>
        <div class="p-6 rounded-lg border bg-white">
          <div class="flex items-center gap-2 font-semibold"><i data-lucide="shield-check" class="w-5 h-5 text-brand-600"></i> Secure checkout</div>
          <p class="mt-2 text-sm text-gray-600">We use industry‑standard encryption to protect your data.</p>
        </div>
        <div class="p-6 rounded-lg border bg-white">
          <div class="flex items-center gap-2 font-semibold"><i data-lucide="refresh-ccw" class="w-5 h-5 text-brand-600"></i> Easy returns</div>
          <p class="mt-2 text-sm text-gray-600">30‑day return policy. Love it or your money back.</p>
        </div>
      </section>
    `;
  }
}

customElements.define('page-home', PageHome);


