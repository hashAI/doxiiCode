import { loadFromStorage, saveToStorage, getImageUrl } from './utils.js';

const initialProducts = [
    {
        id: 'product-foundation-luxury-1',
        name: 'Luminous Silk Foundation',
        brand: 'Premium Brand',
        category: 'Foundation',
        variant: '30ml - Shade 4',
        price: 45.99,
        originalPrice: 52.00,
        rating: 4.8,
        reviews: 2340,
        size: '30ml',
        shade: 'Natural Beige',
        productType: 'makeup',
        certified: true,
        badge: 'Bestseller',
        featured: true,
        newArrival: false,
        image: getImageUrl('luxury foundation bottle beige cosmetic', 900, 0),
        images: [
            getImageUrl('luxury foundation bottle beige cosmetic', 900, 0),
            getImageUrl('foundation swatch skin tone beige', 900, 1),
            getImageUrl('foundation texture close up', 900, 2)
        ],
        tags: ['full coverage', 'long-lasting', 'matte finish']
    },
    {
        id: 'product-serum-vitamin-c',
        name: 'Radiance Vitamin C Serum',
        brand: 'GlowLab',
        category: 'Serum',
        variant: '30ml - Clinical Strength',
        price: 34.99,
        originalPrice: 42.00,
        rating: 4.9,
        reviews: 3890,
        size: '30ml',
        shade: null,
        productType: 'skincare',
        certified: true,
        badge: 'Dermatologist Approved',
        featured: true,
        newArrival: true,
        image: getImageUrl('vitamin c serum bottle orange dropper', 900, 0),
        images: [
            getImageUrl('vitamin c serum bottle orange dropper', 900, 0),
            getImageUrl('serum texture golden liquid', 900, 1),
            getImageUrl('vitamin c serum application face', 900, 2)
        ],
        tags: ['brightening', 'anti-aging', 'vitamin c']
    },
    {
        id: 'product-lipstick-matte-red',
        name: 'Velvet Matte Lipstick - Ruby Red',
        brand: 'ColorPop',
        category: 'Lipstick',
        variant: '3.5g - Ruby Red',
        price: 18.99,
        originalPrice: 24.00,
        rating: 4.7,
        reviews: 1560,
        size: '3.5g',
        shade: 'Ruby Red',
        productType: 'makeup',
        certified: true,
        badge: 'Trending',
        featured: true,
        newArrival: true,
        image: getImageUrl('red matte lipstick tube luxury', 900, 0),
        images: [
            getImageUrl('red matte lipstick tube luxury', 900, 0),
            getImageUrl('red lipstick swatch lips', 900, 1),
            getImageUrl('lipstick texture close up matte', 900, 2)
        ],
        tags: ['matte', 'long-lasting', 'bold']
    },
    {
        id: 'product-moisturizer-hydrating',
        name: 'Hyaluronic Hydration Cream',
        brand: 'SkinEssence',
        category: 'Moisturizer',
        variant: '50ml - All Skin Types',
        price: 28.50,
        originalPrice: 35.00,
        rating: 4.6,
        reviews: 2120,
        size: '50ml',
        shade: null,
        productType: 'skincare',
        certified: true,
        badge: 'Editor\'s Choice',
        featured: false,
        newArrival: true,
        image: getImageUrl('white moisturizer jar minimalist', 900, 0),
        images: [
            getImageUrl('white moisturizer jar minimalist', 900, 0),
            getImageUrl('moisturizer cream texture white', 900, 1),
            getImageUrl('face cream application skin', 900, 2)
        ],
        tags: ['hydrating', 'hyaluronic acid', 'non-comedogenic']
    },
    {
        id: 'product-mascara-volumizing',
        name: 'Volume Max Mascara',
        brand: 'LashPerfect',
        category: 'Mascara',
        variant: '10ml - Jet Black',
        price: 22.99,
        originalPrice: 28.00,
        rating: 4.5,
        reviews: 980,
        size: '10ml',
        shade: 'Jet Black',
        productType: 'makeup',
        certified: true,
        badge: 'Top Rated',
        featured: false,
        newArrival: false,
        image: getImageUrl('black mascara tube curved brush', 900, 0),
        images: [
            getImageUrl('black mascara tube curved brush', 900, 0),
            getImageUrl('mascara brush close up', 900, 1),
            getImageUrl('mascara application eye lashes', 900, 2)
        ],
        tags: ['volumizing', 'waterproof', 'clump-free']
    },
    {
        id: 'product-eyeshadow-palette',
        name: 'Nude Essential Eyeshadow Palette',
        brand: 'ColorPop',
        category: 'Eyeshadow',
        variant: '12 Shades',
        price: 38.00,
        originalPrice: 48.00,
        rating: 4.8,
        reviews: 1780,
        size: '12 x 1.5g',
        shade: 'Nude Collection',
        productType: 'makeup',
        certified: true,
        badge: 'Bestseller',
        featured: true,
        newArrival: false,
        image: getImageUrl('eyeshadow palette nude colors', 900, 0),
        images: [
            getImageUrl('eyeshadow palette nude colors', 900, 0),
            getImageUrl('eyeshadow swatches arm nude', 900, 1),
            getImageUrl('eyeshadow palette open shades', 900, 2)
        ],
        tags: ['versatile', 'highly pigmented', 'blendable']
    },
    {
        id: 'product-sunscreen-spf50',
        name: 'UV Shield Sunscreen SPF 50+',
        brand: 'SunCare Pro',
        category: 'Sunscreen',
        variant: '50ml - Broad Spectrum',
        price: 26.99,
        originalPrice: 32.00,
        rating: 4.7,
        reviews: 2450,
        size: '50ml',
        shade: null,
        productType: 'skincare',
        certified: true,
        badge: 'Dermatologist Recommended',
        featured: false,
        newArrival: false,
        image: getImageUrl('white sunscreen tube spf protection', 900, 0),
        images: [
            getImageUrl('white sunscreen tube spf protection', 900, 0),
            getImageUrl('sunscreen texture white cream', 900, 1),
            getImageUrl('sunscreen application face beach', 900, 2)
        ],
        tags: ['SPF 50+', 'water-resistant', 'non-greasy']
    },
    {
        id: 'product-perfume-floral',
        name: 'Bloom Eau de Parfum',
        brand: 'Essence Luxe',
        category: 'Perfume',
        variant: '50ml - Floral',
        price: 68.00,
        originalPrice: 85.00,
        rating: 4.9,
        reviews: 1120,
        size: '50ml',
        shade: null,
        productType: 'fragrance',
        certified: true,
        badge: 'Luxury',
        featured: false,
        newArrival: false,
        image: getImageUrl('elegant perfume bottle pink floral', 900, 0),
        images: [
            getImageUrl('elegant perfume bottle pink floral', 900, 0),
            getImageUrl('perfume bottle close up glass', 900, 1),
            getImageUrl('perfume spray mist floral', 900, 2)
        ],
        tags: ['long-lasting', 'floral', 'elegant']
    },
    {
        id: 'product-blush-powder',
        name: 'Silk Touch Powder Blush',
        brand: 'ColorPop',
        category: 'Blush',
        variant: '8g - Peachy Pink',
        price: 16.50,
        originalPrice: 21.00,
        rating: 4.6,
        reviews: 890,
        size: '8g',
        shade: 'Peachy Pink',
        productType: 'makeup',
        certified: true,
        badge: 'New',
        featured: false,
        newArrival: true,
        image: getImageUrl('pink powder blush compact mirror', 900, 0),
        images: [
            getImageUrl('pink powder blush compact mirror', 900, 0),
            getImageUrl('blush swatch peachy pink cheek', 900, 1),
            getImageUrl('blush powder texture close up', 900, 2)
        ],
        tags: ['buildable', 'natural glow', 'long-wearing']
    },
    {
        id: 'product-hair-serum',
        name: 'Keratin Repair Hair Serum',
        brand: 'HairVital',
        category: 'Hair Serum',
        variant: '100ml - All Hair Types',
        price: 24.99,
        originalPrice: 30.00,
        rating: 4.5,
        reviews: 1340,
        size: '100ml',
        shade: null,
        productType: 'haircare',
        certified: true,
        badge: 'Salon Quality',
        featured: true,
        newArrival: false,
        image: getImageUrl('gold hair serum bottle pump', 900, 0),
        images: [
            getImageUrl('gold hair serum bottle pump', 900, 0),
            getImageUrl('hair serum texture golden oil', 900, 1),
            getImageUrl('hair serum application smooth hair', 900, 2)
        ],
        tags: ['frizz control', 'shine', 'heat protection']
    }
];

