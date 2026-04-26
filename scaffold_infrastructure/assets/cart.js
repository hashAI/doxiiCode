/**
 * Universal Cart Management System
 *
 * Provides cart operations that every e-commerce store needs:
 * - Add/remove/update items
 * - Calculate totals (subtotal, tax, shipping, discount)
 * - Apply coupons
 * - Persist to localStorage
 * - Cart events for reactive UI updates
 */

import { saveToStorage, loadFromStorage } from './utils.js';

const CART_STORAGE_KEY = 'doxii_cart';
const CART_EVENT = 'cart:updated';

// ============================================================================
// Cart State
// ============================================================================

let cart = {
    items: [],           // Cart items
    appliedCoupon: null, // Applied coupon code
    shippingMethod: null // Selected shipping method
};

// ============================================================================
// Initialize Cart
// ============================================================================

export function initCart() {
    // Load cart from localStorage
    const savedCart = loadFromStorage(CART_STORAGE_KEY);
    if (savedCart) {
        cart = {
            items: savedCart.items || [],
            appliedCoupon: savedCart.appliedCoupon || null,
            shippingMethod: savedCart.shippingMethod || null
        };
    }
    return cart;
}

// ============================================================================
// Cart Operations
// ============================================================================

export function addToCart(product, quantity = 1, variant = null) {
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item =>
        item.id === product.id &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex >= 0) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            image: product.image,
            variant: variant,
            quantity: quantity,
            addedAt: Date.now()
        });
    }

    persistCart();
    dispatchCartEvent('item_added', { product, quantity });
    return cart;
}

export function removeFromCart(itemId, variant = null) {
    const initialLength = cart.items.length;

    cart.items = cart.items.filter(item => {
        if (variant) {
            return !(item.id === itemId && JSON.stringify(item.variant) === JSON.stringify(variant));
        }
        return item.id !== itemId;
    });

    if (cart.items.length !== initialLength) {
        persistCart();
        dispatchCartEvent('item_removed', { itemId, variant });
    }

    return cart;
}

export function updateCartItemQuantity(itemId, quantity, variant = null) {
    const item = cart.items.find(item =>
        item.id === itemId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(itemId, variant);
        }

        item.quantity = quantity;
        persistCart();
        dispatchCartEvent('quantity_updated', { itemId, quantity, variant });
    }

    return cart;
}

export function clearCart() {
    cart.items = [];
    cart.appliedCoupon = null;
    persistCart();
    dispatchCartEvent('cart_cleared');
    return cart;
}

export function getCart() {
    return { ...cart, items: [...cart.items] };
}

