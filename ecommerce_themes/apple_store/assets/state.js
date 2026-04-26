import { loadFromStorage, saveToStorage, getImageUrl } from './utils.js';

// Apple products data
const initialProducts = [
    // iPhone
    {
        id: 1,
        name: 'iPhone 16 Pro',
        tagline: 'Titanium. So strong. So light. So Pro.',
        price: 999,
        category: 'iPhone',
        image: getImageUrl('iphone 16 pro titanium', 1000, 0),
        heroImage: getImageUrl('iphone 16 pro hero', 1000, 1),
        description: 'The ultimate iPhone with a strong and light titanium design, the A18 Pro chip, and the best iPhone cameras ever.',
        features: ['A18 Pro chip', 'Pro camera system', 'Titanium design', 'Action button'],
        colors: ['Black Titanium', 'White Titanium', 'Natural Titanium', 'Blue Titanium'],
        inStock: true,
        badge: 'New',
        rating: 4.9
    },
    {
        id: 2,
        name: 'iPhone 16',
        tagline: 'A total powerhouse.',
        price: 799,
        category: 'iPhone',
        image: getImageUrl('iphone 16 colors', 1000, 2),
        heroImage: getImageUrl('iphone 16 display', 1000, 3),
        description: 'Dynamic Island. A18 chip. Dual camera system. All-day battery life.',
        features: ['A18 chip', 'Dual camera system', 'Dynamic Island', 'All-day battery'],
        colors: ['Black', 'White', 'Pink', 'Teal', 'Ultramarine'],
        inStock: true,
        badge: 'New',
        rating: 4.8
    },
    {
        id: 3,
        name: 'iPhone 15',
        tagline: 'Newphoria.',
        price: 699,
        category: 'iPhone',
        image: getImageUrl('iphone 15 colors pastel', 1000, 4),
        heroImage: getImageUrl('iphone 15 front back', 1000, 5),
        description: 'Dynamic Island. 48MP Main camera. USB-C. All-day battery life.',
        features: ['A16 Bionic', '48MP camera', 'Dynamic Island', 'USB-C'],
        colors: ['Black', 'Blue', 'Green', 'Yellow', 'Pink'],
        inStock: true,
        rating: 4.7
    },

    // Mac
    {
        id: 4,
        name: 'MacBook Air M4',
        tagline: 'Lean. Mean. M4 machine.',
        price: 1099,
        category: 'Mac',
        image: getImageUrl('macbook air m4 laptop', 1000, 0),
        heroImage: getImageUrl('macbook air side view', 1000, 1),
        description: 'The new MacBook Air with M4 chip delivers exceptional performance and battery life in an incredibly thin and light design.',
        features: ['M4 chip', 'Up to 24GB RAM', '18-hour battery', 'Liquid Retina display'],
        colors: ['Midnight', 'Starlight', 'Space Gray', 'Silver'],
        inStock: true,
        badge: 'New',
        rating: 4.9
    },
    {
        id: 5,
        name: 'MacBook Pro 14"',
        tagline: 'Mind-blowing. Head-turning.',
        price: 1999,
        category: 'Mac',
        image: getImageUrl('macbook pro 14 inch laptop', 1000, 2),
        heroImage: getImageUrl('macbook pro display screen', 1000, 3),
        description: 'The most powerful MacBook Pro ever with M4 Pro or M4 Max chip.',
        features: ['M4 Pro/Max chip', 'Up to 128GB RAM', 'Liquid Retina XDR', 'Up to 22 hours battery'],
        colors: ['Space Black', 'Silver'],
        inStock: true,
        badge: 'New',
        rating: 5.0
    },
    {
        id: 6,
        name: 'iMac 24"',
        tagline: 'A desktop built for Apple Intelligence.',
        price: 1299,
        category: 'Mac',
        image: getImageUrl('imac 24 inch colorful', 1000, 4),
        heroImage: getImageUrl('imac desktop display', 1000, 5),
        description: 'A strikingly thin all-in-one desktop with M4 chip and vibrant 24-inch 4.5K Retina display.',
        features: ['M4 chip', '24-inch 4.5K display', 'Studio-quality mics', '1080p camera'],
        colors: ['Green', 'Yellow', 'Orange', 'Pink', 'Purple', 'Blue', 'Silver'],
        inStock: true,
        rating: 4.8
    },

    // iPad
    {
        id: 7,
        name: 'iPad Pro',
        tagline: 'Unbelievably thin. Incredibly powerful.',
        price: 999,
        category: 'iPad',
        image: getImageUrl('ipad pro tablet', 1000, 0),
        heroImage: getImageUrl('ipad pro pencil keyboard', 1000, 1),
        description: 'The ultimate iPad experience with the powerful M4 chip and stunning Ultra Retina XDR display.',
        features: ['M4 chip', 'Ultra Retina XDR', 'Apple Pencil Pro', 'Face ID'],
        colors: ['Space Black', 'Silver'],
        inStock: true,
        badge: 'New',
        rating: 4.9
    },
    {
        id: 8,
        name: 'iPad Air',
        tagline: 'Fresh Air.',
        price: 599,
        category: 'iPad',
        image: getImageUrl('ipad air blue tablet', 1000, 2),
        heroImage: getImageUrl('ipad air front back', 1000, 3),
        description: 'Serious performance in a thin and light design. Now with M3 chip.',
        features: ['M3 chip', 'Liquid Retina display', 'Apple Pencil Pro', 'Touch ID'],
        colors: ['Space Gray', 'Starlight', 'Purple', 'Blue'],
        inStock: true,
        rating: 4.7
    },
    {
        id: 9,
        name: 'iPad',
        tagline: 'Lovable. Drawable. Magical.',
        price: 349,
        category: 'iPad',
        image: getImageUrl('ipad 10th generation', 1000, 4),
        heroImage: getImageUrl('ipad colorful accessories', 1000, 5),
        description: 'The all-new colorful iPad with the A14 Bionic chip. Perfect for everything you love to do.',
        features: ['A14 Bionic', '10.9-inch display', 'USB-C', 'Apple Pencil support'],
        colors: ['Blue', 'Pink', 'Yellow', 'Silver'],
        inStock: true,
        rating: 4.6
    },

    // Apple Watch
    {
        id: 10,
        name: 'Apple Watch Series 11',
        tagline: 'Thinstant classic.',
        price: 399,
        category: 'Watch',
        image: getImageUrl('apple watch series 11', 1000, 0),
        heroImage: getImageUrl('apple watch fitness health', 1000, 1),
        description: 'Our thinnest watch with our biggest display. Advanced health sensors and crash detection.',
        features: ['S11 chip', 'Always-On display', 'Blood oxygen', 'ECG', 'Crash detection'],
        colors: ['Midnight', 'Starlight', 'Silver', 'Red'],
        inStock: true,
        badge: 'New',
        rating: 4.9
    },
    {
        id: 11,
        name: 'Apple Watch Ultra 3',
        tagline: 'New frontiers. New perspectives.',
        price: 799,
        category: 'Watch',
        image: getImageUrl('apple watch ultra rugged', 1000, 2),
        heroImage: getImageUrl('apple watch diving ocean', 1000, 3),
        description: 'The most rugged and capable Apple Watch. Built for adventure with titanium case.',
        features: ['S11 chip', 'Precision dual-frequency GPS', '100m water resistance', 'Up to 36 hours battery'],
        colors: ['Natural', 'Black'],
        inStock: true,
        rating: 5.0
    },

    // AirPods
    {
        id: 12,
        name: 'AirPods Pro 3',
        tagline: 'Hearing aid feature. A gift to hear.',
        price: 249,
        category: 'AirPods',
        image: getImageUrl('airpods pro 3 earbuds', 1000, 0),
        heroImage: getImageUrl('airpods pro case charging', 1000, 1),
        description: 'Active Noise Cancellation. Adaptive Audio. Personalized Spatial Audio. FDA-authorized hearing aid feature.',
        features: ['Active Noise Cancellation', 'Adaptive Audio', 'Hearing aid feature', 'USB-C charging'],
        colors: ['White'],
        inStock: true,
        badge: 'New',
        rating: 4.9
    },
    {
        id: 13,
        name: 'AirPods Max',
        tagline: 'Computational audio. Sounds incredible.',
        price: 549,
        category: 'AirPods',
        image: getImageUrl('airpods max headphones', 1000, 2),
        heroImage: getImageUrl('airpods max side view', 1000, 3),
        description: 'Computational audio delivers immersive listening with Active Noise Cancellation and Adaptive Audio.',
        features: ['Active Noise Cancellation', 'Adaptive Audio', 'Spatial Audio', 'USB-C charging'],
        colors: ['Midnight', 'Starlight', 'Purple', 'Orange', 'Blue'],
        inStock: true,
        rating: 4.8
    },

    // Vision
    {
        id: 14,
        name: 'Apple Vision Pro',
        tagline: 'Welcome to the era of spatial computing.',
        price: 3499,
        category: 'Vision',
        image: getImageUrl('apple vision pro headset', 1000, 0),
        heroImage: getImageUrl('vision pro vr experience', 1000, 1),
        description: 'An immersive way to experience entertainment, apps, and memories in a new dimension.',
        features: ['M2 & R1 chips', 'Spatial computing', '4K displays', 'Eye tracking'],
        colors: ['Silver'],
        inStock: true,
        badge: 'New',
        rating: 4.7
    },

    // Accessories
    {
        id: 15,
        name: 'Magic Keyboard for iPad Pro',
        tagline: 'Float through your work.',
        price: 299,
        category: 'Accessories',
        image: getImageUrl('magic keyboard ipad', 1000, 0),
        heroImage: getImageUrl('ipad keyboard typing', 1000, 1),
        description: 'The best typing experience for iPad Pro with backlit keys and trackpad.',
        features: ['Backlit keys', 'Built-in trackpad', 'USB-C pass-through', 'Floating design'],
        colors: ['Black', 'White'],
        inStock: true,
        rating: 4.6
    },
    {
        id: 16,
        name: 'Apple Pencil Pro',
        tagline: 'Dream it up. Jot it down.',
        price: 129,
        category: 'Accessories',
        image: getImageUrl('apple pencil stylus', 1000, 2),
        heroImage: getImageUrl('apple pencil drawing ipad', 1000, 3),
        description: 'The most advanced Apple Pencil with squeeze gesture, barrel roll, and haptic feedback.',
        features: ['Squeeze gesture', 'Barrel roll', 'Haptic feedback', 'Pixel-perfect precision'],
        colors: ['White'],
        inStock: true,
        badge: 'New',
        rating: 4.9
    }
];

