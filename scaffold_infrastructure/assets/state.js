/**
 * Global State Management Template
 *
 * This file provides state management patterns for e-commerce stores.
 * Developers should customize this for their specific business needs.
 *
 * Key features:
 * - Product catalog with search and filtering
 * - Shopping cart with localStorage persistence
 * - User preferences
 * - Reactive subscription pattern for state updates
 */

import { saveToStorage, loadFromStorage } from './utils.js';

// ============================================================================
// Product Catalog State
// ============================================================================

/**
 * Products Store
 *
 * CUSTOMIZE THIS: Replace with your actual products and business-specific fields
 *
 * Required fields: id, name, price, category, image, description, rating, reviews, inStock
 * Optional fields: originalPrice, descriptionLong, images, features, brand, tags, etc.
 *
 * Add business-specific fields as needed:
 * - Jewelry: metal, gemstone, caratWeight, certification
 * - Books: author, genre, pages, publisher, isbn
 * - Electronics: brand, model, specs, warranty
 * - Furniture: material, dimensions, weight, assemblyRequired
 */
export const productsStore = {
    products: [], // REPLACE THIS WITH YOUR PRODUCTS ARRAY

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
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    },

    getCategories() {
        return [...new Set(this.products.map(p => p.category))];
    }
};

// ============================================================================
// Shopping Cart State with Persistence
// ============================================================================

/**
 * Shopping Cart with localStorage persistence and reactive updates
 */
class CartStore {
    constructor() {
        this.items = loadFromStorage('cart', []);
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        // Return unsubscribe function
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
