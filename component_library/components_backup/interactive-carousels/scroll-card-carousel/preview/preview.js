import '../scroll-card-carousel.js';

/**
 * Scroll Card Carousel - Interactive Preview
 * Demonstrates scroll-based card stacking with seamless looping
 */

export const previewConfig = {
    setup: (element) => {
        // Dependencies are auto-loaded by the component itself
        console.log('Scroll Card Carousel - Preview loaded');

        // Set default theme
        element.theme = 'dark';

        // Example: Customize cards with product data
        element.cards = [
            {
                id: 1,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=800&fit=crop&q=80',
                title: 'Premium Red Sneakers',
                price: '$189.99',
                category: 'Footwear'
            },
            {
                id: 2,
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=800&fit=crop&q=80',
                title: 'Classic White Sneakers',
                price: '$159.99',
                category: 'Footwear'
            },
            {
                id: 3,
                image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=800&fit=crop&q=80',
                title: 'Ocean Blue Runners',
                price: '$199.99',
                category: 'Footwear'
            },
            {
                id: 4,
                image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=800&fit=crop&q=80',
                title: 'Midnight Black Sneakers',
                price: '$179.99',
                category: 'Footwear'
            },
            {
                id: 5,
                image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&h=800&fit=crop&q=80',
                title: 'Forest Green Kicks',
                price: '$169.99',
                category: 'Footwear'
            },
            {
                id: 6,
                image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=800&fit=crop&q=80',
                title: 'Luxury Leather Shoes',
                price: '$249.99',
                category: 'Formal'
            },
            {
                id: 7,
                image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=800&fit=crop&q=80',
                title: 'Sunset Orange Sneakers',
                price: '$174.99',
                category: 'Footwear'
            }
        ];

        // Handle card click events
        element.addEventListener('card-click', (e) => {
            console.log('Card clicked:', e.detail.card);
            const card = e.detail.card;
            alert(`✨ ${card.title}\n💰 ${card.price || 'Price not available'}\n📦 ${card.category || 'Uncategorized'}`);
        });
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Scroll Card Carousel - Interactive Product Stack
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                A dynamic scroll-based card carousel with seamless looping animations powered by GSAP.
                Features drag-to-navigate, scroll interactions, and smooth card stacking effects.
                Perfect for showcasing products, portfolios, or featured collections in an engaging way.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>GSAP-powered card animations</li>
                        <li>Scroll-based navigation with seamless looping</li>
                        <li>Drag-to-browse functionality (mobile-friendly)</li>
                        <li>Prev/Next button controls</li>
                        <li>Smooth card stacking effects</li>
                        <li>Auto-snapping to cards</li>
                        <li>Configurable card data</li>
                        <li>Click event handling</li>
                        <li>Fully responsive design</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Product showcases</li>
                        <li>Fashion catalogs</li>
                        <li>Shoe collections</li>
                        <li>Portfolio galleries</li>
                        <li>Featured items</li>
                        <li>New arrivals</li>
                        <li>Trending products</li>
                        <li>Interactive lookbooks</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎮 Interaction Methods:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">🖱️ Scroll</div>
                        <div class="text-xs">Use mouse wheel or trackpad to navigate through cards</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">👆 Drag</div>
                        <div class="text-xs">Click and drag on cards to swipe through them</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">⬅️ ➡️ Buttons</div>
                        <div class="text-xs">Use prev/next buttons for precise navigation</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎨 Animation Highlights:</h4>
                <div class="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="flex items-start gap-2">
                        <span class="text-lg">🌀</span>
                        <div>
                            <strong>Seamless Looping:</strong> Cards loop infinitely in both directions without visible seams
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="text-lg">📐</span>
                        <div>
                            <strong>Scale & Opacity:</strong> Cards smoothly scale and fade as they move through the stack
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="text-lg">🎯</span>
                        <div>
                            <strong>Auto-Snap:</strong> Cards automatically snap to center position when scrolling stops
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📝 Technical Details:</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm">
                    Built with Lit web components for maximum reusability. Uses GSAP 3.12+ with ScrollTrigger
                    and Draggable plugins for smooth interactions. The seamless loop algorithm creates extra
                    animations at both ends for infinite scrolling. All styles are scoped within Shadow DOM.
                    Cards array can be easily customized via component properties.
                </p>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">⚙️ Customization:</h4>
                <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>const carousel = document.querySelector('scroll-card-carousel');

// Customize cards
carousel.cards = [
  { id: 1, image: 'path/to/image.jpg', title: 'Product Name' },
  { id: 2, image: 'path/to/image2.jpg', title: 'Product Name 2' },
  // ... more cards
];

// Listen for card clicks
carousel.addEventListener('card-click', (e) => {
  console.log('Clicked card:', e.detail.card);
  // Navigate to product page, show details, etc.
});</pre>
                </div>
            </div>

            <div class="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <p class="text-sm text-gray-800 dark:text-gray-200 mb-3">
                    <strong>💡 Try it:</strong> Scroll with your mouse wheel, drag the cards with your cursor,
                    or use the Prev/Next buttons. Click on any card to see product details.
                    The carousel automatically handles infinite looping in both directions!
                </p>
                <div class="flex items-center gap-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme:</span>
                    <button
                        id="theme-toggle-dark"
                        class="px-3 py-1.5 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                        onclick="document.querySelector('scroll-card-carousel').theme = 'dark'"
                    >
                        🌙 Dark
                    </button>
                    <button
                        id="theme-toggle-light"
                        class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
                        onclick="document.querySelector('scroll-card-carousel').theme = 'light'"
                    >
                        ☀️ Light
                    </button>
                </div>
            </div>
        </div>
    `,

    notes: 'Scroll-based navigation with seamless looping. Try scrolling, dragging, or using buttons. Toggle between dark/light themes. GSAP libraries load automatically.'
};

export default previewConfig;
