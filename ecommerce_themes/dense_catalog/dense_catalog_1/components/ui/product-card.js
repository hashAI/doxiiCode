import { BaseComponent } from '../base-component.js';
import { cartStore, eventBus } from '../../assets/state.js';
import { showToast, formatCurrency } from '../../assets/utils.js';
import { navigate } from '../../assets/router.js';

class ProductCard extends BaseComponent {
    static properties = {
        product: { state: true },
        viewMode: { state: true }
    };

    constructor() {
        super();
        this.product = null;
        this.viewMode = 'grid';
    }

    connectedCallback() {
        super.connectedCallback?.();
        this.product = this.readJsonAttr('data-product');
        this.viewMode = this.getAttribute('data-view-mode') || 'grid';
    }

    handleAdd(e) {
        e.stopPropagation();
        cartStore.add(this.product);
        showToast({ title: 'Added to cart', message: `${this.product.name} is now in your cart.` });
        eventBus.emit('cart:open');
    }

    handleCardClick() {
        navigate(`/product/${this.product.id}`);
    }

    renderStars(rating) {
        return Array.from({ length: 5 }, (_, i) =>
            this.html`<span class="text-yellow-400">${i < Math.floor(rating) ? '★' : '☆'}</span>`
        );
    }

    renderGridView() {
        const discount = this.product.originalPrice
            ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
            : 0;

        return this.html`
            <article
                class="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
                @click=${() => this.handleCardClick()}
            >
                <!-- Image -->
                <div class="relative bg-slate-100 dark:bg-slate-700">
                    <img
                        src="${this.product.image}"
                        alt="${this.product.name}"
                        class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    >
                    ${discount > 0 ? this.html`
                        <span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            -${discount}%
                        </span>
                    ` : ''}
                    ${this.product.badge ? this.html`
                        <span class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            ${this.product.badge}
                        </span>
                    ` : ''}
                </div>

                <!-- Content -->
                <div class="p-4 flex-1 flex flex-col">
                    <!-- Brand & Category -->
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                            ${this.product.brand || this.product.category}
                        </span>
                        ${this.product.rating ? this.html`
                            <div class="flex items-center gap-1">
                                <span class="text-sm">${this.renderStars(this.product.rating)}</span>
                                <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">
                                    ${this.product.rating}
                                </span>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Title -->
                    <h3 class="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        ${this.product.name}
                    </h3>

                    <!-- Description -->
                    <p class="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 flex-1">
                        ${this.product.description}
                    </p>

                    <!-- Key Specs -->
                    ${this.product.keySpecs ? this.html`
                        <div class="mb-3 flex flex-wrap gap-1">
                            ${this.product.keySpecs.slice(0, 3).map(spec => this.html`
                                <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                    ${spec}
                                </span>
                            `)}
                        </div>
                    ` : ''}

                    <!-- Price & Action -->
                    <div class="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-xl font-bold text-slate-900 dark:text-white">
                                    ${formatCurrency(this.product.price)}
                                </span>
                                ${this.product.originalPrice ? this.html`
                                    <span class="text-sm text-slate-400 line-through">
                                        ${formatCurrency(this.product.originalPrice)}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        <button
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 font-medium"
                            @click=${(e) => this.handleAdd(e)}
                        >
                            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                            Add
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    renderListView() {
        const discount = this.product.originalPrice
            ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
            : 0;

        return this.html`
            <article
                class="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                @click=${() => this.handleCardClick()}
            >
                <div class="flex flex-col sm:flex-row gap-4 p-4">
                    <!-- Image -->
                    <div class="relative flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                        <img
                            src="${this.product.image}"
                            alt="${this.product.name}"
                            class="w-full sm:w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        >
                        ${discount > 0 ? this.html`
                            <span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -${discount}%
                            </span>
                        ` : ''}
                    </div>

                    <!-- Content -->
                    <div class="flex-1 flex flex-col">
                        <!-- Header -->
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                                        ${this.product.brand || this.product.category}
                                    </span>
                                    ${this.product.badge ? this.html`
                                        <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded">
                                            ${this.product.badge}
                                        </span>
                                    ` : ''}
                                </div>
                                <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                    ${this.product.name}
                                </h3>
                                ${this.product.rating ? this.html`
                                    <div class="flex items-center gap-1 mb-2">
                                        <span class="text-sm">${this.renderStars(this.product.rating)}</span>
                                        <span class="text-sm text-slate-500 dark:text-slate-400">
                                            ${this.product.rating} (${this.product.reviews || 0} reviews)
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Description -->
                        <p class="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            ${this.product.description}
                        </p>

                        <!-- Key Specs -->
                        ${this.product.keySpecs ? this.html`
                            <div class="mb-4 flex flex-wrap gap-2">
                                ${this.product.keySpecs.map(spec => this.html`
                                    <span class="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                        ${spec}
                                    </span>
                                `)}
                            </div>
                        ` : ''}

                        <!-- Price & Action -->
                        <div class="flex items-center justify-between mt-auto pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div class="flex items-baseline gap-3">
                                <span class="text-2xl font-bold text-slate-900 dark:text-white">
                                    ${formatCurrency(this.product.price)}
                                </span>
                                ${this.product.originalPrice ? this.html`
                                    <span class="text-base text-slate-400 line-through">
                                        ${formatCurrency(this.product.originalPrice)}
                                    </span>
                                ` : ''}
                            </div>
                            <div class="flex gap-2">
                                <button
                                    class="px-5 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition font-medium"
                                    @click=${(e) => { e.stopPropagation(); this.handleCardClick(); }}
                                >
                                    View Details
                                </button>
                                <button
                                    class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 font-medium"
                                    @click=${(e) => this.handleAdd(e)}
                                >
                                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    render() {
        if (!this.product) return this.html``;
        return this.viewMode === 'list' ? this.renderListView() : this.renderGridView();
    }
}

customElements.define('product-card', ProductCard);
