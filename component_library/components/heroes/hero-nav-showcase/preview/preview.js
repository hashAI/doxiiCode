/**
 * Preview configuration for Hero Nav Showcase component
 * Demonstrates the hero section with navigation and product showcase
 */

export default {
  component: 'hero-nav-showcase',
  title: 'Hero Nav Showcase',
  description: 'Modern hero section with fixed navigation, mobile menu, dual CTAs, and product showcase image. Perfect for ecommerce landing pages.',
  
  variants: [
    {
      name: 'Default - Light Mode',
      props: {
        theme: 'light',
        logoText: 'ShopElite',
        logoSvg: `<svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.75 11.2991L15.5 15.1839L22.25 11.2991M8.75 34.5783V26.8236L2 22.9387M29 22.9387L22.25 26.8236V34.5783M2.405 15.4081L15.5 22.9536L28.595 15.4081M15.5 38V22.9387M29 28.9154V16.962C28.9995 16.4379 28.8606 15.9233 28.5973 15.4696C28.334 15.0159 27.9556 14.6391 27.5 14.3771L17 8.40036C16.5439 8.13808 16.0266 8 15.5 8C14.9734 8 14.4561 8.13808 14 8.40036L3.5 14.3771C3.04439 14.6391 2.66597 15.0159 2.40269 15.4696C2.13941 15.9233 2.00054 16.4379 2 16.962V28.9154C2.00054 29.4395 2.13941 29.9541 2.40269 30.4078C2.66597 30.8615 3.04439 31.2383 3.5 31.5003L14 37.477C14.4561 37.7393 14.9734 37.8774 15.5 37.8774C16.0266 37.8774 16.5439 37.7393 17 37.477L27.5 31.5003C27.9556 31.2383 28.334 30.8615 28.5973 30.4078C28.8606 29.9541 28.9995 29.4395 29 28.9154Z" stroke="#4F39F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        navItems: JSON.stringify([
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: 'Collections', href: '/collections' },
          { label: 'About', href: '/about' }
        ]),
        ctaPrimaryText: 'Start Shopping',
        ctaSecondaryText: 'Watch Demo',
        heading: 'Premium Fashion &<br>Lifestyle Collection',
        subheading: 'Discover curated collections of premium clothing, accessories, and lifestyle products. Shop the latest trends with fast, free shipping.',
        heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
      }
    },
    {
      name: 'Dark Mode',
      props: {
        theme: 'dark',
        logoText: 'ShopElite',
        logoSvg: `<svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.75 11.2991L15.5 15.1839L22.25 11.2991M8.75 34.5783V26.8236L2 22.9387M29 22.9387L22.25 26.8236V34.5783M2.405 15.4081L15.5 22.9536L28.595 15.4081M15.5 38V22.9387M29 28.9154V16.962C28.9995 16.4379 28.8606 15.9233 28.5973 15.4696C28.334 15.0159 27.9556 14.6391 27.5 14.3771L17 8.40036C16.5439 8.13808 16.0266 8 15.5 8C14.9734 8 14.4561 8.13808 14 8.40036L3.5 14.3771C3.04439 14.6391 2.66597 15.0159 2.40269 15.4696C2.13941 15.9233 2.00054 16.4379 2 16.962V28.9154C2.00054 29.4395 2.13941 29.9541 2.40269 30.4078C2.66597 30.8615 3.04439 31.2383 3.5 31.5003L14 37.477C14.4561 37.7393 14.9734 37.8774 15.5 37.8774C16.0266 37.8774 16.5439 37.7393 17 37.477L27.5 31.5003C27.9556 31.2383 28.334 30.8615 28.5973 30.4078C28.8606 29.9541 28.9995 29.4395 29 28.9154Z" stroke="#818CF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        navItems: JSON.stringify([
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: 'Collections', href: '/collections' },
          { label: 'About', href: '/about' }
        ]),
        ctaPrimaryText: 'Start Shopping',
        ctaSecondaryText: 'Watch Demo',
        heading: 'Premium Fashion &<br>Lifestyle Collection',
        subheading: 'Discover curated collections of premium clothing, accessories, and lifestyle products. Shop the latest trends with fast, free shipping.',
        heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
      }
    },
    {
      name: 'Tech Store',
      props: {
        theme: 'light',
        logoText: 'TechHub',
        navItems: JSON.stringify([
          { label: 'Products', href: '/products' },
          { label: 'Deals', href: '/deals' },
          { label: 'Support', href: '/support' },
          { label: 'Contact', href: '/contact' }
        ]),
        ctaPrimaryText: 'Browse Products',
        ctaSecondaryText: 'See Demo',
        heading: 'Latest Tech<br>Innovations at Your Fingertips',
        subheading: 'Explore cutting-edge technology and electronics. From smartphones to smart homes, find everything you need with expert support.',
        heroImage: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80'
      }
    },
    {
      name: 'Beauty & Cosmetics',
      props: {
        theme: 'light',
        logoText: 'GlowUp',
        navItems: JSON.stringify([
          { label: 'Makeup', href: '/makeup' },
          { label: 'Skincare', href: '/skincare' },
          { label: 'Fragrance', href: '/fragrance' },
          { label: 'Offers', href: '/offers' }
        ]),
        ctaPrimaryText: 'Shop Now',
        ctaSecondaryText: 'Virtual Try-On',
        heading: 'Beauty Products<br>That Empower You',
        subheading: 'Premium cosmetics and skincare from top brands. Discover your perfect look with our curated collections and expert advice.',
        heroImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80'
      }
    },
    {
      name: 'Sports & Fitness - Dark',
      props: {
        theme: 'dark',
        logoText: 'FitGear',
        navItems: JSON.stringify([
          { label: 'Equipment', href: '/equipment' },
          { label: 'Apparel', href: '/apparel' },
          { label: 'Nutrition', href: '/nutrition' },
          { label: 'Training', href: '/training' }
        ]),
        ctaPrimaryText: 'Get Started',
        ctaSecondaryText: 'Free Consultation',
        heading: 'Gear Up for<br>Peak Performance',
        subheading: 'Professional-grade fitness equipment and sportswear. Achieve your goals with premium gear trusted by athletes worldwide.',
        heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
      }
    }
  ],

  // Event handlers for testing
  eventHandlers: {
    'nav-click': (e) => {
      console.log('Navigation clicked:', e.detail);
    },
    'cta-primary-click': (e) => {
      console.log('Primary CTA clicked:', e.detail);
    },
    'cta-secondary-click': (e) => {
      console.log('Secondary CTA clicked:', e.detail);
    },
    'menu-toggle': (e) => {
      console.log('Mobile menu toggled:', e.detail);
    }
  },

  // Notes for developers
  notes: [
    'Component includes fixed navigation that stays at the top on scroll',
    'Mobile menu slides in from left with smooth animation',
    'Fully responsive with mobile-first design approach',
    'Dark/light mode support with theme prop',
    'Navigation items are configurable via JSON prop',
    'All CTAs emit custom events for tracking',
    'Uses Poppins font from Google Fonts',
    'Icons from Lucide with proper ARIA labels',
    'Hero image is responsive with multiple breakpoint sizes',
    'Mobile menu has backdrop blur effect',
    'All interactive elements have hover and active states'
  ]
};

