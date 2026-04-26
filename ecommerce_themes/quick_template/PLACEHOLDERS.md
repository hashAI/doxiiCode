# ⚡ Quick Template - Replacement Guide

**Generic ecommerce template** - Works for any domain (beauty, grocery, shoes, furniture, digital products, etc.)

This template uses placeholders that MUST be replaced for every store. Colors, fonts, and branding are **REQUIRED** (not optional).

## Required Replacements

### 1. Brand Identity (REQUIRED)

| Find | Replace With | Files Affected |
|------|--------------|----------------|
| `STORE` | Your brand name UPPERCASE (e.g., "AURELIA", "BEAUTY", "SHOES") | gallery-header.js (2x), immersive-menu.js (1x) |
| `TAGLINE` | Your tagline/slogan (e.g., "Fine Jewelry", "Premium Beauty", "Quality Footwear") | gallery-header.js, immersive-menu.js |
| `Store · Luxury Collection` | Page title (e.g., "Aurelia · Fine Jewelry") | index.html |
| `A curated atelier of contemporary fine products` | Meta description | index.html |
| `store-` | Storage prefix (lowercase-hyphen, e.g., "aurelia-", "beauty-") | state.js (4x) |

### 2. Colors (REQUIRED - Every store needs unique branding)

**Default:** Gold (#D4AF37) / Noir (dark grays)

**You MUST replace colors for every store.** Find and replace:

| Find | Replace With | Description |
|------|--------------|-------------|
| `gold-400` | `{color}-400` | Primary accent (e.g., `rose-400`, `emerald-400`) |
| `gold-500` | `{color}-500` | Hover state |
| `gold-300` | `{color}-300` | Light accent |
| `gold-400/` | `{color}-400/` | Opacity variants (e.g., `rose-400/20`) |
| `D4AF37` | `{hex}` | Gold hex in CSS (e.g., `#FB7185` for rose) |
| `212,175,55` | `{r},{g},{b}` | Gold RGB values (e.g., `251,113,133` for rose) |

**Files to update:**
- `index.html` - Tailwind config colors, CSS variables, selection color
- All component files using `gold-*` classes

### 3. Fonts (REQUIRED - Every store needs unique typography)

**Default:** Playfair Display (display) + Libre Franklin (body)

**You MUST replace fonts for every store.**

**In `index.html`:**

```html
<!-- Find this Google Fonts link -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Libre+Franklin:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- Replace with your fonts -->
<link href="https://fonts.googleapis.com/css2?family=YOUR_DISPLAY:wght@400;500;600;700&family=YOUR_BODY:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**In Tailwind config (same file):**
```javascript
fontFamily: {
    display: ['YOUR_DISPLAY', 'serif'],  // Change this
    sans: ['YOUR_BODY', 'system-ui', 'sans-serif']  // And this
}
```

### 4. Homepage Content (REQUIRED)

**File:** `components/pages/home-page.js`

Replace these placeholders in the hero and sections:

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `HERO_EYEBROW` | Small text above hero title | "The Atelier Collection" → "New Arrivals" |
| `HERO_TITLE_LINE_1` | First line of hero title | "Where Art" → "Discover Beauty" |
| `HERO_TITLE_LINE_2` | Second line (gradient) | "Meets Soul" → "Redefined" |
| `HERO_DESCRIPTION` | Hero paragraph | Full description text |
| `HERO_CTA_PRIMARY` | Primary button text | "Explore Collection" → "Shop Now" |
| `HERO_CTA_SECONDARY` | Secondary button text | "Shop Rings" → "View All" |
| `FEATURED_SECTION_EYEBROW` | Featured section label | "Featured" → "Best Sellers" |
| `FEATURED_SECTION_TITLE` | Featured section heading | "Pieces of Distinction" → "Our Favorites" |
| `FEATURED_SECTION_DESCRIPTION` | Featured section text | Full description |
| `STAT_1_VALUE`, `STAT_1_LABEL` | First stat (value + label) | "50+", "Years of Heritage" |
| `STAT_2_VALUE`, `STAT_2_LABEL` | Second stat | "1000+", "Unique Products" |
| `STAT_3_VALUE`, `STAT_3_LABEL` | Third stat | "100%", "Satisfaction" |
| `QUOTE_TEXT` | Editorial quote | Full quote text |
| `QUOTE_ATTRIBUTION` | Quote source | "Our Philosophy" → "Our Mission" |
| `NEWSLETTER_TITLE` | Newsletter heading | "Join the Circle" → "Stay Updated" |
| `NEWSLETTER_DESCRIPTION` | Newsletter description | Full description text |

### 5. Trust Section (REQUIRED)

**Files:** `components/pages/home-page.js`, `components/pages/products-page.js`

Replace trust badges (4 items):

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `TRUST_ICON_1` | Lucide icon name | `gem` → `shield-check`, `award`, `truck` |
| `TRUST_TITLE_1` | Trust badge title | "GIA Certified" → "Quality Guaranteed" |
| `TRUST_DESC_1` | Trust badge description | "Every diamond authenticated" → "Premium quality products" |
| `TRUST_ICON_2-4`, `TRUST_TITLE_2-4`, `TRUST_DESC_2-4` | Same for items 2-4 | |

**Popular trust badges:**
- Shipping: `truck`, "Free Shipping", "Complimentary delivery"
- Returns: `rotate-ccw`, "30-Day Returns", "Hassle-free policy"
- Security: `shield-check`, "Secure Payment", "SSL encrypted"
- Quality: `award`, "Premium Quality", "Certified products"
- Support: `headphones`, "24/7 Support", "Always here to help"

### 6. Contact Information (REQUIRED)

**File:** `components/immersive-menu.js`

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `STORE_ADDRESS_LINE_1` | First address line | "123 Jewellers Lane" → "123 Main Street" |
| `STORE_ADDRESS_LINE_2` | Second address line | "London, W1S 2HQ" → "New York, NY 10001" |
| `STORE_PHONE` | Phone number | "+44 20 7123 4567" → "+1 (555) 123-4567" |
| `STORE_EMAIL` | Email address | "atelier@aurea.com" → "hello@store.com" |

### 7. Products & Categories (REQUIRED)

**File:** `assets/state.js`

**A. Update `productCategories` array:**

Replace the 4 generic categories with your store's categories:

```javascript
export const productCategories = [
    {
        id: 'category-1',           // Change to your category ID (e.g., 'dresses', 'phones')
        name: 'Category 1',         // Change to display name (e.g., 'Dresses', 'Phones')
        icon: 'package',            // Change icon (e.g., 'shirt', 'smartphone', 'home')
        color: 'bg-amber-50',       // Optional: category color
        textColor: 'text-amber-700',
        image: getImageUrl('product category collection display', 720, 0)
    },
    // ... repeat for categories 2-4
];
```

**B. Update `initialProducts` array:**

Replace all 10 placeholder products with your store's products. Each product needs:

```javascript
{
    id: 'product-unique-id',           // Unique string ID
    name: 'Product Name',              // Display name
    brand: 'Brand Name',               // Brand/collection
    category: 'Category Display',      // Display category
    variant: 'Size/Color variant',     // Variant info
    price: 199.00,                     // Sale price (number)
    originalPrice: 249.00,             // Original price (number)
    rating: 4.8,                       // 1-5 rating
    reviews: 156,                      // Review count
    size: 'Size info',                 // Size display
    shade: 'Color/material',           // Material/color info
    productType: 'category-1',         // Category ID (must match productCategories)
    certified: true,                   // Show certification badge
    badge: 'Bestseller',               // Optional badge: 'Bestseller', 'New', 'Sale', null
    featured: true,                    // Show in featured section
    newArrival: false,                 // Show in new arrivals
    image: getImageUrl('search query', 900, 0),  // Main image
    images: [                          // Gallery images
        getImageUrl('query', 900, 0),
        getImageUrl('query', 900, 1),
        getImageUrl('query', 900, 2)
    ],
    tags: ['Tag 1', 'Tag 2', 'Tag 3']  // Feature tags
}
```

**C. Update storage keys:**

Replace `store-` prefix in storage keys (4 occurrences):
- `store-favorites` → `{prefix}-favorites`
- `store-cart` → `{prefix}-cart`
- `store-user` → `{prefix}-user`
- `store-theme` → `{prefix}-theme`

### 8. Product Details Certification (REQUIRED)

**File:** `components/pages/product-details-page.js`

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `CERTIFIED_LABEL` | Certification label | "GIA Certified" → "Quality Certified", "Authentic", "Verified" |

---

## Lightning Agent Workflow

### Step 1: Read Key Files (1 tool call)
```python
bulk_read_files(ctx, [
    {"path": "PLACEHOLDERS.md"},
    {"path": "index.html"},
    {"path": "assets/state.js"},
    {"path": "components/pages/home-page.js"}
])
```

### Step 2: Bulk Replace Branding & Colors (1 tool call)
```python
batch_find_replace(ctx, replacements=[
    # Brand identity
    {"path": "index.html", "old_string": "Store · Luxury Collection", "new_string": "<BRAND> · <TAGLINE>", "replace_all": True},
    {"path": "index.html", "old_string": "A curated atelier of contemporary fine products", "new_string": "<META_DESCRIPTION>", "replace_all": True},
    {"path": "components/gallery-header.js", "old_string": "STORE", "new_string": "<BRAND>", "replace_all": True},
    {"path": "components/gallery-header.js", "old_string": "TAGLINE", "new_string": "<TAGLINE>", "replace_all": True},
    {"path": "components/immersive-menu.js", "old_string": "STORE", "new_string": "<BRAND>", "replace_all": True},
    {"path": "components/immersive-menu.js", "old_string": "TAGLINE", "new_string": "<TAGLINE>", "replace_all": True},
    {"path": "assets/state.js", "old_string": "store-", "new_string": "<prefix>-", "replace_all": True},
    # Colors (REQUIRED - replace gold with brand color)
    {"path": "index.html", "old_string": "gold-400", "new_string": "<color>-400", "replace_all": True},
    {"path": "index.html", "old_string": "gold-500", "new_string": "<color>-500", "replace_all": True},
    {"path": "index.html", "old_string": "gold-300", "new_string": "<color>-300", "replace_all": True},
    {"path": "index.html", "old_string": "D4AF37", "new_string": "<hex>", "replace_all": True},
    {"path": "index.html", "old_string": "212,175,55", "new_string": "<r>,<g>,<b>", "replace_all": True},
    # Contact info
    {"path": "components/immersive-menu.js", "old_string": "STORE_ADDRESS_LINE_1", "new_string": "<ADDRESS_1>", "replace_all": True},
    {"path": "components/immersive-menu.js", "old_string": "STORE_ADDRESS_LINE_2", "new_string": "<ADDRESS_2>", "replace_all": True},
    {"path": "components/immersive-menu.js", "old_string": "STORE_PHONE", "new_string": "<PHONE>", "replace_all": True},
    {"path": "components/immersive-menu.js", "old_string": "STORE_EMAIL", "new_string": "<EMAIL>", "replace_all": True},
])
```

### Step 3: Write Products & Categories (1 tool call)
```python
bulk_write_files(ctx, files=[
    {"path": "assets/state.js", "content": "...", "overwrite": True}
])
```

### Step 4: Write Homepage (1 tool call)
```python
bulk_write_files(ctx, files=[
    {"path": "components/pages/home-page.js", "content": "...", "overwrite": True}
])
```

### Step 5: Write Trust Section (1 tool call)
```python
batch_find_replace(ctx, replacements=[
    {"path": "components/pages/home-page.js", "old_string": "TRUST_ICON_1", "new_string": "<icon>", "replace_all": True},
    {"path": "components/pages/home-page.js", "old_string": "TRUST_TITLE_1", "new_string": "<title>", "replace_all": True},
    {"path": "components/pages/home-page.js", "old_string": "TRUST_DESC_1", "new_string": "<desc>", "replace_all": True},
    # Repeat for TRUST_ICON_2-4, TRUST_TITLE_2-4, TRUST_DESC_2-4
])
```

### Step 6: Update Fonts (1 tool call)
```python
batch_find_replace(ctx, replacements=[
    {"path": "index.html", "old_string": "Playfair Display", "new_string": "<DISPLAY_FONT>", "replace_all": True},
    {"path": "index.html", "old_string": "Libre Franklin", "new_string": "<BODY_FONT>", "replace_all": True},
])
```

### Step 7: Validate (1 tool call)
```python
validate_project_with_eslint(ctx)
```

**Total: 7 tool calls, ~60 seconds!**

---

## Category Examples by Store Type

### Beauty Store
```javascript
productCategories = [
    { id: 'skincare', name: 'Skincare', icon: 'droplet' },
    { id: 'makeup', name: 'Makeup', icon: 'palette' },
    { id: 'haircare', name: 'Haircare', icon: 'sparkles' },
    { id: 'fragrance', name: 'Fragrance', icon: 'flower' }
]
```

### Fashion Store
```javascript
productCategories = [
    { id: 'dresses', name: 'Dresses', icon: 'shirt' },
    { id: 'tops', name: 'Tops', icon: 'tshirt' },
    { id: 'pants', name: 'Pants', icon: 'package' },
    { id: 'accessories', name: 'Accessories', icon: 'sparkles' }
]
```

### Electronics Store
```javascript
productCategories = [
    { id: 'phones', name: 'Phones', icon: 'smartphone' },
    { id: 'laptops', name: 'Laptops', icon: 'laptop' },
    { id: 'audio', name: 'Audio', icon: 'headphones' },
    { id: 'accessories', name: 'Accessories', icon: 'cable' }
]
```

### Grocery Store
```javascript
productCategories = [
    { id: 'produce', name: 'Produce', icon: 'apple' },
    { id: 'dairy', name: 'Dairy', icon: 'milk' },
    { id: 'meat', name: 'Meat & Seafood', icon: 'fish' },
    { id: 'bakery', name: 'Bakery', icon: 'croissant' }
]
```

### Furniture Store
```javascript
productCategories = [
    { id: 'sofas', name: 'Sofas', icon: 'sofa' },
    { id: 'tables', name: 'Tables', icon: 'table' },
    { id: 'chairs', name: 'Chairs', icon: 'chair' },
    { id: 'decor', name: 'Decor', icon: 'lamp' }
]
```

---

## Default Values (Template Works With These)

If agent exits early, template still functions with:
- Brand: "STORE" / "TAGLINE"
- Colors: Gold (#D4AF37) / Noir (dark grays)
- Fonts: Playfair Display + Libre Franklin
- Products: 10 generic placeholder products
- Categories: Category 1-4 (generic)
- All routing, cart, wishlist, filters work

**Note:** These are placeholders - every store MUST customize colors, fonts, branding, and content for unique identity.
