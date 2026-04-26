import { BaseComponent } from './base-component.js';

class EcomFooter extends BaseComponent {
  render() {
    return this.html`
      <footer class="mt-16 border-t border-gray-200 bg-white">
        <div class="container mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <i data-lucide="flower-2" class="w-6 h-6 text-brand-600"></i>
              <span class="font-bold text-lg tracking-tight">doxii</span>
            </div>
            <p class="text-sm text-gray-600">Inspiration-first e‑commerce scaffold built with Lit and Tailwind.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Shop</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li><a class="hover:text-brand-600" href="#/catalog">All products</a></li>
              <li><a class="hover:text-brand-600" href="#/catalog">New arrivals</a></li>
              <li><a class="hover:text-brand-600" href="#/catalog">Best sellers</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Company</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li><a class="hover:text-brand-600" href="#/">About</a></li>
              <li><a class="hover:text-brand-600" href="#/">Careers</a></li>
              <li><a class="hover:text-brand-600" href="#/">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Follow</h4>
            <div class="flex gap-3 text-gray-600">
              <a class="hover:text-brand-600" href="#" aria-label="Twitter"><i data-lucide="twitter" class="w-5 h-5"></i></a>
              <a class="hover:text-brand-600" href="#" aria-label="Instagram"><i data-lucide="instagram" class="w-5 h-5"></i></a>
              <a class="hover:text-brand-600" href="#" aria-label="Github"><i data-lucide="github" class="w-5 h-5"></i></a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-200">
          <div class="container mx-auto px-4 py-4 text-xs text-gray-500">© <span id="year"></span> doxii. All rights reserved.</div>
        </div>
        <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
      </footer>
    `;
  }
}

customElements.define('ecom-footer', EcomFooter);


