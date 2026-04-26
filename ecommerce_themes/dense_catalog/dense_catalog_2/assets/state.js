// State management with localStorage sync
import { EventBus } from './utils.js';

// Product data
const initialProducts = [
    // Eyeglasses - Square
    {
        id: 'eg-square-001',
        name: 'Hustlr - Ocean Blue',
        description: 'Ocean Blue Full Rim Square with Free Anti-Glare Lenses',
        category: 'eyeglasses',
        subcategory: 'square',
        frameShape: 'Square',
        price: 1400,
        originalPrice: 1900,
        discount: 26,
        rating: 4.8,
        reviews: 25568,
        images: [
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=0',
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=1',
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=2'
        ],
        colors: ['Ocean Blue', 'Black', 'Transparent', 'Tortoise', 'Gray', 'Red'],
        colorHex: ['#5BA3D9', '#000000', '#E8E8E8', '#8B4513', '#808080', '#FF4444'],
        sizes: ['S', 'M', 'L', 'XL'],
        frameWidth: '139mm (M)',
        productType: ['Powered Eyeglass', 'Zero Power', 'Reading Glass'],
        frameMaterial: 'Acetate',
        featured: true,
        powered: true,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    {
        id: 'eg-square-002',
        name: 'Vincent Chase - Classic Black',
        description: 'Full Rim Square Eyeglasses with Anti-Glare Coating',
        category: 'eyeglasses',
        subcategory: 'square',
        frameShape: 'Square',
        price: 1200,
        originalPrice: 1600,
        discount: 25,
        rating: 4.6,
        reviews: 18234,
        images: [
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=3',
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=4'
        ],
        colors: ['Black', 'Brown', 'Blue'],
        colorHex: ['#000000', '#8B4513', '#4169E1'],
        sizes: ['S', 'M', 'L'],
        frameWidth: '135mm (M)',
        productType: ['Powered Eyeglass', 'Zero Power'],
        frameMaterial: 'TR-90',
        featured: false,
        powered: true,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    // Eyeglasses - Rectangle
    {
        id: 'eg-rect-001',
        name: 'John Jacobs - Premium Collection',
        description: 'Lightweight Rectangle Frame with Blue Light Filter',
        category: 'eyeglasses',
        subcategory: 'rectangle',
        frameShape: 'Rectangle',
        price: 2000,
        originalPrice: 2800,
        discount: 29,
        rating: 4.7,
        reviews: 12456,
        images: [
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=5',
            'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=0'
        ],
        colors: ['Gunmetal', 'Gold', 'Silver'],
        colorHex: ['#818589', '#FFD700', '#C0C0C0'],
        sizes: ['M', 'L', 'XL'],
        frameWidth: '142mm (L)',
        productType: ['Powered Eyeglass', 'Zero Power', 'Reading Glass'],
        frameMaterial: 'Metal',
        featured: true,
        powered: true,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    // Eyeglasses - Aviator
    {
        id: 'eg-avia-001',
        name: 'Pilot - Gold Aviator',
        description: 'Classic Aviator Eyeglasses with Thin Metal Frame',
        category: 'eyeglasses',
        subcategory: 'aviator',
        frameShape: 'Aviator',
        price: 1800,
        originalPrice: 2400,
        discount: 25,
        rating: 4.5,
        reviews: 8923,
        images: [
            'http://194.238.23.194/epicsum/media/image/aviator-glasses?size=720&index=0',
            'http://194.238.23.194/epicsum/media/image/aviator-glasses?size=720&index=1'
        ],
        colors: ['Gold', 'Silver', 'Black'],
        colorHex: ['#FFD700', '#C0C0C0', '#000000'],
        sizes: ['M', 'L'],
        frameWidth: '140mm (M)',
        productType: ['Powered Eyeglass', 'Zero Power'],
        frameMaterial: 'Stainless Steel',
        featured: false,
        powered: true,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    // Sunglasses
    {
        id: 'sg-001',
        name: 'Ray-Ban Style - Wayfarer',
        description: 'Classic Wayfarer Sunglasses with UV Protection',
        category: 'sunglasses',
        subcategory: 'wayfarer',
        frameShape: 'Wayfarer',
        price: 2500,
        originalPrice: 3500,
        discount: 29,
        rating: 4.9,
        reviews: 34521,
        images: [
            'http://194.238.23.194/epicsum/media/image/sunglasses?size=720&index=0',
            'http://194.238.23.194/epicsum/media/image/sunglasses?size=720&index=1',
            'http://194.238.23.194/epicsum/media/image/sunglasses?size=720&index=2'
        ],
        colors: ['Black', 'Tortoise', 'Brown'],
        colorHex: ['#000000', '#8B4513', '#654321'],
        sizes: ['M', 'L'],
        frameWidth: '145mm (M)',
        lensColor: 'Dark Gray',
        uvProtection: 'UV400',
        polarized: true,
        frameMaterial: 'Acetate',
        featured: true,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    {
        id: 'sg-002',
        name: 'Aviator Classic - Pilot',
        description: 'Premium Aviator Sunglasses with Polarized Lenses',
        category: 'sunglasses',
        subcategory: 'aviator',
        frameShape: 'Aviator',
        price: 3000,
        originalPrice: 4000,
        discount: 25,
        rating: 4.8,
        reviews: 28934,
        images: [
            'http://194.238.23.194/epicsum/media/image/aviator-sunglasses?size=720&index=0',
            'http://194.238.23.194/epicsum/media/image/aviator-sunglasses?size=720&index=1'
        ],
        colors: ['Gold', 'Silver', 'Black'],
        colorHex: ['#FFD700', '#C0C0C0', '#000000'],
        sizes: ['M', 'L', 'XL'],
        frameWidth: '148mm (L)',
        lensColor: 'Green',
        uvProtection: 'UV400',
        polarized: true,
        frameMaterial: 'Metal',
        featured: true,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    {
        id: 'sg-003',
        name: 'Cat Eye Glam',
        description: 'Trendy Cat Eye Sunglasses for Women',
        category: 'sunglasses',
        subcategory: 'cat-eye',
        frameShape: 'Cat Eye',
        price: 1800,
        originalPrice: 2400,
        discount: 25,
        rating: 4.6,
        reviews: 15678,
        images: [
            'http://194.238.23.194/epicsum/media/image/cat-eye-sunglasses?size=720&index=0',
            'http://194.238.23.194/epicsum/media/image/cat-eye-sunglasses?size=720&index=1'
        ],
        colors: ['Black', 'Red', 'Tortoise'],
        colorHex: ['#000000', '#FF0000', '#8B4513'],
        sizes: ['S', 'M'],
        frameWidth: '138mm (M)',
        lensColor: 'Gradient Gray',
        uvProtection: 'UV400',
        polarized: false,
        frameMaterial: 'Acetate',
        featured: false,
        inStock: true,
        warranty: '1 Year Manufacturer Warranty'
    },
    // Contact Lenses
    {
        id: 'cl-001',
        name: 'Bausch + Lomb - Daily Disposable',
        description: 'Ultra-Comfortable Daily Contact Lenses - 30 Pack',
        category: 'contact-lenses',
        subcategory: 'daily',
        price: 1200,
        originalPrice: 1500,
        discount: 20,
        rating: 4.7,
        reviews: 8934,
        images: [
            'http://194.238.23.194/epicsum/media/image/contact-lenses?size=720&index=0'
        ],
        packSize: '30 Lenses',
        material: 'Silicone Hydrogel',
        waterContent: '48%',
        oxygenPermeability: '156 Dk/t',
        featured: false,
        inStock: true,
        warranty: 'Not Applicable'
    },
    {
        id: 'cl-002',
        name: 'Acuvue Color - Monthly',
        description: 'Monthly Colored Contact Lenses - Natural Look',
        category: 'contact-lenses',
        subcategory: 'monthly',
        price: 1800,
        originalPrice: 2200,
        discount: 18,
        rating: 4.5,
        reviews: 6234,
        images: [
            'http://194.238.23.194/epicsum/media/image/colored-contacts?size=720&index=0'
        ],
        packSize: '6 Lenses',
        colors: ['Hazel', 'Blue', 'Green', 'Gray'],
        material: 'Silicone Hydrogel',
        waterContent: '46%',
        oxygenPermeability: '147 Dk/t',
        featured: true,
        inStock: true,
        warranty: 'Not Applicable'
    },
    // Accessories
    {
        id: 'acc-001',
        name: 'Premium Eyeglass Case',
        description: 'Hard Shell Protective Case for Eyeglasses',
        category: 'accessories',
        subcategory: 'cases',
        price: 300,
        originalPrice: 500,
        discount: 40,
        rating: 4.3,
        reviews: 2345,
        images: [
            'http://194.238.23.194/epicsum/media/image/glasses-case?size=720&index=0'
        ],
        colors: ['Black', 'Brown', 'Navy'],
        colorHex: ['#000000', '#8B4513', '#000080'],
        material: 'Hard Shell PU Leather',
        featured: false,
        inStock: true,
        warranty: '6 Months'
    },
    {
        id: 'acc-002',
        name: 'Microfiber Cleaning Cloth',
        description: 'Lint-Free Cleaning Cloth - Pack of 3',
        category: 'accessories',
        subcategory: 'cleaning',
        price: 150,
        originalPrice: 250,
        discount: 40,
        rating: 4.4,
        reviews: 5678,
        images: [
            'http://194.238.23.194/epicsum/media/image/cleaning-cloth?size=720&index=0'
        ],
        packSize: '3 Pieces',
        material: 'Microfiber',
        featured: false,
        inStock: true,
        warranty: 'Not Applicable'
    }
];

// Categories metadata
const categoriesMeta = {
    eyeglasses: {
        label: 'Eyeglasses',
        emoji: '👓',
        color: 'primary-900',
        image: 'http://194.238.23.194/epicsum/media/image/eyeglasses?size=720&index=0',
        description: 'Prescription eyeglasses with latest designs'
    },
    sunglasses: {
        label: 'Sunglasses',
        emoji: '🕶️',
        color: 'gray-900',
        image: 'http://194.238.23.194/epicsum/media/image/sunglasses?size=720&index=0',
        description: 'Stylish sunglasses with UV protection'
    },
    'contact-lenses': {
        label: 'Contact Lenses',
        emoji: '👁️',
        color: 'teal-600',
        image: 'http://194.238.23.194/epicsum/media/image/contact-lenses?size=720&index=0',
        description: 'Comfortable daily and monthly contact lenses'
    },
    accessories: {
        label: 'Accessories',
        emoji: '🎒',
        color: 'gold-600',
        image: 'http://194.238.23.194/epicsum/media/image/accessories?size=720&index=0',
        description: 'Cases, cleaning solutions and more'
    }
};

// Frame shapes for eyeglasses
const frameShapes = [
    { id: 'square', label: 'Square', image: 'http://194.238.23.194/epicsum/media/image/square-glasses?size=200&index=0' },
    { id: 'rectangle', label: 'Rectangle', image: 'http://194.238.23.194/epicsum/media/image/rectangle-glasses?size=200&index=0' },
    { id: 'aviator', label: 'Aviator', image: 'http://194.238.23.194/epicsum/media/image/aviator-glasses?size=200&index=0' },
    { id: 'geometric', label: 'Geometric', image: 'http://194.238.23.194/epicsum/media/image/geometric-glasses?size=200&index=0' },
    { id: 'cat-eye', label: 'Cat Eye', image: 'http://194.238.23.194/epicsum/media/image/cat-eye-glasses?size=200&index=0' },
    { id: 'wayfarer', label: 'Wayfarer', image: 'http://194.238.23.194/epicsum/media/image/wayfarer-glasses?size=200&index=0' }
];

// Trending searches
const trendingSearches = [
    { id: 'eyeglasses', label: 'eyeglasses', icon: '👓', bgColor: 'bg-orange-50' },
    { id: 'sunglasses', label: 'sunglasses', icon: '🕶️', bgColor: 'bg-cyan-50' },
    { id: 'contact-lens', label: 'contact lens', icon: '👁️', bgColor: 'bg-blue-50' },
    { id: 'gold-membership', label: 'gold max membership', icon: '⭐', bgColor: 'bg-yellow-100' },
    { id: 'home-service', label: 'home service', icon: '🏠', bgColor: 'bg-purple-50' },
    { id: 'exchange', label: 'product exchange', icon: '🔄', bgColor: 'bg-amber-50' },
    { id: 'zero-power', label: 'zero power computer glasses', icon: '💻', bgColor: 'bg-indigo-50' }
];

// Products Store
class ProductsStore {
    constructor() {
        this.products = initialProducts;
        this.categories = this.deriveCategories();
    }

    deriveCategories() {
        const cats = new Set();
        this.products.forEach(p => cats.add(p.category));
        return Array.from(cats);
    }

    getAll() {
        return this.products;
    }

    getById(id) {
        return this.products.find(p => p.id === id);
    }

    getByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    getBySubcategory(category, subcategory) {
        return this.products.filter(p => p.category === category && p.subcategory === subcategory);
    }

    getFeatured() {
        return this.products.filter(p => p.featured);
    }

    search(query) {
        const q = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    }

    getCategories() {
        return this.categories;
    }

    getCategoryMeta(category) {
        return categoriesMeta[category] || null;
    }
}

// Cart Store with localStorage
class CartStore {
    constructor() {
        this.storageKey = 'store-cart';
        this.items = this.loadFromStorage();
        this.freeDeliveryThreshold = 1000;
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        EventBus.emit('cart:updated', this.items);
    }

    add(product, quantity = 1, options = {}) {
        const existing = this.items.find(item =>
            item.id === product.id &&
            item.selectedColor === options.selectedColor &&
            item.selectedSize === options.selectedSize
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity,
                selectedColor: options.selectedColor || product.colors?.[0],
                selectedSize: options.selectedSize || product.sizes?.[0],
                addedAt: Date.now()
            });
        }

        this.save();
        return this.items;
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        return this.items;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.remove(productId);
            } else {
                this.save();
            }
        }
        return this.items;
    }

    clear() {
        this.items = [];
        this.save();
        return this.items;
    }

    getItems() {
        return this.items;
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    needsDeliveryFee() {
        return this.getTotal() < this.freeDeliveryThreshold;
    }
}

// User Store with localStorage
class UserStore {
    constructor() {
        this.storageKey = 'store-user';
        this.data = this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {
                location: null,
                savedAddresses: [],
                recentSearches: [],
                wishlist: [],
                isGoldMember: false
            };
        } catch {
            return {
                location: null,
                savedAddresses: [],
                recentSearches: [],
                wishlist: [],
                isGoldMember: false
            };
        }
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        EventBus.emit('user:updated', this.data);
    }

    setLocation(location) {
        this.data.location = location;
        this.save();
    }

    getLocation() {
        return this.data.location;
    }

    addAddress(address) {
        this.data.savedAddresses.push(address);
        this.save();
    }

    getAddresses() {
        return this.data.savedAddresses;
    }

    addRecentSearch(query) {
        this.data.recentSearches = [
            query,
            ...this.data.recentSearches.filter(q => q !== query)
        ].slice(0, 10);
        this.save();
    }

    getRecentSearches() {
        return this.data.recentSearches;
    }

    toggleWishlist(productId) {
        const index = this.data.wishlist.indexOf(productId);
        if (index > -1) {
            this.data.wishlist.splice(index, 1);
        } else {
            this.data.wishlist.push(productId);
        }
        this.save();
        return this.isInWishlist(productId);
    }

    isInWishlist(productId) {
        return this.data.wishlist.includes(productId);
    }

    getWishlist() {
        return this.data.wishlist;
    }

    setGoldMember(isGold) {
        this.data.isGoldMember = isGold;
        this.save();
    }

    isGoldMember() {
        return this.data.isGoldMember;
    }
}

// Theme Store
class ThemeStore {
    constructor() {
        this.storageKey = 'store-theme';
        this.theme = this.loadFromStorage();
        this.apply();
    }

    loadFromStorage() {
        return localStorage.getItem(this.storageKey) || 'light';
    }

    save() {
        localStorage.setItem(this.storageKey, this.theme);
        EventBus.emit('theme:changed', this.theme);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.save();
        this.apply();
        return this.theme;
    }

    apply() {
        const html = document.documentElement;
        const metaTheme = document.querySelector('meta[name="theme-color"]');

        if (this.theme === 'dark') {
            html.classList.add('dark');
            metaTheme?.setAttribute('content', '#1F2937');
        } else {
            html.classList.remove('dark');
            metaTheme?.setAttribute('content', '#042A5B');
        }
    }

    get() {
        return this.theme;
    }
}

// Singleton instances
export const productsStore = new ProductsStore();
export const cartStore = new CartStore();

class ShortlistStore {
    constructor() {
        this.storageKey = 'store-favorites';
        this.items = this.loadFromStorage();
        this.subscribers = [];
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
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
        this.saveToStorage();
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

export const userStore = new UserStore();
export const themeStore = new ThemeStore();
export { categoriesMeta, frameShapes, trendingSearches };
