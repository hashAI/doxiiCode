import '../product-detail-sports.js';

// Preview configuration
export default {
    title: 'Product Detail Sports',
    component: 'product-detail-sports',
    description: 'Image-heavy product page with vertical thumbnail gallery and shipping calculator, ideal for sports and outdoor equipment',

    // Event handlers for preview
    setupEventListeners: (container) => {
        const component = container.querySelector('product-detail-sports');

        if (component) {
            component.addEventListener('product:add-to-cart', (e) => {
                console.log('Add to cart:', e.detail);
                alert(`Added to cart!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nSize: ${e.detail.size}\nQuantity: ${e.detail.quantity}`);
            });

            component.addEventListener('product:buy-now', (e) => {
                console.log('Buy now:', e.detail);
                alert(`Proceeding to checkout!\nProduct: ${e.detail.product.name}\nColor: ${e.detail.color}\nSize: ${e.detail.size}\nQuantity: ${e.detail.quantity}`);
            });

            component.addEventListener('product:save', (e) => {
                console.log('Save toggled:', e.detail);
            });
        }
    },

    // Default configuration
    defaultConfig: {},

    // Available configurations for preview controls
    configurations: []
};
