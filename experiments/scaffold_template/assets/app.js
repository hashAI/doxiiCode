/**
 * Main Application Bootstrap
 *
 * This file:
 * - Imports all components and pages
 * - Initializes vendors (AOS, Lucide)
 * - Sets up routing
 * - Handles route change events
 */

import { initAOS, refreshAOS, ensureIcons, initTheme } from './utils.js';
import { setRoutes } from './router.js';

// ============================================================================
// Import Base Component (MUST BE FIRST)
// ============================================================================
import '../components/base-component.js';

// ============================================================================
// Import UI Components
// ============================================================================
import '../components/header.js';
import '../components/footer.js';
import '../components/mobile-menu.js';
import '../components/bottom-nav.js';
import '../components/cart-drawer.js';
import '../components/hero.js';
import '../components/product-card.js';
import '../components/product-grid.js';
import '../components/category-filter.js';
import '../components/newsletter.js';
import '../components/promo-banner.js';
import '../components/filter-bar.js';
import '../components/category-grid.js';

// ============================================================================
// Import Pages
// ============================================================================
import '../pages/page-home.js';
import '../pages/page-catalog.js';
import '../pages/page-product.js';
import '../pages/page-cart.js';
import '../pages/page-checkout.js';
import '../pages/page-about.js';
import '../pages/page-contact.js';

// ============================================================================
// Initialize Vendors
// ============================================================================

function initVendors() {
    // Initialize theme (dark/light mode)
    initTheme();

    // Initialize Lucide icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }

    // Initialize AOS animations
    initAOS();

    console.log('✓ Vendors initialized');
}

// ============================================================================
// Handle Route Changes
// ============================================================================

function onRouteChanged(event) {
    // Refresh icons and animations after route change
    queueMicrotask(() => {
        ensureIcons();
        refreshAOS();

        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Close any open drawers
        document.querySelectorAll('.drawer').forEach(drawer => {
            drawer.classList.remove('open');
        });
        document.body.classList.remove('drawer-open');
    });

    console.log('→ Route changed:', event.detail);
}

// ============================================================================
// Application Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOXII E-commerce Store - Initializing...');

    // Initialize vendors
    initVendors();

    // Setup route change listener
    document.addEventListener('route:changed', onRouteChanged);

    // Configure routes
    setRoutes([
        { path: '/', component: 'page-home' },
        { path: '/catalog', component: 'page-catalog' },
        { path: '/product/:id', component: 'page-product' },
        { path: '/cart', component: 'page-cart' },
        { path: '/checkout', component: 'page-checkout' },
        { path: '/about', component: 'page-about' },
        { path: '/contact', component: 'page-contact' }
    ]);

    console.log('✓ Application ready');
});

// ============================================================================
// Hot Module Replacement (for development)
// ============================================================================

if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.log('🔄 Hot reload triggered');
        window.location.reload();
    });
}
