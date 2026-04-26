import '../product-detail-minimal.js';

// Preview configuration
export default {
    title: 'Product Detail Minimal',
    component: 'product-detail-minimal',
    description: 'Clean and minimal product page with elegant typography and pill-style selectors, perfect for luxury and watch brands',

    // Event handlers for preview
    setupEventListeners: (container) => {
        const component = container.querySelector('product-detail-minimal');

        if (component) {
            component.addEventListener('product:add-to-cart', (e) => {
                console.log('Add to cart:', e.detail);
                alert(`Added to cart!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nSize: ${e.detail.size}`);
            });

            component.addEventListener('product:wishlist', (e) => {
                console.log('Wishlist toggled:', e.detail);
            });
        }
    },

    // Default configuration
    defaultConfig: {},

    // Available configurations for preview controls
    configurations: []
};
