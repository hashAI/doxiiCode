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
            brand: 'Sony',
            price: 512,
            originalPrice: 649,
            category: 'electronics',
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
            brand: 'Apple',
            price: 587,
            originalPrice: 1199,
            category: 'electronics',
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
            brand: 'Tommy Hilfiger',
            price: 417,
            originalPrice: 439,
            category: 'men',
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
            brand: 'Ray-Ban',
            price: 539,
            originalPrice: 899,
            category: 'accessories',
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
            brand: 'HRX',
            price: 29.99,
            originalPrice: 49.99,
            category: 'men',
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
            brand: 'Nike',
            price: 129.99,
            originalPrice: 179.99,
            category: 'men',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop'
            ],
            description: 'Professional running shoes with cushioned sole and breathable mesh.',
            descriptionLong: 'Engineered for performance, these professional running shoes feature advanced cushioning technology and breathable mesh upper for maximum comfort during long runs.',
            features: ['Air Zoom cushioning', 'Flyknit upper', 'Rubber outsole', 'Lightweight design', 'Breathable mesh'],
            materials: 'Mesh, synthetic leather, rubber',
            care: 'Wipe clean with damp cloth',
            variants: {
                sizes: ['7', '8', '9', '10', '11', '12'],
                colors: [
                    { name: 'Black', value: 'black', hex: '#000000' },
                    { name: 'White', value: 'white', hex: '#FFFFFF' },
                    { name: 'Blue', value: 'blue', hex: '#0066CC' }
                ]
            },
            rating: 4.8,
            reviews: 1023,
            inStock: true,
            featured: true,
            tags: ['sports', 'running', 'comfort'],
            relatedProducts: [5, 9, 10]
        },
        {
            id: 7,
            name: 'Floral Summer Dress',
            brand: 'Biba',
            price: 79.99,
            originalPrice: 129.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=800&fit=crop'
            ],
            description: 'Elegant floral summer dress perfect for any occasion.',
            descriptionLong: 'Step into summer with this elegant floral dress featuring a flattering silhouette and vibrant print. Perfect for garden parties, brunches, or casual outings.',
            features: ['Floral print', 'A-line silhouette', 'Midi length', 'Side pockets', 'Breathable fabric'],
            materials: '100% Cotton',
            care: 'Machine wash cold, hang dry',
            variants: {
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: [
                    { name: 'Blue Floral', value: 'blue-floral', hex: '#4A90E2' },
                    { name: 'Pink Floral', value: 'pink-floral', hex: '#FF69B4' }
                ]
            },
            rating: 4.7,
            reviews: 567,
            inStock: true,
            featured: true,
            tags: ['dress', 'summer', 'floral', 'women'],
            relatedProducts: [1, 8, 11]
        },
        {
            id: 8,
            name: 'Kids Colorful Hoodie',
            brand: 'U.S. Polo Assn.',
            price: 39.99,
            originalPrice: 59.99,
            category: 'kids',
            image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=800&fit=crop'
            ],
            description: 'Comfortable and colorful hoodie perfect for active kids.',
            descriptionLong: 'Keep your little ones cozy and stylish with this vibrant hoodie. Made from soft, durable fabric that withstands active play and frequent washing.',
            features: ['Soft fleece lining', 'Kangaroo pocket', 'Adjustable drawstring hood', 'Ribbed cuffs', 'Machine washable'],
            materials: '80% Cotton, 20% Polyester',
            care: 'Machine wash cold, tumble dry low',
            variants: {
                sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
                colors: [
                    { name: 'Blue', value: 'blue', hex: '#0066CC' },
                    { name: 'Red', value: 'red', hex: '#FF3333' },
                    { name: 'Green', value: 'green', hex: '#00CC66' }
                ]
            },
            rating: 4.6,
            reviews: 423,
            inStock: true,
            featured: true,
            tags: ['kids', 'hoodie', 'casual'],
            relatedProducts: [9, 10, 11]
        },
        {
            id: 9,
            name: 'Decorative Throw Pillow Set',
            brand: 'HomeCenter',
            price: 49.99,
            originalPrice: 79.99,
            category: 'home-living',
            image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&h=800&fit=crop'
            ],
            description: 'Set of 4 decorative throw pillows to brighten your living space.',
            descriptionLong: 'Transform your living room or bedroom with this elegant set of throw pillows. Featuring modern geometric patterns and premium fabric, these pillows add comfort and style to any space.',
            features: ['Set of 4 pillows', 'Hidden zipper', 'Removable covers', 'Premium filling', 'Fade-resistant fabric'],
            materials: 'Velvet cover, polyester filling',
            care: 'Machine wash covers in cold water',
            variants: {
                colors: [
                    { name: 'Navy & Gold', value: 'navy-gold', hex: '#001F3F' },
                    { name: 'Grey & White', value: 'grey-white', hex: '#808080' },
                    { name: 'Teal & Beige', value: 'teal-beige', hex: '#008080' }
                ]
            },
            rating: 4.8,
            reviews: 789,
            inStock: true,
            featured: false,
            tags: ['home', 'decor', 'pillows'],
            relatedProducts: [10, 11, 12]
        },
        {
            id: 10,
            name: 'Premium Makeup Palette',
            brand: 'Lakme',
            price: 89.99,
            originalPrice: 129.99,
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop'
            ],
            description: 'Professional-grade eyeshadow palette with 24 stunning shades.',
            descriptionLong: 'Create endless eye looks with this versatile palette featuring 24 highly pigmented shades. From everyday neutrals to bold statement colors, this palette has everything you need for any occasion.',
            features: ['24 shades', 'Highly pigmented', 'Long-lasting', 'Blendable formula', 'Includes mirror'],
            materials: 'Talc-free, cruelty-free formula',
            care: 'Keep in cool, dry place. Close lid after use.',
            rating: 4.9,
            reviews: 912,
            inStock: true,
            featured: true,
            tags: ['makeup', 'beauty', 'eyeshadow'],
            relatedProducts: [11, 12, 1]
        },
        {
            id: 11,
            name: 'Denim Jacket Classic',
            brand: 'Wrangler',
            price: 89.99,
            originalPrice: 149.99,
            category: 'women',
            image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1543076659-9380cdf10613?w=800&h=800&fit=crop'
            ],
            description: 'Timeless denim jacket that pairs perfectly with any outfit.',
            descriptionLong: 'A wardrobe essential that never goes out of style. This classic denim jacket features quality construction and a flattering fit that complements any look, from casual to dressy.',
            features: ['100% cotton denim', 'Button front closure', 'Chest pockets', 'Adjustable button cuffs', 'Vintage wash'],
            materials: '100% Cotton denim',
            care: 'Machine wash cold, tumble dry low',
            variants: {
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: [
                    { name: 'Light Blue', value: 'light-blue', hex: '#ADD8E6' },
                    { name: 'Dark Blue', value: 'dark-blue', hex: '#00008B' },
                    { name: 'Black', value: 'black', hex: '#000000' }
                ]
            },
            rating: 4.7,
            reviews: 345,
            inStock: true,
            featured: false,
            tags: ['denim', 'jacket', 'women', 'casual'],
            relatedProducts: [7, 1, 5]
        },
        {
            id: 12,
            name: 'Luxury Skincare Set',
            brand: 'The Body Shop',
            price: 129.99,
            originalPrice: 199.99,
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop'
            ],
            description: 'Complete skincare routine set with cleanser, toner, serum, and moisturizer.',
            descriptionLong: 'Pamper your skin with this luxury skincare collection. Each product is formulated with premium natural ingredients to cleanse, nourish, and rejuvenate your skin for a radiant glow.',
            features: ['4-step routine', 'Natural ingredients', 'Dermatologist tested', 'Suitable for all skin types', 'Cruelty-free'],
            materials: 'Natural botanical extracts, hyaluronic acid, vitamins C & E',
            care: 'Store in cool, dry place. Use within 12 months of opening.',
            rating: 4.8,
            reviews: 234,
            inStock: true,
            featured: false,
            tags: ['skincare', 'beauty', 'natural'],
            relatedProducts: [10, 7, 11]
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
    sortBy: 'recommended', // recommended, popularity, price-low, price-high, rating, discount, newest
    priceRange: null, // null or {min, max}
    minRating: null, // null or 2, 3, 4
    minDiscount: null, // null or 30, 40, 50, 60, 70

    reset() {
        this.selectedCategory = null;
        this.searchQuery = '';
        this.sortBy = 'recommended';
        this.priceRange = null;
        this.minRating = null;
        this.minDiscount = null;
    },

    clearPriceFilter() {
        this.priceRange = null;
    },

    clearRatingFilter() {
        this.minRating = null;
    },

    clearDiscountFilter() {
        this.minDiscount = null;
    },

    clearAllFilters() {
        this.selectedCategory = null;
        this.priceRange = null;
        this.minRating = null;
        this.minDiscount = null;
    },

    setPriceRange(range) {
        this.priceRange = range;
    },

    setRating(rating) {
        this.minRating = rating;
    },

    setDiscount(discount) {
        this.minDiscount = discount;
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
        if (this.priceRange) {
            filtered = filtered.filter(p => {
                const price = p.price;
                if (this.priceRange.max === null) {
                    return price >= this.priceRange.min;
                }
                return price >= this.priceRange.min && price <= this.priceRange.max;
            });
        }

        // Rating filter
        if (this.minRating) {
            filtered = filtered.filter(p => p.rating >= this.minRating);
        }

        // Discount filter
        if (this.minDiscount) {
            filtered = filtered.filter(p => {
                if (!p.originalPrice) return false;
                const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
                return discount >= this.minDiscount;
            });
        }

        // Sorting
        switch (this.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'discount':
                filtered.sort((a, b) => {
                    const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
                    const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
                    return discountB - discountA;
                });
                break;
            case 'popularity':
            case 'newest':
                // Keep original order or could add date field
                break;
            case 'recommended':
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
