import '../product-detail-fashion.js';

// Preview configuration
export default {
    title: 'Product Detail Fashion',
    component: 'product-detail-fashion',
    description: 'Fashion-focused product page with comprehensive reviews, tabs, and rating distribution',

    // Event handlers for preview
    setupEventListeners: (container) => {
        const component = container.querySelector('product-detail-fashion');

        if (component) {
            component.addEventListener('product:add-to-cart', (e) => {
                console.log('Add to cart:', e.detail);
                alert(`Added to cart!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nSize: ${e.detail.size}`);
            });

            component.addEventListener('product:buy-item', (e) => {
                console.log('Buy item:', e.detail);
                alert(`Buying now!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nSize: ${e.detail.size}`);
            });

            component.addEventListener('product:wishlist', (e) => {
                console.log('Wishlist toggled:', e.detail);
            });

            component.addEventListener('product:share', (e) => {
                console.log('Share product:', e.detail);
                alert('Share functionality triggered!');
            });
        }
    },

    // Default configuration
    defaultConfig: {},

    // Available configurations for preview controls
    configurations: []
};
