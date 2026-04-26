# Hero AI Geometric Component

A modern, fully-featured hero section component with geometric SVG patterns, dual theme support, and mobile-responsive design.

## ✨ Features

### 🎨 **Dual Theme Support**
- ✅ **Dark Mode** (default) - Dark background with geometric patterns
- ✅ **Light Mode** - Light gradient background with subtle patterns
- ✅ **Theme Toggle Button** - Built-in theme switcher in navigation
- ✅ **Smooth Transitions** - Seamless theme switching

### 📱 **Mobile Menu**
- ✅ **Responsive Hamburger Menu** - Appears on mobile/tablet
- ✅ **Slide Animation** - Smooth slide-in/out transitions
- ✅ **Backdrop Blur** - Modern glassmorphism effect
- ✅ **Close Button** - Easy dismissal
- ✅ **Full Navigation** - All menu items accessible

### 🎯 **Core Features**
- ✅ **Geometric SVG Background** - Animated patterns
- ✅ **Fixed Navigation** - Stays at top with backdrop blur
- ✅ **Community Badge** - User avatars with community stats
- ✅ **Dual CTA Buttons** - Primary & secondary actions
- ✅ **Hero Image** - Responsive product showcase
- ✅ **Mobile-First Design** - Optimized for all screen sizes
- ✅ **Poppins Font** - Auto-loaded from Google Fonts
- ✅ **Lucide Icons** - Auto-initialized

## 🚀 Usage

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <hero-ai-geometric></hero-ai-geometric>

    <script type="module">
        import './hero-ai-geometric.js';
    </script>
</body>
</html>
```

### With Custom Configuration

```html
<script type="module">
    import './hero-ai-geometric.js';

    const hero = document.querySelector('hero-ai-geometric');

    // Set initial theme
    hero.theme = 'light'; // or 'dark'

    // Customize content
    hero.config = {
        brandName: 'YourBrand',
        navigation: [
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'About', href: '/about' }
        ],
        hero: {
            communityBadge: {
                users: ['url1', 'url2', 'url3'],
                text: 'Join 10k+ users'
            },
            title: {
                dark: 'Your dark mode title',
                light: 'Your light mode title'
            },
            subtitle: 'Your subtitle here',
            cta: {
                primary: 'Get Started',
                secondary: 'Learn More'
            },
            image: {
                dark: 'your-dark-image.png',
                light: 'your-light-image.png'
            }
        }
    };
</script>
```

## 🎮 Interactive Controls

### Theme Switching

```javascript
const hero = document.querySelector('hero-ai-geometric');

// Set theme directly
hero.theme = 'light';
hero.theme = 'dark';

// Toggle theme
hero.toggleTheme();
```

### Mobile Menu Control

```javascript
// Toggle mobile menu programmatically
hero.toggleMobileMenu();

// Check menu state
console.log(hero.mobileMenuOpen); // true/false
```

## 📡 Events

The component emits the following custom events:

### Navigation Events
```javascript
hero.addEventListener('nav-click', (e) => {
    console.log('Navigation item:', e.detail.item);
    // { label: 'Home', href: '/' }
});
```

### CTA Events
```javascript
hero.addEventListener('cta-primary-click', (e) => {
    console.log('Primary CTA:', e.detail);
    // { action: 'get-started' }
});

hero.addEventListener('cta-secondary-click', (e) => {
    console.log('Secondary CTA:', e.detail);
    // { action: 'watch-demo' }
});
```

### Menu & Theme Events
```javascript
hero.addEventListener('menu-toggle', (e) => {
    console.log('Menu state:', e.detail.open);
    // { open: true/false }
});

hero.addEventListener('theme-changed', (e) => {
    console.log('New theme:', e.detail.theme);
    // { theme: 'light' or 'dark' }
});
```

## 🎨 Theme Differences

### Dark Mode
- Background: `#0A0F1C` (dark blue-black)
- Text: White/Slate-50
- Geometric patterns: Dark blue (`#1D293D`)
- Primary CTA: White background
- Border colors: Slate-600
- Mobile menu: Black backdrop with blur

### Light Mode
- Background: Gradient `from-slate-50 to-slate-100`
- Text: Slate-900
- Geometric patterns: Light slate (`#E2E8F0`)
- Primary CTA: Indigo-600 background
- Border colors: Slate-300
- Mobile menu: White backdrop with blur

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (mobile menu active)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🧪 Testing

Open `demo.html` in your browser to see:
- ✅ Theme switching controls
- ✅ Mobile menu functionality
- ✅ All events in console
- ✅ Both light and dark modes
- ✅ Responsive behavior

## 🛠️ Customization Points

### Colors
- Theme-based backgrounds
- CTA button colors
- Border and text colors
- Geometric pattern opacity

### Layout
- Navigation items
- Hero content positioning
- Community badge styling
- Image placement

### Typography
- Font: Poppins (Google Fonts)
- Sizes: Responsive with breakpoints
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Content
- Brand name
- Navigation links
- Community stats
- Hero title/subtitle
- CTA text
- Hero images

## 🎯 Use Cases

Perfect for:
- E-commerce homepages
- SaaS landing pages
- Tech product launches
- Startup websites
- AI/ML tool platforms
- Smart automation platforms
- Productivity tool pages
- Developer tool websites
- Analytics dashboard homepages
- Modern online stores

## 📦 Dependencies

**Auto-loaded (no manual setup required):**
- Lit 3.2.1+ (from CDN)
- Poppins Font (Google Fonts)
- Lucide Icons (unpkg CDN)

**Required:**
- TailwindCSS (via CDN or build)

## 🔧 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Part of the DOXII Component Library - E-commerce Components
