# DOXII Component Library

**Version**: 1.0.0  
**Last Updated**: November 1, 2025

---

## Overview

The DOXII Component Library is a curated collection of pre-built, tested web components for creating unique e-commerce experiences. Instead of generating code on-the-fly, the Architect agent searches, selects, and composes these components to build custom stores.

## Philosophy

- **Reliability**: Pre-tested components eliminate runtime errors
- **Security**: Audit once, use everywhere
- **Speed**: Faster assembly vs generation
- **Consistency**: Predictable behavior across all stores
- **Flexibility**: 3 variants per component + cosmetic customization

---

## Component Categories

### 1. Headers (3 variants)
- **Classic**: Traditional horizontal navigation
- **Mega Menu**: Dropdown menus with categories
- **Minimal**: Floating minimal header

### 2. Footers (3 variants)
- **Multi-Column**: 4-column with links
- **Minimal**: Single row minimal
- **Newsletter**: Newsletter-focused

### 3. Mobile Navigation (3 variants)
- **Drawer**: Slide-out drawer
- **Fullscreen**: Full-screen overlay
- **Bottom Sheet**: Bottom drawer

### 4. Product Cards (3 variants)
- **Standard**: Image + info below
- **Overlay**: Info overlays on hover
- **Horizontal**: Side-by-side layout

### 5. Product Grids (3 variants)
- **Standard**: Equal height grid
- **Masonry**: Pinterest style
- **List**: List view with large images

### 6. Product Galleries (3 variants)
- **Thumbnail Side**: Thumbnails on side
- **Thumbnail Bottom**: Thumbnails below
- **Dots**: Dots indicator

### 7. Heroes (3 variants)
- **Split**: Split text/image
- **Fullwidth**: Full-width image overlay
- **Minimal**: Centered minimal

### 8. Carts (3 variants)
- **Drawer**: Slide-out drawer
- **Modal**: Centered modal
- **Dropdown**: Header dropdown

### 9. Filters (3 variants)
- **Sidebar**: Left sidebar
- **Drawer**: Mobile bottom sheet
- **Horizontal**: Top horizontal bar

### 10. Category Displays (3 variants)
- **Grid Images**: Image grid with overlays
- **Banners**: Full-width banners
- **Icons**: Icon-based minimal

### 11. Miscellaneous
- **Newsletters** (3 variants)
- **Testimonials** (3 variants)
- **Trust Badges** (2 variants)
- **Promo Banner** (1 variant)

**Total**: 45+ components

---

## Customization Rules

### ✅ Allowed (Agent CAN Modify)
- Tailwind utility classes (colors, spacing, typography, borders, shadows)
- CSS custom properties for colors
- Layout direction (flex-row vs flex-col)
- Breakpoint visibility (hidden sm:block, etc.)
- Animation timing/delays
- Text content (placeholders, labels)
- Image URLs

### ❌ Forbidden (Agent CANNOT Modify)
- JavaScript logic (event handlers, state management)
- Component lifecycle methods
- Data flow (props, state integration)
- Accessibility attributes
- Security-related code
- Core functionality

---

## Component Structure

Each component follows this standard structure:

```javascript
/* eslint-disable import/no-unresolved */
/* global customElements */
/**
 * Component Name - Variant Description
 *
 * Functionality:
 * - Feature 1
 * - Feature 2
 *
 * Customization Points:
 * - CSS classes (via attributes)
 * - Colors (Tailwind classes)
 *
 * Props/Attributes:
 * - data-* attributes for configuration
 *
 * State Integration:
 * - Stores used (cartStore, productsStore, etc.)
 * - Events emitted/listened to
 */

import { BaseComponent } from './base-component.js';

export class ComponentNameVariant extends BaseComponent {
    static properties = {
        // Reactive properties
    };

    constructor() {
        super();
        // Initialize
    }

    connectedCallback() {
        super.connectedCallback();
        // Setup subscriptions
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Cleanup
    }

    render() {
        return this.html`
            <!-- Component template -->
        `;
    }
}

customElements.define('component-name-variant', ComponentNameVariant);
```

**Important Pattern Notes:**
- ✅ Import `BaseComponent` from `'./base-component.js'` (NOT from CDN)
- ✅ Use `this.html` in render() (NOT `html` from import)
- ✅ Add ESLint disable comments at the top
- ✅ Declare `customElements` as global
- ❌ **NEVER** import `html`, `LitElement`, or `nothing` from CDN directly

---

## Component API Standards

All components must follow these standards:

1. **Extend BaseComponent**
2. **Use Lit reactive properties**
3. **Subscribe to stores in connectedCallback**
4. **Cleanup in disconnectedCallback**
5. **Use Tailwind for all styling**
6. **Support dark mode with dark: prefix**
7. **Emit custom events for actions**
8. **Use eventBus for cross-component communication**
9. **Document all customization points**
10. **Include JSDoc comments**

---

## Usage by Architect Agent

### Workflow: Plan → Search → Assemble → Integrate

1. **PLAN**: Analyze requirements, design UI/UX
2. **SEARCH**: Find matching components from library
3. **ASSEMBLE**: Customize cosmetically (Tailwind classes)
4. **INTEGRATE**: Glue components together, wire state/events

### Search Tools

- `search_components()`: Search by query, category, features, style
- `get_component_details()`: Get full details for a component
- `list_component_categories()`: List all categories

---

## Testing Checklist

For each component:

- [ ] Renders without errors
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1280px)
- [ ] Dark mode works correctly
- [ ] Light mode works correctly
- [ ] Interactive elements have 44px+ touch targets
- [ ] Hover/focus states work
- [ ] Events emit correctly
- [ ] Store subscriptions work
- [ ] Z-index layering correct
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] Accessibility: screen reader friendly
- [ ] Accessibility: keyboard navigable

---

## Contributing

To add a new component:

1. Create component file in appropriate category directory
2. Follow component structure template
3. Implement functionality
4. Add comprehensive JSDoc comments
5. Test against checklist
6. Add entry to `component-catalog.json`
7. Update this README

---

*For more details, see COMPONENT_LIBRARY_PLAN.md*

