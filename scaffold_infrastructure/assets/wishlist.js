/* eslint-disable no-undef */
/* global btoa, atob */
/**
 * Universal Wishlist/Favorites Management System
 *
 * Provides wishlist operations for e-commerce stores:
 * - Add/remove items from wishlist
 * - Check if item is in wishlist
 * - Persist to localStorage
 * - Move items to cart
 * - Wishlist events for reactive UI
 */

import { saveToStorage, loadFromStorage } from './utils.js';
import { addToCart } from './cart.js';

const WISHLIST_STORAGE_KEY = 'doxii_wishlist';
const WISHLIST_EVENT = 'wishlist:updated';

// ============================================================================
// Wishlist State
// ============================================================================

let wishlist = {
    items: []
};

// ============================================================================
// Initialize Wishlist
// ============================================================================

export function initWishlist() {
    const saved = loadFromStorage(WISHLIST_STORAGE_KEY);
    if (saved && saved.items) {
        wishlist.items = saved.items;
    }
    return wishlist;
}

// ============================================================================
// Wishlist Operations
// ============================================================================

export function addToWishlist(product) {
    // Check if already in wishlist
    if (isInWishlist(product.id)) {
        return { success: false, message: 'Already in wishlist' };
    }

    wishlist.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        category: product.category,
        inStock: product.inStock !== false,
        addedAt: Date.now()
    });

    persistWishlist();
    dispatchWishlistEvent('item_added', { product });

    return { success: true, message: 'Added to wishlist' };
}

export function removeFromWishlist(productId) {
    const initialLength = wishlist.items.length;

    wishlist.items = wishlist.items.filter(item => item.id !== productId);

    if (wishlist.items.length !== initialLength) {
        persistWishlist();
        dispatchWishlistEvent('item_removed', { productId });
        return { success: true, message: 'Removed from wishlist' };
    }

    return { success: false, message: 'Item not in wishlist' };
}

export function toggleWishlist(product) {
    if (isInWishlist(product.id)) {
        return removeFromWishlist(product.id);
    } else {
        return addToWishlist(product);
    }
}

export function clearWishlist() {
    wishlist.items = [];
    persistWishlist();
    dispatchWishlistEvent('wishlist_cleared');
    return wishlist;
}

export function getWishlist() {
    return { ...wishlist, items: [...wishlist.items] };
}

export function getWishlistItems() {
    return [...wishlist.items];
}

export function getWishlistCount() {
    return wishlist.items.length;
}

export function isInWishlist(productId) {
    return wishlist.items.some(item => item.id === productId);
}

export function getWishlistItem(productId) {
    return wishlist.items.find(item => item.id === productId);
}

// ============================================================================
// Move to Cart
// ============================================================================

export function moveToCart(productId, quantity = 1) {
    const item = getWishlistItem(productId);

    if (!item) {
        return { success: false, error: 'Item not in wishlist' };
    }

    // Add to cart
    addToCart(item, quantity);

    // Remove from wishlist
    removeFromWishlist(productId);

    dispatchWishlistEvent('moved_to_cart', { productId, quantity });

    return { success: true, message: 'Moved to cart' };
}

export function moveAllToCart() {
    const itemIds = wishlist.items.map(item => item.id);

    wishlist.items.forEach(item => {
        addToCart(item, 1);
    });

    clearWishlist();
    dispatchWishlistEvent('all_moved_to_cart', { itemIds });

    return { success: true, message: `Moved ${itemIds.length} items to cart` };
}

// ============================================================================
// Filtering & Sorting
// ============================================================================

export function getWishlistByCategory(category) {
    return wishlist.items.filter(item => item.category === category);
}

export function getInStockWishlistItems() {
    return wishlist.items.filter(item => item.inStock);
}

export function getOutOfStockWishlistItems() {
    return wishlist.items.filter(item => !item.inStock);
}

export function sortWishlist(sortBy = 'addedAt', order = 'desc') {
    const sorted = [...wishlist.items];

    sorted.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle different types
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    return sorted;
}

// ============================================================================
// Price Tracking
// ============================================================================

export function updatePrices(products = []) {
    // Update wishlist items with current prices from product list
    const updates = [];

    wishlist.items.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (product) {
            const priceChanged = product.price !== item.price;
            const stockChanged = product.inStock !== item.inStock;

            if (priceChanged || stockChanged) {
                item.price = product.price;
                item.inStock = product.inStock !== false;

                updates.push({
                    id: item.id,
                    priceChanged,
                    stockChanged,
                    oldPrice: item.price,
                    newPrice: product.price
                });
            }
        }
    });

    if (updates.length > 0) {
        persistWishlist();
        dispatchWishlistEvent('prices_updated', { updates });
    }

    return updates;
}

export function getPriceDropItems() {
    // Return items where current price < originalPrice
    return wishlist.items.filter(item => item.price < item.originalPrice);
}

// ============================================================================
// Statistics
// ============================================================================

export function getWishlistStats() {
    const items = wishlist.items;

    return {
        totalItems: items.length,
        inStock: items.filter(i => i.inStock).length,
        outOfStock: items.filter(i => !i.inStock).length,
        totalValue: items.reduce((sum, item) => sum + item.price, 0),
        priceDrops: getPriceDropItems().length,
        categories: [...new Set(items.map(i => i.category))],
        oldestItem: items.reduce((oldest, item) =>
            !oldest || item.addedAt < oldest.addedAt ? item : oldest
        , null),
        newestItem: items.reduce((newest, item) =>
            !newest || item.addedAt > newest.addedAt ? item : newest
        , null)
    };
}

// ============================================================================
// Sharing
// ============================================================================

export function exportWishlist() {
    return JSON.stringify(wishlist);
}

export function importWishlist(wishlistJson) {
    try {
        const imported = JSON.parse(wishlistJson);
        wishlist.items = imported.items || [];
        persistWishlist();
        dispatchWishlistEvent('wishlist_imported');
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

export function getWishlistShareUrl() {
    // Generate shareable URL with wishlist data
    const encoded = btoa(JSON.stringify(wishlist.items.map(i => i.id)));
    return `${window.location.origin}${window.location.pathname}#/wishlist/shared/${encoded}`;
}

export function loadSharedWishlist(encodedData) {
    try {
        const productIds = JSON.parse(atob(encodedData));
        return productIds;
    } catch (e) {
        return [];
    }
}

// ============================================================================
// Persistence
// ============================================================================

function persistWishlist() {
    saveToStorage(WISHLIST_STORAGE_KEY, wishlist);
}

// ============================================================================
// Events
// ============================================================================

function dispatchWishlistEvent(action, data = {}) {
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, {
        detail: {
            action,
            wishlist: getWishlist(),
            ...data
        }
    }));
}

export function onWishlistUpdate(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener(WISHLIST_EVENT, handler);
    return () => window.removeEventListener(WISHLIST_EVENT, handler);
}

// ============================================================================
// Bulk Operations
// ============================================================================

export function mergeWishlist(serverWishlist) {
    // Merge server wishlist with local wishlist (useful after login)
    if (!serverWishlist || !serverWishlist.items) return wishlist;

    serverWishlist.items.forEach(serverItem => {
        if (!isInWishlist(serverItem.id)) {
            wishlist.items.push(serverItem);
        }
    });

    persistWishlist();
    dispatchWishlistEvent('wishlist_merged');
    return wishlist;
}

// ============================================================================
// Initialize on import
// ============================================================================

initWishlist();
