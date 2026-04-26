# ⚡ Lightning Agent Plan

## Goal: 60-Second Store Customization in ~15 Tool Calls

### The Core Insight

The `visual_gallery/visual_gallery_1` template is a **fully functional store** with:
- ✅ Working header, footer, navigation
- ✅ Product listing with filters
- ✅ Product details with gallery
- ✅ Cart & wishlist functionality
- ✅ Responsive design (mobile + desktop)
- ✅ Dark luxury aesthetic

**The problem?** Current agents spend too much time:
- Exploring file structure (unnecessary - we know it)
- Reading files multiple times (redundant)
- Making individual changes (slow)
- Multiple validation cycles (overkill)

**The solution?** Pre-bake placeholders + bulk operations = **80% customization in 3 tool calls**

---

## Quick Win Strategy

### Tool Call Budget: 15 max

| # | Operation | Tool | Time |
|---|-----------|------|------|
| 1 | Read template structure (index.html + state.js) | `bulk_read_files` | 2s |
| 2 | Replace ALL placeholders (brand, colors, fonts, storage keys) | `batch_find_replace` | 3s |
| 3 | Generate & write products | `bulk_write_files` (state.js) | 5s |
| 4 | Generate & write custom homepage | `bulk_write_files` (home-page.js) | 10s |
| 5 | Single validation | `validate_project_with_eslint` | 5s |
| 6-8 | Fix any ESLint errors (batch) | `batch_find_replace` | 5s |

**Total: ~30 seconds of tool execution + ~30 seconds of LLM thinking = 60 seconds**

---

## Phase 1: Template Preparation (One-Time Setup)

### Create Placeholder-Based Template

Transform `visual_gallery/visual_gallery_1` into a placeholder-ready template:

#### 1. Brand Placeholders

**File: `index.html`**
```html
<title>__BRAND_NAME__ · __BRAND_TAGLINE__</title>
<meta name="description" content="__META_DESCRIPTION__">
```

**File: `gallery-header.js`**
```javascript
// Brand name in header
<h1>__BRAND_NAME__</h1>
<p>__BRAND_TAGLINE__</p>
```

#### 2. Color System Placeholders

Current template uses `gold` and `noir` color tokens. We'll keep Tailwind structure but document replacement patterns:

**Replacement Map (in README):**
```
gold-400 → Primary accent (buttons, highlights)
gold-500 → Primary hover
noir-900 → Background dark
noir-800 → Borders
noir-100 → Text light
```

#### 3. Storage Key Placeholders

**Current:** `store-cart`, `store-favorites`, `store-user`, `store-theme`
**Placeholder:** `__STORAGE_PREFIX__-cart`, `__STORAGE_PREFIX__-favorites`, etc.

#### 4. Homepage Hero Placeholders

**File: `home-page.js`**
```javascript
// Hero section - Agent MUST customize this
<p>__HERO_EYEBROW__</p>
<h1>__HERO_TITLE_LINE_1__<span>__HERO_TITLE_LINE_2__</span></h1>
<p>__HERO_DESCRIPTION__</p>
<button>__HERO_CTA_PRIMARY__</button>
<button>__HERO_CTA_SECONDARY__</button>
```

#### 5. Products Template

**File: `state.js`**
Products array stays as example, but with clear structure documentation:

```javascript
// PRODUCTS ARRAY - Replace with store-specific products
// Required fields per product:
// - id: unique string (e.g., 'product-{category}-{number}')
// - name: Product name
// - brand: Brand/collection name
// - category: Display category
// - variant: Size/color variant
// - price: Number
// - originalPrice: Number (for discount display)
// - rating: Number (1-5)
// - reviews: Number
// - productType: 'rings' | 'necklaces' | 'earrings' | 'bracelets' (for filtering)
// - badge: 'Bestseller' | 'New' | 'Sale' etc. (optional)
// - featured: boolean
// - newArrival: boolean
// - image: Main image URL (use getImageUrl())
// - images: Array of gallery URLs
// - tags: Array of feature tags
```

---

## Phase 2: Placeholder Reference Doc

Create a `PLACEHOLDERS.md` file in the template:

```markdown
# Template Placeholders

## Brand Identity
| Placeholder | Description | Example |
|-------------|-------------|---------|
| `__BRAND_NAME__` | Store name | "Aurelia Gems" |
| `__BRAND_TAGLINE__` | Short tagline | "Luxury Jewelry" |
| `__META_DESCRIPTION__` | SEO description | "Discover exquisite..." |
| `__STORAGE_PREFIX__` | localStorage prefix | "aurelia" |

## Homepage Hero
| Placeholder | Description | Example |
|-------------|-------------|---------|
| `__HERO_EYEBROW__` | Small text above title | "The Signature Collection" |
| `__HERO_TITLE_LINE_1__` | Main title part 1 | "Timeless" |
| `__HERO_TITLE_LINE_2__` | Gradient accent text | "Elegance" |
| `__HERO_DESCRIPTION__` | Hero paragraph | "Handcrafted pieces..." |
| `__HERO_CTA_PRIMARY__` | Main button | "Explore Collection" |
| `__HERO_CTA_SECONDARY__` | Secondary button | "Shop Rings" |

## Color Tokens (Tailwind)
| Current Token | Usage | Replace With |
|---------------|-------|--------------|
| `gold-400` | Accent, buttons, links | Your brand primary |
| `gold-500` | Hover states | Your brand primary dark |
| `noir-900` | Dark background | Keep or customize |
| `noir-100` | Light text | Keep or customize |

## Products (state.js)
The `initialProducts` array should be completely replaced.
See product structure documentation in state.js comments.
```

