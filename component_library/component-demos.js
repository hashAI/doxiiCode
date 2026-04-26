/**
 * Component Demo Configurations
 * 
 * This file provides demo setups for components that need:
 * - Sample data
 * - Initial state (e.g., drawers open, modals visible)
 * - Mock state/router
 */

export const componentDemos = {
    // Cart Components - Show open by default
    'cart-drawer': {
        setup: (element) => {
            // Mock cart store
            window.cartStore = {
                state: {
                    items: [
                        { id: '1', name: 'Premium Headphones', price: 299.99, quantity: 1, image: 'https://placehold.co/100x100' },
                        { id: '2', name: 'Wireless Mouse', price: 49.99, quantity: 2, image: 'https://placehold.co/100x100' }
                    ],
                    count: 3,
                    total: 399.97
                },
                subscribe: (callback) => {
                    callback(window.cartStore.state);
                    return () => {};
                },
                getState: () => window.cartStore.state,
                getCount: () => window.cartStore.state.count
            };
            
            // Set open immediately
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-screen'
    },
    
    'cart-modal': {
        setup: (element) => {
            window.cartStore = {
                state: {
                    items: [
                        { id: '1', name: 'Premium Headphones', price: 299.99, quantity: 1, image: 'https://placehold.co/100x100' },
                        { id: '2', name: 'Wireless Mouse', price: 49.99, quantity: 2, image: 'https://placehold.co/100x100' }
                    ],
                    count: 3,
                    total: 399.97
                },
                subscribe: (callback) => {
                    callback(window.cartStore.state);
                    return () => {};
                },
                getState: () => window.cartStore.state,
                getCount: () => window.cartStore.state.count
            };
            
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-screen'
    },
    
    'cart-dropdown': {
        setup: (element) => {
            window.cartStore = {
                state: {
                    items: [
                        { id: '1', name: 'Premium Headphones', price: 299.99, quantity: 1, image: 'https://placehold.co/100x100' }
                    ],
                    count: 1,
                    total: 299.99
                },
                subscribe: (callback) => {
                    callback(window.cartStore.state);
                    return () => {};
                },
                getState: () => window.cartStore.state,
                getCount: () => window.cartStore.state.count
            };
            
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-96'
    },
    
    // Mobile Menu Components - Show open by default
    'mobile-menu-drawer': {
        setup: (element) => {
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-screen'
    },
    
    'mobile-menu-fullscreen': {
        setup: (element) => {
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-screen'
    },
    
    'mobile-menu-bottom': {
        setup: (element) => {
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-screen'
    },
    
    // Filter Components - Show open state
    'filter-drawer': {
        setup: (element) => {
            setTimeout(() => {
                element.setAttribute('data-open', 'true');
                if (element.open) element.open();
            }, 100);
        },
        wrapperClass: 'relative h-screen'
    },
    
    'filter-sidebar': {
        wrapperClass: 'relative min-h-screen'
    },
    
    'filter-horizontal': {
        wrapperClass: 'relative'
    },
    
    // Product Cards - Need product data
    'product-card-standard': {
        setup: (element) => {
            const sampleProduct = {
                id: '1',
                name: 'Premium Wireless Headphones',
                price: 299.99,
                originalPrice: 399.99,
                rating: 4.5,
                reviews: 128,
                image: 'https://placehold.co/400x400/4F46E5/FFFFFF?text=Product',
                inStock: true
            };
            element.setAttribute('data-product', JSON.stringify(sampleProduct));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'product-card-overlay': {
        setup: (element) => {
            const sampleProduct = {
                id: '2',
                name: 'Smart Watch Ultra',
                price: 499.99,
                rating: 4.8,
                reviews: 256,
                image: 'https://placehold.co/400x400/06B6D4/FFFFFF?text=Watch',
                inStock: true
            };
            element.setAttribute('data-product', JSON.stringify(sampleProduct));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'product-card-horizontal': {
        setup: (element) => {
            const sampleProduct = {
                id: '3',
                name: 'Premium Laptop Backpack',
                price: 89.99,
                rating: 4.6,
                reviews: 89,
                image: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=Backpack',
                description: 'Durable, water-resistant backpack with padded laptop compartment',
                features: ['Water resistant', 'Padded laptop sleeve', 'USB charging port'],
                inStock: true
            };
            element.setAttribute('data-product', JSON.stringify(sampleProduct));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    // Product Grids - Need product array
    'product-grid-standard': {
        setup: (element) => {
            const products = [
                { id: '1', name: 'Product 1', price: 99.99, image: 'https://placehold.co/300x300/4F46E5/FFFFFF?text=1', rating: 4.5, inStock: true },
                { id: '2', name: 'Product 2', price: 149.99, image: 'https://placehold.co/300x300/06B6D4/FFFFFF?text=2', rating: 4.2, inStock: true },
                { id: '3', name: 'Product 3', price: 199.99, image: 'https://placehold.co/300x300/8B5CF6/FFFFFF?text=3', rating: 4.8, inStock: true },
                { id: '4', name: 'Product 4', price: 79.99, image: 'https://placehold.co/300x300/EC4899/FFFFFF?text=4', rating: 4.3, inStock: true }
            ];
            element.setAttribute('data-products', JSON.stringify(products));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'product-grid-masonry': {
        setup: (element) => {
            const products = [
                { id: '1', name: 'Product 1', price: 99.99, image: 'https://placehold.co/300x400/4F46E5/FFFFFF?text=1', rating: 4.5, inStock: true },
                { id: '2', name: 'Product 2', price: 149.99, image: 'https://placehold.co/300x350/06B6D4/FFFFFF?text=2', rating: 4.2, inStock: true },
                { id: '3', name: 'Product 3', price: 199.99, image: 'https://placehold.co/300x450/8B5CF6/FFFFFF?text=3', rating: 4.8, inStock: true }
            ];
            element.setAttribute('data-products', JSON.stringify(products));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'product-grid-list': {
        setup: (element) => {
            const products = [
                { id: '1', name: 'Premium Product', price: 299.99, image: 'https://placehold.co/300x300/4F46E5/FFFFFF?text=Premium', description: 'High quality product', rating: 4.7, inStock: true },
                { id: '2', name: 'Standard Product', price: 149.99, image: 'https://placehold.co/300x300/06B6D4/FFFFFF?text=Standard', description: 'Great value', rating: 4.3, inStock: true }
            ];
            element.setAttribute('data-products', JSON.stringify(products));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    // Product Galleries
    'gallery-thumbnail-side': {
        setup: (element) => {
            const images = [
                'https://placehold.co/600x600/4F46E5/FFFFFF?text=Image+1',
                'https://placehold.co/600x600/06B6D4/FFFFFF?text=Image+2',
                'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Image+3',
                'https://placehold.co/600x600/EC4899/FFFFFF?text=Image+4'
            ];
            element.setAttribute('data-images', JSON.stringify(images));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'gallery-thumbnail-bottom': {
        setup: (element) => {
            const images = [
                'https://placehold.co/600x600/4F46E5/FFFFFF?text=Image+1',
                'https://placehold.co/600x600/06B6D4/FFFFFF?text=Image+2',
                'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Image+3'
            ];
            element.setAttribute('data-images', JSON.stringify(images));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'gallery-dots': {
        setup: (element) => {
            const images = [
                'https://placehold.co/600x600/4F46E5/FFFFFF?text=Image+1',
                'https://placehold.co/600x600/06B6D4/FFFFFF?text=Image+2',
                'https://placehold.co/600x600/8B5CF6/FFFFFF?text=Image+3'
            ];
            element.setAttribute('data-images', JSON.stringify(images));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    // Category Displays
    'category-grid-images': {
        setup: (element) => {
            const categories = [
                { name: 'Electronics', image: 'https://placehold.co/400x400/4F46E5/FFFFFF?text=Electronics', count: 124 },
                { name: 'Fashion', image: 'https://placehold.co/400x400/EC4899/FFFFFF?text=Fashion', count: 89 },
                { name: 'Home', image: 'https://placehold.co/400x400/06B6D4/FFFFFF?text=Home', count: 56 },
                { name: 'Sports', image: 'https://placehold.co/400x400/8B5CF6/FFFFFF?text=Sports', count: 42 }
            ];
            element.setAttribute('data-categories', JSON.stringify(categories));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    'category-banner': {
        setup: (element) => {
            const categories = [
                { name: 'Summer Sale', image: 'https://placehold.co/1200x400/4F46E5/FFFFFF?text=Summer+Sale', description: 'Up to 50% off' },
                { name: 'New Arrivals', image: 'https://placehold.co/1200x400/EC4899/FFFFFF?text=New+Arrivals', description: 'Fresh styles' }
            ];
            element.setAttribute('data-categories', JSON.stringify(categories));
        },
        wrapperClass: 'bg-gray-50 dark:bg-gray-900'
    },
    
    'category-icons': {
        setup: (element) => {
            const categories = [
                { name: 'Electronics', icon: 'smartphone', count: 124 },
                { name: 'Fashion', icon: 'shirt', count: 89 },
                { name: 'Home', icon: 'home', count: 56 },
                { name: 'Sports', icon: 'dumbbell', count: 42 }
            ];
            element.setAttribute('data-categories', JSON.stringify(categories));
        },
        wrapperClass: 'p-8 bg-gray-50 dark:bg-gray-900'
    },
    
    // Headers - Full width
    'header-classic': {
        setup: (element) => {
            element.setAttribute('data-logo-text', 'DOXII');
            element.setAttribute('data-show-search', 'true');
        },
        wrapperClass: ''
    },
    
    'header-mega-menu': {
        setup: (element) => {
            element.setAttribute('data-logo-text', 'DOXII');
        },
        wrapperClass: ''
    },
    
    'header-minimal': {
        setup: (element) => {
            element.setAttribute('data-logo-text', 'DOXII');
        },
        wrapperClass: ''
    },
    
    // Footers - Full width
    'footer-multi-column': {
        setup: (element) => {
            element.setAttribute('data-brand-name', 'DOXII');
            element.setAttribute('data-show-newsletter', 'true');
        },
        wrapperClass: ''
    },
    
    'footer-minimal': {
        setup: (element) => {
            element.setAttribute('data-brand-name', 'DOXII');
        },
        wrapperClass: ''
    },
    
    'footer-newsletter': {
        setup: (element) => {
            element.setAttribute('data-brand-name', 'DOXII');
        },
        wrapperClass: ''
    },
    
    // Default for other components
    default: {
        wrapperClass: 'p-8'
    }
};



