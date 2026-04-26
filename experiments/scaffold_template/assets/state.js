/**
 * Global State Management
 * - Product catalog
 * - Shopping cart with localStorage persistence
 * - User preferences
 * - Reactive state with subscription pattern
 */

import { saveToStorage, loadFromStorage } from './utils.js';

// ============================================================================
// Product Catalog State
// ============================================================================

export const productsStore = {
    products: [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            brand: 'Levi',
            price: 512,
            originalPrice: 649,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop'
            ],
            description: 'High-quality wireless headphones with noise cancellation and premium sound.',
            descriptionLong: 'Experience premium sound quality with our flagship wireless headphones. Featuring advanced active noise cancellation technology, these headphones deliver crystal-clear audio in any environment. The comfortable over-ear design and 30-hour battery life make them perfect for long listening sessions.',
            features: ['Active Noise Cancellation', '30-hour battery life', 'Bluetooth 5.0', 'Premium leather earcups', 'Foldable design'],
            materials: 'Premium leather, aluminum frame',
            care: 'Wipe clean with soft cloth',
            variants: {
                colors: [
                    { name: 'Black', value: 'black', hex: '#000000' },
                    { name: 'Silver', value: 'silver', hex: '#C0C0C0' },
                    { name: 'Rose Gold', value: 'rose-gold', hex: '#B76E79' }
                ]
            },
            rating: 4.8,
            reviews: 1240,
            inStock: true,
            featured: true,
            tags: ['audio', 'wireless', 'premium'],
            relatedProducts: [2, 8, 6]
        },
        {
            id: 2,
            name: 'Smart Watch Series 5',
            brand: 'Pepe Jeans',
            price: 587,
            originalPrice: 1199,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
            description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and notifications.',
            rating: 3.9,
            reviews: '10',
            inStock: true,
            featured: true,
            tags: ['wearable', 'fitness', 'smart']
        },
        {
            id: 3,
            name: 'Minimalist Leather Wallet',
            brand: 'Lux Cozi',
            price: 417,
            originalPrice: 439,
            category: 'Accessories',
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop',
            description: 'Polo Collar Cotton T-shirts',
            rating: 4.6,
            reviews: '456',
            inStock: true,
            featured: false,
            tags: ['leather', 'minimalist', 'everyday']
        },
        {
            id: 4,
            name: 'Designer Sunglasses',
            brand: 'Marks & Spencer',
            price: 539,
            originalPrice: 899,
            category: 'Accessories',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
            description: 'Men Solid Cotton T-shirt',
            rating: 4.8,
            reviews: '17',
            inStock: true,
            featured: false,
            tags: ['fashion', 'outdoor', 'protection']
        },
        {
            id: 5,
            name: 'Organic Cotton T-Shirt',
            price: 29.99,
            category: 'Clothing',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=800&fit=crop'
            ],
            description: 'Soft and comfortable t-shirt made from 100% organic cotton.',
            descriptionLong: 'Our organic cotton t-shirt is made from sustainably sourced cotton, providing unmatched comfort and breathability. Perfect for everyday wear, this classic crew neck design fits seamlessly into any wardrobe. The soft fabric gets even better with each wash.',
            features: ['100% Organic Cotton', 'Crew neck design', 'Pre-shrunk fabric', 'Breathable and soft', 'Machine washable'],
            materials: '100% Organic Cotton',
            care: 'Machine wash cold, tumble dry low',
            variants: {
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                colors: [
                    { name: 'White', value: 'white', hex: '#FFFFFF' },
                    { name: 'Black', value: 'black', hex: '#000000' },
                    { name: 'Navy', value: 'navy', hex: '#001F3F' },
                    { name: 'Gray', value: 'gray', hex: '#808080' }
                ]
            },
            rating: 4.9,
            reviews: 678,
            inStock: true,
            featured: true,
            tags: ['organic', 'sustainable', 'basics'],
            relatedProducts: [6, 4, 9]
        },
        {
            id: 6,
            name: 'Running Shoes Pro',
            price: 129.99,
            category: 'Footwear',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            description: 'Professional running shoes with cushioned sole and breathable mesh.',
            rating: 4.8,
            reviews: 1023,
            inStock: true,
            featured: true,
            tags: ['sports', 'running', 'comfort']
        },
        {
            id: 7,
            name: 'Stainless Steel Water Bottle',
            price: 34.99,
            category: 'Lifestyle',
            image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
            description: 'Insulated water bottle that keeps drinks cold for 24h or hot for 12h.',
            rating: 4.7,
            reviews: 567,
            inStock: true,
            featured: false,
            tags: ['hydration', 'eco-friendly', 'insulated']
        },
        {
            id: 8,
            name: 'Portable Bluetooth Speaker',
            price: 89.99,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
            description: 'Compact speaker with powerful bass and 20-hour battery life.',
            rating: 4.6,
            reviews: 423,
            inStock: true,
            featured: false,
            tags: ['audio', 'portable', 'wireless']
        },
        {
            id: 9,
            name: 'Canvas Backpack',
            price: 79.99,
            category: 'Bags',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
            description: 'Durable canvas backpack with laptop compartment and multiple pockets.',
            rating: 4.8,
            reviews: 789,
            inStock: true,
            featured: true,
            tags: ['travel', 'laptop', 'durable']
        },
        {
            id: 10,
            name: 'Yoga Mat Premium',
            price: 59.99,
            category: 'Fitness',
            image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
            description: 'Non-slip yoga mat with extra cushioning and carrying strap.',
            rating: 4.9,
            reviews: 912,
            inStock: true,
            featured: false,
            tags: ['yoga', 'fitness', 'wellness']
        },
        {
            id: 11,
            name: 'Desk Lamp LED',
            price: 45.99,
            category: 'Home',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop',
            description: 'Adjustable LED desk lamp with multiple brightness levels and USB charging.',
            rating: 4.7,
            reviews: 345,
            inStock: true,
            featured: false,
            tags: ['lighting', 'workspace', 'LED']
        },
        {
            id: 12,
            name: 'Ceramic Coffee Mug Set',
            price: 39.99,
            category: 'Home',
            image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
            description: 'Set of 4 handcrafted ceramic mugs with unique designs.',
            rating: 4.8,
            reviews: 234,
            inStock: true,
            featured: false,
            tags: ['kitchen', 'handmade', 'coffee']
        }
    ],

    getProductById(id) {
        return this.products.find(p => p.id === parseInt(id));
    },

    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    },

    getFeaturedProducts() {
        return this.products.filter(p => p.featured);
    },

    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    },

    getCategories() {
        return [...new Set(this.products.map(p => p.category))];
    }
};

