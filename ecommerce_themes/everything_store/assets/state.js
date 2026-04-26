import { loadFromStorage, saveToStorage, getImageUrl } from './utils.js';

const initialProducts = [
    // Fruits & Vegetables
    {
        id: 1,
        name: 'Mango Sindhura',
        price: 91,
        originalPrice: 140,
        category: 'Fruits & Vegetables',
        subcategory: 'Fresh Fruits',
        image: getImageUrl('mango sindhura', 720, 0),
        description: '2 pcs of fresh seasonal mangoes',
        rating: 4.5,
        reviews: 234,
        inStock: true,
        unit: '2 pcs',
        badge: 'Mildly Sweet',
        tags: ['fruit', 'seasonal', 'limited-edition']
    },
    {
        id: 2,
        name: 'Strawberry (Mahabaleshwar)',
        price: 112,
        originalPrice: 172,
        category: 'Fruits & Vegetables',
        subcategory: 'Fresh Fruits',
        image: getImageUrl('fresh strawberries', 720, 1),
        description: '1 pack (Approx. 160g - 180g)',
        rating: 4.7,
        reviews: 189,
        inStock: true,
        unit: '1 pack',
        badge: 'Early Season',
        tags: ['fruit', 'fresh', 'premium']
    },
    {
        id: 3,
        name: 'Apple Ber',
        price: 44,
        originalPrice: 57,
        category: 'Fruits & Vegetables',
        subcategory: 'Fresh Fruits',
        image: getImageUrl('apple ber indian jujube', 720, 2),
        description: '500 g of fresh apple ber',
        rating: 4.3,
        reviews: 145,
        inStock: true,
        unit: '500 g',
        tags: ['fruit', 'seasonal']
    },
    {
        id: 4,
        name: 'Coriander Leaves',
        price: 7,
        originalPrice: 12,
        category: 'Fruits & Vegetables',
        subcategory: 'Fresh Vegetables',
        image: getImageUrl('fresh coriander leaves', 720, 3),
        description: '1 pack (100 g) of fresh coriander',
        rating: 4.2,
        reviews: 312,
        inStock: true,
        unit: '1 pack (100 g)',
        tags: ['vegetable', 'herbs', 'organic']
    },
    {
        id: 5,
        name: 'Fresh Onion',
        price: 27,
        originalPrice: 53,
        category: 'Fruits & Vegetables',
        subcategory: 'Fresh Vegetables',
        image: getImageUrl('fresh red onions', 720, 4),
        description: '1 Pack / 900 -1000 gm',
        rating: 4.4,
        reviews: 567,
        inStock: true,
        unit: '1 kg',
        tags: ['vegetable', 'staple', 'daily-use']
    },

    // Dairy & Eggs
    {
        id: 6,
        name: 'Amul Taaza Milk',
        price: 27,
        category: 'Dairy, Bread & Eggs',
        subcategory: 'Milk & Curd',
        image: getImageUrl('amul taaza milk packet', 720, 0),
        description: '500 ml toned milk',
        rating: 4.6,
        reviews: 892,
        inStock: true,
        unit: '500 ml',
        tags: ['dairy', 'milk', 'fresh']
    },
    {
        id: 7,
        name: 'Britannia White Bread',
        price: 35,
        category: 'Dairy, Bread & Eggs',
        subcategory: 'Breads & Buns',
        image: getImageUrl('britannia white bread', 720, 1),
        description: '400g fresh white bread',
        rating: 4.5,
        reviews: 654,
        inStock: true,
        unit: '400 g',
        tags: ['bread', 'breakfast', 'bakery']
    },
    {
        id: 8,
        name: 'Farm Fresh Brown Eggs',
        price: 75,
        category: 'Dairy, Bread & Eggs',
        subcategory: 'Eggs',
        image: getImageUrl('brown eggs carton', 720, 2),
        description: '6 pcs farm fresh eggs',
        rating: 4.7,
        reviews: 423,
        inStock: true,
        unit: '6 pcs',
        tags: ['eggs', 'protein', 'fresh']
    },

    // Snacks & Beverages
    {
        id: 9,
        name: 'Lays Classic Salted',
        price: 20,
        category: 'Snacks & Beverages',
        subcategory: 'Chips & Namkeen',
        image: getImageUrl('lays chips packet', 720, 0),
        description: '52g pack of classic salted chips',
        rating: 4.4,
        reviews: 1234,
        inStock: true,
        unit: '52 g',
        tags: ['snacks', 'chips', 'popular']
    },
    {
        id: 10,
        name: 'Coca Cola 750ml',
        price: 40,
        category: 'Snacks & Beverages',
        subcategory: 'Cold Drinks',
        image: getImageUrl('coca cola bottle', 720, 1),
        description: '750ml chilled coca cola',
        rating: 4.6,
        reviews: 987,
        inStock: true,
        unit: '750 ml',
        tags: ['beverage', 'cold-drink', 'refreshing']
    },
    {
        id: 11,
        name: 'Haldiram Bhujia',
        price: 65,
        category: 'Snacks & Beverages',
        subcategory: 'Chips & Namkeen',
        image: getImageUrl('haldiram bhujia', 720, 2),
        description: '200g classic bhujia namkeen',
        rating: 4.8,
        reviews: 756,
        inStock: true,
        unit: '200 g',
        tags: ['snacks', 'namkeen', 'indian']
    },

    // Household Essentials
    {
        id: 12,
        name: 'Surf Excel Matic',
        price: 449,
        category: 'Cleaning Essentials',
        subcategory: 'Detergents',
        image: getImageUrl('surf excel matic powder', 720, 0),
        description: '2kg front load detergent',
        rating: 4.5,
        reviews: 534,
        inStock: true,
        unit: '2 kg',
        tags: ['cleaning', 'detergent', 'laundry']
    },
    {
        id: 13,
        name: 'Vim Dishwash Bar',
        price: 15,
        category: 'Cleaning Essentials',
        subcategory: 'Dishwash',
        image: getImageUrl('vim dishwash bar', 720, 1),
        description: '200g lemon dishwash bar',
        rating: 4.3,
        reviews: 678,
        inStock: true,
        unit: '200 g',
        tags: ['cleaning', 'dishwash', 'kitchen']
    },

    // Electronics & Accessories
    {
        id: 14,
        name: 'boAt Rockerz 450',
        price: 1499,
        originalPrice: 2990,
        category: 'Electricals & Accessories',
        subcategory: 'Audio Accessories',
        image: getImageUrl('boat wireless headphones', 720, 0),
        description: 'Bluetooth wireless headphones',
        rating: 4.3,
        reviews: 2345,
        inStock: true,
        unit: '1 pc',
        tags: ['electronics', 'audio', 'wireless']
    },
    {
        id: 15,
        name: 'Samsung M21 Cable',
        price: 249,
        category: 'Electricals & Accessories',
        subcategory: 'Mobile Accessories',
        image: getImageUrl('usb c charging cable', 720, 1),
        description: 'Type-C charging cable',
        rating: 4.4,
        reviews: 567,
        inStock: true,
        unit: '1 pc',
        tags: ['electronics', 'cable', 'charging']
    },

    // Personal Care
    {
        id: 16,
        name: 'Colgate Strong Teeth',
        price: 90,
        category: 'Bath & Body',
        subcategory: 'Oral Care',
        image: getImageUrl('colgate toothpaste', 720, 0),
        description: '200g toothpaste pack',
        rating: 4.5,
        reviews: 834,
        inStock: true,
        unit: '200 g',
        tags: ['personal-care', 'oral', 'hygiene']
    },
    {
        id: 17,
        name: 'Dove Soap Bar',
        price: 65,
        category: 'Bath & Body',
        subcategory: 'Bath Soaps',
        image: getImageUrl('dove soap bar', 720, 1),
        description: '125g moisturizing soap',
        rating: 4.6,
        reviews: 945,
        inStock: true,
        unit: '125 g',
        tags: ['personal-care', 'soap', 'bath']
    },

    // Breakfast & Instant
    {
        id: 18,
        name: 'Maggi Noodles',
        price: 12,
        category: 'Breakfast & Sauces',
        subcategory: 'Instant Food',
        image: getImageUrl('maggi instant noodles', 720, 0),
        description: '70g masala noodles',
        rating: 4.7,
        reviews: 1567,
        inStock: true,
        unit: '70 g',
        tags: ['instant', 'noodles', 'quick-meal']
    },
    {
        id: 19,
        name: 'Kelloggs Corn Flakes',
        price: 185,
        category: 'Breakfast & Sauces',
        subcategory: 'Cereals',
        image: getImageUrl('kelloggs corn flakes', 720, 1),
        description: '475g breakfast cereal',
        rating: 4.4,
        reviews: 678,
        inStock: true,
        unit: '475 g',
        tags: ['breakfast', 'cereal', 'healthy']
    },

    // Atta, Rice & Dals
    {
        id: 20,
        name: 'Aashirvaad Atta',
        price: 289,
        category: 'Atta, Rice, Oil & Dals',
        subcategory: 'Atta & Flours',
        image: getImageUrl('aashirvaad atta flour', 720, 0),
        description: '5kg whole wheat flour',
        rating: 4.6,
        reviews: 1234,
        inStock: true,
        unit: '5 kg',
        tags: ['staple', 'flour', 'grain']
    },
    {
        id: 21,
        name: 'India Gate Basmati',
        price: 185,
        category: 'Atta, Rice, Oil & Dals',
        subcategory: 'Rice',
        image: getImageUrl('basmati rice bag', 720, 1),
        description: '1kg premium basmati rice',
        rating: 4.7,
        reviews: 876,
        inStock: true,
        unit: '1 kg',
        tags: ['staple', 'rice', 'premium']
    }
];