export const productCategories = [
    {
        id: 'skincare',
        name: 'Skincare',
        icon: 'droplet',
        color: 'bg-primary-50',
        textColor: 'text-primary-700',
        image: getImageUrl('skincare products serum bottles', 720, 0)
    },
    {
        id: 'makeup',
        name: 'Makeup',
        icon: 'sparkles',
        color: 'bg-purple-50',
        textColor: 'text-purple-700',
        image: getImageUrl('makeup products lipstick palette', 720, 1)
    },
    {
        id: 'fragrance',
        name: 'Fragrance',
        icon: 'heart',
        color: 'bg-amber-50',
        textColor: 'text-amber-700',
        image: getImageUrl('perfume bottles elegant luxury', 720, 2)
    },
    {
        id: 'haircare',
        name: 'Hair Care',
        icon: 'wind',
        color: 'bg-blue-50',
        textColor: 'text-blue-700',
        image: getImageUrl('haircare products bottles shampoo', 720, 3)
    }
];

export const priceBrackets = [
    { id: 'under20', label: 'Under $20', max: 20 },
    { id: 'under30', label: 'Under $30', max: 30 },
    { id: 'under50', label: 'Under $50', max: 50 },
    { id: 'under70', label: 'Under $70', max: 70 },
    { id: 'under100', label: 'Under $100', max: 100 },
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
            metaTheme.setAttribute('content', theme === 'dark' ? '#0B0B16' : '#2D0B52');
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