---

## Phase 3: Lightning Agent Implementation

### Agent Instructions (Minimal)

```markdown
## LIGHTNING AGENT - 60 Second Store Customization

You are a speed-optimized agent. Complete ALL customization in 15 tool calls max.

### YOUR WORKFLOW (4 Steps)

**STEP 1: Understand (1 tool call)**
Read requirements + template files in ONE bulk read.

**STEP 2: Bulk Replace Placeholders (1 tool call)**
Use batch_find_replace to update ALL placeholders at once:
- Brand name, tagline, meta
- Storage prefix
- Color tokens (if changing)

**STEP 3: Generate Products + Homepage (2 tool calls)**
Write complete state.js with 10-12 products.
Write complete home-page.js with custom hero.

**STEP 4: Validate (1-2 tool calls)**
Run ESLint once. Batch fix any errors.

### PLACEHOLDERS TO REPLACE
[Include full placeholder table]

### PRODUCT STRUCTURE
[Include required product fields]

### DONE!
Store is fully customized. All pages work automatically.
```

### Key Optimizations

1. **No Exploration** - Template structure is fixed, documented
2. **No Individual Reads** - All needed info in one bulk read
3. **No Grep Needed** - Placeholders are known, documented
4. **Bulk Everything** - All replacements in one call
5. **Single Validation** - Only at the end

---

## Phase 4: Files to Create/Modify

### 1. Create Placeholder Template

**Path:** `ecommerce_themes/quick_template/` (copy of visual_gallery_1 with placeholders)

Files to modify:
- `index.html` - Add brand/meta placeholders
- `components/gallery-header.js` - Add brand placeholders  
- `components/pages/home-page.js` - Add hero placeholders
- `assets/state.js` - Add product documentation, storage prefix
- `PLACEHOLDERS.md` - New file with replacement reference

### 2. Create Lightning Agent

**Path:** `experiments/doxii_agents/architect_lightning.py`

Features:
- Minimal instructions (500 tokens vs 4000)
- Pre-defined placeholder list
- Strict tool call budget
- Speed metrics tracking

### 3. Update Interactive Runner

**Path:** `experiments/scripts/interactive_agent_v2.py`

Add `--lightning` flag for fast mode.

---

## Expected Results

### Before (Architect V2)
- **Time:** 5-10 minutes
- **Tool calls:** 50-100
- **Cost:** ~$2-3 per store

### After (Lightning Agent)
- **Time:** 30-60 seconds
- **Tool calls:** 8-15
- **Cost:** ~$0.30 per store

### 10x Improvement! 🚀

---

## Fallback Handling

If agent exits early, store STILL WORKS because:
1. Template has sensible defaults
2. Placeholder text is readable (e.g., "__BRAND_NAME__" → visible but functional)
3. Example products are in state.js
4. All routing, cart, wishlist work with any products

### Graceful Degradation Priority

| If agent completes... | Store quality |
|-----------------------|---------------|
| Step 1 only | 60% - Template with defaults |
| Steps 1-2 | 80% - Branded, example products |
| Steps 1-3 | 95% - Fully customized |
| Steps 1-4 | 100% - Validated, production ready |

---

## Implementation Checklist

- [x] Create `ecommerce_themes/quick_template/` with placeholders
- [x] Add `PLACEHOLDERS.md` reference doc
- [x] Create `architect_lightning.py` agent
- [x] Add `--lightning` mode to interactive script
- [ ] Test with 5 different store types
- [ ] Measure time and tool calls
- [ ] Document results

---

## ✅ IMPLEMENTATION COMPLETE

### Files Created/Modified

1. **`ecommerce_themes/quick_template/`** - Full working template with documentation
2. **`ecommerce_themes/quick_template/PLACEHOLDERS.md`** - Replacement guide
3. **`experiments/doxii_agents/architect_lightning.py`** - Lightning agent (500 token instructions)
4. **`experiments/scripts/interactive_agent_v2.py`** - Updated with `--lightning` flag

### Usage

```bash
# Lightning mode (60 seconds target)
python experiments/scripts/interactive_agent_v2.py --lightning -m "Create a luxury jewelry store called Aurelia Gems"

# Fast mode (2-4 minutes)  
python experiments/scripts/interactive_agent_v2.py --fast -m "Create a jewelry store"

# Quality mode (5-10 minutes)
python experiments/scripts/interactive_agent_v2.py --quality -m "Create a jewelry store"
```

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LIGHTNING AGENT ⚡                        │
│                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │ Step 1: Read│ → │Step 2: Bulk │ → │Step 3: Write│        │
│  │ 3 key files │   │  Replace    │   │  Products   │        │
│  │  (1 call)   │   │  (1 call)   │   │  (1 call)   │        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
│                                             │                │
│  ┌─────────────┐   ┌─────────────┐         │                │
│  │Step 5: Valid│ ← │Step 4: Write│ ← ──────┘                │
│  │  ate (1)    │   │  Homepage   │                          │
│  └─────────────┘   │  (1 call)   │                          │
│                    └─────────────┘                          │
│                                                              │
│  Total: 5 core calls (~30s) + LLM (~30s) = 60 seconds       │
└─────────────────────────────────────────────────────────────┘
```

### Key Innovations

1. **Pre-baked Template** - Works out-of-box with defaults
2. **Documented Replacements** - No grep needed, patterns known
3. **Single-Pass Updates** - One batch_find_replace for all branding
4. **Graceful Degradation** - Store works even if agent exits early

Ready to test! ⚡

