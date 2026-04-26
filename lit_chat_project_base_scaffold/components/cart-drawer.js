import { BaseComponent } from './base-component.js';
import { cartStore, getProductById } from '../assets/state.js';
import { currency } from '../assets/utils.js';

class EcomCartDrawer extends BaseComponent {
  constructor() {
    super();
    this.open = false;
    this._unsub = null;
    this._onOpen = () => this.toggle(true);
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = cartStore.subscribe(() => this.requestUpdate());
    document.addEventListener('cart:open', this._onOpen);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._unsub) this._unsub();
    document.removeEventListener('cart:open', this._onOpen);
  }

  toggle(state) {
    this.open = typeof state === 'boolean' ? state : !this.open;
    this.requestUpdate();
  }

  overlay() {
    return this.html`
      <div class="fixed inset-0 bg-black/40" @click=${() => this.toggle(false)}></div>
    `;
  }

  changeQty(id, delta) {
    const it = cartStore.items.find((i) => i.productId === id);
    const next = (it?.qty || 0) + delta;
    cartStore.setQty(id, next);
  }

  remove(id) { cartStore.remove(id); }

  renderItem(item) {
    const p = getProductById(item.productId);
    if (!p) return this.nothing();
    return this.html`
      <div class="flex gap-3 py-3 border-b border-gray-200 last:border-none">
        <img src="${p.image}" alt="${p.name}" class="w-16 h-16 rounded object-cover" />
        <div class="flex-1">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-medium">${p.name}</div>
              <div class="text-sm text-gray-600">${currency(p.price)}</div>
            </div>
            <button class="text-gray-500 hover:text-red-600" @click=${() => this.remove(p.id)} aria-label="Remove">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <button class="w-6 h-6 grid place-items-center rounded border" @click=${() => this.changeQty(p.id, -1)}>-</button>
            <span class="text-sm">${item.qty}</span>
            <button class="w-6 h-6 grid place-items-center rounded border" @click=${() => this.changeQty(p.id, 1)}>+</button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const classes = this.open ? 'translate-x-0' : 'translate-x-full';
    const items = cartStore.items;
    const subtotal = cartStore.totalPrice();
    return this.html`
      ${this.open ? this.overlay() : this.nothing()}
      <aside class="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-gray-200 z-50 transform ${classes} transition-transform">
        <div class="h-16 px-4 border-b flex items-center justify-between">
          <div class="font-semibold">Your Cart</div>
          <button class="text-gray-600 hover:text-gray-900" @click=${() => this.toggle(false)} aria-label="Close cart"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div class="p-4 overflow-y-auto h-[calc(100%-8rem)]">
          ${items.length === 0 ? this.html`<div class="text-sm text-gray-600">Your cart is empty.</div>` : items.map((i) => this.renderItem(i))}
        </div>
        <div class="h-16 px-4 border-t flex items-center justify-between">
          <div class="text-sm">Subtotal</div>
          <div class="font-semibold">${currency(subtotal)}</div>
        </div>
      </aside>
    `;
  }
}

customElements.define('ecom-cart-drawer', EcomCartDrawer);


