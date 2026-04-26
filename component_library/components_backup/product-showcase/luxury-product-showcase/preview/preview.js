import '../luxury-product-showcase.js';

/**
 * Luxury Product Showcase - Interactive Preview
 * Demonstrates smooth scrolling product gallery with GSAP animations
 */

export const previewConfig = {
    setup: (element) => {
        // Dependencies are auto-loaded by the component itself
        console.log('Luxury Product Showcase - Preview loaded');

        // Create wrapper with header and footer
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'min-height: 100vh; background: #f8f8f8;';

        // Create header
        const header = document.createElement('header');
        header.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem 3rem;
            background: rgba(248, 248, 248, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            font-family: 'Playfair Display', Georgia, serif;
        `;
        header.innerHTML = `
            <div style="font-size: 1.75rem; letter-spacing: 0.1em; font-weight: 500;">LUXE</div>
            <nav style="display: flex; gap: 2.5rem;">
                <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem; font-family: Inter, sans-serif;">Shop</a>
                <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem; font-family: Inter, sans-serif;">Collections</a>
                <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem; font-family: Inter, sans-serif;">About</a>
            </nav>
            <div style="display: flex; gap: 1.5rem; align-items: center; font-family: Inter, sans-serif;">
                <button style="background: none; border: none; cursor: pointer; padding: 0.5rem;">🔍</button>
                <button style="background: none; border: none; cursor: pointer; padding: 0.5rem; position: relative;">
                    🛒
                    <span style="position: absolute; top: 0; right: 0; background: #1a1a1a; color: white; font-size: 0.7rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">3</span>
                </button>
            </div>
        `;

        // Create intro section
        const intro = document.createElement('section');
        intro.style.cssText = `
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 8rem 3rem 4rem;
            background: linear-gradient(135deg, #f5f1ed 0%, #e8dfd5 100%);
            overflow: hidden;
        `;
        intro.innerHTML = `
            <div style="position: relative; z-index: 2; max-width: 600px;">
                <h1 style="font-family: 'Playfair Display', serif; font-size: clamp(3rem, 10vw, 7rem); line-height: 1.1; margin-bottom: 2rem;">Timeless Elegance</h1>
                <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2.5rem; color: rgba(26, 26, 26, 0.8); max-width: 500px;">Discover our curated collection of premium products that blend artisanal craftsmanship with contemporary design.</p>
                <button style="padding: 1rem 2.5rem; background: #1a1a1a; color: white; border: none; font-size: 1rem; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500;">Explore Collection</button>
            </div>
        `;

        // Create footer
        const footer = document.createElement('footer');
        footer.style.cssText = `
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: #d8d4cf;
            position: relative;
            padding: 4rem 2rem;
            font-family: Inter, sans-serif;
        `;
        footer.innerHTML = `
            <div style="text-align: center;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 4rem; margin-bottom: 1rem; letter-spacing: 0.1em;">LUXE</h3>
                <p style="font-size: 1.1rem; color: rgba(26, 26, 26, 0.7); margin-bottom: 3rem;">Curated Excellence Since 2020</p>
                <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
                    <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem;">About</a>
                    <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem;">Contact</a>
                    <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem;">Privacy</a>
                    <a href="#" style="color: #1a1a1a; text-decoration: none; font-size: 0.95rem;">Terms</a>
                </div>
            </div>
            <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" style="position: absolute; bottom: 6rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 80px; height: 80px; background: #1a1a1a; color: white; text-decoration: none; justify-content: center; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em;">Top</a>
            <p style="position: absolute; bottom: 2rem; font-size: 0.85rem; color: rgba(26, 26, 26, 0.6);">© 2024 LUXE. All rights reserved.</p>
        `;

        // Wrap element
        const parent = element.parentNode;
        parent.insertBefore(wrapper, element);
        wrapper.appendChild(header);
        wrapper.appendChild(intro);
        wrapper.appendChild(element);
        wrapper.appendChild(footer);

        // Handle events
        element.addEventListener('add-to-cart', (e) => {
            console.log('Add to cart:', e.detail.product);
            alert(`🛍️ Added "${e.detail.product.name}" to cart!`);
        });

        element.addEventListener('view-details', (e) => {
            console.log('View details:', e.detail.product);
            alert(`👁️ Viewing details for "${e.detail.product.name}"`);
        });
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Luxury Product Showcase - Smooth Scrolling Gallery
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                An elegant full-page scrolling product showcase inspired by luxury brand websites.
                Features smooth GSAP animations, parallax effects, and split-screen layouts that create
                an immersive shopping experience perfect for high-end products.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>GSAP-powered smooth animations</li>
                        <li>ScrollTrigger parallax effects</li>
                        <li>Split-screen product layouts</li>
                        <li>Full-screen hero section</li>
                        <li>Elegant typography (Playfair Display)</li>
                        <li>Fixed navigation header</li>
                        <li>Scroll indicators</li>
                        <li>Interactive cart buttons</li>
                        <li>Responsive mobile-friendly design</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Luxury fashion brands</li>
                        <li>Premium watch collections</li>
                        <li>High-end home decor</li>
                        <li>Artisanal products</li>
                        <li>Designer accessories</li>
                        <li>Exclusive product launches</li>
                        <li>Portfolio showcases</li>
                        <li>Editorial-style galleries</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-amber-200 dark:border-amber-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎨 Design Highlights:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Scroll Animations</div>
                        <div class="text-xs">Smooth reveals and parallax effects as you scroll</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Color Palette</div>
                        <div class="text-xs">Soft pastel backgrounds with neutral tones</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Typography</div>
                        <div class="text-xs">Elegant serif headlines, clean sans-serif body</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-amber-200 dark:border-amber-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📝 Technical Details:</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm">
                    Built with Lit web components for maximum reusability. Uses GSAP 3.12+ with ScrollTrigger
                    for buttery-smooth animations. All styles are scoped within Shadow DOM. Fully responsive
                    with mobile-optimized layouts. Products array can be easily customized via component properties.
                </p>
            </div>

            <div class="mt-4 p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <p class="text-sm text-gray-800 dark:text-gray-200">
                    <strong>💡 Tip:</strong> Scroll down to experience the smooth animations and parallax effects.
                    Click "Add to Cart" buttons to see interaction demos. The component automatically loads
                    GSAP and Google Fonts for optimal viewing.
                </p>
            </div>
        </div>
    `,

    notes: 'Scroll through the entire showcase to experience all animations. GSAP libraries are loaded automatically. Click any CTA button to see interaction demos.'
};

export default previewConfig;
