import { loadFromStorage, saveToStorage } from './utils.js';

const epicsum = (query, size = 1000, index = 0) =>
    `http://194.238.23.194/epicsum/media/image/${encodeURIComponent(query)}?size=${size}&index=${index}`;

const gallery = (query, size = 1000, count = 3) =>
    Array.from({ length: count }, (_, idx) => epicsum(`${query}-${idx + 1}`, size, idx));

const initialProducts = [
    {
        id: 201,
        name: 'Quantum Pro Headphones',
        price: 349,
        originalPrice: 449,
        category: 'Audio',
        image: epicsum('premium wireless headphones', 720, 0),
        gallery: gallery('premium wireless headphones'),
        description: 'Flagship wireless headphones with adaptive ANC and spatial audio.',
        rating: 4.9,
        reviews: 1847,
        inStock: true,
        featured: true,
        tags: ['audio', 'wireless', 'best-seller'],
        colors: ['Midnight Black', 'Space Gray', 'Arctic White'],
        sizes: ['One Size'],
        specs: 'Active noise cancellation, 40-hour battery life, USB-C charging',
        shipping: 'Free 2-day shipping'
    },
    {
        id: 202,
        name: 'UltraView 4K Monitor',
        price: 799,
        originalPrice: 999,
        category: 'Displays',
        image: epicsum('4k monitor display', 720, 1),
        gallery: gallery('4k monitor display'),
        description: '32-inch 4K HDR monitor with 144Hz refresh rate and USB-C hub.',
        rating: 4.8,
        reviews: 634,
        inStock: true,
        featured: true,
        tags: ['display', 'productivity', '4k'],
        colors: ['Black'],
        sizes: ['32"'],
        specs: '3840x2160, 144Hz, HDR10, USB-C 90W PD',
        shipping: 'Ships in 24h'
    },
    {
        id: 203,
        name: 'MechMaster Keyboard',
        price: 189,
        category: 'Accessories',
        image: epicsum('mechanical keyboard', 720, 0),
        gallery: gallery('mechanical keyboard'),
        description: 'Premium mechanical keyboard with hot-swappable switches and RGB.',
        rating: 4.7,
        reviews: 923,
        inStock: true,
        tags: ['keyboard', 'gaming', 'productivity'],
        colors: ['Black', 'White', 'Navy'],
        sizes: ['Full Size', 'TKL'],
        specs: 'Hot-swappable switches, PBT keycaps, N-key rollover',
        shipping: 'Free returns'
    },
    {
        id: 204,
        name: 'StreamCam Pro 4K',
        price: 249,
        category: 'Cameras',
        image: epicsum('4k webcam streaming', 720, 2),
        gallery: gallery('4k webcam streaming'),
        description: 'Professional 4K webcam with auto-framing and low-light optimization.',
        rating: 4.6,
        reviews: 512,
        inStock: true,
        tags: ['camera', 'streaming', 'video'],
        colors: ['Black', 'Silver'],
        sizes: ['One Size'],
        specs: '4K @ 30fps, 1080p @ 60fps, auto-framing, HDR',
        shipping: 'Ships worldwide'
    },
    {
        id: 205,
        name: 'PowerBank Ultra 20K',
        price: 79,
        category: 'Power',
        image: epicsum('portable power bank', 720, 3),
        gallery: gallery('portable power bank'),
        description: '20,000mAh power bank with 100W USB-C PD and wireless charging.',
        rating: 4.8,
        reviews: 1256,
        inStock: true,
        featured: true,
        tags: ['power', 'portable', 'charging'],
        colors: ['Black', 'Gray'],
        sizes: ['One Size'],
        specs: '20000mAh, 100W USB-C PD, 15W wireless charging',
        shipping: 'Complimentary cable'
    },
    {
        id: 206,
        name: 'SmartHub Docking Station',
        price: 299,
        category: 'Accessories',
        image: epicsum('laptop docking station', 720, 1),
        gallery: gallery('laptop docking station'),
        description: '14-in-1 USB-C docking station with dual 4K display support.',
        rating: 4.5,
        reviews: 387,
        inStock: true,
        tags: ['dock', 'productivity', 'usb-c'],
        colors: ['Space Gray'],
        sizes: ['One Size'],
        specs: 'Dual 4K @ 60Hz, 100W PD, Gigabit Ethernet, SD reader',
        shipping: 'Carbon-neutral'
    },
    {
        id: 207,
        name: 'PrecisionTrack Mouse',
        price: 129,
        category: 'Accessories',
        image: epicsum('wireless mouse ergonomic', 720, 4),
        gallery: gallery('wireless mouse ergonomic'),
        description: 'Ergonomic wireless mouse with 4000 DPI sensor and multi-device support.',
        rating: 4.7,
        reviews: 789,
        inStock: true,
        featured: true,
        tags: ['mouse', 'ergonomic', 'wireless'],
        colors: ['Black', 'White'],
        sizes: ['One Size'],
        specs: '4000 DPI, Bluetooth + 2.4GHz, 3-device pairing',
        shipping: 'Next-day available'
    },
    {
        id: 208,
        name: 'NanoFit Earbuds Pro',
        price: 199,
        category: 'Audio',
        image: epicsum('wireless earbuds case', 720, 2),
        gallery: gallery('wireless earbuds case'),
        description: 'True wireless earbuds with adaptive ANC and 30-hour battery.',
        rating: 4.6,
        reviews: 1523,
        inStock: true,
        tags: ['audio', 'wireless', 'earbuds'],
        colors: ['Black', 'White', 'Blue'],
        sizes: ['One Size'],
        specs: 'Adaptive ANC, 8hr + 22hr case, IPX5 water resistant',
        shipping: 'Ships in 48h'
    },
    {
        id: 209,
        name: 'TitanSSD 2TB',
        price: 249,
        category: 'Storage',
        image: epicsum('portable ssd drive', 720, 0),
        gallery: gallery('portable ssd drive'),
        description: 'Ultra-fast portable SSD with 2000MB/s read speeds and rugged design.',
        rating: 4.9,
        reviews: 1045,
        inStock: true,
        tags: ['storage', 'portable', 'ssd'],
        colors: ['Black', 'Silver'],
        sizes: ['1TB', '2TB', '4TB'],
        specs: '2000MB/s read, USB 3.2 Gen 2x2, IP65 rated',
        shipping: 'Free shipping over $150'
    },
    {
        id: 210,
        name: 'LumiDesk LED Strip',
        price: 59,
        category: 'Lighting',
        image: epicsum('led desk lighting', 720, 3),
        gallery: gallery('led desk lighting'),
        description: 'Smart LED light strip with app control and 16M colors.',
        rating: 4.4,
        reviews: 678,
        inStock: true,
        tags: ['lighting', 'smart', 'rgb'],
        colors: ['RGB'],
        sizes: ['1.5m', '3m'],
        specs: '16M colors, app control, music sync, voice assistant',
        shipping: 'Complimentary adhesive kit'
    },
    {
        id: 211,
        name: 'AirFlow Laptop Stand',
        price: 89,
        category: 'Accessories',
        image: epicsum('aluminum laptop stand', 720, 0),
        gallery: gallery('aluminum laptop stand'),
        description: 'Aluminum laptop stand with adjustable height and cable management.',
        rating: 4.5,
        reviews: 534,
        inStock: true,
        tags: ['stand', 'ergonomic', 'aluminum'],
        colors: ['Silver', 'Space Gray'],
        sizes: ['One Size'],
        specs: 'Aluminum alloy, 6 height positions, cable organizer',
        shipping: 'Handmade to order'
    },
    {
        id: 212,
        name: 'ChargeSync Cable Bundle',
        price: 45,
        category: 'Accessories',
        image: epicsum('braided usb cables', 720, 1),
        gallery: gallery('braided usb cables'),
        description: 'Premium braided cable set with USB-C, Lightning, and Micro-USB.',
        rating: 4.6,
        reviews: 892,
        inStock: true,
        tags: ['cables', 'charging', 'bundle'],
        colors: ['Black', 'White', 'Blue'],
        sizes: ['1m', '2m'],
        specs: 'Braided nylon, 100W PD support, lifetime warranty',
        shipping: 'Ready to ship'
    }
];

