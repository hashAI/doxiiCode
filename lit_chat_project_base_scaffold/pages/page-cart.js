import { BaseComponent } from '../components/base-component.js';
import { cartStore, getProductById } from '../assets/state.js';
import { currency } from '../assets/utils.js';

class PageCart extends BaseComponent {
  constructor() {
    super();
    this._unsub = null;
  }
  connectedCallback() {
    super.connectedCallback();
    this._unsub = cartStore.subscribe(() => this.requestUpdate());
  }
  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._unsub) this._unsub();
  }
  changeQty(id, d) {
    const it = cartStore.items.find((i) => i.productId === id);
    const next = (it?.qty || 0) + d;
    cartStore.setQty(id, next);
  }
  remove(id) { cartStore.remove(id); }
  render() {
    const items = cartStore.items;
    const subtotal = cartStore.totalPrice();
    return this.html`
      <section class="container mx-auto px-4 py-10">
        <h1 class="text-2xl font-semibold">Your cart</h1>
        ${items.length === 0 ? this.html`<p class="mt-4 text-gray-600">Your cart is empty.</p>` : this.nothing()}
        <div class="mt-6 grid md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-4">
            ${items.map(i => {
              const p = getProductById(i.productId);
              if (!p) return this.nothing();
              return this.html`
                <div class="flex gap-4 p-4 border rounded-lg bg-white" data-aos="fade-up">
                  <img src="${p.image}" class="w-24 h-24 rounded object-cover" alt="${p.name}" />
                  <div class="flex-1">
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="font-medium">${p.name}</div>
                        <div class="text-sm text-gray-600">${currency(p.price)}</div>
                      </div>
                      <button class="text-gray-500 hover:text-red-600" @click=${() => this.remove(p.id)}><i data-lucide="x" class="w-4 h-4"></i></button>
                    </div>
                    <div class="mt-2 flex items-center gap-2">
                      <button class="w-6 h-6 grid place-items-center rounded border" @click=${() => this.changeQty(p.id, -1)}>-</button>
                      <span class="text-sm">${i.qty}</span>
                      <button class="w-6 h-6 grid place-items-center rounded border" @click=${() => this.changeQty(p.id, 1)}>+</button>
                    </div>
                  </div>
                </div>`;
            })}
          </div>
          <div class="p-4 border rounded-lg h-fit bg-white">
            <div class="flex items-center justify-between">
              <div class="text-sm">Subtotal</div>
              <div class="font-semibold">${currency(subtotal)}</div>
            </div>
            <button class="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-brand-600 text-white hover:bg-brand-700">
              <i data-lucide="credit-card" class="w-4 h-4"></i> Checkout
            </button>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('page-cart', PageCart);


