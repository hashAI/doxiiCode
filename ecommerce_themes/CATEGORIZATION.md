# E-commerce Themes Categorization

This document categorizes each store theme according to the 5 catalog grammar categories.

## Categories Overview

1. **grid_classic** - Default catalog grammar, balanced grid, standard filters, familiar PDP
2. **dense_catalog** - High SKU/functional browsing, list or tight grid, specs visible early, bulk-friendly UX
3. **visual_gallery** - Image-first discovery, large tiles, overlay actions, minimal text
4. **editorial** - Content-rich browsing, long descriptions, rich media, storytelling PDP
5. **minimal_canvas** - Neutral mutation base, lowest styling opinion, simplest markup

---

## Folder Structure

```
ecommerce_themes/
├── grid_classic/
│   ├── grid_classic_1/     # Cosmetics/skincare theme (formerly beauty_store)
│   └── grid_classic_2/     # General store theme (formerly everything_store)
├── dense_catalog/
│   ├── dense_catalog_1/    # Tech products theme (formerly electronics_store_1)
│   └── dense_catalog_2/    # Eyewear theme (formerly lenskart_store)
├── visual_gallery/
│   └── visual_gallery_1/   # Luxury products theme (formerly jewellery_store)
├── editorial/
│   ├── editorial_1/        # Tech editorial theme (formerly apple_store)
│   └── editorial_2/        # Fashion editorial theme (formerly clothing_store_1)
└── CATEGORIZATION.md
```

---

## Store Categorizations

### 1. grid_classic_1
**Category: `grid_classic`**

**Evidence:**
- Balanced 2-3 column grid layout
- Standard filters: category, price, brand, sort (sidebar on desktop, bottom sheets on mobile)
- Familiar product cards with image, name, price, rating, badges
- Standard PDP structure
- No strong preference - works as default catalog grammar

**Key Characteristics:**
- Balanced grid (responsive: 1-2-3 columns)
- Standard filters (category, price, brand, sort)
- Familiar product card layout
- Standard PDP structure

---

### 2. grid_classic_2
**Category: `grid_classic`** (with `minimal_canvas` tendencies)

**Evidence:**
- Simple 2-column grid layout (mobile-first)
- Basic filters: category, price range, subcategory
- Standard product cards with essential info
- Functional, no-frills approach
- Simple markup and structure

**Key Characteristics:**
- Balanced grid (2 columns)
- Standard filters (category, price, subcategory)
- Familiar PDP
- Simple, functional approach
- Could also fit `minimal_canvas` due to simplicity

---

### 3. dense_catalog_1
**Category: `dense_catalog`**

**Evidence:**
- Comprehensive filters: price range (min/max), brand, rating, category, search
- Grid/list view toggle for functional browsing
- Specs visible early (ratings, reviews, prices prominently displayed)
- Bulk-friendly UX with filter persistence and scroll position saving
- High SKU browsing optimized (session storage for filters/scroll)
- Active filter chips for quick removal
- Mobile bottom sheet filters for efficient filtering

**Key Characteristics:**
- High SKU/functional browsing
- List or tight grid options
- Specs visible early (ratings, prices, reviews)
- Bulk-friendly UX with filter persistence
- Optimized for users who want "something fast and functional"

---

### 4. dense_catalog_2
**Category: `dense_catalog`**

**Evidence:**
- Grid/list view toggle for functional browsing
- Comprehensive filters: frame shape, sort options
- Specs visible early: ratings, reviews, colors, prices
- Bulk-friendly UX with multiple filter options
- Functional browsing optimized for high SKU count
- List view shows detailed specs (description, colors, ratings)

**Key Characteristics:**
- High SKU/functional browsing
- List or tight grid options
- Specs visible early (ratings, colors, descriptions in list view)
- Bulk-friendly UX
- Critical for users who want "something fast and functional"

---

### 5. visual_gallery_1
**Category: `visual_gallery`**

**Evidence:**
- Large product tiles with aspect-portrait images
- Image-first discovery - images are the primary focus
- Overlay actions on hover (Quick View, Add to Cart, Favorites)
- Minimal text - product name, brand, price only
- Gallery-style presentation with dark luxury aesthetic
- Large view mode option (1-2-3 columns based on view)
- Visual emphasis over text/specs

**Key Characteristics:**
- Image-first discovery
- Large tiles (aspect-portrait, large view mode)
- Overlay actions on hover
- Minimal text (name, brand, price only)
- Perfect for fashion/art/inspiration-heavy stores

---

### 6. editorial_1
**Category: `editorial`**

**Evidence:**
- Products page features editorial sections: "Switch to...", "Why we're the best place to buy"
- Rich storytelling with hero banners and content cards
- Product details page has feature tabs, comparison modals, and detailed descriptions
- Carousel-based product presentation with narrative flow
- Content-rich browsing experience with long-form descriptions

**Key Characteristics:**
- Storytelling PDP with feature highlights
- Rich media and editorial content sections
- Products page feels like a magazine with narrative sections

---

### 7. editorial_2
**Category: `editorial`**

**Evidence:**
- Home page features editorial hero: "Wearable architecture for the modern atelier"
- Long descriptions and storytelling approach
- Products page has elegant typography and editorial-style layout
- Content-rich browsing with narrative elements
- Magazine-like presentation

**Key Characteristics:**
- Content-rich browsing with long descriptions
- Storytelling approach ("wearable architecture", "sculpted silhouettes")
- Rich media presentation
- Editorial-style layout

---

## Summary Table

| Store | Category | Primary Fit | Notes |
|-------|----------|-------------|-------|
| grid_classic_1 | `grid_classic` | ✅ Strong | Default catalog grammar |
| grid_classic_2 | `grid_classic` | ✅ Good | Simple, standard approach (could be minimal_canvas) |
| dense_catalog_1 | `dense_catalog` | ✅ Strong | High SKU, functional, specs early |
| dense_catalog_2 | `dense_catalog` | ✅ Strong | Functional browsing, specs visible |
| visual_gallery_1 | `visual_gallery` | ✅ Strong | Image-first, large tiles, overlay actions |
| editorial_1 | `editorial` | ✅ Strong | Rich storytelling, content-heavy |
| editorial_2 | `editorial` | ✅ Strong | Editorial-style, storytelling |

---

## Category Distribution

- **grid_classic**: 2 stores (grid_classic_1, grid_classic_2)
- **dense_catalog**: 2 stores (dense_catalog_1, dense_catalog_2)
- **visual_gallery**: 1 store (visual_gallery_1)
- **editorial**: 2 stores (editorial_1, editorial_2)
- **minimal_canvas**: 0 stores (grid_classic_2 has tendencies but fits grid_classic better)

---

## Recommendations

1. **For users with no preference**: Use `grid_classic_1` (grid_classic) as default
2. **For high SKU/functional needs**: Use `dense_catalog_1` or `dense_catalog_2` (dense_catalog)
3. **For fashion/art/inspiration**: Use `visual_gallery_1` (visual_gallery)
4. **For content-rich/storytelling**: Use `editorial_1` or `editorial_2` (editorial)
5. **For simplest approach**: `grid_classic_2` could be adapted to `minimal_canvas` if needed

---

## Notes

- All stores use **placeholder names** (e.g., "Store Name", "Brand A") instead of specific brand names
- Stores are generic templates that can be customized for any product category
- Each store maintains its unique visual aesthetic and UX patterns while using neutral naming
