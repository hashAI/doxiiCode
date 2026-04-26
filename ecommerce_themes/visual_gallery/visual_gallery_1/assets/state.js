import { loadFromStorage, saveToStorage, getImageUrl } from './utils.js';

const initialProducts = [
    {
        id: 'product-diamond-ring-1',
        name: 'Eternal Brilliance Diamond Ring',
        brand: 'LuxeGems Signature',
        category: 'Engagement Ring',
        variant: '1.5ct - Platinum',
        price: 4999.00,
        originalPrice: 5999.00,
        rating: 4.9,
        reviews: 1256,
        size: '1.5 Carat',
        shade: 'Platinum',
        productType: 'rings',
        certified: true,
        badge: 'Bestseller',
        featured: true,
        newArrival: false,
        image: getImageUrl('diamond engagement ring platinum luxury', 900, 0),
        images: [
            getImageUrl('diamond engagement ring platinum luxury', 900, 0),
            getImageUrl('diamond ring close up sparkle', 900, 1),
            getImageUrl('engagement ring box velvet', 900, 2)
        ],
        tags: ['GIA Certified', 'VS1 Clarity', 'Excellent Cut']
    },
    {
        id: 'product-gold-necklace-1',
        name: 'Royal Heritage Gold Necklace',
        brand: 'Artisan Gold',
        category: 'Necklace',
        variant: '22K Gold - 18 inches',
        price: 2499.00,
        originalPrice: 2999.00,
        rating: 4.8,
        reviews: 892,
        size: '18 inches',
        shade: '22K Gold',
        productType: 'necklaces',
        certified: true,
        badge: 'Handcrafted',
        featured: true,
        newArrival: true,
        image: getImageUrl('gold necklace 22k luxury elegant', 900, 0),
        images: [
            getImageUrl('gold necklace 22k luxury elegant', 900, 0),
            getImageUrl('gold necklace detail craftsmanship', 900, 1),
            getImageUrl('gold necklace on model', 900, 2)
        ],
        tags: ['22K Gold', 'Hallmarked', 'Traditional']
    },
    {
        id: 'product-sapphire-earrings-1',
        name: 'Ceylon Sapphire Drop Earrings',
        brand: 'Gem Palace',
        category: 'Earrings',
        variant: '2ct Total - White Gold',
        price: 3299.00,
        originalPrice: 3999.00,
        rating: 4.7,
        reviews: 654,
        size: '2 Carat Total',
        shade: 'Ceylon Blue',
        productType: 'earrings',
        certified: true,
        badge: 'Rare Gems',
        featured: true,
        newArrival: true,
        image: getImageUrl('sapphire earrings blue drop white gold', 900, 0),
        images: [
            getImageUrl('sapphire earrings blue drop white gold', 900, 0),
            getImageUrl('sapphire close up blue gemstone', 900, 1),
            getImageUrl('earrings on model elegant', 900, 2)
        ],
        tags: ['Ceylon Origin', 'AAA Quality', 'White Gold']
    },
    {
        id: 'product-tennis-bracelet-1',
        name: 'Diamond Tennis Bracelet',
        brand: 'LuxeGems Signature',
        category: 'Bracelet',
        variant: '5ct - White Gold',
        price: 6999.00,
        originalPrice: 8499.00,
        rating: 4.9,
        reviews: 432,
        size: '7 inches',
        shade: 'White Gold',
        productType: 'bracelets',
        certified: true,
        badge: 'Luxury',
        featured: false,
        newArrival: true,
        image: getImageUrl('diamond tennis bracelet white gold luxury', 900, 0),
        images: [
            getImageUrl('diamond tennis bracelet white gold luxury', 900, 0),
            getImageUrl('tennis bracelet close up diamonds', 900, 1),
            getImageUrl('bracelet on wrist elegant', 900, 2)
        ],
        tags: ['5 Carat Total', 'VS Clarity', 'Timeless']
    },
    {
        id: 'product-pearl-strand-1',
        name: 'South Sea Pearl Strand',
        brand: 'Pearl Essence',
        category: 'Pearl Necklace',
        variant: '10-12mm - Opera Length',
        price: 3799.00,
        originalPrice: 4299.00,
        rating: 4.8,
        reviews: 321,
        size: '30 inches',
        shade: 'Cream White',
        productType: 'necklaces',
        certified: true,
        badge: 'Premium',
        featured: false,
        newArrival: false,
        image: getImageUrl('south sea pearl necklace white cream luxury', 900, 0),
        images: [
            getImageUrl('south sea pearl necklace white cream luxury', 900, 0),
            getImageUrl('pearls close up luster', 900, 1),
            getImageUrl('pearl necklace on model elegant', 900, 2)
        ],
        tags: ['South Sea', 'AAA Grade', 'Natural Luster']
    },
    {
        id: 'product-emerald-ring-1',
        name: 'Colombian Emerald Cocktail Ring',
        brand: 'Gem Palace',
        category: 'Cocktail Ring',
        variant: '3ct - Yellow Gold',
        price: 5499.00,
        originalPrice: 6499.00,
        rating: 4.6,
        reviews: 287,
        size: '3 Carat',
        shade: 'Vivid Green',
        productType: 'rings',
        certified: true,
        badge: 'Rare',
        featured: true,
        newArrival: false,
        image: getImageUrl('emerald cocktail ring green yellow gold', 900, 0),
        images: [
            getImageUrl('emerald cocktail ring green yellow gold', 900, 0),
            getImageUrl('emerald gemstone close up green', 900, 1),
            getImageUrl('cocktail ring on hand elegant', 900, 2)
        ],
        tags: ['Colombian', 'Vivid Green', '18K Gold']
    },
    {
        id: 'product-wedding-band-1',
        name: 'Eternity Diamond Band',
        brand: 'LuxeGems Signature',
        category: 'Wedding Band',
        variant: '1ct Total - Platinum',
        price: 2199.00,
        originalPrice: 2599.00,
        rating: 4.9,
        reviews: 1089,
        size: '1 Carat Total',
        shade: 'Platinum',
        productType: 'rings',
        certified: true,
        badge: 'Popular',
        featured: false,
        newArrival: false,
        image: getImageUrl('diamond eternity band platinum wedding', 900, 0),
        images: [
            getImageUrl('diamond eternity band platinum wedding', 900, 0),
            getImageUrl('wedding band diamonds close up', 900, 1),
            getImageUrl('wedding rings pair elegant', 900, 2)
        ],
        tags: ['Eternity Style', 'Round Diamonds', 'Comfort Fit']
    },
    {
        id: 'product-ruby-pendant-1',
        name: 'Burmese Ruby Heart Pendant',
        brand: 'Rouge Collection',
        category: 'Pendant',
        variant: '1.5ct - Rose Gold',
        price: 2899.00,
        originalPrice: 3499.00,
        rating: 4.7,
        reviews: 456,
        size: '1.5 Carat',
        shade: 'Pigeon Blood Red',
        productType: 'necklaces',
        certified: true,
        badge: 'Romantic',
        featured: false,
        newArrival: true,
        image: getImageUrl('ruby heart pendant rose gold romantic', 900, 0),
        images: [
            getImageUrl('ruby heart pendant rose gold romantic', 900, 0),
            getImageUrl('ruby gemstone close up red', 900, 1),
            getImageUrl('pendant on chain elegant', 900, 2)
        ],
        tags: ['Burmese Origin', 'Heart Shape', 'Rose Gold']
    },
    {
        id: 'product-gold-bangle-1',
        name: 'Traditional Gold Kada Bangle',
        brand: 'Artisan Gold',
        category: 'Bangle',
        variant: '24K Gold - 2.5 inches',
        price: 3499.00,
        originalPrice: 3999.00,
        rating: 4.8,
        reviews: 567,
        size: '2.5 inches',
        shade: '24K Gold',
        productType: 'bracelets',
        certified: true,
        badge: 'Heritage',
        featured: true,
        newArrival: false,
        image: getImageUrl('gold kada bangle 24k traditional indian', 900, 0),
        images: [
            getImageUrl('gold kada bangle 24k traditional indian', 900, 0),
            getImageUrl('gold bangle detail engraving', 900, 1),
            getImageUrl('bangle on wrist traditional', 900, 2)
        ],
        tags: ['24K Pure Gold', 'Traditional', 'Hallmarked']
    },
    {
        id: 'product-diamond-studs-1',
        name: 'Classic Diamond Studs',
        brand: 'LuxeGems Signature',
        category: 'Stud Earrings',
        variant: '1ct Total - Platinum',
        price: 1999.00,
        originalPrice: 2399.00,
        rating: 4.9,
        reviews: 2156,
        size: '1 Carat Total',
        shade: 'Platinum',
        productType: 'earrings',
        certified: true,
        badge: 'Classic',
        featured: true,
        newArrival: false,
        image: getImageUrl('diamond stud earrings platinum classic', 900, 0),
        images: [
            getImageUrl('diamond stud earrings platinum classic', 900, 0),
            getImageUrl('diamond studs close up sparkle', 900, 1),
            getImageUrl('stud earrings on model elegant', 900, 2)
        ],
        tags: ['Round Brilliant', 'E Color', 'VVS1 Clarity']
    }
];

export const productCategories = [
    {
        id: 'rings',
        name: 'Rings',
        icon: 'gem',
        color: 'bg-amber-50',
        textColor: 'text-amber-700',
        image: getImageUrl('diamond ring collection display', 720, 0)
    },
    {
        id: 'necklaces',
        name: 'Necklaces',
        icon: 'sparkles',
        color: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        image: getImageUrl('gold necklace collection luxury', 720, 1)
    },
    {
        id: 'earrings',
        name: 'Earrings',
        icon: 'star',
        color: 'bg-rose-50',
        textColor: 'text-rose-700',
        image: getImageUrl('diamond earrings collection elegant', 720, 2)
    },
    {
        id: 'bracelets',
        name: 'Bracelets',
        icon: 'circle',
        color: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        image: getImageUrl('gold bracelet collection luxury', 720, 3)
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
