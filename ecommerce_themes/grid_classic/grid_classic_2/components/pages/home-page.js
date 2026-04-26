import { BaseComponent } from '../base-component.js';
import { productsStore, categoriesMeta, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { formatCurrency, getImageUrl, showToast } from '../../assets/utils.js';

class HomePage extends BaseComponent {
    static properties = {
        categories: { type: Array },
        featuredProducts: { type: Array },
        showCategoriesSheet: { type: Boolean },
        groceryKitchenCategories: { type: Array },
        snacksDrinksCategories: { type: Array }
    };

    constructor() {
        super();
        this.categories = categoriesMeta;
        this.featuredProducts = productsStore.getFeaturedProducts();
        this.showCategoriesSheet = false;
        this.shouldScrollToTrending = false;

        // Grocery & Kitchen subcategories
        this.groceryKitchenCategories = [
            {
                id: 'fruits-vegetables',
                name: 'Fruits &\nVegetables',
                image: getImageUrl('fresh fruits vegetables basket', 400, 0)
            },
            {
                id: 'dairy-bread-eggs',
                name: 'Dairy, Bread\n& Eggs',
                image: getImageUrl('dairy milk bread eggs', 400, 1)
            },
            {
                id: 'atta-rice-dals',
                name: 'Atta, Rice,\nOil & Dals',
                image: getImageUrl('atta rice oil packages', 400, 2)
            },
            {
                id: 'meat-fish-eggs',
                name: 'Meat, Fish\n& Eggs',
                image: getImageUrl('meat fish eggs', 400, 3)
            },
            {
                id: 'masala-dry-fruits',
                name: 'Masala &\nDry Fruits',
                image: getImageUrl('spices dry fruits', 400, 4)
            },
            {
                id: 'breakfast-sauces',
                name: 'Breakfast &\nSauces',
                image: getImageUrl('breakfast cereals sauces', 400, 5)
            },
            {
                id: 'packaged-food',
                name: 'Packaged\nFood',
                image: getImageUrl('packaged ready to eat food', 400, 6)
            }
        ];

        // Snacks & Drinks subcategories
        this.snacksDrinksCategories = [
            {
                id: 'zepto-cafe',
                name: 'Zepto\nCafe',
                image: getImageUrl('coffee croissant cafe', 400, 0)
            },
            {
                id: 'tea-coffee',
                name: 'Tea, Coffee\n& More',
                image: getImageUrl('tea coffee packets', 400, 1)
            },
            {
                id: 'ice-creams',
                name: 'Ice Creams\n& More',
                image: getImageUrl('ice cream cups cones', 400, 2)
            },
            {
                id: 'frozen-food',
                name: 'Frozen\nFood',
                image: getImageUrl('frozen snacks chips packets', 400, 3)
            },
            {
                id: 'sweet-cravings',
                name: 'Sweet\nCravings',
                image: getImageUrl('chocolates candies sweets', 400, 4)
            },
            {
                id: 'cold-drinks',
                name: 'Cold Drinks\n& Juices',
                image: getImageUrl('cold drinks juice bottles', 400, 5)
            },
            {
                id: 'chips-namkeen',
                name: 'Chips &\nNamkeen',
                image: getImageUrl('chips namkeen packets', 400, 6)
            },
            {
                id: 'biscuits-cookies',
                name: 'Biscuits\n& Cookies',
                image: getImageUrl('biscuits cookies packets', 400, 7)
            }
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('categories:open', () => {
            this.showCategoriesSheet = true;
            document.getElementById('overlay')?.classList.remove('hidden');
        });

        document.getElementById('overlay')?.addEventListener('click', () => {
            this.closeCategoriesSheet();
        });

        const query = this.getQuery?.() || {};
        if (query.section === 'trending') {
            this.shouldScrollToTrending = true;
            queueMicrotask(() => this.scrollToTrending());
        }
    }

    closeCategoriesSheet() {
        this.showCategoriesSheet = false;
        document.getElementById('overlay')?.classList.add('hidden');
    }

    scrollToTrending() {
        const target = document.getElementById('trending-section');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.shouldScrollToTrending = false;
        } else {
            // Retry shortly if the section isn't in the DOM yet
            setTimeout(() => this.scrollToTrending(), 150);
        }
    }

    addToCart(product) {
        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            message: `${product.name} added successfully`,
            variant: 'success'
        });
    }

    renderCategoryCard(category) {
        return this.html`
            <button
                @click=${() => navigate(`/products/${category.id}`)}
                class="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl overflow-hidden touch-feedback shadow-sm transition-colors">
                <img src="${category.image}" alt="${category.name}" class="w-full h-28 object-cover">
                <div class="p-3">
                    <p class="text-sm font-semibold text-center leading-tight whitespace-pre-line dark:text-gray-100">${category.name}</p>
                </div>
            </button>
        `;
    }

    render() {
        // Enhanced top categories with more options
        const topCategories = [
            { name: 'All', icon: '🛒', color: 'bg-orange-50', textColor: 'text-orange-700', id: 'all' },
            ...this.categories.slice(0, 6)
        ];

        return this.html`
            <div class="pb-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <!-- Top Category Tabs -->
                <div class="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-900 px-4 pt-3 pb-4 transition-colors">
                    <div class="flex gap-4 overflow-x-auto scrollbar-hide pb-1" style="-webkit-overflow-scrolling: touch;">
                        ${topCategories.map(cat => this.html`
                            <button
                                @click=${() => cat.id === 'all' ? navigate('/') : navigate(`/products/${cat.id}`)}
                                class="flex-shrink-0 touch-feedback">
                                <div class="flex flex-col items-center gap-2 w-16">
                                    <div class="w-14 h-14 ${cat.color} dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-colors">
                                        ${cat.icon}
                                    </div>
                                    <p class="text-xs text-center ${cat.textColor || 'text-gray-700'} font-semibold leading-tight dark:text-gray-100">
                                        ${cat.name.includes(' ') ? cat.name.split(' ')[0] : cat.name}
                                    </p>
                                </div>
                            </button>
                        `)}
                    </div>
                </div>

                <!-- Grocery & Kitchen Section -->
                <div class="px-4 pt-5">
                    <h2 class="font-bold text-xl mb-4 text-gray-900 dark:text-white">Grocery & Kitchen</h2>
                    <div class="grid grid-cols-2 gap-3">
                        ${this.groceryKitchenCategories.map(cat => this.renderCategoryCard(cat))}
                    </div>
                </div>

                <!-- Snacks & Drinks Section -->
                <div class="px-4 pt-6">
                    <h2 class="font-bold text-xl mb-4 text-gray-900 dark:text-white">Snacks & Drinks</h2>
                    <div class="grid grid-cols-2 gap-3">
                        ${this.snacksDrinksCategories.map(cat => this.renderCategoryCard(cat))}
                    </div>
                </div>

                <!-- Promotional Banner -->
                <div class="px-4 pt-6">
                    <div class="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                        <div class="relative z-10">
                            <p class="text-white/90 text-xs font-medium mb-1">SPECIAL OFFER</p>
                            <h3 class="text-white font-bold text-2xl mb-2">Get ₹100 OFF</h3>
                            <p class="text-white/90 text-sm mb-4">on orders above ₹499</p>
                            <button class="bg-white text-purple-700 px-6 py-2.5 rounded-xl font-bold text-sm touch-feedback">
                                Shop Now
                            </button>
                        </div>
                        <div class="absolute right-0 bottom-0 opacity-30">
                            <img src="${getImageUrl('shopping bags', 200, 0)}" alt="" class="w-32 h-32 object-contain">
                        </div>
                    </div>
                </div>

                <!-- Featured Products Section -->
                <div class="px-4 pt-6" id="trending-section">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-bold text-xl text-gray-900 dark:text-white">Trending Products</h2>
                        <button @click=${() => navigate('/products/snacks-beverages')} class="text-primary-500 text-sm font-semibold flex items-center gap-1 touch-feedback">
                            See All
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style="-webkit-overflow-scrolling: touch;">
                        ${this.featuredProducts.slice(0, 8).map(product => this.html`
                            <div class="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden touch-feedback transition-colors"
                                 @click=${() => navigate(`/product/${product.id}`)}>
                                <div class="relative">
                                    ${product.badge ? this.html`
                                        <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                                            ${product.badge}
                                        </div>
                                    ` : ''}
                                    <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover">
                                </div>
                                <div class="p-3">
                                    <h3 class="font-medium text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem] dark:text-gray-100">${product.name}</h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">${product.unit}</p>
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="font-bold text-sm text-green-700 dark:text-green-400">${formatCurrency(product.price)}</p>
                                            ${product.originalPrice ? this.html`
                                                <p class="text-xs text-gray-400 dark:text-gray-500 line-through">${formatCurrency(product.originalPrice)}</p>
                                            ` : ''}
                                        </div>
                                        <button
                                            @click=${(e) => {
                                                e.stopPropagation();
                                                this.addToCart(product);
                                            }}
                                            class="bg-white dark:bg-gray-900 border-2 border-primary-500 dark:border-primary-400 text-primary-500 dark:text-primary-400 px-2 py-1 rounded-lg text-xs font-bold touch-feedback transition-colors">
                                            ADD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- Daily Essentials Section -->
                <div class="px-4 pt-6 pb-4">
                    <h2 class="font-bold text-xl mb-4 text-gray-900 dark:text-white">Daily Essentials</h2>
                    <div class="grid grid-cols-3 gap-3">
                        ${this.categories.slice(0, 6).map(cat => this.html`
                            <button
                                @click=${() => navigate(`/products/${cat.id}`)}
                                class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2 touch-feedback transition-colors">
                                <div class="text-3xl">${cat.icon}</div>
                                <p class="text-xs text-center font-medium leading-tight dark:text-gray-100">${cat.name.split(' ')[0]}</p>
                            </button>
                        `)}
                    </div>
                </div>
            </div>

            <!-- Categories Bottom Sheet -->
            <div class="bottom-sheet ${this.showCategoriesSheet ? 'open' : ''}" style="max-height: 70vh;">
                <div class="bottom-sheet-handle"></div>
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg dark:text-white">All Categories</h3>
                        <button
                            @click=${this.closeCategoriesSheet}
                            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-feedback">
                            <i data-lucide="x" class="w-5 h-5 text-gray-500 dark:text-gray-300"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-3 pb-4">
                        ${this.categories.map(cat => this.html`
                            <button
                                @click=${() => {
                                    this.closeCategoriesSheet();
                                    navigate(`/products/${cat.id}`);
                                }}
                                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl touch-feedback transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div class="text-3xl">${cat.icon}</div>
                                <div class="text-left flex-1">
                                    <p class="font-medium text-sm dark:text-gray-100">${cat.name}</p>
                                </div>
                                <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500"></i>
                            </button>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
