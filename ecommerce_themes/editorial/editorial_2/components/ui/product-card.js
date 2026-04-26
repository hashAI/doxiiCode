import { BaseComponent } from '../base-component.js';
import { cartStore, eventBus } from '../../assets/state.js';
import { showToast, formatCurrency } from '../../assets/utils.js';
import { navigate } from '../../assets/router.js';

class ProductCard extends BaseComponent {
    static properties = {
        product: { state: true }
    };

    constructor() {
        super();
        this.product = null;
    }

    connectedCallback() {
        super.connectedCallback?.();
        const payload = this.readJsonAttr('data-product');
        this.product = payload;
    }

    handleAdd(e) {
        e.stopPropagation(); // Prevent card click navigation
        cartStore.add(this.product);
        showToast({ title: 'Added to cart', message: `${this.product.name} is now in your bag.` });
        eventBus.emit('cart:open');
    }

    handleCardClick() {
        navigate(`/product/${this.product.id}`);
    }

    render() {
        if (!this.product) return this.html``;
        return this.html`
            <article class="group border border-ink-100 dark:border-ink-800 rounded-3xl overflow-hidden flex flex-col h-full cursor-pointer" @click=${() => this.handleCardClick()}>
                <div class="relative">
                    <img src="${this.product.image}" alt="${this.product.name}" class="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.03]">
                    ${this.product.originalPrice ? this.html`
                        <span class="absolute top-4 left-4 bg-white/90 dark:bg-ink-800/90 text-ink-900 dark:text-white text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-full">
                            New
                        </span>` : null}
                </div>
                <div class="flex-1 flex flex-col px-5 py-6 gap-4">
                    <div>
                        <p class="text-xs uppercase tracking-[0.4em] text-ink-400">${this.product.category}</p>
                        <h3 class="text-lg font-semibold mt-1">${this.product.name}</h3>
                        <p class="text-sm text-ink-500 dark:text-ink-300">${this.product.description}</p>
                    </div>
                    <div class="mt-auto flex items-center justify-between">
                        <div>
                            <p class="text-lg font-semibold">${formatCurrency(this.product.price)}</p>
                            ${this.product.originalPrice ? this.html`
                                <p class="text-xs text-ink-400 line-through">${formatCurrency(this.product.originalPrice)}</p>
                            ` : null}
                        </div>
                        <button class="px-4 py-2 rounded-full border border-ink-200 dark:border-ink-700 hover:bg-ink-900 dark:hover:bg-white hover:text-white dark:hover:text-ink-900 transition" @click=${(e) => this.handleAdd(e)}>
                            Add
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
}

customElements.define('product-card', ProductCard);