export const productsStore = {
    products: initialProducts,
    getProductById(id) {
        return this.products.find(product => product.id === Number(id));
    },
    getFeaturedProducts() {
        return this.products.filter(product => product.badge || product.rating >= 4.5).slice(0, 8);
    },
    getByCategory(category) {
        return this.products.filter(product => product.category === category);
    },
    getBySubcategory(subcategory) {
        return this.products.filter(product => product.subcategory === subcategory);
    },
    search(query) {
        const q = query.toLowerCase();
        return this.products.filter(product =>
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(q)))
        );
    },
    getCategories() {
        return [...new Set(this.products.map(product => product.category))];
    },
    getSubcategories(category) {
        return [...new Set(
            this.products
                .filter(p => p.category === category)
                .map(p => p.subcategory)
                .filter(Boolean)
        )];
    }
};

export const categoriesMeta = [
    {
        id: 'fruits-vegetables',
        name: 'Fruits & Vegetables',
        icon: '🥬',
        color: 'bg-green-50',
        textColor: 'text-green-700',
        image: getImageUrl('fresh fruits vegetables', 720, 0)
    },
    {
        id: 'dairy-bread-eggs',
        name: 'Dairy, Bread & Eggs',
        icon: '🥛',
        color: 'bg-blue-50',
        textColor: 'text-blue-700',
        image: getImageUrl('dairy milk eggs', 720, 1)
    },
    {
        id: 'snacks-beverages',
        name: 'Snacks & Beverages',
        icon: '🍿',
        color: 'bg-orange-50',
        textColor: 'text-orange-700',
        image: getImageUrl('snacks beverages', 720, 2)
    },
    {
        id: 'atta-rice-dals',
        name: 'Atta, Rice, Oil & Dals',
        icon: '🌾',
        color: 'bg-amber-50',
        textColor: 'text-amber-700',
        image: getImageUrl('rice flour grains', 720, 3)
    },
    {
        id: 'cleaning-essentials',
        name: 'Cleaning Essentials',
        icon: '🧼',
        color: 'bg-purple-50',
        textColor: 'text-purple-700',
        image: getImageUrl('cleaning products', 720, 4)
    },
    {
        id: 'bath-body',
        name: 'Bath & Body',
        icon: '🧴',
        color: 'bg-pink-50',
        textColor: 'text-pink-700',
        image: getImageUrl('bath body care', 720, 5)
    },
    {
        id: 'breakfast-sauces',
        name: 'Breakfast & Sauces',
        icon: '🍯',
        color: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        image: getImageUrl('breakfast cereals', 720, 0)
    },
    {
        id: 'electricals-accessories',
        name: 'Electricals & Accessories',
        icon: '🔌',
        color: 'bg-indigo-50',
        textColor: 'text-indigo-700',
        image: getImageUrl('electronics accessories', 720, 1)
    }
];

