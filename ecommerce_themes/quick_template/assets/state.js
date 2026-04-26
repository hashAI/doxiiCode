import { loadFromStorage, saveToStorage, getImageUrl } from './utils.js';

const initialProducts = [
    {
        id: 'product-category-1-1',
        name: 'Product Name 1',
        brand: 'Brand Name',
        category: 'Category 1',
        variant: 'Variant Info',
        price: 99.00,
        originalPrice: 129.00,
        rating: 4.5,
        reviews: 125,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-1',
        certified: true,
        badge: 'Bestseller',
        featured: true,
        newArrival: false,
        image: getImageUrl('product category 1 luxury', 900, 0),
        images: [
            getImageUrl('product category 1 luxury', 900, 0),
            getImageUrl('product category 1 detail', 900, 1),
            getImageUrl('product category 1 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-2-1',
        name: 'Product Name 2',
        brand: 'Brand Name',
        category: 'Category 2',
        variant: 'Variant Info',
        price: 149.00,
        originalPrice: 199.00,
        rating: 4.6,
        reviews: 89,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-2',
        certified: false,
        badge: 'New',
        featured: true,
        newArrival: true,
        image: getImageUrl('product category 2 luxury', 900, 0),
        images: [
            getImageUrl('product category 2 luxury', 900, 0),
            getImageUrl('product category 2 detail', 900, 1),
            getImageUrl('product category 2 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-3-1',
        name: 'Product Name 3',
        brand: 'Brand Name',
        category: 'Category 3',
        variant: 'Variant Info',
        price: 199.00,
        originalPrice: 249.00,
        rating: 4.7,
        reviews: 156,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-3',
        certified: true,
        badge: 'Sale',
        featured: false,
        newArrival: true,
        image: getImageUrl('product category 3 luxury', 900, 0),
        images: [
            getImageUrl('product category 3 luxury', 900, 0),
            getImageUrl('product category 3 detail', 900, 1),
            getImageUrl('product category 3 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-4-1',
        name: 'Product Name 4',
        brand: 'Brand Name',
        category: 'Category 4',
        variant: 'Variant Info',
        price: 79.00,
        originalPrice: 99.00,
        rating: 4.8,
        reviews: 234,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-4',
        certified: false,
        badge: null,
        featured: false,
        newArrival: false,
        image: getImageUrl('product category 4 luxury', 900, 0),
        images: [
            getImageUrl('product category 4 luxury', 900, 0),
            getImageUrl('product category 4 detail', 900, 1),
            getImageUrl('product category 4 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-1-2',
        name: 'Product Name 5',
        brand: 'Brand Name',
        category: 'Category 1',
        variant: 'Variant Info',
        price: 129.00,
        originalPrice: 159.00,
        rating: 4.4,
        reviews: 67,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-1',
        certified: true,
        badge: 'Popular',
        featured: true,
        newArrival: false,
        image: getImageUrl('product category 1 premium', 900, 0),
        images: [
            getImageUrl('product category 1 premium', 900, 0),
            getImageUrl('product category 1 detail', 900, 1),
            getImageUrl('product category 1 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-2-2',
        name: 'Product Name 6',
        brand: 'Brand Name',
        category: 'Category 2',
        variant: 'Variant Info',
        price: 179.00,
        originalPrice: 229.00,
        rating: 4.9,
        reviews: 312,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-2',
        certified: true,
        badge: 'Bestseller',
        featured: true,
        newArrival: false,
        image: getImageUrl('product category 2 premium', 900, 0),
        images: [
            getImageUrl('product category 2 premium', 900, 0),
            getImageUrl('product category 2 detail', 900, 1),
            getImageUrl('product category 2 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-3-2',
        name: 'Product Name 7',
        brand: 'Brand Name',
        category: 'Category 3',
        variant: 'Variant Info',
        price: 89.00,
        originalPrice: 119.00,
        rating: 4.5,
        reviews: 98,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-3',
        certified: false,
        badge: null,
        featured: false,
        newArrival: true,
        image: getImageUrl('product category 3 premium', 900, 0),
        images: [
            getImageUrl('product category 3 premium', 900, 0),
            getImageUrl('product category 3 detail', 900, 1),
            getImageUrl('product category 3 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-4-2',
        name: 'Product Name 8',
        brand: 'Brand Name',
        category: 'Category 4',
        variant: 'Variant Info',
        price: 219.00,
        originalPrice: 279.00,
        rating: 4.7,
        reviews: 201,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-4',
        certified: true,
        badge: 'Premium',
        featured: true,
        newArrival: false,
        image: getImageUrl('product category 4 premium', 900, 0),
        images: [
            getImageUrl('product category 4 premium', 900, 0),
            getImageUrl('product category 4 detail', 900, 1),
            getImageUrl('product category 4 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-1-3',
        name: 'Product Name 9',
        brand: 'Brand Name',
        category: 'Category 1',
        variant: 'Variant Info',
        price: 159.00,
        originalPrice: 199.00,
        rating: 4.6,
        reviews: 145,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-1',
        certified: false,
        badge: 'New',
        featured: false,
        newArrival: true,
        image: getImageUrl('product category 1 elegant', 900, 0),
        images: [
            getImageUrl('product category 1 elegant', 900, 0),
            getImageUrl('product category 1 detail', 900, 1),
            getImageUrl('product category 1 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    },
    {
        id: 'product-category-2-3',
        name: 'Product Name 10',
        brand: 'Brand Name',
        category: 'Category 2',
        variant: 'Variant Info',
        price: 109.00,
        originalPrice: 139.00,
        rating: 4.8,
        reviews: 278,
        size: 'Size Info',
        shade: 'Color/Material',
        productType: 'category-2',
        certified: true,
        badge: null,
        featured: true,
        newArrival: false,
        image: getImageUrl('product category 2 elegant', 900, 0),
        images: [
            getImageUrl('product category 2 elegant', 900, 0),
            getImageUrl('product category 2 detail', 900, 1),
            getImageUrl('product category 2 showcase', 900, 2)
        ],
        tags: ['Tag 1', 'Tag 2', 'Tag 3']
    }
];

export const productCategories = [
    {
        id: 'category-1',
        name: 'Category 1',
        icon: 'package',
        color: 'bg-amber-50',
        textColor: 'text-amber-700',
        image: getImageUrl('product category collection display', 720, 0)
    },
    {
        id: 'category-2',
        name: 'Category 2',
        icon: 'grid',
        color: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        image: getImageUrl('product category collection luxury', 720, 1)
    },
    {
        id: 'category-3',
        name: 'Category 3',
        icon: 'layers',
        color: 'bg-rose-50',
        textColor: 'text-rose-700',
        image: getImageUrl('product category collection elegant', 720, 2)
    },
    {
        id: 'category-4',
        name: 'Category 4',
        icon: 'shopping-bag',
        color: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        image: getImageUrl('product category collection premium', 720, 3)
    }
];

export const priceBrackets = [
    { id: 'under1000', label: 'Under $1,000', max: 1000 },
    { id: 'under2500', label: 'Under $2,500', max: 2500 },
    { id: 'under5000', label: 'Under $5,000', max: 5000 },
    { id: 'under7500', label: 'Under $7,500', max: 7500 },
    { id: 'under10000', label: 'Under $10,000', max: 10000 },
    { id: 'any', label: 'Any Price', max: null }
];

class ProductsStore {
    constructor() {
        this.products = initialProducts;
    }

    getAll() {
        return this.products;
    }

    getFeatured() {
        return this.products.filter(product => product.featured);
    }

    getNewlyAdded() {
        return this.products.filter(product => product.newArrival);
    }

    getByCategory(category) {
        if (!category || category === 'all') return this.products;
        return this.products.filter(product => product.productType === category);
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    search(query) {
        const q = query.toLowerCase();
        return this.products.filter(product =>
            product.name.toLowerCase().includes(q) ||
            product.brand.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.variant.toLowerCase().includes(q)
        );
    }

    filterByPrice(max) {
        if (!max) return this.products;
        return this.products.filter(product => product.price <= max);
    }
}

export const productsStore = new ProductsStore();

class ShortlistStore {
    constructor() {
        this.items = loadFromStorage('store-favorites', []);
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        callback(this.getState());
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        const snapshot = this.getState();
        this.subscribers.forEach(cb => cb(snapshot));
        saveToStorage('store-favorites', this.items);
    }

    getState() {
        return {
            items: this.items,
            count: this.items.length
        };
    }

    add(product) {
        if (!this.items.find(item => item.id === product.id)) {
            this.items.push(product);
        }
        this.notify();
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.notify();
    }

    toggle(product) {
        if (this.items.find(item => item.id === product.id)) {
            this.remove(product.id);
        } else {
            this.add(product);
        }
    }
}

export const shortlistStore = new ShortlistStore();

class CartStore {
    constructor() {
        this.items = loadFromStorage('store-cart', []);
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        callback(this.getState());
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        const snapshot = this.getState();
        this.subscribers.forEach(cb => cb(snapshot));
        saveToStorage('store-cart', this.items);
    }

    getState() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
            items: this.items,
            count: this.items.reduce((sum, item) => sum + item.quantity, 0),
            total
        };
    }

    add(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({ ...product, quantity });
        }
        this.notify();
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.notify();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
        }
        this.notify();
    }

    clear() {
        this.items = [];
        this.notify();
    }
}

export const cartStore = new CartStore();

class UserStore {
    constructor() {
        this.state = loadFromStorage('store-user', {
            location: 'New York',
            recentSearches: [],
            savedAddresses: []
        });
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this.state);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        saveToStorage('store-user', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }

    addSearch(query) {
        const searches = this.state.recentSearches.filter(s => s !== query);
        searches.unshift(query);
        this.set('recentSearches', searches.slice(0, 8));
    }
}

export const userStore = new UserStore();

class ThemeStore {
    constructor() {
        const savedTheme = loadFromStorage('store-theme', null);
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        this.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.listeners = [];
        this.applyTheme(this.theme);
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this.theme);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#1a1a1a');
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        saveToStorage('store-theme', this.theme);
        this.listeners.forEach(cb => cb(this.theme));
    }
}

export const themeStore = new ThemeStore();

export const eventBus = {
    events: {},
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },
    emit(event, payload) {
        (this.events[event] || []).forEach(cb => cb(payload));
    }
};
