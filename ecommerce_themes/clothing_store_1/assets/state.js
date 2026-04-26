import { loadFromStorage, saveToStorage } from './utils.js';

const epicsum = (query, size = 1000, index = 0) =>
    `http://194.238.23.194/epicsum/media/image/${encodeURIComponent(query)}?size=${size}&index=${index}`;

const gallery = (query, size = 1000, count = 3) =>
    Array.from({ length: count }, (_, idx) => epicsum(`${query}-${idx + 1}`, size, idx));

const initialProducts = [
    {
        id: 101,
        name: 'Aria Wool Blazer',
        price: 228,
        originalPrice: 298,
        category: 'Women',
        image: epicsum('tailored blazer editorial', 720, 0),
        gallery: gallery('tailored blazer editorial'),
        description: 'Double-breasted blazer in Responsible Wool Standard yarns with fluid drape.',
        rating: 4.8,
        reviews: 124,
        inStock: true,
        featured: true,
        tags: ['tailored', 'capsule', 'best-seller'],
        colors: ['Stone', 'Ink', 'Rosé'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: 'RWS wool, corozo buttons',
        shipping: 'Free 2-day shipping'
    },
    {
        id: 102,
        name: 'Fieldstone Trench',
        price: 268,
        originalPrice: 328,
        category: 'Women',
        image: epicsum('modern trench coat fashion', 720, 1),
        gallery: gallery('modern trench coat fashion'),
        description: 'Water-resistant organic cotton trench with removable quilted liner.',
        rating: 4.7,
        reviews: 98,
        inStock: true,
        featured: true,
        tags: ['outerwear', 'weather'],
        colors: ['Camel', 'Olive', 'Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: 'Organic cotton, recycled poly fill',
        shipping: 'Ships in 24h'
    },
    {
        id: 103,
        name: 'Drift Knit Polo',
        price: 118,
        category: 'Men',
        image: epicsum('mens knit polo minimal', 720, 0),
        gallery: gallery('mens knit polo minimal'),
        description: 'Mercerized organic cotton polo with engineered rib collar.',
        rating: 4.6,
        reviews: 76,
        inStock: true,
        tags: ['knitwear', 'essentials'],
        colors: ['Bone', 'Navy', 'Charcoal'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        material: 'Organic cotton',
        shipping: 'Free returns'
    },
    {
        id: 104,
        name: 'Aero Runner',
        price: 198,
        category: 'Men',
        image: epicsum('mens technical runner sneaker', 720, 2),
        gallery: gallery('mens technical runner sneaker'),
        description: 'Ultralight sneaker with algae foam midsole and reflective details.',
        rating: 4.5,
        reviews: 205,
        inStock: true,
        tags: ['footwear', 'performance'],
        colors: ['Fog', 'Noir'],
        sizes: ['7', '8', '9', '10', '11', '12'],
        material: 'Recycled mesh, algae foam',
        shipping: 'Ships worldwide'
    },
    {
        id: 105,
        name: 'Lumen Slip Dress',
        price: 178,
        category: 'Women',
        image: epicsum('silk slip dress fashion', 720, 3),
        gallery: gallery('silk slip dress fashion'),
        description: 'Bias-cut eucalyptus satin slip with adjustable straps.',
        rating: 4.9,
        reviews: 142,
        inStock: true,
        featured: true,
        tags: ['evening', 'silk'],
        colors: ['Champagne', 'Emerald', 'Onyx'],
        sizes: ['XS', 'S', 'M', 'L'],
        material: 'Lenzing™ ECOVERO™ satin',
        shipping: 'Complimentary gift wrap'
    },
    {
        id: 106,
        name: 'Mod Denim Trouser',
        price: 158,
        category: 'Women',
        image: epicsum('wide leg denim womenswear', 720, 1),
        gallery: gallery('wide leg denim womenswear'),
        description: 'Wide-leg denim with sculpted waist and minimal hardware.',
        rating: 4.4,
        reviews: 63,
        inStock: true,
        tags: ['denim', 'essentials'],
        colors: ['Indigo', 'Washed Black'],
        sizes: ['24', '25', '26', '27', '28', '29', '30', '31'],
        material: 'Regenerative cotton',
        shipping: 'Carbon-neutral'
    },
    {
        id: 107,
        name: 'Element Puffer',
        price: 248,
        category: 'Men',
        image: epicsum('mens puffer jacket street style', 720, 4),
        gallery: gallery('mens puffer jacket street style'),
        description: 'Modular puffer with detachable hood and recycled fill.',
        rating: 4.6,
        reviews: 88,
        inStock: true,
        featured: true,
        tags: ['outerwear', 'winter'],
        colors: ['Slate', 'Moss'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Recycled nylon shell',
        shipping: 'Next-day available'
    },
    {
        id: 108,
        name: 'Column Midi Skirt',
        price: 148,
        category: 'Women',
        image: epicsum('linen midi skirt fashion', 720, 2),
        gallery: gallery('linen midi skirt fashion'),
        description: 'Column skirt with hidden elastic waist and center slit.',
        rating: 4.3,
        reviews: 54,
        inStock: true,
        tags: ['linen', 'summer'],
        colors: ['Oat', 'Ink'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: 'European linen',
        shipping: 'Ships in 48h'
    },
    {
        id: 109,
        name: 'Studio Utility Vest',
        price: 138,
        category: 'Men',
        image: epicsum('mens utility vest minimal', 720, 0),
        gallery: gallery('mens utility vest minimal'),
        description: 'Technical vest with heat-bonded seams and internal pockets.',
        rating: 4.2,
        reviews: 61,
        inStock: true,
        tags: ['layering', 'utility'],
        colors: ['Carbon', 'Clay'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Recycled nylon',
        shipping: 'Free shipping over $150'
    },
    {
        id: 110,
        name: 'Solace Cashmere Crew',
        price: 228,
        category: 'Women',
        image: epicsum('cashmere crewneck womenswear', 720, 3),
        gallery: gallery('cashmere crewneck womenswear'),
        description: 'Grade-A Mongolian cashmere crew with saddle shoulder.',
        rating: 4.9,
        reviews: 210,
        inStock: true,
        tags: ['knitwear', 'cashmere'],
        colors: ['Ivory', 'Fog', 'Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        material: '100% cashmere',
        shipping: 'Complimentary care kit'
    },
    {
        id: 111,
        name: 'Eclipse Day Bag',
        price: 298,
        category: 'Accessories',
        image: epicsum('designer leather tote minimal', 720, 0),
        gallery: gallery('designer leather tote minimal'),
        description: 'Vegetable-tanned leather tote with modular strap system.',
        rating: 4.8,
        reviews: 57,
        inStock: true,
        tags: ['leather goods', 'accessories'],
        colors: ['Cognac', 'Noir'],
        sizes: ['One Size'],
        material: 'Italian leather',
        shipping: 'Handmade to order'
    },
    {
        id: 112,
        name: 'Sphere Hoop Set',
        price: 98,
        category: 'Accessories',
        image: epicsum('minimal jewelry hoop earrings', 720, 1),
        gallery: gallery('minimal jewelry hoop earrings'),
        description: 'Set of three recycled sterling hoops with magnetic closure.',
        rating: 4.7,
        reviews: 134,
        inStock: true,
        tags: ['jewelry', 'gift'],
        colors: ['Silver', 'Gold'],
        sizes: ['One Size'],
        material: 'Recycled sterling silver',
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
        this.items = loadFromStorage('nova-cart', []);
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
        saveToStorage('nova-cart', this.items);
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
        this.state = loadFromStorage('nova-preferences', {
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
        saveToStorage('nova-preferences', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }

    get(key) {
        return this.state[key];
    }
}

export const preferencesStore = new PreferencesStore();

class UserStore {
    constructor() {
        this.state = loadFromStorage('clothing-user', {
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
        saveToStorage('clothing-user', this.state);
        this.listeners.forEach(cb => cb(this.state));
    }
}

export const userStore = new UserStore();

class ShortlistStore {
    constructor() {
        this.items = loadFromStorage('clothing-favorites', []);
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
        saveToStorage('clothing-favorites', this.items);
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
        name: 'Sculpted Tailoring',
        description: 'Architectural suiting with fluid Italian textiles.',
        cta: 'Explore suiting',
        image: epicsum('tailored suit womenswear studio', 1000, 0),
        category: 'Women'
    },
    {
        name: 'Elements Capsule',
        description: 'Modular outerwear engineered for commute and travel.',
        cta: 'Layer up',
        image: epicsum('mens modern outerwear studio', 1000, 1),
        category: 'Men'
    },
    {
        name: 'Everyday Rituals',
        description: 'Cashmere, knits, and the tactile essentials we live in.',
        cta: 'Shop essentials',
        image: epicsum('minimal knitwear folded', 1000, 2),
        category: 'Accessories'
    }
];

export const journalEntries = [
    {
        slug: 'atelier-diaries-vol-01',
        title: 'Atelier Diaries · Volume 01',
        excerpt: 'Tracing the hand-stitched details behind the Aria blazer with creative director Lila Qin.',
        image: epicsum('fashion studio craftsmanship', 720, 0),
        date: 'Nov 12, 2025'
    },
    {
        slug: 'materials-we-believe-in',
        title: 'Materials We Believe In',
        excerpt: 'A closer look at regenerative cotton partners across Porto and Jaipur.',
        image: epicsum('textile closeup sustainable fabric', 720, 1),
        date: 'Oct 30, 2025'
    },
    {
        slug: 'soundtrack-of-the-season',
        title: 'Soundtrack of the Season',
        excerpt: 'Ambient mixes curated for slow Sunday fittings.',
        image: epicsum('vinyl records minimalist studio', 720, 2),
        date: 'Oct 05, 2025'
    }
];

export const lookbookSlides = [
    {
        title: 'Desert Chromatics',
        caption: 'Sun-baked tones and airy tailoring shot in Todos Santos.',
        image: epicsum('desert fashion editorial', 1000, 0),
        video: 'http://194.238.23.194/epicsum/media/video/desert%20fashion?size=720&index=0'
    },
    {
        title: 'Architectural Shadows',
        caption: 'Sculpted silhouettes framed by brutalist lines.',
        image: epicsum('architectural fashion editorial', 1000, 1),
        video: 'http://194.238.23.194/epicsum/media/video/architectural%20fashion?size=720&index=1'
    },
    {
        title: 'Night Swim',
        caption: 'Iridescent finishes and technical mesh under blue hour light.',
        image: epicsum('night swim fashion editorial', 1000, 2),
        video: 'http://194.238.23.194/epicsum/media/video/night%20swim?size=720&index=2'
    }
];