export const productsStore = {
    products: initialProducts,
    getProductById(id) {
        return this.products.find(product => product.id === Number(id));
    },
    getFeaturedProducts() {
        return this.products.filter(product => product.badge === 'New').slice(0, 6);
    },
    getByCategory(category) {
        return this.products.filter(product => product.category === category);
    },
    getCategories() {
        return [...new Set(this.products.map(product => product.category))];
    }
};

export const categoriesMeta = [
    {
        id: 'iphone',
        name: 'iPhone',
        description: 'The ultimate iPhone experience',
        image: getImageUrl('iphone collection lineup', 1000, 0)
    },
    {
        id: 'mac',
        name: 'Mac',
        description: 'Supercharged by Apple silicon',
        image: getImageUrl('mac computers lineup', 1000, 1)
    },
    {
        id: 'ipad',
        name: 'iPad',
        description: 'Touch, draw, and type on one magical device',
        image: getImageUrl('ipad lineup accessories', 1000, 2)
    },
    {
        id: 'watch',
        name: 'Apple Watch',
        description: 'A healthy leap ahead',
        image: getImageUrl('apple watch collection', 1000, 3)
    },
    {
        id: 'airpods',
        name: 'AirPods',
        description: 'Share the joy',
        image: getImageUrl('airpods collection', 1000, 4)
    },
    {
        id: 'vision',
        name: 'Vision',
        description: 'Welcome to spatial computing',
        image: getImageUrl('apple vision pro', 1000, 5)
    },
    {
        id: 'accessories',
        name: 'Accessories',
        description: 'Mix. Match. MagSafe.',
        image: getImageUrl('apple accessories collection', 1000, 0)
    }
];

class CartStore {
    constructor() {
        this.items = loadFromStorage('apple-cart', []);
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
        saveToStorage('apple-cart', this.items);
    }

    getState() {
        const subtotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const tax = subtotal * 0.1;
        const shipping = subtotal > 0 && subtotal < 50 ? 10 : 0;

        return {
            items: this.items,
            subtotal,
            tax,
            shipping,
            total: subtotal + tax + shipping,
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

class UserStore {
    constructor() {
        this.state = loadFromStorage('apple-user', {
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
        saveToStorage('apple-user', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }
}

export const userStore = new UserStore();

class ShortlistStore {
    constructor() {
        this.items = loadFromStorage('apple-favorites', []);
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
        saveToStorage('apple-favorites', this.items);
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

class ThemeStore {
    constructor() {
        const savedTheme = loadFromStorage('apple-theme', null);
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
            metaTheme.setAttribute('content', theme === 'dark' ? '#1d1d1f' : '#ffffff');
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        saveToStorage('apple-theme', this.theme);
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
