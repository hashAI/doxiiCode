import '../product-detail-elite.js';

// Preview configuration
export default {
    title: 'Product Detail Elite',
    component: 'product-detail-elite',
    description: 'Elegant product detail page with expandable accordion sections, perfect for furniture and home decor',

    // Event handlers for preview
    setupEventListeners: (container) => {
        const component = container.querySelector('product-detail-elite');

        if (component) {
            component.addEventListener('product:add-to-cart', (e) => {
                console.log('Add to cart:', e.detail);
                alert(`Added to cart!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nQuantity: ${e.detail.quantity}`);
            });

            component.addEventListener('product:buy-now', (e) => {
                console.log('Buy now:', e.detail);
                alert(`Proceeding to checkout!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nQuantity: ${e.detail.quantity}`);
            });

            component.addEventListener('product:color-change', (e) => {
                console.log('Color changed:', e.detail);
            });
        }
    },

    // Default configuration
    defaultConfig: {},

    // Available configurations for preview controls
    configurations: []
};