export function getCartItemCount() {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartItem(itemId, variant = null) {
    return cart.items.find(item =>
        item.id === itemId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
}

export function isInCart(itemId, variant = null) {
    return cart.items.some(item =>
        item.id === itemId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
}

// ============================================================================
// Cart Calculations
// ============================================================================

export function calculateSubtotal() {
    return cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

export function calculateDiscount(coupons = []) {
    const subtotal = calculateSubtotal();
    const coupon = cart.appliedCoupon
        ? coupons.find(c => c.code === cart.appliedCoupon)
        : null;

    if (!coupon) return 0;

    if (coupon.type === 'percentage') {
        return (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
        return Math.min(coupon.value, subtotal);
    }

    return 0;
}

export function calculateTax(taxRate = 0.08) {
    const subtotal = calculateSubtotal();
    return subtotal * taxRate;
}

export function calculateShipping(shippingMethods = []) {
    const method = cart.shippingMethod
        ? shippingMethods.find(m => m.id === cart.shippingMethod)
        : null;

    return method ? method.price : 0;
}

export function calculateTotal(options = {}) {
    const {
        taxRate = 0.08,
        coupons = [],
        shippingMethods = []
    } = options;

    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(coupons);
    const tax = calculateTax(taxRate);
    const shipping = calculateShipping(shippingMethods);

    return {
        subtotal,
        discount,
        tax,
        shipping,
        total: subtotal - discount + tax + shipping
    };
}

// ============================================================================
// Coupon Management
// ============================================================================

export function applyCoupon(couponCode, availableCoupons = []) {
    const coupon = availableCoupons.find(c =>
        c.code.toLowerCase() === couponCode.toLowerCase() &&
        c.active === true
    );

    if (!coupon) {
        return { success: false, error: 'Invalid coupon code' };
    }

    // Check minimum purchase requirement
    const subtotal = calculateSubtotal();
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        return {
            success: false,
            error: `Minimum purchase of $${coupon.minPurchase} required`
        };
    }

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return { success: false, error: 'Coupon has expired' };
    }

    cart.appliedCoupon = coupon.code;
    persistCart();
    dispatchCartEvent('coupon_applied', { coupon });

    return { success: true, coupon };
}

export function removeCoupon() {
    const removedCoupon = cart.appliedCoupon;
    cart.appliedCoupon = null;
    persistCart();
    dispatchCartEvent('coupon_removed', { coupon: removedCoupon });
    return cart;
}

export function getAppliedCoupon() {
    return cart.appliedCoupon;
}

// ============================================================================
// Shipping Management
// ============================================================================

export function setShippingMethod(methodId) {
    cart.shippingMethod = methodId;
    persistCart();
    dispatchCartEvent('shipping_updated', { methodId });
    return cart;
}

export function getShippingMethod() {
    return cart.shippingMethod;
}

// ============================================================================
// Persistence
// ============================================================================

function persistCart() {
    saveToStorage(CART_STORAGE_KEY, cart);
}

// ============================================================================
// Events
// ============================================================================

function dispatchCartEvent(action, data = {}) {
    window.dispatchEvent(new CustomEvent(CART_EVENT, {
        detail: {
            action,
            cart: getCart(),
            ...data
        }
    }));
}

export function onCartUpdate(callback) {
    const handler = (event) => callback(event.detail);
    window.addEventListener(CART_EVENT, handler);
    return () => window.removeEventListener(CART_EVENT, handler);
}

// ============================================================================
// Validation
// ============================================================================

export function validateCart(products = []) {
    const issues = [];

    cart.items.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) {
            issues.push({
                type: 'product_not_found',
                itemId: item.id,
                message: `Product ${item.name} no longer available`
            });
        } else if (!product.inStock) {
            issues.push({
                type: 'out_of_stock',
                itemId: item.id,
                message: `${item.name} is out of stock`
            });
        } else if (product.price !== item.price) {
            issues.push({
                type: 'price_changed',
                itemId: item.id,
                oldPrice: item.price,
                newPrice: product.price,
                message: `Price of ${item.name} has changed`
            });
        }
    });

    return {
        valid: issues.length === 0,
        issues
    };
}

// ============================================================================
// Bulk Operations
// ============================================================================

export function mergeCarts(serverCart) {
    // Merge server cart with local cart (useful after login)
    if (!serverCart || !serverCart.items) return cart;

    serverCart.items.forEach(serverItem => {
        const existingItem = cart.items.find(item =>
            item.id === serverItem.id &&
            JSON.stringify(item.variant) === JSON.stringify(serverItem.variant)
        );

        if (existingItem) {
            existingItem.quantity += serverItem.quantity;
        } else {
            cart.items.push(serverItem);
        }
    });

    persistCart();
    dispatchCartEvent('cart_merged');
    return cart;
}

export function exportCart() {
    return JSON.stringify(cart);
}

export function importCart(cartJson) {
    try {
        const imported = JSON.parse(cartJson);
        cart = {
            items: imported.items || [],
            appliedCoupon: imported.appliedCoupon || null,
            shippingMethod: imported.shippingMethod || null
        };
        persistCart();
        dispatchCartEvent('cart_imported');
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// ============================================================================
// Initialize on import
// ============================================================================

initCart();