// ============================================================================
// Shopping Cart State with Persistence
// ============================================================================

class CartStore {
    constructor() {
        this.items = loadFromStorage('cart', []);
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(callback => callback(this.getState()));
        saveToStorage('cart', this.items);
    }

    getState() {
        return {
            items: this.items,
            total: this.getTotal(),
            count: this.getCount(),
            subtotal: this.getSubtotal(),
            tax: this.getTax(),
            shipping: this.getShipping()
        };
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.notify();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.notify();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.notify();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.notify();
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTax(rate = 0.08) {
        return this.getSubtotal() * rate;
    }

    getShipping() {
        const subtotal = this.getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal > 100) return 0; // Free shipping over $100
        return 9.99;
    }

    getTotal() {
        return this.getSubtotal() + this.getTax() + this.getShipping();
    }

    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    }

    getItemQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }
}

export const cartStore = new CartStore();

// ============================================================================
// User Preferences State
// ============================================================================

class PreferencesStore {
    constructor() {
        this.preferences = loadFromStorage('preferences', {
            theme: 'light',
            currency: 'USD',
            locale: 'en-US',
            notifications: true
        });
    }

    get(key) {
        return this.preferences[key];
    }

    set(key, value) {
        this.preferences[key] = value;
        saveToStorage('preferences', this.preferences);
    }

    getAll() {
        return { ...this.preferences };
    }
}

export const preferencesStore = new PreferencesStore();

// ============================================================================
// Filter State (for catalog page)
// ============================================================================

export const filterStore = {
    selectedCategory: null,
    searchQuery: '',
    sortBy: 'featured', // featured, price-low, price-high, rating, newest
    priceRange: [0, 1000],

    reset() {
        this.selectedCategory = null;
        this.searchQuery = '';
        this.sortBy = 'featured';
        this.priceRange = [0, 1000];
    },

    applyFilters(products) {
        let filtered = [...products];

        // Category filter
        if (this.selectedCategory) {
            filtered = filtered.filter(p => p.category === this.selectedCategory);
        }

        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Price range filter
        filtered = filtered.filter(p =>
            p.price >= this.priceRange[0] && p.price <= this.priceRange[1]
        );

        // Sorting
        switch (this.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'featured':
            default:
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        return filtered;
    }
};

// ============================================================================
// Global Event Bus for Cross-Component Communication
// ============================================================================

export const eventBus = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    },

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
};