export const productsStore = {
    products: initialProducts,
    getProductById(id) {
        return this.products.find(product => product.id === Number(id));
    },
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    },
    getByCategory(category) {
        return this.products.filter(product => product.category === category);
    },
    search(query) {
        const q = query.toLowerCase();
        return this.products.filter(product =>
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.tags.some(tag => tag.toLowerCase().includes(q))
        );
    },
    getCategories() {
        return [...new Set(this.products.map(product => product.category))];
    }
};

class CartStore {
    constructor() {
        this.items = loadFromStorage('tech-cart', []);
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
        saveToStorage('tech-cart', this.items);
    }

    getState() {
        return {
            items: this.items,
            subtotal: this.items.reduce((total, item) => total + item.price * item.quantity, 0),
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

class PreferencesStore {
    constructor() {
        this.state = loadFromStorage('tech-preferences', {
            theme: 'light',
            currency: 'USD'
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
        saveToStorage('tech-preferences', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }

    get(key) {
        return this.state[key];
    }
}

export const preferencesStore = new PreferencesStore();

class UserStore {
    constructor() {
        this.state = loadFromStorage('electronics-user', {
            location: 'Select Location',
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
        saveToStorage('electronics-user', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }
}

export const userStore = new UserStore();

class ShortlistStore {
    constructor() {
        this.items = loadFromStorage('electronics-favorites', []);
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
        saveToStorage('electronics-favorites', this.items);
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

export const collectionsMeta = [
    {
        name: 'Premium Audio',
        description: 'Immersive sound with cutting-edge ANC technology.',
        cta: 'Explore audio',
        image: epicsum('premium headphones studio', 1000, 0),
        category: 'Audio'
    },
    {
        name: 'Productivity Hub',
        description: 'Displays, keyboards, and accessories for peak efficiency.',
        cta: 'Build your setup',
        image: epicsum('modern desk setup', 1000, 1),
        category: 'Accessories'
    },
    {
        name: 'Power & Storage',
        description: 'Fast charging and ultra-portable SSDs for on-the-go.',
        cta: 'Shop essentials',
        image: epicsum('portable tech accessories', 1000, 2),
        category: 'Storage'
    }
];

export const blogEntries = [
    {
        slug: 'tech-setup-minimalist-guide',
        title: 'The Minimalist Tech Setup Guide',
        excerpt: 'Build a clean, efficient workspace with just the essentials for maximum productivity.',
        image: epicsum('minimal desk setup tech', 720, 0),
        date: 'Nov 28, 2025'
    },
    {
        slug: 'wireless-audio-revolution',
        title: 'The Wireless Audio Revolution',
        excerpt: 'How spatial audio and adaptive ANC are transforming our listening experience.',
        image: epicsum('wireless headphones close up', 720, 1),
        date: 'Nov 15, 2025'
    },
    {
        slug: 'sustainable-tech-choices',
        title: 'Making Sustainable Tech Choices',
        excerpt: 'A deep dive into eco-friendly electronics and responsible consumption.',
        image: epicsum('recycled electronics components', 720, 2),
        date: 'Oct 22, 2025'
    }
];

export const gallerySlides = [
    {
        title: 'Studio Sessions',
        caption: 'Behind the scenes of our product photography and testing lab.',
        image: epicsum('tech product photography studio', 1000, 0),
        video: 'http://194.238.23.194/epicsum/media/video/tech%20studio?size=720&index=0'
    },
    {
        title: 'Urban Workflow',
        caption: 'Mobile productivity in modern workspaces across the city.',
        image: epicsum('modern office tech setup', 1000, 1),
        video: 'http://194.238.23.194/epicsum/media/video/modern%20office?size=720&index=1'
    },
    {
        title: 'Innovation Lab',
        caption: 'Exploring next-gen tech and cutting-edge prototypes.',
        image: epicsum('tech innovation lab', 1000, 2),
        video: 'http://194.238.23.194/epicsum/media/video/innovation%20lab?size=720&index=2'
    }
];