class CartStore {
    constructor() {
        this.items = loadFromStorage('quickcart-cart', []);
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
        saveToStorage('quickcart-cart', this.items);
    }

    getState() {
        const subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const deliveryFee = subtotal > 0 && subtotal < 199 ? 25 : 0;

        return {
            items: this.items,
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
            count: this.items.reduce((total, item) => total + item.quantity, 0)
        };
    }

    add(product, quantity = 1) {
        const item = this.items.find(line => line.id === product.id);
        if (item) {
            item.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                unit: product.unit,
                quantity
            });
        }
        this.notify();
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.notify();
    }

    update(productId, quantity) {
        const item = this.items.find(line => line.id === productId);
        if (!item) return;
        if (quantity <= 0) {
            this.remove(productId);
        } else {
            item.quantity = quantity;
            this.notify();
        }
    }

    clear() {
        this.items = [];
        this.notify();
    }
}

export const cartStore = new CartStore();

class ShortlistStore {
    constructor() {
        this.items = loadFromStorage('quickcart-favorites', []);
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
        saveToStorage('quickcart-favorites', this.items);
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

class UserStore {
    constructor() {
        this.state = loadFromStorage('quickcart-user', {
            location: 'Select Location',
            savedAddresses: [],
            recentSearches: []
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

    set(key, value) {
        this.state[key] = value;
        saveToStorage('quickcart-user', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }

    get(key) {
        return this.state[key];
    }

    addSearch(query) {
        const searches = this.state.recentSearches.filter(s => s !== query);
        searches.unshift(query);
        this.set('recentSearches', searches.slice(0, 10));
    }
}

export const userStore = new UserStore();

class ThemeStore {
    constructor() {
        const savedTheme = loadFromStorage('quickcart-theme', null);
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

        // Update meta theme color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#1F2937' : '#EC407A');
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        saveToStorage('quickcart-theme', this.theme);
        this.listeners.forEach(cb => cb(this.theme));
    }

    setTheme(theme) {
        this.theme = theme;
        this.applyTheme(this.theme);
        saveToStorage('quickcart-theme', this.theme);
        this.listeners.forEach(cb => cb(this.theme));
    }

    getTheme() {
        return this.theme;
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
