import { BaseComponent } from './base-component.js';
import { cartStore, eventBus } from '../assets/state.js';
import { formatCurrency, showToast } from '../assets/utils.js';

class CartDrawer extends BaseComponent {
    static properties = {
        open: { state: true },
        cart: { state: true }
    };

    constructor() {
        super();
        this.open = false;
        this.cart = cartStore.getState();
    }

    connectedCallback() {
        super.connectedCallback?.();
        this.unsubscribeCart = cartStore.subscribe(state => {
            this.cart = state;
        });
        this.cartToggleHandler = () => this.toggle();
        eventBus.on('cart:toggle', this.cartToggleHandler);
        eventBus.on('cart:open', () => this.setOpen(true));
    }

    disconnectedCallback() {
        this.unsubscribeCart?.();
    }

    setOpen(next) {
        this.open = next;
        document.body.classList.toggle('overflow-hidden', this.open);
    }

    toggle() {
        this.setOpen(!this.open);
    }

    removeItem(id) {
        cartStore.remove(id);
        showToast({ title: 'Removed', message: 'Item removed from cart' });
    }

    adjustQuantity(id, delta) {
        const item = this.cart.items.find(line => line.id === id);
        if (!item) return;
        cartStore.update(id, item.quantity + delta);
    }

    checkout() {
        showToast({ title: 'Checkout simulated', message: 'Hook this into your checkout provider.' });
    }

    render() {
        return this.html`
            <div class=${[
                'fixed inset-0 z-50 pointer-events-none transition',
                this.open ? 'pointer-events-auto' : 'opacity-0'
            ].join(' ')}>
                <div
                    class=${[
                        'absolute inset-0 bg-black/50 transition-opacity',
                        this.open ? 'opacity-100' : 'opacity-0'
                    ].join(' ')}
                    @click=${() => this.toggle()}
                ></div>
                <aside class=${[
                    'absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-ink-900 shadow-glow',
                    'transition-transform duration-300 flex flex-col',
                    this.open ? 'translate-x-0' : 'translate-x-full'
                ].join(' ')}>
                    <div class="flex items-center justify-between px-6 py-5 border-b border-ink-100 dark:border-ink-800">
                        <div>
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Cart</p>
                            <p class="text-lg font-semibold">${this.cart.count} item${this.cart.count === 1 ? '' : 's'}</p>
                        </div>
                        <button class="p-2 rounded-full hover:bg-ink-50 dark:hover:bg-ink-800" aria-label="Close cart" @click=${() => this.toggle()}>
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        ${this.cart.items.length === 0 ? this.emptyTemplate() : this.cart.items.map(item => this.lineItemTemplate(item))}
                    </div>
                    <div class="border-t border-ink-100 dark:border-ink-800 p-6 space-y-4">
                        <div class="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <strong>${formatCurrency(this.cart.subtotal)}</strong>
                        </div>
                        <button
                            class="w-full px-5 py-3 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center justify-center gap-2"
                            ?disabled=${this.cart.items.length === 0}
                            @click=${() => this.checkout()}
                        >
                            <i data-lucide="credit-card"></i>
                            Proceed to checkout
                        </button>
                        <p class="text-center text-xs text-ink-400">
                            Carbon-neutral shipping on all orders. Duties calculated at checkout.
                        </p>
                    </div>
                </aside>
            </div>
        `;
    }

    emptyTemplate() {
        return this.html`
            <div class="text-center py-16 space-y-3">
                <p class="text-sm text-ink-400 uppercase tracking-[0.4em]">Cart</p>
                <p class="text-lg">Your cart is minimal for now.</p>
                <button class="px-5 py-3 bg-ink-900 dark:bg-white text-white dark:text-ink-900 rounded-full" @click=${() => this.toggle()}>
                    Continue shopping
                </button>
            </div>
        `;
    }

    lineItemTemplate(item) {
        return this.html`
            <div class="flex gap-4 border border-ink-100 dark:border-ink-800 rounded-2xl p-4">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-24 object-cover rounded-xl">
                <div class="flex-1 flex flex-col">
                    <div class="flex justify-between gap-2">
                        <p class="font-semibold">${item.name}</p>
                        <button class="text-ink-400 hover:text-ink-900 dark:hover:text-white" aria-label="Remove item" @click=${() => this.removeItem(item.id)}>
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <p class="text-sm text-ink-500 dark:text-ink-300">${formatCurrency(item.price)}</p>
                    <div class="mt-auto flex items-center gap-3">
                        <button class="w-8 h-8 rounded-full border border-ink-200 dark:border-ink-700 flex items-center justify-center" @click=${() => this.adjustQuantity(item.id, -1)}>
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                        <span class="w-8 text-center">${item.quantity}</span>
                        <button class="w-8 h-8 rounded-full border border-ink-200 dark:border-ink-700 flex items-center justify-center" @click=${() => this.adjustQuantity(item.id, 1)}>
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('cart-drawer', CartDrawer);

