import '../hero-modern-purple.js';

/**
 * Hero Modern Purple - Interactive Preview
 * Modern e-commerce hero section with purple gradient, fixed navigation, and mobile menu
 */

export const previewConfig = {
    setup: (element) => {
        console.log('Hero Modern Purple - Preview loaded');

        // Set default theme to light
        element.setAttribute('theme', 'light');

        // Create theme toggle
        const themeToggle = document.createElement('div');
        themeToggle.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 0.75rem 1.25rem;
            border-radius: 50px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: 'Poppins', sans-serif;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(0, 0, 0, 0.1);
        `;

        const updateToggle = () => {
            const currentTheme = element.getAttribute('theme') || 'light';
            const isDark = currentTheme === 'dark';
            themeToggle.innerHTML = `
                <span style="font-size: 1rem;">${isDark ? '🌙' : '☀️'}</span>
                <span>${isDark ? 'Dark' : 'Light'} Mode</span>
            `;
            themeToggle.style.background = isDark
                ? 'rgba(42, 42, 42, 0.95)'
                : 'rgba(255, 255, 255, 0.95)';
            themeToggle.style.color = isDark ? '#f5f1ed' : '#000000';
            themeToggle.style.borderColor = isDark ? 'rgba(245, 241, 237, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        };

        updateToggle();

        themeToggle.addEventListener('click', () => {
            const currentTheme = element.getAttribute('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            element.setAttribute('theme', newTheme);
            updateToggle();
        });

        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.transform = 'scale(1.05)';
            themeToggle.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = 'scale(1)';
            themeToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });

        document.body.appendChild(themeToggle);

        // Toast notification helper
        const showToast = (message, icon = '✨') => {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 1000;
                background: rgba(139, 92, 246, 0.95);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-family: 'Poppins', sans-serif;
                font-size: 0.875rem;
                font-weight: 500;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                animation: slideInUp 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            `;
            toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span><span>${message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        };

        // Handle custom events
        element.addEventListener('nav-click', (e) => {
            console.log('Navigation clicked:', e.detail);
            showToast(`Navigating to ${e.detail.label}`, '📍');
        });

        element.addEventListener('cta-primary-click', () => {
            console.log('Primary CTA clicked');
            showToast('Starting shopping experience', '🛍️');
        });

        element.addEventListener('cta-secondary-click', () => {
            console.log('Secondary CTA clicked');
            showToast('Opening product demo', '▶️');
        });

        element.addEventListener('menu-toggle', (e) => {
            console.log('Menu toggled:', e.detail.isOpen);
            showToast(e.detail.isOpen ? 'Menu opened' : 'Menu closed', '📱');
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutDown {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Hero Modern Purple - Modern E-commerce Hero Section
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                A modern hero section with purple gradient background, fixed navigation with mobile menu,
                trust indicators, and smooth animations. Perfect for e-commerce stores looking for a
                contemporary, professional look with excellent mobile responsiveness.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Fixed navigation with backdrop blur effect</li>
                        <li>Mobile-responsive hamburger menu</li>
                        <li>Purple gradient hero section</li>
                        <li>Trust indicators with checkmarks</li>
                        <li>Dual CTA buttons (primary and secondary)</li>
                        <li>Lucide icons via CDN (auto-initialized)</li>
                        <li>Dark/light mode with smooth transitions</li>
                        <li>Mobile-first responsive design</li>
                        <li>Smooth animations and transitions</li>
                        <li>Customizable brand logo</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>E-commerce homepages</li>
                        <li>Product landing pages</li>
                        <li>Fashion and apparel stores</li>
                        <li>Electronics retailers</li>
                        <li>Lifestyle brand websites</li>
                        <li>Modern online stores</li>
                        <li>Tech product launches</li>
                        <li>Premium brand showcases</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎨 Design Highlights:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Fixed Navigation</div>
                        <div class="text-xs">Backdrop blur with logo and navigation links</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Purple Gradient</div>
                        <div class="text-xs">Vibrant purple gradient background with blur effects</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Mobile Menu</div>
                        <div class="text-xs">Slide-in mobile navigation with smooth animations</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎬 Interactive Elements:</h4>
                <div class="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="flex items-start gap-2">
                        <span class="font-medium">🌓</span>
                        <div>
                            <strong>Theme Toggle:</strong> Click the theme button in the top-right to switch between light and dark modes
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">🔘</span>
                        <div>
                            <strong>CTA Buttons:</strong> Click "Shop Now" or "Watch Demo" to see interaction events
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">📱</span>
                        <div>
                            <strong>Mobile Menu:</strong> Resize to mobile view and click the hamburger icon to see the slide-in menu
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">🔍</span>
                        <div>
                            <strong>Icons:</strong> All icons use Lucide and are automatically initialized via data-lucide attributes
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">🎯</span>
                        <div>
                            <strong>Navigation:</strong> Click nav links to see interaction feedback
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📝 Technical Details:</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm">
                    Built with Lit web components for maximum reusability. Poppins font family loaded from Google Fonts.
                    Lucide icons auto-load from CDN and initialize via data-lucide attributes. Pure CSS animations
                    for smooth transitions. All styles use TailwindCSS utility classes. Fully responsive with
                    breakpoints at 768px (md), 1024px (lg), and 1280px (xl). Component properties can be easily
                    customized including hero content, navigation items, trust indicators, and theme.
                    Emits custom events for all interactions (nav-click, cta-primary-click, cta-secondary-click, menu-toggle).
                </p>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🔧 Customization Options:</h4>
                <div class="grid md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div>
                        <strong>Hero Content:</strong> heroTitle, heroSubtitle, heroImage
                    </div>
                    <div>
                        <strong>Branding:</strong> brandName, logoPath, ctaPrimaryText, ctaSecondaryText
                    </div>
                    <div>
                        <strong>Navigation:</strong> navigationItems array with label and href
                    </div>
                    <div>
                        <strong>Trust Indicators:</strong> trustIndicators array with text
                    </div>
                    <div>
                        <strong>Theme:</strong> theme attribute (light/dark)
                    </div>
                    <div>
                        <strong>Colors:</strong> Purple gradient, backdrop blur, button styles
                    </div>
                </div>
            </div>

            <div class="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <p class="text-sm text-gray-800 dark:text-gray-200">
                    <strong>💡 Tip:</strong> This component features a modern purple gradient design perfect for
                    e-commerce stores. Toggle between light and dark modes to see the smooth theme transitions.
                    All interactions emit custom events that you can listen to and handle in your application.
                    The mobile menu slides in from the left with smooth animations. Lucide icons are loaded
                    automatically and initialized via data-lucide attributes. The fixed navigation uses backdrop
                    blur for a modern glassmorphism effect.
                </p>
            </div>
        </div>
    `,

    notes: 'Modern purple gradient hero section. Toggle theme in top-right. Click any interactive element for toast notifications. Fully responsive with mobile menu!'
};

export default previewConfig;

